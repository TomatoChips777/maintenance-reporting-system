const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

function logReportRemark(reportId, remark, action, updatedBy) {
    const query = `
        INSERT INTO tbl_report_remarks (report_id, remark, action, updated_by, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    return db.queryAsync(query, [reportId, remark, action, updatedBy]);
}

// Fetching all the maintenance-reports
router.get('/', async (req, res) => {
    try {
        const query = `
        SELECT 
            mr.*, 
            --u.name AS reporter_name, 
              CASE 
                WHEN mr.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS reporter_name,
            tmr.report_id,
            tmr.category, 
            tmr.priority, 
            tmr.assigned_staff, 
            tmr.id as maintenance_id,
            mr.status
        FROM tbl_reports mr
        JOIN tbl_users u ON mr.user_id = u.id
        LEFT JOIN tbl_maintenance_reports tmr ON mr.id = tmr.report_id
        WHERE mr.archived = 0  and mr.report_type = 'Maintenance'
        ORDER BY mr.created_at DESC`;
        const rows =  await db.queryAsync(query);
        return res.json({success: false, reports: rows});
    //    const rows =  db.query(query, (err, rows) => {
    //         res.json({ success: true, reports: rows });
    //     });
    } catch (err) {
        console.error("Error fetching all reports:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

router.put("/admin/edit/:reportId", async (req, res) => {
    try {
        const { category, priority, status, assigned_staff, updated_by } = req.body;
        const { reportId } = req.params;

        // Step 1: Get current report with type
        const oldReportResult = await db.queryAsync(
            `SELECT tr.user_id, tr.location, tr.status, tr.report_type
             FROM tbl_reports tr
             WHERE tr.id = ?`,
            [reportId]
        );

        if (oldReportResult.length === 0) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        const { user_id: userId, location, status: oldStatus, report_type } = oldReportResult[0];

        // Step 2: Update status in tbl_reports
        await db.queryAsync(
            `UPDATE tbl_reports SET status = ? WHERE id = ?`,
            [status, reportId]
        );


        // Step 3: If Maintenance, update tbl_maintenance_reports
        if (report_type === "Maintenance") {
            // Get old maintenance report data
            const oldMaintResult = await db.queryAsync(
                `SELECT category, priority, assigned_staff 
         FROM tbl_maintenance_reports WHERE report_id = ?`,
                [reportId]
            );

            let oldCategory = "", oldPriority = "", oldStaff = "";
            if (oldMaintResult.length > 0) {
                oldCategory = oldMaintResult[0].category || "";
                oldPriority = oldMaintResult[0].priority || "";
                oldStaff = oldMaintResult[0].assigned_staff || "";
            }

            // Update maintenance report
            await db.queryAsync(
                `UPDATE tbl_maintenance_reports
            SET category = ?, priority = ?, assigned_staff = ?
            WHERE report_id = ?`,
                    [category, priority, assigned_staff || null, reportId]
            );

            // Collect logs only for changes
            if (oldCategory !== category) {
                await logReportRemark(
                    reportId,
                    `Category changed from ${oldCategory || "None"} to ${category}`,
                    "Update Category",
                    updated_by
                );
            }

            if (oldPriority !== priority) {
                await logReportRemark(
                    reportId,
                    `Priority changed from ${oldPriority || "None"} to ${priority}`,
                    "Update Priority",
                    updated_by
                );
            }

            if (oldStaff !== assigned_staff) {
                // Resolve staff name(s)
                let staffNames = "None";
                if (assigned_staff) {
                    const staffResult = await db.queryAsync(
                        `SELECT GROUP_CONCAT(name SEPARATOR ', ') AS names 
                 FROM tbl_maintenance_staff 
                 WHERE FIND_IN_SET(id, ?)`,
                        [assigned_staff]
                    );
                    staffNames = staffResult[0]?.names || "Unknown Staff";
                }

                await logReportRemark(
                    reportId,
                    `Assigned staff updated to ${staffNames}`,
                    "Update Staff",
                    updated_by
                );
            }
        }

        // Step 4: Log status changes
        if (oldStatus !== status) {
            await logReportRemark(
                reportId,
                `Status changed from ${oldStatus} to ${status}`,
                "Updated Status",
                updated_by
            );

            // Notifications only if status changed
            let notifMsg = "";

            switch (status) {
                case "In Progress":
                    if (oldStatus === "Resolved" || oldStatus === "Completed") {
                        notifMsg = `Your report about ${location} has been reopened and is back to In Progress.`;
                    } else {
                        notifMsg = `Your report about ${location} is now being worked on (In Progress).`;
                    }
                    break;

                case "Resolved":
                case "Completed":
                    notifMsg = `Your report about ${location} has been marked as ${status}.`;
                    break;

                case "Pending":
                    notifMsg = `Your report about ${location} has been set back to Pending.`;
                    break;

                default:
                    notifMsg = `The status of your report about ${location} has been updated to ${status}.`;
            }

            const notifInsert = await db.queryAsync(
                'INSERT INTO notifications (message, title) VALUES (?, "Report Update")',
                [notifMsg]
            );
            const notifId = notifInsert.insertId;

            await db.queryAsync(
                'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
                [notifId, userId]
            );

            req.io.emit('updateNotifications');
            req.io.emit('reportUpdatedNotification', { reportId, notifId, userId, message: notifMsg });
        }

        req.io.emit('updateViewedReport');
        req.io.emit('updateReports');
        req.io.emit('update');

        res.json({ success: true, message: "Report updated successfully" });

    } catch (err) {
        console.error("Error updating report:", err);
        res.status(500).json({ success: false, message: "Failed to update report" });
    }
});

router.post('/add-staff', async (req, res) => {
    const { name, email, contact_number, role, status } = req.body;
    if (!email || !name) {
        return res.status(500).json({ error: 'Name and email are required' });
    }
    try {
        const existingUser = await db.queryAsync('SELECT id FROM tbl_maintenance_staff WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Email already exist' });
        }

        await db.queryAsync('INSERT INTO tbl_maintenance_staff (name, email, contact_number, role) VALUES (?, ?, ?, ?)',
            [name, email, contact_number, role ? role : null]
        );
        req.io.emit('updateUser');
        return res.json({ success: true, message: 'Staff added successfully' });
    } catch (err) {
        console.error('Failed to add staff:', err);
        res.status(500).json({ err: 'Internal server error' });
    }

})

router.get('/get-staff', async (req, res) => {
    try {
        const rows = await db.queryAsync('SELECT * FROM tbl_maintenance_staff');
        return res.json(rows);
    } catch (err) {
        console.error('Get all users error:', err);
        res.status(500).json({ eror: 'Internal server error' });
    }
})

router.put('/update-staff-status/:staff_id', async (req, res) => {
    const { staff_id } = req.params;
    const { status } = req.body;
    if (status !== 0 && status !== 1) {
        return res.status(400).json({ success: false, message: 'Invalid status values.' });
    }

    try {
        const result = await db.queryAsync("UPDATE tbl_maintenance_staff SET status = ? WHERE id = ?", [status, staff_id]);

        if (result.affectedRows === 0) {
            return status(404).json({ success: false, message: 'Staff not found.' });
        }
        req.io.emit('updateUser');
    } catch (err) {
        console.error('Activate/Deactivate error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
})

router.put('/update-staff/:staff_id', async (req, res) => {
    const { staff_id } = req.params;
    const { name, email, contact_number, role, status } = req.body;

    try {
        // Check email uniqueness (only if provided)
        if (email) {
            const checkEmailQuery = `
                SELECT id FROM tbl_maintenance_staff 
                WHERE email = ? AND id != ?
            `;
            const existing = await db.queryAsync(checkEmailQuery, [email, staff_id]);

            if (existing.length > 0) {
                return res.status(409).json({ error: 'Email already exists' });
            }
        }

        const updates = [];
        const params = [];

        if (name) {
            updates.push('name = ?');
            params.push(name);
        }
        if (email) {
            updates.push('email = ?');
            params.push(email);
        }
        if (contact_number) {
            updates.push('contact_number = ?');
            params.push(contact_number);
        }
        if (role) {
            updates.push('role = ?');
            params.push(role);
        }
        if (status !== undefined) {
            updates.push('status = ?');
            params.push(status);
        }
        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        const updateQuery = `UPDATE tbl_maintenance_staff SET ${updates.join(', ')} WHERE id = ?`;
        params.push(staff_id);

        const result = await db.queryAsync(updateQuery, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.io.emit('updateUser');
        return res.json({ success: true, message: 'User updated successfully' });

    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

router.post("/create-report", upload.single('image'), async (req, res) => {
  try {
    const {
      report_type,
      category,
      priority,
      assigned_staff,
      status,
      type,
      item_name,
      contact_info,
      sender_id,
      location,
      description,
      is_anonymous,
      user_id
    } = req.body;

    const image_path = req.file ? req.file.filename : null;

    // Step 1: Insert into tbl_reports (base table)
    const insertReportQuery = `
      INSERT INTO tbl_reports (user_id, report_type, status, location, description, image_path, is_anonymous)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const reportResult = await db.queryAsync(insertReportQuery, [
      user_id,
      report_type,
      status || 'Pending',
      location,
      description,
      image_path,
      is_anonymous
    ]);

    const reportId = reportResult.insertId;

    // Step 2: Handle each report type
    if (report_type === "Maintenance") {
      const maintenanceQuery = `
        INSERT INTO tbl_maintenance_reports (report_id, category, priority, assigned_staff) 
        VALUES (?, ?, ?, ?)
      `;
      await db.queryAsync(maintenanceQuery, [reportId, category, priority, assigned_staff]);

      // Notifications
      const notifMsg = `A new report has been submitted about ${location}`;
      const notifResult = await db.queryAsync(
        'INSERT INTO notifications (message, title) VALUES (?, "New Report")',
        [notifMsg]
      );
      const notifId = notifResult.insertId;

      const receivers = await db.queryAsync(
        'SELECT id FROM tbl_users WHERE role="Admin" OR role="Maintenance Manager"'
      );

      if (receivers.length > 0) {
        const receiverValues = receivers.map(user => [notifId, user.id, false]);
        await db.queryAsync(
          'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
          [receiverValues]
        );
      } else {
        console.log("No receivers found for notification.");
      }

      req.io.emit('updateReports');
      req.io.emit('update');
      return res.json({ success: true, message: "Maintenance report created successfully" });

    } else if (report_type === "Lost And Found") {
      const lostFoundQuery = `
        INSERT INTO tbl_lost_found 
        (user_id, report_id, type, category, location, description, item_name, contact_info, is_anonymous) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.queryAsync(lostFoundQuery, [
        user_id,
        reportId,
        type,
        category,
        location,
        description,
        item_name,
        contact_info,
        is_anonymous ? 1 : 0
      ]);

      req.io.emit('update');
      return res.json({ success: true, message: "Lost & Found report created successfully" });

    } else if (report_type === "Incident") {
      const incidentQuery = `
        INSERT INTO tbl_incident_reports (report_id, category, priority, assigned_staff) 
        VALUES (?, ?, ?, ?)
      `;
      await db.queryAsync(incidentQuery, [reportId, category, priority, assigned_staff]);

      req.io.emit('update');
      return res.json({ success: true, message: "Incident report created successfully" });

    } else {
      return res.json({ success: true, message: "Report created, but no specific report type handled." });
    }

  } catch (err) {
    console.error("Error creating report:", err);
    return res.status(500).json({ success: false, message: "Server error creating report" });
  }
});


router.get('/view-reports-by-id/:reportId', async (req, res) => {
  const { reportId } = req.params;

  try {
    const query = `
      SELECT 
        tr.id,
        tr.user_id,
        tr.location,
        tr.report_type,
        tr.description,
        tr.image_path,
        tr.status,
        tr.is_anonymous,
        tr.created_at,
        tr.updated_at,
        tr.viewed,
        tr.archived,
        tmr.id AS maintenance_id,
        tmr.category,
        tmr.priority,
        tmr.assigned_staff,
        tmr.acknowledged_by,
        CASE 
          WHEN tr.is_anonymous = 1 THEN 'Anonymous'
          ELSE u.name 
        END AS reporter_name
      FROM tbl_reports tr
      LEFT JOIN tbl_maintenance_reports tmr 
        ON tr.id = tmr.report_id
      JOIN tbl_users u 
        ON tr.user_id = u.id
      WHERE tmr.id = ?
      AND tr.archived = 0
      ORDER BY tr.created_at DESC;
    `;

    const rows = await db.queryAsync(query, [reportId]);
    return res.json({ success: true, reports: rows });
  } catch (err) {
    console.error("Error fetching report by ID:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch reports" });
  }
});


module.exports = router;
