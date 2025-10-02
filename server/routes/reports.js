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

// handler for logs/remarks
function logReportRemark(reportId, remark, action, updatedBy) {
    const query = `
        INSERT INTO tbl_report_remarks (report_id, remark, action, updated_by, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    return db.queryAsync(query, [reportId, remark, action, updatedBy]);
}

// router.post('/create-report', upload.single('image'), async (req, res) => {

//     if (!req.body.user_id || !req.body.location || !req.body.description) {
//         return res.status(400).json({ success: false, message: "Missing required fields" });
//     }
//     const { user_id, location, description, is_anonymous } = req.body;
//     const image_path = req.file ? req.file.filename : null;
//     const report_type = '';



//     const query = `INSERT INTO tbl_reports (user_id, location, description, image_path, is_anonymous, report_type) VALUES (?, ?, ?, ?, ?, ?)`;
//     db.queryAsync(query, [user_id, location, description, image_path, is_anonymous, report_type], (err, result) => {
//         if (err) {
//             console.error("Error creating report:", err);
//             return res.status(500).json({ success: false, message: 'Failed to submit report' });
//         }
//         const newReport = {
//             id: result.insertId,
//             user_id,
//             location,
//             description,
//             status: "pending",
//             image_path: image_path || null
//         };


//         // Step 2: Create a new notification
//         const notifMsg = `A new report has been submitted about ${location}.`;
//         const notifResult = db.queryAsync(
//             'INSERT INTO notifications (message, title) VALUES (?, "New Report")',
//             [notifMsg]
//         );
//         const notifId = notifResult.insertId;

//         // Step 3: Get all admins and staff
//         const receivers = db.queryAsync(
//             'SELECT id FROM tbl_users WHERE role="admin" OR role="staff"'
//         );

//         // Step 4: Insert one notification per receiver
//         if (receivers.length > 0) {
//             const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
//             db.queryAsync(
//                 'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?',
//                 [receiverValues]
//             );
//         }
//         req.io.emit('updateReports');
//         req.io.emit('update');
//         req.io.emit('createdReport', newReport);
//         res.json({ success: true, message: 'Report submitted successfully', reportId: result.insertId });
//     });
// });
// // Get All Reports
// router.get('/', (req, res) => {
//     const query = `
//         SELECT r.*,
//         CASE 
//                 WHEN r.is_anonymous = 1 THEN 'Anonymous'
//                 ELSE u.name 
//             END AS reporter_name
//         FROM tbl_reports r 
//         JOIN tbl_users u ON r.user_id = u.id WHERE archived = 0 AND report_type = ''
//         ORDER BY r.created_at DESC`;
//     db.query(query, (err, rows) => {
//         if (err) {
//             console.error("Error fetching all reports:", err);
//             return res.status(500).json([]);
//         }
//         res.json(rows);
//     });
// });


//
router.post('/create-report', upload.single('image'), async (req, res) => { // route for creating reports
    try {
        if (!req.body.user_id || !req.body.location || !req.body.description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const { user_id, location, description, is_anonymous } = req.body;
        const image_path = req.file ? req.file.filename : null;
        const report_type = '';

        // Step 1: Insert into tbl_reports
        const query = `
        INSERT INTO tbl_reports 
        (user_id, location, description, image_path, is_anonymous, report_type) 
        VALUES (?, ?, ?, ?, ?, ?)
        `;

        const result = await db.queryAsync(query, [
            user_id,
            location,
            description,
            image_path,
            is_anonymous,
            report_type
        ]);

        const newReport = {
            id: result.insertId,
            user_id,
            location,
            description,
            status: "pending",
            image_path: image_path || null
        };

        // Step 2: Create a notification
        const notifMsg = `A new report has been submitted about ${location}.`;
        const notifResult = await db.queryAsync('INSERT INTO notifications (message, title) VALUES (?, "New Report")', [notifMsg]
        );
        const notifId = notifResult.insertId;

        // Step 3: Get all admins and staff
        const receivers = await db.queryAsync(
            'SELECT id FROM tbl_users WHERE role="admin" OR role="staff"'
        );

        // Step 4: Insert one notification per receiver
        if (receivers.length > 0) {
            const receiverValues = receivers.map(user => [notifId, user.id, false]);
            await db.queryAsync('INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?', [receiverValues]
            );
        }

        // Emit socket updates
        req.io.emit('updateReports');
        req.io.emit('update');
        req.io.emit('createdReport', newReport);

        res.json({
            success: true,
            message: 'Report submitted successfully',
            reportId: result.insertId
        });

    } catch (err) {
        console.error("Error creating report:", err);
        res.status(500).json({ success: false, message: 'Failed to submit report' });
    }
});

// route for fetching all the reports
router.get('/', async (req, res) => {
    try {
        const query = `
      SELECT r.*,
        CASE 
          WHEN r.is_anonymous = 1 THEN 'Anonymous'
          ELSE u.name 
        END AS reporter_name
      FROM tbl_reports r
      JOIN tbl_users u ON r.user_id = u.id
      WHERE r.archived = 0 AND r.report_type = ''
      ORDER BY r.created_at DESC
    `;

        const rows = await db.queryAsync(query);
        res.json(rows);

    } catch (err) {
        console.error("Error fetching all reports:", err);
        res.status(500).json([]);
    }
});

// route for fetching specific reports rquired userId
router.get('/get-user-reports/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
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

        const row = await db.queryAsync(query, [userId]);
        return res.json({ success: true, reports: row });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to fetch reports' })
    }
});

