const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { fetchData } = require('../config/dbUtils');
// Multer setup for file uploads
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

router.post('/create-report', upload.single('image'), (req, res) => {

    if (!req.body.user_id || !req.body.location || !req.body.description) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const { user_id, location, description, is_anonymous } = req.body;
    const image_path = req.file ? req.file.filename : null;
    const report_type = '';



    const query = `INSERT INTO tbl_reports (user_id, location, description, image_path, is_anonymous, report_type) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [user_id, location, description, image_path, is_anonymous, report_type], (err, result) => {
        if (err) {
            console.error("Error creating report:", err);
            return res.status(500).json({ success: false, message: 'Failed to submit report' });
        }
        const newReport = {
            id: result.insertId,
            user_id,
            location,
            description,
            status: "pending",
            image_path: image_path || null
        };


        // Step 2: Create a new notification
        const notifMsg = `A new report has been submitted about ${location}.`;
        const notifResult = db.queryAsync(
            'INSERT INTO notifications (message, title) VALUES (?, "New Report")',
            [notifMsg]
        );
        const notifId = notifResult.insertId;

        // Step 3: Get all admins and staff
        const receivers = db.queryAsync(
            'SELECT id FROM tbl_users WHERE role="admin" OR role="staff"'
        );

        // Step 4: Insert one notification per receiver
        if (receivers.length > 0) {
            const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
            db.queryAsync(
                'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
                [receiverValues]
            );
        }
        req.io.emit('updateReports');
        req.io.emit('update');
        req.io.emit('createdReport', newReport);
        res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
    });
});
// Get All Reports
router.get('/', (req, res) => {
    const query = `
        SELECT r.*,
        CASE 
                WHEN r.is_anonymous = 1 THEN 'Anonymous'
                ELSE u.name 
            END AS reporter_name
        FROM tbl_reports r 
        JOIN tbl_users u ON r.user_id = u.id WHERE archived = 0 AND report_type = ''
        ORDER BY r.created_at DESC`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error fetching all reports:", err);
            return res.status(500).json([]);
        }
        res.json(rows);
    });
});

router.get('/get-user-reports/:userId', (req, res) => {
    const { userId } = req.params;

    // const query = `SELECT * FROM tbl_reports WHERE user_id = ? AND archived = 0 ORDER BY created_at DESC`;
    // const query = `SELECT tr.*, tmr.* 
    //     FROM tbl_reports tr
    //     LEFT JOIN tbl_maintenance_reports tmr 
    //         ON tr.id = tmr.report_id
    //     WHERE tr.user_id = ?
    //       AND tr.archived = 0
    //     ORDER BY tr.created_at DESC`;
    const query = `SELECT 
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
        tmr.acknowledged_by
        FROM tbl_reports tr
        LEFT JOIN tbl_maintenance_reports tmr 
        ON tr.id = tmr.report_id
        WHERE tr.user_id = ?
        AND tr.archived = 0
        ORDER BY tr.created_at DESC;`
    db.query(query, [userId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, reports: rows });
    });
});


router.get('/report/view-reports-by-id/:reportId', (req, res) => {
    const { reportId } = req.params;
    const query = `SELECT 
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
        tmr.acknowledged_by
        FROM tbl_reports tr
        LEFT JOIN tbl_maintenance_reports tmr 
        ON tr.id = tmr.report_id
        WHERE tr.id = ?
        AND tr.archived = 0
        ORDER BY tr.created_at DESC;`
    db.query(query, [reportId], (err, rows) => {
        if (err) {
            console.error("Error fetching user reports:", err);
            return res.status(500).json({ success: false, message: "Failed to fetch reports" });
        }
        res.json({ success: true, reports: rows });
    });
});
// router.put("/admin/edit-report-type/:reportId", (req, res) => {
//     const { report_type, priority, location, category, acknowledged_by } = req.body;
//     const { reportId } = req.params;
//     const updateReportQuery = "UPDATE tbl_reports SET report_type = ? WHERE id = ?";
//     db.query(updateReportQuery, [report_type, reportId], (err, result) => {
//         if (err) {
//             console.error("Error updating report type:", err);
//             return res.status(500).json({ success: false, message: "Failed to update report type" });
//         }

//         if (report_type === "Maintenance") {
//             const maintenanceQuery = `
//                 INSERT INTO tbl_maintenance_reports (report_id, priority, category, acknowledged_by) 
//                 VALUES (?, ?, ?, ?) 
//                 ON DUPLICATE KEY UPDATE 
//                 priority = ?, category = ?, acknowledged_by = ?`;


