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

// Fetching all the maintenance-reports
router.get('/', (req, res) => {
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
            mr.status
        FROM tbl_reports mr
        JOIN tbl_users u ON mr.user_id = u.id
        LEFT JOIN tbl_maintenance_reports tmr ON mr.id = tmr.report_id
        WHERE mr.archived = 0  and mr.report_type = 'Maintenance'
        ORDER BY mr.created_at DESC`;

    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
        res.json({ success: true, reports: rows });
    });
});

router.put("/admin/edit/:reportId", async (req, res) => {
    try {
        const { category, priority, status, assigned_staff } = req.body;
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
        const updateReportQuery = `
            UPDATE tbl_reports 
            SET status = ?
            WHERE id = ?
        `;
        await db.queryAsync(updateReportQuery, [status, reportId]);

        // Step 3: If Maintenance, update tbl_maintenance_reports
        if (report_type === "Maintenance") {
            const updateMaintenanceQuery = `
                UPDATE tbl_maintenance_reports
                SET category = ?, priority = ?, assigned_staff = ?
                WHERE report_id = ?
            `;
            await db.queryAsync(updateMaintenanceQuery, [category, priority, assigned_staff ? assigned_staff : null, reportId]);
        }

        // Step 4: Notifications only if status changed
        if (oldStatus !== status) {
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

            // Insert notification
            const notifInsert = await db.queryAsync(
                'INSERT INTO notifications (message, title) VALUES (?, "Report Update")',
                [notifMsg]
            );
            const notifId = notifInsert.insertId;

            await db.queryAsync(
                'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
                [notifId, userId]
            );

            // Emit socket events for notification
            req.io.emit('updateNotifications');
            req.io.emit('reportUpdatedNotification', { reportId, notifId, userId, message: notifMsg });
        }

        // Always emit updateReports so UI refreshes
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
    console.log(name, email, contact_number, role, status);
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

router.put('/update-staff-status/:staff_id', async (req, res) =>{
    const {staff_id } = req.params;
    const {status} = req.body;
    if(status !== 0 && status !== 1){
        return res.status(400).json({success: false, message: 'Invalid status values.'});
    }

    try{
        const result = await db.queryAsync("UPDATE tbl_maintenance_staff SET status = ? WHERE id = ?", [status, staff_id]);

        if(result.affectedRows === 0){
            return status(404).json({success: false, message: 'Staff not found.'});
        }
    }catch(err){
        console.error('Activate/Deactivate error:', err);
        res.status(500).json({success: false, message: 'Database error'});
    }
})
router.post("/create-report", upload.single('image'), (req, res) => {
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
    const insertReportQuery = `
        INSERT INTO tbl_reports (user_id, report_type, status, location, description, image_path)
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(insertReportQuery, [user_id, report_type, status || 'Pending', location, description, image_path], (err, result) => {
        if (err) {
            console.error("Error inserting into tbl_reports:", err);
            return res.status(500).json({ success: false, message: "Failed to create base report" });
        }

        const reportId = result.insertId;

        // Step 2: Insert into related table based on report_type
        if (report_type === "Maintenance") {
            const maintenanceQuery = `
                INSERT INTO tbl_maintenance_reports (report_id, category, priority, assigned_staff) 
                VALUES (?, ?, ?, ?)`;
            
            db.query(maintenanceQuery, [reportId, category, priority, assigned_staff], (err) => {
                if (err) {
                    console.error("Error inserting into maintenance report:", err);
                    return res.status(500).json({ success: false, message: "Failed to create maintenance report" });
                }
                req.io.emit('updateReports');
                req.io.emit('update');
                res.json({ success: true, message: "Maintenance report created successfully" });
            });

        } else if (report_type === "Lost And Found") {
            const lostFoundQuery = `
                INSERT INTO tbl_lost_found 
                (user_id, report_id, type, category, location, description, item_name, contact_info, is_anonymous) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            db.query(
                lostFoundQuery,
                [user_id, reportId, type, category, location, description, item_name, contact_info, is_anonymous ? 1 : 0],
                (err) => {
                    if (err) {
                        console.error("Error inserting into lost and found:", err);
                        return res.status(500).json({ success: false, message: "Failed to create lost and found report" });
                    }

                    req.io.emit('update');
                    res.json({ success: true, message: "Lost & Found report created successfully" });
                }
            );

        } else if (report_type === "Incident") {
            const incidentQuery = `
                INSERT INTO tbl_incident_reports (report_id, category, priority, assigned_staff) 
                VALUES (?, ?, ?, ?)`;

            db.query(incidentQuery, [reportId, category, priority, assigned_staff], (err) => {
                if (err) {
                    console.error("Error inserting into incident report:", err);
                    return res.status(500).json({ success: false, message: "Failed to create incident report" });
                }

                req.io.emit('update');
                res.json({ success: true, message: "Incident report created successfully" });
            });

        } else {
            // If it's not one of the known types
            res.json({ success: true, message: "Report created, but no specific report type handled." });
        }
    });
});

module.exports = router;