// routes for fetching and returning selected reports need reportId params
router.get('/report/view-reports-by-id/:reportId', async (req, res) => {
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
      WHERE tr.id = ?
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

// router.get('/report/view-reports-by-id/:reportId', async (req, res) => {
//     const { reportId } = req.params;

//     try{
//         const query = `SELECT 
//         tr.id,
//         tr.user_id,
//         tr.location,
//         tr.report_type,
//         tr.description,
//         tr.image_path,
//         tr.status,
//         tr.is_anonymous,
//         tr.created_at,
//         tr.updated_at,
//         tr.viewed,
//         tr.archived,
//         tmr.id AS maintenance_id,
//         tmr.category,
//         tmr.priority,
//         tmr.assigned_staff,
//         tmr.acknowledged_by
//         FROM tbl_reports tr
//         LEFT JOIN tbl_maintenance_reports tmr 
//         ON tr.id = tmr.report_id
//         WHERE tr.id = ?
//         AND tr.archived = 0
//         ORDER BY tr.created_at DESC;`
//         const rows = await db.queryAsync(query,[reportId]);
//         return res.json({success: true, reports: rows});

//     }catch(err){
//         return res.status(500).json({success: false, message: "Failed to fetch reports"});
//     }

//     // db.query(query, [reportId], (err, rows) => {
//     //     if (err) {
//     //         console.error("Error fetching user reports:", err);
//     //         return res.status(500).json({ success: false, message: "Failed to fetch reports" });
//     //     }
//     //     res.json({ success: true, reports: rows });
//     // });
// });
// router.put("/admin/edit-report-type/:reportId", async (req, res) => {
//     const { report_type, priority, category, acknowledged_by, updated_by } = req.body;
//     const { reportId } = req.params;

//     try {
//         // Update main report type
//         const updateReportQuery = `
//             UPDATE tbl_reports 
//             SET report_type = ?
//             WHERE id = ?
//         `;
//         await db.queryAsync(updateReportQuery, [report_type, reportId]);

//         if (report_type === "Maintenance") {
//             // Insert or update maintenance report
//             const maintenanceQuery = `
//                 INSERT INTO tbl_maintenance_reports (report_id, priority, category, acknowledged_by) 
//                 VALUES (?, ?, ?, ?)
//                 ON DUPLICATE KEY UPDATE 
//                     priority = VALUES(priority), 
//                     category = VALUES(category), 
//                     acknowledged_by = VALUES(acknowledged_by)
//             `;
//             await db.queryAsync(maintenanceQuery, [reportId, priority, category, acknowledged_by]);

//             console.log("Executed");
//             // Log remark if acknowledged
//             if (acknowledged_by) {
//                 await logReportRemark(
//                     reportId,
//                     `Report acknowledged`,
//                     "Acknowledged",
//                     acknowledged_by
//                 );
//             }
//         } else {
//             console.log("Executed 2");
//             // Delete maintenance record if report type was changed away from Maintenance
//             const deleteMaintenanceQuery = `
//                 DELETE FROM tbl_maintenance_reports 
//                 WHERE report_id = ?
//             `;
//             await db.queryAsync(deleteMaintenanceQuery, [reportId]);

//             // Later you can add similar logic for other report types,:
//             // if (report_type === "Incident") { ... tbl_incident_reports logic ... }
//             // if (report_type === "LostAndFound") { ... tbl_lostfound_reports logic ... }
//         }

//         // Emit real-time updates
//         req.io.emit("updateViewedReport");
//         req.io.emit("updateReports");
//         req.io.emit("update");

//         res.json({ success: true, message: "Report updated successfully" });
//     } catch (err) {
//         console.error("Error updating report:", err);
//         res.status(500).json({ success: false, message: "Failed to update report" });
//     }
// });

// router.put("/admin/edit-report-type/:reportId", async (req, res) => {
//     const { report_type, priority, category, acknowledged_by, updated_by } = req.body;
//     const { reportId } = req.params;

//     try {
//         // Get the current report_type
//         const [currentReport] = await db.queryAsync(
//             "SELECT report_type FROM tbl_reports WHERE id = ?",
//             [reportId]
//         );

//         if (!currentReport) {
//             return res.status(404).json({ success: false, message: "Report not found" });
//         }

//         const currentType = currentReport.report_type;

//         // Case 1: Report type actually changed
//         if (currentType !== report_type) {
//             // Update main report type
//             const updateReportQuery = `
//                 UPDATE tbl_reports 
//                 SET report_type = ?
//                 WHERE id = ?
//             `;
//             await db.queryAsync(updateReportQuery, [report_type, reportId]);

//             if (report_type === "Maintenance") {
//                 // Insert fresh maintenance row
//                 const maintenanceQuery = `
//                     INSERT INTO tbl_maintenance_reports (report_id, priority, category, acknowledged_by) 
//                     VALUES (?, ?, ?, ?)
//                     ON DUPLICATE KEY UPDATE 
//                         priority = VALUES(priority), 
//                         category = VALUES(category), 
//                         acknowledged_by = VALUES(acknowledged_by)
//                 `;
//                 await db.queryAsync(maintenanceQuery, [reportId, priority, category, acknowledged_by]);
//             } else {
//                 // Delete maintenance record if moved away
//                 await db.queryAsync("DELETE FROM tbl_maintenance_reports WHERE report_id = ?", [reportId]);


//             }
//         } 
//         // Case 2: Report type is the same (only update sub-table details)
//         else {
//             if (report_type === "Maintenance") {
//                 const maintenanceUpdateQuery = `
//                     UPDATE tbl_maintenance_reports
//                     SET priority = ?, category = ?, acknowledged_by = ?
//                     WHERE report_id = ?
//                 `;
//                 await db.queryAsync(maintenanceUpdateQuery, [priority, category, acknowledged_by, reportId]);
//             }
//             // Add similar else-if for Incident / LostAndFound in the future
//         }

//         // Log remark if acknowledged
//         if (acknowledged_by) {
//             await logReportRemark(
//                 reportId,
//                 `Report acknowledged`,
//                 "Acknowledged",
//                 acknowledged_by
//             );
//         }

//         // Emit real-time updates
//         req.io.emit("updateViewedReport");
//         req.io.emit("updateReports");
//         req.io.emit("update");

//         res.json({ success: true, message: "Report updated successfully" });
//     } catch (err) {
//         console.error("Error updating report:", err);
//         res.status(500).json({ success: false, message: "Failed to update report" });
//     }
// });

// router.put("/admin/edit-report-type/:reportId", async (req, res) => {
//     const { report_type, priority, category, acknowledged_by, updated_by } = req.body;
//     const { reportId } = req.params;

//     try {
//         // Get the current report_type
//         const [currentReport] = await db.queryAsync(
//             "SELECT report_type FROM tbl_reports WHERE id = ?",
//             [reportId]
//         );

//         if (!currentReport) {
//             return res.status(404).json({ success: false, message: "Report not found" });
//         }

//         const currentType = currentReport.report_type;

//         // Case 1: Report type actually changed
//         if (currentType !== report_type) {
//             // Update main report type
//             const updateReportQuery = `
//                 UPDATE tbl_reports 
//                 SET report_type = ?
//                 WHERE id = ?
//             `;
//             await db.queryAsync(updateReportQuery, [report_type, reportId]);

//             // Handle Maintenance type
//             if (report_type === "Maintenance") {
//                 const maintenanceQuery = `
//                     INSERT INTO tbl_maintenance_reports (report_id, priority, category, acknowledged_by) 
//                     VALUES (?, ?, ?, ?)
//                     ON DUPLICATE KEY UPDATE 
//                         priority = VALUES(priority), 
//                         category = VALUES(category), 
//                         acknowledged_by = VALUES(acknowledged_by)
//                 `;
//                 await db.queryAsync(maintenanceQuery, [reportId, priority, category, acknowledged_by]);
//             } else {
//                 await db.queryAsync("DELETE FROM tbl_maintenance_reports WHERE report_id = ?", [reportId]);
//             }

//             // Handle Incident type
//             if (report_type === "Incident") {
//                 console.log('Change to Incident');
//                 // const incidentQuery = `
//                 //     INSERT INTO tbl_incident_reports (report_id, priority, category, acknowledged_by) 
//                 //     VALUES (?, ?, ?, ?)
//                 //     ON DUPLICATE KEY UPDATE 
//                 //         priority = VALUES(priority), 
//                 //         category = VALUES(category), 
//                 //         acknowledged_by = VALUES(acknowledged_by)
//                 // `;
//                 // await db.queryAsync(incidentQuery, [reportId, priority, category, acknowledged_by]);
//             } else {
//                 // await db.queryAsync("DELETE FROM tbl_incident_reports WHERE report_id = ?", [reportId]);
//                 console.log('Delete from incident');

//             }

//             // Handle Lost & Found type
//             if (report_type === "LostAndFound") {
//                 console.log("Change to lost and found")
//                 // const lostFoundQuery = `
//                 //     INSERT INTO tbl_lost_and_found (report_id, priority, category, acknowledged_by) 
//                 //     VALUES (?, ?, ?, ?)
//                 //     ON DUPLICATE KEY UPDATE 
//                 //         priority = VALUES(priority), 
//                 //         category = VALUES(category), 
//                 //         acknowledged_by = VALUES(acknowledged_by)
//                 // `;
//                 // await db.queryAsync(lostFoundQuery, [reportId, priority, category, acknowledged_by]);
//             } else {
//                 // await db.queryAsync("DELETE FROM tbl_lost_and_found WHERE report_id = ?", [reportId]);
//                 console.log("Delete from lost and found")
//             }
//         } 
//         // Case 2: Report type is the same (only update sub-table details)
//         else {
//             if (report_type === "Maintenance") {
//                 const maintenanceUpdateQuery = `
//                     UPDATE tbl_maintenance_reports
//                     SET priority = ?, category = ?, acknowledged_by = ?
//                     WHERE report_id = ?
//                 `;
//                 await db.queryAsync(maintenanceUpdateQuery, [priority, category, acknowledged_by, reportId]);
//             } else if (report_type === "Incident") {
//                console.log('Updated data from incident');
//                 // const incidentUpdateQuery = `
//                 //     UPDATE tbl_incident_reports
//                 //     SET priority = ?, category = ?, acknowledged_by = ?
//                 //     WHERE report_id = ?
//                 // `;
//                 // await db.queryAsync(incidentUpdateQuery, [priority, category, acknowledged_by, reportId]);
//             } else if (report_type === "LostAndFound") {
//                 console.log('Updated data from lost and found')
//                 // const lostFoundUpdateQuery = `
//                 //     UPDATE tbl_lost_and_found
//                 //     SET priority = ?, category = ?, acknowledged_by = ?
//                 //     WHERE report_id = ?
//                 // `;
//                 // await db.queryAsync(lostFoundUpdateQuery, [priority, category, acknowledged_by, reportId]);
//             }
//         }

//         // Log remark if acknowledged
//         if (acknowledged_by) {
//             await logReportRemark(
//                 reportId,
//                 `Report acknowledged`,
//                 "Acknowledged",
//                 acknowledged_by
//             );
//         }

//         // Emit real-time updates
//         req.io.emit("updateViewedReport");
//         req.io.emit("updateReports");
//         req.io.emit("update");

//         res.json({ success: true, message: "Report updated successfully" });
//     } catch (err) {
//         console.error("Error updating report:", err);
//         res.status(500).json({ success: false, message: "Failed to update report" });
//     }
// });




// router.put("/admin/edit-report-type/:reportId", async (req, res) => {
//     const { report_type, priority, category, acknowledged_by, updated_by } = req.body;
//     const { reportId } = req.params;

//     try {
//         // Update report type
//         const updateReportQuery = "UPDATE tbl_reports SET report_type = ? WHERE id = ?";
//         await db.queryAsync(updateReportQuery, [report_type, reportId]);

//         if (report_type === "Maintenance") {
//             // Insert or update maintenance report
//             const maintenanceQuery = `
//                 INSERT INTO tbl_maintenance_reports (report_id, priority, category, acknowledged_by) 
//                 VALUES (?, ?, ?, ?)
//                 ON DUPLICATE KEY UPDATE 
//                     priority = VALUES(priority), 
//                     category = VALUES(category), 
//                     acknowledged_by = VALUES(acknowledged_by)
//             `;
//             await db.queryAsync(maintenanceQuery, [reportId, priority, category, acknowledged_by]);

//             // Log remark if acknowledged
//             if (acknowledged_by) {
//                 await logReportRemark(
//                     reportId,
//                     `Report acknowledged`,
//                     "Acknowledged",
//                     acknowledged_by
//                 );
//             }
//         }

//         // Emit real-time updates
//         req.io.emit('updateViewedReport');
//         req.io.emit('updateReports');
//         req.io.emit('update');

//         res.json({ success: true, message: "Report updated successfully" });
//     } catch (err) {
//         console.error("Error updating report:", err);
//         res.status(500).json({ success: false, message: "Failed to update report" });
//     }
// });

// Mark report as viewed
// router.put('/report/set-viewed-report/:id', async (req, res) => {
//     const { id } = req.params;

//     try {
//         const query = 'UPDATE tbl_reports SET viewed = 1 WHERE id = ?';
//         const result = await db.queryAsync(query, [id]);

//         if (result.affectedRows > 0) {
//             req.io.emit('updateReports');
//             return res.json({ success: true, message: "Report has been marked as viewed." });
//         } else {
//             return res.status(404).json({ success: false, message: "Report not found." });
//         }
//     } catch (err) {
//         console.error('Error setting as viewed:', err);
//         return res.status(500).json({ success: false, message: 'Error setting as viewed' });
//     }
// });


//  Archive report

//
router.put("/admin/edit-report-type/:reportId", async (req, res) => { // route for editing report type it requires reportId
    const { report_type, priority, category, acknowledged_by, updated_by } = req.body;
    const { reportId } = req.params;


    try {
        // Get the current report_type
        const [currentReport] = await db.queryAsync(
            "SELECT report_type FROM tbl_reports WHERE id = ?",
            [reportId]
        );

        if (!currentReport) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        const currentType = currentReport.report_type;

        // Case 1: Report type actually changed
        if (currentType !== report_type) {
            // Update main report type
            const updateReportQuery = `
                UPDATE tbl_reports 
                SET report_type = ?
                WHERE id = ?
            `;
            await db.queryAsync(updateReportQuery, [report_type, reportId]);

            // Handle Maintenance type
            if (report_type === "Maintenance") {
                const maintenanceQuery = `
                    INSERT INTO tbl_maintenance_reports (report_id, priority, category, acknowledged_by) 
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        priority = VALUES(priority), 
                        category = VALUES(category), 
                        acknowledged_by = COALESCE(tbl_maintenance_reports.acknowledged_by, VALUES(acknowledged_by))
                `;
                await db.queryAsync(maintenanceQuery, [reportId, priority, category, acknowledged_by]);
            } else {
                await db.queryAsync("DELETE FROM tbl_maintenance_reports WHERE report_id = ?", [reportId]);
            }

            // Handle Incident type
            if (report_type === "Incident") {
                console.log('Change to Incident');
                // same pattern as maintenance if needed
            } else {
                console.log('Delete from incident');
            }

            // Handle Lost & Found type
            if (report_type === "LostAndFound") {
                console.log("Change to lost and found");
                // same pattern as maintenance if needed
            } else {
                console.log("Delete from lost and found");
            }
        }
        // Case 2: Report type is the same (only update sub-table details)
        else {
            if (report_type === "Maintenance") {
                // First fetch current data
                const oldMaintResult = await db.queryAsync(`SELECT category, acknowledged_by, priority FROM tbl_maintenance_reports WHERE report_id = ?`, [reportId]);

                let oldAck = null, oldCategory = "", oldPriority = "";

                if (oldMaintResult.length > 0) {
                    oldAck = oldMaintResult[0]?.acknowledged_by || null;
                    oldCategory = oldMaintResult[0]?.category || "";
                    oldPriority = oldMaintResult[0]?.priority || "";
                }
                await db.queryAsync(`UPDATE tbl_maintenance_reports SET 
                    priority = ?, category = ?, acknowledged_by = COALESCE(acknowledged_by, ?) 
                    WHERE report_id = ?`, [priority, category, acknowledged_by, reportId]);

                if (oldCategory !== category) {
                    await logReportRemark(reportId, `Category changed from ${oldCategory || "None"} to ${category}`, "Update Category", acknowledged_by);
                }

                if (oldPriority !== priority) {
                    await logReportRemark(reportId, `Priority changed from ${oldPriority || "None"} to ${priority}`, "Update Priority", acknowledged_by);
                }
                // // Log acknowledgment only if it was empty before and now has value
                if (!oldAck && acknowledged_by) {
                    await logReportRemark(reportId, `Report acknowledged`, "Acknowledged", acknowledged_by);
                }
            } else if (report_type === "Incident") {
                console.log('Updated data from incident');
            } else if (report_type === "LostAndFound") {
                console.log('Updated data from lost and found');
            }
        }

        // Emit real-time updates
        req.io.emit("updateViewedReport");
        req.io.emit("updateReports");
        req.io.emit("update");

        res.json({ success: true, message: "Report updated successfully" });
    } catch (err) {
        console.error("Error updating report:", err);
        res.status(500).json({ success: false, message: "Failed to update report" });
    }
});


// route for achiving report requires id or reportId
router.put('/report/archive-report/:id', async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({ success: false, message: "Error: reason is required." });
    }

    try {
        const query = `UPDATE tbl_reports SET archived = 1 WHERE id = ?`;
        const result = await db.queryAsync(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Report not found or already archived" });
        }

        // Get report details
        const selectQuery = `SELECT user_id, location FROM tbl_reports WHERE id = ?`;
        const rows = await db.queryAsync(selectQuery, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Report not found after update" });
        }

        const report = rows[0];
        const { user_id, location } = report;

        // Create notification
        const notifMsg = `Your report about ${location} has been archived. Reason: ${reason}`;
        const notifInsert = await db.queryAsync('INSERT INTO notifications (message, title) VALUES (?, "Report Archived")', [notifMsg]);

        const notifId = notifInsert.insertId;

        await db.queryAsync(
            'INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES (?, ?, false)',
            [notifId, user_id]
        );

        // Emit socket events
        req.io.emit('updateReports');
        req.io.emit('updateNotifications');
        req.io.emit('reportArchivedNotification', { reportId: id, notifId, userId: user_id, message: notifMsg });

        return res.json({ success: true, message: "Report archived successfully and user notified", affectedRow: report });

    } catch (err) {
        return res.status(500).json({ success: false, message: "Error archiving report" });
    }
});