//             db.query(
//                 maintenanceQuery,
//                 [reportId, priority, category, acknowledged_by, priority, category, acknowledged_by],
//                 (err, maintenanceResult) => {
//                     if (err) {
//                         console.error("Error updating maintenance report:", err);
//                         return res.status(500).json({ success: false, message: "Failed to update maintenance report" });
//                     }

//                     const notifMsg = `A new report has been submitted about ${location}.`;
//                     const notifResult = db.queryAsync(
//                         'INSERT INTO notifications (message, title) VALUES (?, "New Report")',
//                         [notifMsg]
//                     );
//                     const notifId = notifResult.insertId;

//                     // Step 3: Get all admins and staff
//                     const receivers = db.queryAsync(
//                         'SELECT id FROM tbl_users WHERE role="Maintenance Mananger"'
//                     );

//                     // Step 4: Insert one notification per receiver
//                     if (receivers.length > 0) {
//                         const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
//                         db.queryAsync(
//                             'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
//                             [receiverValues]
//                         );
//                     }
//                     req.io.emit('updateReports');
//                     req.io.emit('update');
//                     res.json({ success: true, message: "Report updated successfully" });


//                 }
//             );
//         } else if (report_type === "Lost And Found") {
//             const lostFoundQuery = `
//                 INSERT INTO tbl_lost_found (user_id, report_id, type, category, location, description, item_name, contact_info, is_anonymous) 
//                 VALUES (?, ?, ?, ?, ?, ? , ? , ?, ?) 
//                 ON DUPLICATE KEY UPDATE 
//                 type = ?, item_name = ?, contact_info = ?`;

//             db.query(
//                 lostFoundQuery,
//                 [sender_id, reportId, type, category, location, description, item_name, contact_info, is_anonymous, type, item_name, contact_info],
//                 (err, lostFoundResult) => {
//                     if (err) {
//                         console.error("Error updating lost and found report:", err);
//                         return res.status(500).json({ success: false, message: "Failed to update lost and found report" });
//                     }

//                     const title = `${report_type}`;
//                     const message = `New ${type.toLowerCase()} item reported: "${item_name}" at ${location}.`;

//                     const notificationQuery = `
//                         INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) 
//                         VALUES (?, ?, ?, ?)`;

//                     db.query(notificationQuery, [reportId, sender_id, message, title], (err) => {
//                         if (err) {
//                             console.error("Error inserting notification:", err);
//                         }
//                     });

//                     req.io.emit('update');
//                     res.json({ success: true, message: "Report updated successfully" });
//                 }
//             );
//         } else if (report_type === "Incident") {

//             const incidentQuery = `
//                 INSERT INTO tbl_incident_reports (report_id, category, priority, assigned_staff) 
//                 VALUES (?, ?, ?, ?) 
//                 ON DUPLICATE KEY UPDATE 
//                 category = ?, priority = ?, assigned_staff = ?`;
//             db.query(
//                 incidentQuery,
//                 [reportId, category, priority, assigned_staff, category, priority, assigned_staff],
//                 (err, incidentResult) => {
//                     if (err) {
//                         console.error("Error updating incident report:", err);
//                         return res.status(500).json({ success: false, message: "Failed to update incident report" });
//                     }

//                     const title = `${report_type}`;
//                     const message = `New incident report: ${category} (${priority} priority) at ${location}.`;

//                     const notificationQuery = `
//                         INSERT INTO tbl_admin_notifications (report_id, user_id, message, title) 
//                         VALUES (?, ?, ?, ?)`;

//                     db.query(notificationQuery, [reportId, sender_id, message, title], (err) => {
//                         if (err) {
//                             console.error("Error inserting notification:", err);
//                         }
//                     });
//                     req.io.emit('update'); // Notify frontend
//                     res.json({ success: true, message: "Report updated successfully" });


//                 }
//             );
//         } else {
//             req.io.emit('update');
//             res.json({ success: true, message: "Report type updated successfully" });
//         }
//     });
//     req.io.emit('updateReports');
//     req.io.emit('updateNotifications');
// });

