-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 19, 2025 at 10:21 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lc-maintenance-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `borrowed_items`
--

CREATE TABLE `borrowed_items` (
  `id` int(11) NOT NULL,
  `borrower_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `item_name` text NOT NULL,
  `description` text DEFAULT NULL,
  `borrow_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `returned_date` timestamp NULL DEFAULT NULL,
  `assisted_by` varchar(100) DEFAULT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `borrowed_items`
--

INSERT INTO `borrowed_items` (`id`, `borrower_name`, `email`, `department`, `item_name`, `description`, `borrow_date`, `returned_date`, `assisted_by`, `status`, `created_at`) VALUES
(1, 'fff', 'fff@gmail.com', 'Nursing', 'EUS Laptop1 w/charger', 'ttttttt', '2025-09-17 07:21:14', NULL, 'Angelo Cabase', 'Pending', '2025-09-17 07:21:14');

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_conversations`
--

CREATE TABLE `chatbot_conversations` (
  `id` int(11) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ended_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatbot_messages`
--

CREATE TABLE `chatbot_messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `sender` enum('user','bot') NOT NULL,
  `text` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `start_datetime` datetime NOT NULL,
  `end_datetime` datetime NOT NULL DEFAULT current_timestamp(),
  `notified` tinyint(1) DEFAULT 0,
  `is_personal` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_modified` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `notified_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_preparations`
--

CREATE TABLE `event_preparations` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `status` enum('New','Used','Old','Restored') DEFAULT 'Used',
  `serial_number` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_items`
--

INSERT INTO `inventory_items` (`id`, `item_name`, `category`, `quantity`, `status`, `serial_number`, `created_at`, `updated_at`) VALUES
(1, 'Test Item', 'Monitors', 10, 'Used', '', '2025-09-17 04:47:37', '2025-09-17 04:47:37');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `title`, `message`, `created_at`) VALUES
(1, 'New Report', 'A new report has been submitted about test.', '2025-09-10 09:33:39'),
(2, 'New Report', 'A new report has been submitted about test.', '2025-09-10 09:50:32'),
(3, 'New Report', 'A new report has been submitted about test.', '2025-09-10 09:51:56'),
(4, 'New Report', 'A new report has been submitted about undefined.', '2025-09-10 10:20:33'),
(5, 'New Report', 'A new report has been submitted about undefined.', '2025-09-10 10:33:23'),
(6, 'New Report', 'A new report has been submitted about undefined.', '2025-09-10 10:34:31'),
(7, 'New Report', 'A new report has been submitted about test.', '2025-09-10 11:31:08'),
(8, 'New Report', 'A new report has been submitted about test.', '2025-09-10 14:15:44'),
(9, 'New Report', 'A new report has been submitted about test.', '2025-09-10 14:18:52'),
(10, 'New Report', 'A new report has been submitted about test.', '2025-09-10 14:30:06'),
(11, 'New Report', 'A new report has been submitted about test.', '2025-09-10 14:30:19'),
(12, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-09-10 14:45:20'),
(13, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-09-10 14:46:21'),
(14, 'Report Update', 'Your report about test has been marked as Resolved.', '2025-09-10 14:56:37'),
(15, 'New Report', 'A new report has been submitted about Test.', '2025-09-10 14:59:09'),
(16, 'New Report', 'A new report has been submitted about test.', '2025-09-10 15:04:36'),
(17, 'New Report', 'A new report has been submitted about test 2.', '2025-09-10 15:04:53'),
(18, 'New Report', 'A new report has been submitted about test 2.', '2025-09-10 15:05:14'),
(19, 'Report Update', 'Your report about test has been marked as Resolved.', '2025-09-10 15:32:06'),
(20, 'Report Update', 'Your report about adsas has been marked as Resolved.', '2025-09-10 15:55:48'),
(21, 'Report Update', 'Your report about gggg has been marked as Resolved.', '2025-09-10 15:56:04'),
(22, 'New Report', 'A new report has been submitted about test.', '2025-09-10 16:13:01'),
(23, 'Report Update', 'Your report about La Union has been marked as Resolved.', '2025-09-11 08:47:49'),
(24, 'New Report', 'A new report has been submitted about test.', '2025-09-11 08:59:41'),
(25, 'New Report', 'A new report has been submitted about test.', '2025-09-11 09:11:19'),
(26, 'New Report', 'A new report has been submitted about test.', '2025-09-11 09:11:34'),
(27, 'New Report', 'A new report has been submitted about La Union.', '2025-09-11 09:12:24'),
(28, 'Report Update', 'Your report about test has been marked as Resolved.', '2025-09-11 09:12:40'),
(29, 'New Report', 'A new report has been submitted about test.', '2025-09-11 09:13:12'),
(30, 'Report Update', 'Your report about test has been marked as Resolved.', '2025-09-11 09:13:33'),
(31, 'New Report', 'A new report has been submitted about Test Empty Category.', '2025-09-11 09:34:17'),
(32, 'Report Archived', 'Your report about test has been archived.', '2025-09-11 10:10:43'),
(33, 'New Report', 'A new report has been submitted about Test.', '2025-09-11 10:52:58'),
(34, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-09-11 11:13:46'),
(35, 'Report Update', 'Your report about test has been marked as Resolved.', '2025-09-11 11:14:42'),
(36, 'Report Update', 'Your report about test has been reopened and is back to In Progress.', '2025-09-11 11:16:38'),
(37, 'Report Archived', 'Your report about test 2 has been archived. Reason(Duplicate entry)', '2025-09-11 11:35:31'),
(38, 'Report Archived', 'Your report about Test has been archived. Reason: Duplicate report', '2025-09-11 11:42:36'),
(39, 'Report Archived', 'Your report about adsas has been archived. Reason: \'\'', '2025-09-11 11:43:31'),
(40, 'Report Archived', 'Your report about test has been archived. Reason: undefined', '2025-09-11 11:59:16'),
(41, 'Report Archived', 'Your report about test has been archived. Reason: \' \'', '2025-09-11 12:45:06'),
(42, 'Public Events', 'Upcoming Events:\n\n- Test\n  From: 9/11/2025, 2:40:00 PM\n  To:   9/11/2025, 3:00:00 PM', '2025-09-11 14:36:49'),
(43, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-09-11 15:16:31'),
(44, 'New Report', 'A new report has been submitted about Test.', '2025-09-12 09:42:31'),
(45, 'New Report', 'A new report has been submitted about Test.', '2025-09-12 09:46:25'),
(46, 'Report Update', 'Your report about test has been set back to Pending.', '2025-09-12 09:57:06'),
(47, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-09-12 10:28:55'),
(48, 'New Report', 'A new report has been submitted about Test.', '2025-09-12 10:33:56'),
(49, 'New Report', 'A new report has been submitted about Location.', '2025-09-12 10:41:26'),
(50, 'New Report', 'A new report has been submitted about Location.', '2025-09-12 10:42:04'),
(51, 'Report Update', 'Your report about Location is now being worked on (In Progress).', '2025-09-12 10:42:35'),
(52, 'Report Update', 'Your report about test has been set back to Pending.', '2025-09-12 10:44:55'),
(53, 'New Report', 'A new report has been submitted about Test.', '2025-09-12 11:48:07'),
(54, 'New Report', 'A new report has been submitted about Test.', '2025-09-12 12:57:18'),
(55, 'New Report', 'A new report has been submitted about Test Empty Category.', '2025-09-12 13:36:31'),
(56, 'New Report', 'A new report has been submitted about La Union.', '2025-09-12 13:37:42'),
(57, 'New Report', 'A new report has been submitted about test.', '2025-09-12 13:38:10'),
(58, 'New Report', 'A new report has been submitted about gggg.', '2025-09-12 13:38:22'),
(59, 'Report Update', 'Your report about Test has been marked as Resolved.', '2025-09-12 13:38:41'),
(60, 'Report Update', 'Your report about La Union has been marked as Resolved.', '2025-09-12 13:38:47'),
(61, 'New Report', 'A new report has been submitted about Test .', '2025-09-12 15:34:28'),
(62, 'New Report', 'A new report has been submitted about Test .', '2025-09-12 15:35:17'),
(63, 'New Report', 'A new report has been submitted about Test .', '2025-09-12 15:46:54'),
(64, 'Report Update', 'Your report about Location has been set back to Pending.', '2025-09-12 15:47:24'),
(65, 'Report Update', 'Your report about Test Empty Category is now being worked on (In Progress).', '2025-09-12 16:01:00'),
(66, 'New Report', 'A new report has been submitted about Test .', '2025-09-12 16:12:07'),
(67, 'New Report', 'A new report has been submitted about Location.', '2025-09-12 16:18:04'),
(68, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-09-15 08:59:08'),
(69, 'New Report', 'A new report has been submitted about Test Multiple Forms.', '2025-09-15 09:47:05'),
(70, 'New Report', 'A new report has been submitted about Test Multiple Forms.', '2025-09-15 14:57:05'),
(71, 'New Report', 'A new report has been submitted about test.', '2025-09-16 09:03:29'),
(72, 'Report Update', 'Your report about Test Multiple Forms is now being worked on (In Progress).', '2025-09-16 09:03:57'),
(73, 'New Report', 'A new report has been submitted about Test.', '2025-09-16 09:14:06'),
(74, 'New Report', 'A new report has been submitted about Test 09-16-2025.', '2025-09-16 11:32:18'),
(75, 'New Report', 'A new report has been submitted about Test 09-16-2025.', '2025-09-16 11:34:59'),
(76, 'New Report', 'A new report has been submitted about Test 09-16-2025.', '2025-09-16 11:36:47'),
(77, 'Report Update', 'Your report about report_type is now being worked on (In Progress).', '2025-09-16 11:57:11'),
(78, 'Report Update', 'Your report about Demo location is now being worked on (In Progress).', '2025-09-17 11:31:39'),
(79, 'Report Update', 'Your report about test has been set back to Pending.', '2025-09-17 11:31:54'),
(80, 'Report Update', 'Your report about test check box has been marked as Resolved.', '2025-09-17 11:32:45'),
(81, 'Report Update', 'Your report about test check box has been set back to Pending.', '2025-09-17 11:33:00'),
(82, 'Report Update', 'Your report about Test is now being worked on (In Progress).', '2025-09-18 11:42:16'),
(83, 'Report Update', 'Your report about test multiple staff has been marked as Resolved.', '2025-09-18 13:37:31'),
(84, 'Report Update', 'Your report about  is now being worked on (In Progress).', '2025-09-19 10:54:06'),
(85, 'Report Archived', 'Your report about  has been archived. Reason: No content', '2025-09-19 11:53:52'),
(86, 'Report Archived', 'Your report about Test has been archived. Reason: Unknown content', '2025-09-19 12:47:33');

-- --------------------------------------------------------

--
-- Table structure for table `notification_receivers`
--

CREATE TABLE `notification_receivers` (
  `id` int(11) NOT NULL,
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_receivers`
--

INSERT INTO `notification_receivers` (`id`, `notification_id`, `user_id`, `is_read`, `read_at`) VALUES
(1, 12, 5, 0, NULL),
(2, 13, 5, 0, NULL),
(3, 14, 5, 0, NULL),
(4, 19, 4, 0, NULL),
(5, 20, 4, 0, NULL),
(6, 21, 4, 0, NULL),
(7, 23, 5, 1, NULL),
(8, 28, 5, 1, NULL),
(9, 30, 6, 0, NULL),
(10, 32, 6, 0, NULL),
(11, 34, 5, 1, NULL),
(12, 35, 5, 0, NULL),
(13, 36, 5, 0, NULL),
(14, 37, 6, 0, NULL),
(15, 38, 6, 0, NULL),
(16, 39, 4, 0, NULL),
(17, 40, 5, 0, NULL),
(18, 41, 5, 0, NULL),
(19, 42, 4, 1, NULL),
(20, 43, 5, 0, NULL),
(21, 46, 5, 0, NULL),
(22, 47, 5, 0, NULL),
(23, 51, 6, 0, NULL),
(24, 52, 5, 0, NULL),
(25, 59, 6, 0, NULL),
(26, 60, 5, 0, NULL),
(27, 64, 6, 0, NULL),
(28, 65, 6, 0, NULL),
(29, 68, 5, 0, NULL),
(30, 72, 6, 0, NULL),
(31, 77, 6, 0, NULL),
(32, 78, 6, 0, NULL),
(33, 79, 5, 0, NULL),
(34, 80, 5, 0, NULL),
(35, 81, 5, 0, NULL),
(36, 82, 5, 0, NULL),
(37, 83, 5, 0, NULL),
(38, 84, 6, 0, NULL),
(39, 85, 6, 0, NULL),
(40, 86, 6, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_maintenance_reports`
--

CREATE TABLE `tbl_maintenance_reports` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `category` enum('Electrical','Plumbing','Cleaning','General Repair','Others') DEFAULT 'Others',
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `assigned_staff` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_maintenance_reports`
--

INSERT INTO `tbl_maintenance_reports` (`id`, `report_id`, `category`, `priority`, `assigned_staff`) VALUES
(1, 17, 'Cleaning', 'Medium', ''),
(10, 19, 'Plumbing', 'Urgent', '7'),
(11, 18, 'General Repair', 'High', ''),
(12, 15, 'Others', 'High', '12'),
(13, 16, 'Electrical', 'Medium', NULL),
(14, 11, 'Cleaning', 'High', ''),
(17, 22, 'Plumbing', 'Medium', ''),
(18, 23, 'Cleaning', 'Medium', ''),
(19, 24, 'Plumbing', 'High', ''),
(20, 25, 'Plumbing', 'Medium', ''),
(21, 26, 'General Repair', 'Medium', '2'),
(22, 21, 'Plumbing', 'Low', ''),
(23, 20, 'Cleaning', 'Medium', ''),
(24, 27, 'Cleaning', 'Urgent', ''),
(25, 14, 'Plumbing', 'Medium', ''),
(26, 32, 'General Repair', 'Medium', ''),
(27, 33, 'Plumbing', 'Medium', ''),
(28, 34, 'Plumbing', 'Medium', ''),
(29, 35, 'Electrical', 'High', ''),
(30, 36, 'Cleaning', 'High', ''),
(31, 37, 'Plumbing', 'High', ''),
(32, 38, 'Electrical', 'Medium', ''),
(33, 39, 'Plumbing', 'Medium', ''),
(34, 40, 'Electrical', 'Low', ''),
(35, 41, 'Cleaning', 'Low', ''),
(36, 42, 'Plumbing', 'Medium', ''),
(37, 43, 'Cleaning', 'Medium', ''),
(38, 44, 'Plumbing', 'Low', '1'),
(39, 46, 'Electrical', 'Low', '1,2,3,4'),
(40, 47, 'Electrical', 'Low', '2'),
(41, 48, 'Electrical', 'Low', '1,2,3,4,7'),
(42, 49, 'Plumbing', 'Low', '3'),
(43, 50, 'Plumbing', 'Low', '1,3'),
(44, 51, 'Electrical', 'Low', '1'),
(45, 52, 'Cleaning', 'Medium', '1,4,5'),
(46, 53, 'Plumbing', 'Low', '4,6,7'),
(47, 54, 'Plumbing', 'Low', '1,11,2,3,4,5,6,7,8,9,10'),
(48, 55, 'Plumbing', 'Low', '1,2'),
(49, 56, NULL, NULL, NULL),
(50, 57, 'Electrical', 'Low', '12'),
(51, 58, 'Electrical', 'Low', '12'),
(52, 59, NULL, NULL, NULL),
(53, 60, NULL, NULL, NULL),
(54, 61, NULL, NULL, NULL),
(55, 62, 'Electrical', 'Low', '12,1'),
(56, 63, NULL, NULL, NULL),
(57, 64, NULL, NULL, NULL),
(58, 65, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_maintenance_staff`
--

CREATE TABLE `tbl_maintenance_staff` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_maintenance_staff`
--

INSERT INTO `tbl_maintenance_staff` (`id`, `name`, `email`, `contact_number`, `role`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Staff 00', 'staff00@gmail.com', '0987654321', 'Staff 0', '2025-09-16 02:44:45', '2025-09-16 02:44:45', 1),
(2, 'Staff 01', 'staff01@gmail.com', 'asdsadsad', 'Staff 01', '2025-09-16 05:31:27', '2025-09-16 05:31:27', 1),
(3, 'Staff 02', 'staff02@gmail.com', 'asdsadsad', 'Staff 02', '2025-09-16 05:31:42', '2025-09-16 05:31:42', 1),
(4, 'Staff 03', 'staff03@gmail.com', 'asdasdsa', 'Staff 03', '2025-09-17 00:31:37', '2025-09-17 00:31:37', 1),
(5, 'Staff 04', 'staff04@gmail.com', 'asdsasa', 'Staff 04', '2025-09-17 00:38:43', '2025-09-17 00:38:43', 1),
(6, 'Staff 05', 'staff05@gmail.com', 'asdsasa', 'Staff 05', '2025-09-17 00:42:48', '2025-09-17 00:42:48', 1),
(7, 'Staff 06', 'staff06@gmail.com', 'asdsasa', 'Staff 06', '2025-09-17 00:49:58', '2025-09-17 00:49:58', 1),
(8, 'Staff 07', 'staff07@gmail.com', 'asdsasa', 'Staff 07', '2025-09-17 00:52:14', '2025-09-17 00:52:14', 1),
(9, 'Staff 08', 'staff08@gmail.com', 'asdsasa', 'Staff 08', '2025-09-17 00:52:52', '2025-09-17 00:52:52', 1),
(10, 'Staff 09', 'staff09@gmail.com', 'sadasdas', 'Staff 09', '2025-09-17 00:56:38', '2025-09-17 00:56:38', 1),
(11, 'Staff 10', 'staff10@gmail.com', 'tes', 'Staff 10', '2025-09-17 05:12:30', '2025-09-17 05:12:30', 1),
(12, 'Staff 11', 'staff11@gmail.com', '', 'Staff 11', '2025-09-19 00:26:12', '2025-09-19 00:26:12', 1),
(13, 'Staff 12', 'staff12@gmail.com', '', NULL, '2025-09-19 03:28:55', '2025-09-19 03:28:55', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_reports`
--

CREATE TABLE `tbl_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `report_type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `status` enum('Pending','In Progress','Resolved') DEFAULT 'Pending',
  `is_anonymous` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `viewed` tinyint(1) NOT NULL DEFAULT 0,
  `archived` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_reports`
--

INSERT INTO `tbl_reports` (`id`, `user_id`, `location`, `report_type`, `description`, `image_path`, `status`, `is_anonymous`, `created_at`, `updated_at`, `viewed`, `archived`) VALUES
(3, 5, 'test', '', 'test', NULL, 'Pending', 0, '2025-09-10 01:50:32', '2025-09-11 04:47:32', 0, 0),
(4, 5, 'test', '', 'test', NULL, 'Pending', 1, '2025-09-10 01:51:56', '2025-09-11 04:47:32', 0, 0),
(6, 6, 'test', '', 'Test', '1757487876565.jpg', 'Pending', 0, '2025-09-10 07:04:36', '2025-09-11 02:48:06', 0, 0),
(7, 6, 'test 2', '', 'test', '1757487893433.jpg', 'Pending', 0, '2025-09-10 07:04:53', '2025-09-15 06:55:48', 0, 0),
(8, 4, 'test', '', 'Hello World', '1757489463189.jpg', 'Pending', 0, '2025-09-10 07:31:03', '2025-09-11 04:47:32', 0, 0),
(9, 4, 'Hello World', '', 'Hello World', '1757489598938.jpg', 'Pending', 0, '2025-09-10 07:33:18', '2025-09-11 02:40:31', 0, 0),
(10, 4, 'ggggggg', '', 'gggg', NULL, 'Pending', 0, '2025-09-10 07:51:57', '2025-09-15 06:55:48', 0, 0),
(11, 4, 'gggg', 'Maintenance', 'ggg', NULL, 'Pending', 0, '2025-09-10 07:52:10', '2025-09-15 07:32:32', 1, 0),
(12, 4, 'gggg', '', 'ggggggg', NULL, 'Pending', 0, '2025-09-10 07:52:30', '2025-09-15 06:55:48', 0, 0),
(13, 4, 'adsas', '', 'sdadasdasd', NULL, 'Pending', 0, '2025-09-10 07:53:11', '2025-09-15 06:55:48', 0, 0),
(14, 6, 'test', 'Maintenance', 'test', '1757491981194.jpg', 'Pending', 0, '2025-09-10 08:13:01', '2025-09-16 01:54:26', 1, 0),
(15, 5, 'La Union', 'Maintenance', 'Test Report Form', NULL, 'Resolved', 0, '2025-09-11 00:47:02', '2025-09-17 01:29:20', 1, 0),
(16, 5, 'test', 'Maintenance', 'test', NULL, 'Pending', 0, '2025-09-11 00:49:27', '2025-09-17 03:31:54', 1, 0),
(17, 5, 'test', 'Maintenance', 'test', NULL, 'In Progress', 0, '2025-09-11 00:49:47', '2025-09-12 02:28:55', 0, 0),
(18, 6, 'Test Empty Category', 'Maintenance', 'Test Empty Category', '1757554457172.jpg', 'In Progress', 1, '2025-09-11 01:34:17', '2025-09-17 01:29:27', 1, 0),
(19, 6, 'Test', 'Maintenance', '{expandedReport && (\r\n  <Modal show onHide={() => setExpandedReport(null)} size=\"lg\" centered>\r\n    <Modal.Header closeButton>\r\n      <Modal.Title className=\"fw-bold\">Report Details</Modal.Title>\r\n    </Modal.Header>\r\n    <Modal.Body>\r\n      <Row>\r\n        {/* Image Section */}\r\n        <Col md={5} className=\"mb-3\">\r\n          {expandedReport.image_path ? (\r\n            <Image\r\n              src={`${import.meta.env.VITE_IMAGES}/${expandedReport.image_path}`}\r\n              alt=\"Report\"\r\n              fluid\r\n              rounded\r\n              className=\"border\"\r\n              style={{ maxHeight: \"300px\", objectFit: \"cover\", width: \"100%\" }}\r\n            />\r\n          ) : (\r\n            <div className=\"d-flex align-items-center justify-content-center border rounded bg-light\" style={{ height: \"300px\" }}>\r\n              <span className=\"text-muted\">No Image Available</span>\r\n            </div>\r\n          )}\r\n        </Col>\r\n\r\n        {/* Details Section */}\r\n        <Col md={7}>\r\n          <h5 className=\"fw-bold mb-2\">{expandedReport.location}</h5>\r\n          <span\r\n            className={`badge px-3 py-2 fs-6 mb-3 ${\r\n              expandedReport.status === \"Pending\"\r\n                ? \"bg-warning text-dark\"\r\n                : expandedReport.status === \"In Progress\"\r\n                ? \"bg-primary\"\r\n                : \"bg-success\"\r\n            }`}\r\n          >\r\n            {expandedReport.status}\r\n          </span>\r\n\r\n          <p className=\"text-muted mb-1\">\r\n            <strong>Reported on:</strong> {FormatDate(expandedReport.created_at)}\r\n          </p>\r\n\r\n          <hr />\r\n\r\n          <p>\r\n            <strong>Description:</strong>\r\n            <br />\r\n            {expandedReport.description}\r\n          </p>\r\n        </Col>\r\n      </Row>\r\n    </Modal.Body>\r\n    <Modal.Footer>\r\n      <button\r\n        className=\"btn btn-secondary\"\r\n        onClick={() => setExpandedReport(null)}\r\n      >\r\n        Close\r\n      </button>\r\n    </Modal.Footer>\r\n  </Modal>\r\n)}\r\n', '1757559178366.jpg', 'Resolved', 0, '2025-09-11 02:52:58', '2025-09-17 01:29:23', 1, 0),
(20, 6, 'Location', 'Maintenance', 'Location', '1757644886830.jpg', 'Pending', 1, '2025-09-12 02:41:26', '2025-09-15 07:08:09', 1, 0),
(21, 6, 'Test ', 'Maintenance', 'Test Description', NULL, 'Pending', 1, '2025-09-12 07:34:28', '2025-09-15 08:15:38', 1, 0),
(22, 4, 'Test', 'Maintenance', 'Sample', NULL, 'In Progress', 0, '2025-09-12 08:01:32', '2025-09-18 05:39:43', 1, 0),
(23, 4, 'Test', 'Maintenance', 'Sampole', NULL, 'In Progress', 0, '2025-09-12 08:02:27', '2025-09-16 05:31:46', 1, 0),
(24, 4, 'test', 'Maintenance', 'Sample', NULL, 'In Progress', 0, '2025-09-12 08:03:15', '2025-09-18 05:39:45', 1, 0),
(25, 4, 'Sample', 'Maintenance', 'Sample', NULL, 'In Progress', 0, '2025-09-12 08:06:11', '2025-09-16 06:36:40', 1, 0),
(26, 4, 'Test Sample', 'Maintenance', 'Test Sample', NULL, 'Pending', 0, '2025-09-12 08:07:02', '2025-09-15 07:07:57', 1, 0),
(27, 6, 'Test Multiple Forms', 'Maintenance', 'Testing Multiple Forms', '1757900825003.jpg', 'In Progress', 0, '2025-09-15 01:47:05', '2025-09-16 01:03:57', 1, 0),
(28, 6, 'Test', '', 'Test', NULL, 'Pending', 1, '2025-09-16 01:14:06', '2025-09-16 01:14:06', 0, 0),
(29, 6, 'Test 09-16-2025', '', 'Test 09-16-2025', NULL, 'Pending', 0, '2025-09-16 03:32:18', '2025-09-16 03:32:18', 0, 0),
(30, 6, 'Test 09-16-2025', '', 'Test 09-16-2025', '1757993699754.jpg', 'Pending', 0, '2025-09-16 03:34:59', '2025-09-16 03:34:59', 0, 0),
(31, 6, 'Test 09-16-2025', '', 'Test 09-16-2025', '1757993807494.jpg', 'Pending', 1, '2025-09-16 03:36:47', '2025-09-16 03:36:47', 0, 0),
(32, 6, 'report_type', 'Maintenance', 'report_type', '1757993938915.jpg', 'In Progress', 0, '2025-09-16 03:38:58', '2025-09-16 03:57:11', 1, 0),
(33, 4, 'aasdsa', 'Maintenance', 'aasddasassad', '1758001183243.jpg', 'Pending', 0, '2025-09-16 05:39:43', '2025-09-16 05:39:53', 1, 0),
(34, 4, 'testasd', 'Maintenance', 'asdasdsadsadasasadasd', NULL, 'Pending', 0, '2025-09-16 07:23:13', '2025-09-16 07:37:56', 1, 0),
(35, 4, 'asdsad', 'Maintenance', 'asdsadsadasd', NULL, 'In Progress', 0, '2025-09-16 07:32:24', '2025-09-16 07:32:24', 0, 0),
(36, 4, 'sadsa', 'Maintenance', 'asdsadsa', NULL, 'In Progress', 0, '2025-09-16 07:33:36', '2025-09-16 07:33:36', 0, 0),
(37, 4, 'aa', 'Maintenance', 'aaaaa', NULL, 'In Progress', 0, '2025-09-16 07:36:17', '2025-09-17 01:17:33', 1, 0),
(38, 4, 'asdas', 'Maintenance', 'asdasasdads', NULL, 'In Progress', 0, '2025-09-16 07:37:18', '2025-09-17 01:16:28', 1, 0),
(39, 4, 'asdas', 'Maintenance', 'asdsadasd', NULL, 'In Progress', 0, '2025-09-16 07:48:34', '2025-09-17 01:16:27', 1, 0),
(40, 5, 'sadasdas', 'Maintenance', 'asdasadasda', NULL, 'In Progress', 0, '2025-09-17 01:21:41', '2025-09-17 01:21:41', 0, 0),
(41, 5, 'Test', 'Maintenance', 'asdasdasdasdas', NULL, 'In Progress', 0, '2025-09-17 01:23:57', '2025-09-17 01:23:57', 0, 0),
(42, 5, 'tester', 'Maintenance', 'asdsadasdasdasd tester', NULL, 'In Progress', 0, '2025-09-17 01:25:08', '2025-09-17 01:25:08', 0, 0),
(43, 5, 'asdsada', 'Maintenance', 'test tester', NULL, 'Pending', 0, '2025-09-17 01:27:19', '2025-09-17 01:27:33', 1, 0),
(44, 5, 'test test teseter', 'Maintenance', 'test test teseter', NULL, 'Pending', 0, '2025-09-17 01:32:34', '2025-09-17 01:32:37', 1, 0),
(45, 5, 'test multiple staff', 'Maintenance', 'test multiple staff', NULL, 'Resolved', 0, '2025-09-17 01:37:17', '2025-09-18 05:37:31', 1, 0),
(46, 5, 'test multiple staff', 'Maintenance', 'test multiple staff', NULL, 'Pending', 0, '2025-09-17 01:39:47', '2025-09-17 01:40:41', 1, 0),
(47, 5, 'test 1', 'Maintenance', 'test 1', NULL, 'Pending', 0, '2025-09-17 01:40:35', '2025-09-17 01:40:38', 1, 0),
(48, 5, 'test check box', 'Maintenance', 'test', '1758073974926.jpg', 'Pending', 0, '2025-09-17 01:52:54', '2025-09-17 03:33:00', 1, 0),
(49, 6, 'Demo location', 'Maintenance', 'Demo Description', NULL, 'In Progress', 0, '2025-09-17 02:22:23', '2025-09-17 03:31:39', 1, 0),
(50, 6, 'wwwwwwwwwwwwwwww', 'Maintenance', 'wwwwwwwwww', NULL, 'Pending', 0, '2025-09-17 07:14:58', '2025-09-18 02:47:26', 1, 0),
(51, 6, 'adsas', 'Maintenance', 'asdsadasdasdas', NULL, 'Pending', 0, '2025-09-17 07:16:22', '2025-09-18 03:43:37', 1, 0),
(52, 6, 'asdsadsa', 'Maintenance', 'asdasdsa', NULL, 'Pending', 0, '2025-09-17 07:16:29', '2025-09-17 08:08:27', 1, 0),
(53, 6, 'asa', 'Maintenance', 'asdasdsas', NULL, 'Pending', 1, '2025-09-17 07:18:09', '2025-09-17 08:06:55', 1, 0),
(54, 5, 'Test', 'Maintenance', 'Test', NULL, 'In Progress', 0, '2025-09-18 03:26:11', '2025-09-18 03:42:16', 1, 0),
(55, 6, 'Library', 'Maintenance', 'Test Report', NULL, 'Pending', 0, '2025-09-18 05:00:33', '2025-09-18 05:00:39', 1, 0),
(56, 6, '          ', 'Maintenance', '           ', NULL, 'Pending', 0, '2025-09-18 06:58:59', '2025-09-18 06:58:59', 0, 0),
(57, 6, '', 'Maintenance', '', NULL, 'In Progress', 0, '2025-09-18 07:01:38', '2025-09-19 03:53:52', 1, 1),
(58, 6, '', 'Maintenance', '', NULL, 'Pending', 0, '2025-09-18 07:02:53', '2025-09-19 02:53:35', 1, 0),
(59, 6, ' ', 'Maintenance', '    ', NULL, 'Pending', 0, '2025-09-18 07:19:38', '2025-09-19 06:03:05', 1, 0),
(60, 6, ' ', 'Maintenance', '     ', NULL, 'Pending', 0, '2025-09-18 07:19:55', '2025-09-18 07:33:19', 1, 0),
(61, 6, 'aa a sdsa', 'Maintenance', 'asdasd     sdd          dasdasdsadadsadsada          dsadsadasdasdsadasdsaasdasdasdasdasdsaasds', NULL, 'Pending', 0, '2025-09-18 07:33:08', '2025-09-18 07:33:32', 1, 0),
(62, 6, 'lcoalhost', 'Maintenance', 'Test.        test         TEST', NULL, 'Pending', 1, '2025-09-19 00:51:02', '2025-09-19 01:18:40', 1, 0),
(63, 6, 'IT Services and Development Office', 'Maintenance', 'IT Services And Development Office', NULL, 'Pending', 1, '2025-09-19 03:44:46', '2025-09-19 03:45:20', 1, 0),
(64, 6, 'Test', 'Maintenance', '|               |\r\n|               |\r\n|               |\r\n----------\r\n', NULL, 'Pending', 1, '2025-09-19 03:49:26', '2025-09-19 03:49:43', 1, 0),
(65, 6, 'Test', 'Maintenance', '_________________\r\n|                              |\r\n|                              |\r\n|                              |\r\n|                              |\r\n|                              |\r\n--------------------', NULL, 'Pending', 0, '2025-09-19 03:50:53', '2025-09-19 04:47:33', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Super Admin','Admin','Report Manager','Maintenance Manager','Lost & Found Manager','Incident Manager','User') NOT NULL DEFAULT 'User',
  `image_url` text DEFAULT NULL,
  `token` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `password`, `role`, `image_url`, `token`, `status`, `created_at`) VALUES
(4, 'Angelo Cabase', 'gelocabase1324@gmail.com', '$2b$10$S0ASQo2Zr61T4bMiY1KNauEszEtJVH7hOOrMX2QSgNIeGJ2NcWNKy', 'Admin', 'profile/1757466065021.jpg', '117007367720928788994', 1, '2025-09-10 01:01:05'),
(5, 'angelo cabase', 'goldengrape777@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'Admin', 'profile/1757466665920.jpg', '111521943834505403428', 1, '2025-09-10 01:11:05'),
(6, 'Unknown User', 'cabase.1324@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'User', 'profile/1757487445945.jpg', '118115940971893247297', 1, '2025-09-10 06:57:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `borrowed_items`
--
ALTER TABLE `borrowed_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user` (`user_id`);

--
-- Indexes for table `event_preparations`
--
ALTER TABLE `event_preparations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_id` (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_maintenance_staff`
--
ALTER TABLE `tbl_maintenance_staff`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `borrowed_items`
--
ALTER TABLE `borrowed_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `event_preparations`
--
ALTER TABLE `event_preparations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `tbl_maintenance_staff`
--
ALTER TABLE `tbl_maintenance_staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `chatbot_conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `event_preparations`
--
ALTER TABLE `event_preparations`
  ADD CONSTRAINT `event_preparations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  ADD CONSTRAINT `notification_receivers_ibfk_1` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notification_receivers_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `tbl_users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