//  route for send back report it requires reportId
router.put('/report/send-back/:id', async (req, res) => {
    const { id } = req.params;
    const { reason, location } = req.body;
    try {
        // Reset report type
        await db.queryAsync(`UPDATE tbl_reports SET report_type = '' WHERE id = ?`, [id]);

        // Delete maintenance report
        await db.queryAsync(`DELETE FROM tbl_maintenance_reports WHERE report_id = ?`, [id]);

        // Create a new notification
        const notifMsg = `A report about ${location} has been returned.`;
        const notifInsert = await db.queryAsync(`INSERT INTO notifications (message, title) VALUES (?, "Returned Report")`, [notifMsg]);
        const notifId = notifInsert.insertId;

        // Get all admins and staff
        const receivers = await db.queryAsync(`SELECT id FROM tbl_users WHERE role="admin" OR role="Report Approver"`);

        if (receivers.length > 0) {
            const receiverValues = receivers.map(user => [notifId, user.id, false]); // false = unread
            await db.queryAsync(`INSERT INTO notification_receivers (notification_id, user_id, is_read) VALUES ?`, [receiverValues]);
        }
        // Emit socket update
        req.io.emit('updateReports');
        req.io.emit('updateNotifications');

        return res.json({ success: true, message: "Report sent back to manager", reason });
    } catch (err) {
        console.error("Error sending back report:", err);
        return res.status(500).json({ success: false, message: "Failed to send back report" });
    }
});