router.put("/admin/edit-report-type/:reportId", (req, res) => {
    const { report_type, priority, location, category, acknowledged_by, updated_by } = req.body;
    const { reportId } = req.params;

    const updateReportQuery = "UPDATE tbl_reports SET report_type = ? WHERE id = ?";
    db.query(updateReportQuery, [report_type, reportId], (err) => {
        if (err) {
            console.error("Error updating report type:", err);
            return res.status(500).json({ success: false, message: "Failed to update report type" });
        }

        if (report_type === "Maintenance") {
            const maintenanceQuery = `
                INSERT INTO tbl_maintenance_reports (report_id, priority, category, acknowledged_by) 
                VALUES (?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                priority = ?, category = ?, acknowledged_by = ?
            `;

            db.query(
                maintenanceQuery,
                [reportId, priority, category, acknowledged_by, priority, category, acknowledged_by],
                async (err) => {
                    if (err) {
                        console.error("Error updating maintenance report:", err);
                        return res.status(500).json({ success: false, message: "Failed to update maintenance report" });
                    }

                    if (acknowledged_by) {
                            await logReportRemark(
                                reportId,
                                `Report acknowledged`,
                                "Acknowledged",
                                acknowledged_by
                            );
                    }
                    req.io.emit('updateViewedReport');
                    req.io.emit('updateReports');
                    req.io.emit('update');
                    res.json({ success: true, message: "Report updated successfully" });
                }
            );
        }
    });
});

router.put('/report/set-viewed-report/:id', (req, res) => {
    const { id } = req.params;

    const query = 'UPDATE tbl_reports SET viewed = 1 WHERE  id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error setting as viewed:', err);
            return req.status(500).json({ success: false, message: 'Error setting as viewed' });
        }

        if (result.affectedRows > 0) {
            req.io.emit('updateReports');
            return res.json({
                success: true,
                message: "Report has been marked as viewed.",
            });
        }
    })
})

router.put('/report/archive-report/:id', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    if (!reason) {
        return res.status(400).json({ success: false, message: "Error reason is required." })
    }
    const query = `UPDATE tbl_reports SET archived = 1 WHERE id = ?`;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error archiving report:", err);
            return res.status(500).json({ success: false, message: "Error archiving report" });
        }

        if (result.affectedRows > 0) {
            const selectQuery = `SELECT user_id, location FROM tbl_reports WHERE id = ?`;

            db.query(selectQuery, [id], async (err, rows) => {
                if (err) {
                    console.error("Error retrieving report details:", err);
                    return res.status(500).json({ success: false, message: "Error retrieving report details" });
                }

                if (rows.length === 0) {
                    return res.status(404).json({ success: false, message: "Report not found after update" });
                }

                const report = rows[0];
                const { user_id, location } = report;

                try {
                    // Create notification
                    const notifMsg = `Your report about ${location} has been archived. Reason: ${reason}`;

                    const notifInsert = await db.queryAsync(
                        'INSERT INTO notifications (message, title) VALUES (?, "Report Archived")',
                        [notifMsg]
                    );
                    const notifId = notifInsert.insertId;

                    await db.queryAsync(
                        'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
                        [notifId, user_id]
                    );

                    // Emit socket events
                    req.io.emit('updateReports');
                    req.io.emit('updateNotifications');
                    req.io.emit('reportArchivedNotification', { reportId: id, notifId, userId: user_id, message: notifMsg });

                    return res.json({
                        success: true,
                        message: "Report archived successfully and user notified",
                        affectedRow: report
                    });
                } catch (notifErr) {
                    console.error("Error sending archive notification:", notifErr);
                    return res.status(500).json({ success: false, message: "Report archived but notification failed" });
                }
            });
        } else {
            return res.status(404).json({ success: false, message: "Report not found or already archived" });
        }
    });
});

