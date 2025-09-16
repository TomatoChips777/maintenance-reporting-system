const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


// Not implemented
router.delete('/admin/report/:id', (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'admin') {
        return res.status(400).json({ success: false, message: `Unauthorized: You cannot delete this report` });
    }

    db.query('SELECT image_path FROM tbl_reports WHERE id = ?', [id], (err, rows) => {
        if (err) {
            console.error("Error fetching report:", err);
            return res.status(500).json({ success: false, message: 'Failed to fetch report' });
        }
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this report" });
        }

        const imagePath = rows[0].image_path;
        if (imagePath) {
            const filePath = path.join(__dirname, '../uploads', imagePath);

            console.log("Attempting to delete file:", filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully:", filePath);
                    }
                });
            } else {
                console.warn("File not found:", filePath);
            }
        }

        db.query('DELETE FROM tbl_reports WHERE id = ?', [id], (err) => {
            if (err) {
                console.error("Error deleting report:", err);
                return res.status(500).json({ success: false, message: 'Failed to delete report' });
            }
            req.io.emit('reportDeleted', { reportId: id });
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});

// Not implemented
router.delete('/report/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: `User ID is required ${userId}` });
    }

    db.query('SELECT image_path FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err, rows) => {
        if (err) {
            console.error("Error fetching report:", err);
            return res.status(500).json({ success: false, message: 'Failed to fetch report' });
        }
        if (rows.length === 0) {
            return res.status(403).json({ success: false, message: "Unauthorized: You cannot delete this report" });
        }

        const imagePath = rows[0].image_path;
        if (imagePath) {
            const filePath = path.join(__dirname, '../uploads', imagePath);

            console.log("Attempting to delete file:", filePath);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Error deleting file:", err);
                    } else {
                        console.log("File deleted successfully:", filePath);
                    }
                });
            } else {
                console.warn("File not found:", filePath);
            }
        }

        db.query('DELETE FROM tbl_reports WHERE id = ? AND user_id = ?', [id, userId], (err) => {
            if (err) {
                console.error("Error deleting report:", err);
                return res.status(500).json({ success: false, message: 'Failed to delete report' });
            }
            // req.io.emit('reportDeleted', { reportId: id });
            req.io.emit('update');
            res.json({ success: true, message: 'Report deleted successfully' });
        });
    });
});
// Not implemented
router.put('/reports/archive-maintenance-report/:id', (req, res) => {
    const { id } = req.params;
    const query = `UPDATE tbl_reports SET archived = 1 WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error archiving report:", err);
            return res.status(500).json({ success: false, message: "Error archiving report" });
        }
        req.io.emit('update');
        res.json({ success: true, message: "Report archived successfully" });
    })

});
//Not Implemented
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `SELECT * FROM tbl_reports WHERE user_id = ? AND archived = 0 ORDER BY created_at DESC`;
    db.query(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, reports: rows });
    });
});
//Not Implemented
router.put("/admin/edit-report-type/:reportId", (req, res) => {
    const { report_type, category, priority, assigned_staff, status, type, item_name, contact_info, sender_id, location, description, } = req.body;
    const { reportId } = req.params;
    // Update `tbl_reports` first
    const updateReportQuery = "UPDATE tbl_reports SET report_type = ? WHERE id = ?";

    db.query(updateReportQuery, [report_type, reportId], (err, result) => {
        if (err) {
            console.error("Error updating report type:", err);
            return res.status(500).json({ success: false, message: "Failed to update report type" });
        }

        if (report_type === "Maintenance Report") {
            const maintenanceQuery = `
                INSERT INTO tbl_maintenance_reports (report_id, category, priority, assigned_staff, status) 
                VALUES (?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                category = ?, priority = ?, assigned_staff = ?, status = ?`;

            db.query(
                maintenanceQuery,
                [reportId, category, priority, assigned_staff, status, category, priority, assigned_staff, status],
                (err, maintenanceResult) => {
                    if (err) {
                        console.error("Error updating maintenance report:", err);
                        return res.status(500).json({ success: false, message: "Failed to update maintenance report" });
                    }
                    req.io.emit('update');
                    req.io.emit('updateReports');
                    res.json({ success: true, message: "Report updated successfully" });
                }
            );
        } else if (report_type === "Lost And Found") {
            const lostFoundQuery = `
                INSERT INTO tbl_lost_found (user_id, report_id, type, category, location, description, item_name, contact_info) 
                VALUES (?, ?, ?, ?, ?, ? , ? , ?) 
                ON DUPLICATE KEY UPDATE 
                type = ?, item_name = ?, contact_info = ?`;

            db.query(
                lostFoundQuery,
                [sender_id, reportId, type, category, location, description, item_name, contact_info, type, item_name, contact_info],
                (err, lostFoundResult) => {
                    if (err) {
                        console.error("Error updating lost and found report:", err);
                        return res.status(500).json({ success: false, message: "Failed to update lost and found report" });
                    }
                    req.io.emit('update'); // Notify frontend
                    res.json({ success: true, message: "Report updated successfully" });
                }
            );
        } else {
            req.io.emit('update'); // Notify frontend
            res.json({ success: true, message: "Report type updated successfully" });
        }
    });
});


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
        const { category, priority, status } = req.body;
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
                SET category = ?, priority = ?
                WHERE report_id = ?
            `;
            await db.queryAsync(updateMaintenanceQuery, [category, priority, reportId]);
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

module.exports = router;