// route for adding progress rearks on selected report it requires reportId
router.post('/report/add-progress-remarks/:id', async (req, res) => {
    const { id } = req.params; // report_id
    const { action, remark, updated_by } = req.body;

    if (!action || !updated_by) {
        return res.status(400).json({ success: false, message: "Action and updated_by are required." });
    }

    try {
        const insertQuery = `INSERT INTO tbl_report_remarks (report_id, action, remark, updated_by) VALUES (?, ?, ?, ?)`;

        // Destructure so we can access insertId
        const result = await db.queryAsync(insertQuery, [
            id,
            action,
            remark || null,
            updated_by
        ]);

        req.io.emit('updateViewedReport');

        return res.json({
            success: true,
            message: "Remark added successfully",
            remarkId: result.insertId
        });

    } catch (err) {
        console.error("Error inserting remark:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to insert remark"
        });
    }
});


// route for fetching all remarks for a report it requires reportId
router.get('/report/get-report-remarks/:id', async (req, res) => {
    const { id } = req.params;

    try {
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
        const rows = await db.queryAsync(query, [id]);
        return res.json({ success: true, remarks: rows });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});
// this route used by maintenance report creation
router.post("/create", upload.single('image'), async (req, res) => {
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

    try {
        // Step 1: Insert into tbl_reports
        const insertReportQuery = `
            INSERT INTO tbl_reports (user_id, report_type, status, location, description, image_path, is_anonymous)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const reportResult = await db.queryAsync(insertReportQuery, [
            user_id,
            report_type,
            status || "Pending",
            location,
            description,
            image_path,
            is_anonymous ? 1 : 0
        ]);
        const reportId = reportResult.insertId;

        // Step 2: Insert into related table based on report_type
        if (report_type === "Maintenance") {
            const maintenanceQuery = `
                INSERT INTO tbl_maintenance_reports (report_id, category, priority, assigned_staff)
                VALUES (?, ?, ?, ?)
            `;
            await db.queryAsync(maintenanceQuery, [reportId, category, priority, assigned_staff]);
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
        return res.status(500).json({ success: false, message: "Failed to create report" });
    }
});
module.exports = router;