router.put('/report/send-back/:id', (req, res) => {
    const { id } = req.params;
    const { reason, location } = req.body;

    const query1 = `UPDATE tbl_reports 
                    SET report_type = ''
                    WHERE id = ?`;

    const query2 = `DELETE FROM tbl_maintenance_reports WHERE report_id = ?`;

    db.query(query1, [id], (err) => {
        if (err) {
            console.error("Error updating tbl_reports:", err);
            return res.status(500).json({ success: false, message: "Failed to reset report" });
        }

        db.query(query2, [id], (err2) => {
            if (err2) {
                console.error("Error deleting from tbl_maintenance_reports:", err2);
                return res.status(500).json({ success: false, message: "Failed to clean maintenance record" });
            }

            // Step 2: Create a new notification
            const notifMsg = `A report about ${location} has been returned.`;
            const notifInsert = `INSERT INTO notifications (message, title) VALUES (?, "Returned Report")`;

            db.query(notifInsert, [notifMsg], (err3, notifResult) => {
                if (err3) {
                    console.error("Error inserting notification:", err3);
                    return res.status(500).json({ success: false, message: "Failed to create notification" });
                }

                const notifId = notifResult.insertId;
                console.log("Notif Id", notifId);
                // Step 3: Get all admins and staff
                const getReceivers = `SELECT id FROM tbl_users WHERE role="admin" OR role="Report Approver"`;
                db.query(getReceivers, (err4, receivers) => {
                    if (err4) {
                        console.error("Error fetching receivers:", err4);
                        return res.status(500).json({ success: false, message: "Failed to fetch receivers" });
                    }

                    if (receivers.length > 0) {
                        const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
                        const insertReceivers = `INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?`;

                        db.query(insertReceivers, [receiverValues], (err5) => {
                            if (err5) {
                                console.error("Error inserting notification receivers:", err5);
                                return res.status(500).json({ success: false, message: "Failed to assign notifications" });
                            }

                            // Emit socket update
                            req.io.emit('updateReports');
                            req.io.emit('updateNotifications');
                            return res.json({ success: true, message: "Report sent back to manager", reason });
                        });
                    } else {

                        req.io.emit('updateReports');
                        return res.json({ success: true, message: "Report sent back (no receivers found)", reason });
                    }
                });
            });
        });
    });
});


// Insert a remark for a report
router.post('/report/add-progress-remarks/:id', (req, res) => {
    const { id } = req.params; // report_id
    const { action, remark, updated_by } = req.body;

    if (!action || !updated_by) {
        return res.status(400).json({
            success: false,
            message: "Action and updated_by are required."
        });
    }

    const insertQuery = `
        INSERT INTO tbl_report_remarks (report_id, action, remark, updated_by)
        VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [id, action, remark || null, updated_by], (err, result) => {
        if (err) {
            console.error("Error inserting remark:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to insert remark"
            });
        }

        // Emit socket for real-time update
        // req.io.emit('updateRemarks', { reportId: id });
        req.io.emit('updateViewedReport');
        return res.json({
            success: true,
            message: "Remark added successfully",
            remarkId: result.insertId
        });
    });
});


// Get all remarks for a report
router.get('/report/get-report-remarks/:id', (req, res) => {
    const { id } = req.params;

    const query = `
    SELECT 
      rr.id,
      rr.remark,
      rr.action,
      rr.created_at,
      u.name AS updated_by
    FROM tbl_report_remarks rr
    LEFT JOIN tbl_users u ON rr.updated_by = u.id
    WHERE rr.report_id = ?
    ORDER BY rr.created_at DESC
  `;

    db.query(query, [id], (err, rows) => {
        if (err) {
            console.error("Error fetching remarks:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
        res.json({ success: true, remarks: rows });
    });
});


// router.put('/report/send-back/:id', (req, res) => {
//     const { id } = req.params;
//     const { reason, location } = req.body;


//     const query1 = `UPDATE tbl_reports 
//                   SET report_type = ''
//                   WHERE id = ?`;

//     const query2 = `DELETE FROM tbl_maintenance_reports WHERE report_id = ?`;

//     db.query(query1, [id], (err) => {
//         if (err) {
//             console.error("Error updating tbl_reports:", err);
//             return res.status(500).json({ success: false, message: "Failed to reset report" });
//         }

//         db.query(query2, [id], (err2) => {
//             if (err2) {
//                 console.error("Error deleting from tbl_maintenance_reports:", err2);
//                 return res.status(500).json({ success: false, message: "Failed to clean maintenance record" });
//             }
//             // Step 2: Create a new notification
//             const notifMsg = `A report about${location} has been returned.`;
//             const notifResult = db.queryAsync(
//                 'INSERT INTO notifications (message, title) VALUES (?, "Returned Report")',
//                 [notifMsg]
//             );
//             const notifId = notifResult.insertId;

//             // Step 3: Get all admins and staff
//             const receivers = db.queryAsync(
//                 'SELECT id FROM tbl_users WHERE role="admin" OR role="staff"'
//             );

//             // Step 4: Insert one notification per receiver
//             if (receivers.length > 0) {
//                 const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
//                 db.queryAsync(
//                     'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
//                     [receiverValues]
//                 );
//             }
//             req.io.emit('updateReports');

//             res.json({ success: true, message: "Report sent back to manager", reason });
//         });
//     });
// });

router.post("/create", upload.single('image'), (req, res) => {
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
