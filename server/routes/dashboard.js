const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Dashboard Summary Endpoint
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {

    const urgentReports = `
    SELECT COUNT(*) AS count FROM tbl_maintenance_reports tmr 
    LEFT JOIN tbl_reports tr ON tmr.report_id = tr.id     
    WHERE tmr.priority = 'Urgent' AND tr.status != 'Resolved'; 
    `;
    const urgentReportsResult = await db.queryAsync(urgentReports);

    // Active Borrowers: Count distinct borrowers with at least one "Pending" or "Approved" status
    const highPriorityReports = `
    SELECT COUNT(*) AS count
    FROM tbl_maintenance_reports tmr LEFT JOIN
    tbl_reports tr ON tmr.report_id = tr.id
    WHERE tmr.priority = 'High' AND tr.status != 'Resolved'
    `;
    const highPriorityReportsResult = await db.queryAsync(highPriorityReports);

    // Available Items
    const mediumPriorityReports = `
      SELECT COUNT(*) AS count
      FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
      ON tmr.report_id = tr.id
      WHERE tmr.priority = 'Medium' AND tr.status != 'Resolved'
    `;

    const mediumPriorityReportsResult = await db.queryAsync(mediumPriorityReports);

    const lowPriorityReports = `
      SELECT COUNT(*) AS count
      FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
      ON tmr.report_id = tr.id
      WHERE tmr.priority = 'Low' AND tr.status != 'Resolved'
    `;

    const lowPriorityReportsResult = await db.queryAsync(lowPriorityReports);

    const reportsFrequency = `
      SELECT *
      FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
      ON tmr.report_id = tr.id
      ORDER BY tr.created_at DESC
    `;
    const reportFrequencyResult = await db.queryAsync(reportsFrequency);

    const borrowersRankingQuery = `
      SELECT borrower_name, COUNT(*) AS borrow_count FROM borrowed_items GROUP BY borrower_name ORDER BY borrow_count DESC LIMIT 10; 
    `;
    const borrowersRankingResult = await db.queryAsync(borrowersRankingQuery);

    const assignedFrequencyQuery = `
      SELECT ms.id, ms.name, 
      COUNT(*) AS count FROM tbl_maintenance_reports tmr 
      JOIN tbl_maintenance_staff ms ON FIND_IN_SET(ms.id, tmr.assigned_staff) > 0 
      GROUP BY ms.id, ms.name ORDER BY count DESC LIMIT 10; 
    `;
    const assignedFrequencyResult = await db.queryAsync(assignedFrequencyQuery);

    const inventoryQuery = `
      SELECT item_name AS item, status, category, quantity AS total, quantity AS available
      FROM inventory_items
      ORDER BY created_at DESC
    `;
    const inventory = await db.queryAsync(inventoryQuery);


    const inProgressCountQuery = `
      SELECT COUNT(*) AS count
      FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
      ON tmr.report_id = tr.id
      WHERE tr.status = 'In Progress'
        AND tr.archived = 0
    `;
    const inProgressResult = await db.queryAsync(inProgressCountQuery);
    const reportsTodayQuery = `
      SELECT COUNT(*) AS count
      FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
      ON tmr.report_id = tr.id
      WHERE DATE(tr.created_at) = CURDATE()
        AND tr.archived = 0
    `;
    const reportsTodayResult = await db.queryAsync(reportsTodayQuery);

    const reportsTodayListQuery = `
     SELECT tr.id, tr.location, tr.description, tmr.priority, tr.created_at, tr.updated_at,
      TIME_FORMAT(tr.created_at, '%h:%i %p') AS time
      FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
      ON tmr.report_id = tr.id
      WHERE DATE(tr.created_at) = CURDATE()
        AND tr.archived = 0 AND tr.status = 'Pending'
    `;
    const reportsTodayList = await db.queryAsync(reportsTodayListQuery);
    // In Progress Reports (list)
    // const inProgressListQuery = `
    //   SELECT tr.id, tr.location, tr.description, tmr.priority, tr.created_at, tr.updated_at, 
    //   TIME_FORMAT(tr.updated_at, '%h:%i %p') AS time 
    //   FROM tbl_maintenance_reports tmr 
    //   LEFT JOIN tbl_reports tr ON tmr.report_id = tr.id
    //   WHERE tr.status = 'In Progress' AND tr.archived = 0 ORDER BY tr.updated_at DESC LIMIT 10; 
    // `;
    const inProgressListQuery = `SELECT 
      tr.id, 
      tr.location, 
      tr.description, 
      tmr.priority, 
      tr.created_at, 
      tr.updated_at,
      TIME_FORMAT(tr.updated_at, '%h:%i %p') AS time,
      GROUP_CONCAT(ms.name ORDER BY ms.name SEPARATOR ', ') AS assigned_staff_names
      FROM tbl_maintenance_reports tmr
      LEFT JOIN tbl_reports tr 
        ON tmr.report_id = tr.id
      LEFT JOIN tbl_maintenance_staff ms 
        ON FIND_IN_SET(ms.id, tmr.assigned_staff) > 0
      WHERE tr.status = 'In Progress' 
        AND tr.archived = 0
      GROUP BY tr.id, tr.location, tr.description, tmr.priority, tr.created_at, tr.updated_at
      ORDER BY tr.updated_at DESC
      LIMIT 10
    `;
    const inProgressList = await db.queryAsync(inProgressListQuery);

    // Recently Completed Reports (list)
    // const recentlyCompletedListQuery = `
    //   SELECT tr.id, tr.location, tr.description, tmr.priority, tr.created_at, tr.updated_at,
    //   TIME_FORMAT(tr.updated_at, '%h:%i %p') AS time
    //   FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
    //   ON tmr.report_id = tr.id
    //   WHERE tr.status IN ('Resolved', 'Completed')
    //     AND tr.archived = 0
    //   ORDER BY tr.updated_at DESC
    //   LIMIT 10
    // `;
    const recentlyCompletedListQuery = `SELECT 
  tr.id, 
  tr.location, 
  tr.description, 
  tmr.priority, 
  tr.created_at, 
  tr.updated_at,
  TIME_FORMAT(tr.updated_at, '%h:%i %p') AS time,
  GROUP_CONCAT(ms.name ORDER BY ms.name SEPARATOR ', ') AS assigned_staff_names
FROM tbl_maintenance_reports tmr
LEFT JOIN tbl_reports tr 
  ON tmr.report_id = tr.id
LEFT JOIN tbl_maintenance_staff ms 
  ON FIND_IN_SET(ms.id, tmr.assigned_staff) > 0
WHERE tr.status IN ('Resolved', 'Completed') 
  AND tr.archived = 0
GROUP BY tr.id, tr.location, tr.description, tmr.priority, tr.created_at, tr.updated_at
ORDER BY tr.updated_at DESC
LIMIT 10;
`
    const recentlyCompletedList = await db.queryAsync(recentlyCompletedListQuery);

    ;
    const categoryQuery = `
      SELECT *
      FROM tbl_maintenance_reports tmr LEFT JOIN tbl_reports tr
      ON tmr.report_id = tr.id
      WHERE tr.archived = 0
    `;
    const categoryData = await db.queryAsync(categoryQuery);


    const trendsQuery = {
      daily: `
    SELECT DATE(tr.updated_at) AS day,
           AVG(TIMESTAMPDIFF(HOUR, tr.created_at, tr.updated_at)) AS avg_resolution_hours
    FROM tbl_reports tr
    JOIN tbl_maintenance_reports tmr ON tr.id = tmr.report_id
    WHERE tr.status IN ('Resolved', 'Completed')
    GROUP BY DATE(tr.updated_at)
    ORDER BY day;
  `,
      weekly: `
    SELECT YEAR(tr.updated_at) AS year,
           WEEK(tr.updated_at, 1) AS week,
           AVG(TIMESTAMPDIFF(HOUR, tr.created_at, tr.updated_at)) AS avg_resolution_hours
    FROM tbl_reports tr
    JOIN tbl_maintenance_reports tmr ON tr.id = tmr.report_id
    WHERE tr.status IN ('Resolved', 'Completed')
    GROUP BY year, week
    ORDER BY year, week;
  `,
      monthly: `
    SELECT YEAR(tr.updated_at) AS year,
           MONTH(tr.updated_at) AS month,
           AVG(TIMESTAMPDIFF(HOUR, tr.created_at, tr.updated_at)) AS avg_resolution_hours
    FROM tbl_reports tr
    JOIN tbl_maintenance_reports tmr ON tr.id = tmr.report_id
    WHERE tr.status IN ('Resolved', 'Completed')
    GROUP BY year, month
    ORDER BY year, month;
  `,
      yearly: `
    SELECT YEAR(tr.updated_at) AS year,
           AVG(TIMESTAMPDIFF(HOUR, tr.created_at, tr.updated_at)) AS avg_resolution_hours
    FROM tbl_reports tr
    JOIN tbl_maintenance_reports tmr ON tr.id = tmr.report_id
    WHERE tr.status IN ('Resolved', 'Completed')
    GROUP BY year
    ORDER BY year;
  `
    };

    const [daily, weekly, monthly, yearly] = await Promise.all([
      db.queryAsync(trendsQuery.daily),
      db.queryAsync(trendsQuery.weekly),
      db.queryAsync(trendsQuery.monthly),
      db.queryAsync(trendsQuery.yearly),
    ]);
    // Compose and send full dashboard data
    res.json({
      reportFrequencyResult,
      inventory,
      reportsTodayList,
      inProgressList,
      recentlyCompletedList,
      categoryData,
      quickStats: {
        inProgessCount: inProgressResult[0].count,
        reportsToday: reportsTodayResult[0].count,
        urgentReports: urgentReportsResult[0].count,
        highPriorityReports: highPriorityReportsResult[0].count,
        mediumPriorityReports: mediumPriorityReportsResult[0].count,
        lowPriorityReports: lowPriorityReportsResult[0].count,

      },
      trends: {
        daily,
        weekly,
        monthly,
        yearly
      },
      borrowersRanking: borrowersRankingResult,
      assignedFrequency: assignedFrequencyResult
    });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
