-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 17, 2025 at 10:19 AM
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
(86, 'Report Archived', 'Your report about Test has been archived. Reason: Unknown content', '2025-09-19 12:47:33'),
(87, 'New Report', 'A new report has been submitted about Test Notifications 2', '2025-09-24 09:15:50'),
(88, 'New Report', 'A new report has been submitted about Test', '2025-09-24 09:21:36'),
(89, 'New Report', 'A new report has been submitted about Test', '2025-09-24 09:24:19'),
(90, 'New Report', 'A new report has been submitted about Test ', '2025-09-24 09:28:22'),
(91, 'New Report', 'A new report has been submitted about Test Approver.', '2025-09-24 09:46:20'),
(92, 'New Report', 'A new report has been submitted about Test Approver.', '2025-09-24 09:46:49'),
(93, 'Report Archived', 'Your report about Test Approver has been archived. Reason: Test', '2025-09-24 09:53:52'),
(94, 'Returned Report', 'Report about Test has been returned.', '2025-09-24 10:30:09'),
(95, 'Returned Report', 'Report about Test notification has been returned.', '2025-09-24 10:30:36'),
(96, 'Returned Report', 'A report aboutTest Location has been returned.', '2025-09-24 10:32:59'),
(97, 'Returned Report', 'A report about test has been returned.', '2025-09-24 10:36:10'),
(98, 'Returned Report', 'A report about Test Location has been returned.', '2025-09-24 10:38:38'),
(99, 'Returned Report', 'A report about IT Services and Development Office has been returned.', '2025-09-24 10:38:46'),
(100, 'Returned Report', 'A report about lcoalhost has been returned.', '2025-09-24 10:41:10'),
(101, 'Returned Report', 'A report about aa a sdsa has been returned.', '2025-09-24 10:43:57'),
(102, 'New Report', 'A new report has been submitted about Test .', '2025-09-24 11:29:50'),
(103, 'New Report', 'A new report has been submitted about Test.', '2025-09-24 11:30:03'),
(104, 'New Report', 'A new report has been submitted about Test.', '2025-09-24 11:30:12'),
(105, 'Report Update', 'Your report about Test  is now being worked on (In Progress).', '2025-09-24 13:16:13'),
(106, 'Report Update', 'Your report about Test  has been set back to Pending.', '2025-09-24 13:16:33'),
(107, 'New Report', 'A new report has been submitted about Test Notifications 2.', '2025-09-24 13:20:18'),
(108, 'Report Update', 'Your report about Test  is now being worked on (In Progress).', '2025-09-25 08:42:20'),
(109, 'Report Update', 'Your report about Test is now being worked on (In Progress).', '2025-09-25 08:42:42'),
(110, 'Report Update', 'Your report about   is now being worked on (In Progress).', '2025-09-25 09:00:28'),
(111, 'Report Update', 'Your report about Test is now being worked on (In Progress).', '2025-09-25 09:05:51'),
(112, 'Report Update', 'Your report about Test Notifications 2 is now being worked on (In Progress).', '2025-09-25 10:32:35'),
(113, 'Report Update', 'Your report about   is now being worked on (In Progress).', '2025-09-25 10:32:48'),
(114, 'Report Update', 'Your report about            has been marked as Resolved.', '2025-09-25 10:33:13'),
(115, 'Report Update', 'Your report about asa is now being worked on (In Progress).', '2025-09-25 10:34:04'),
(116, 'Report Update', 'Your report about  has been marked as Resolved.', '2025-09-25 10:34:49'),
(117, 'Report Update', 'Your report about Library has been marked as Resolved.', '2025-09-25 10:35:44'),
(118, 'Report Update', 'Your report about asdsadsa is now being worked on (In Progress).', '2025-09-25 10:37:37'),
(119, 'Report Update', 'Your report about adsas is now being worked on (In Progress).', '2025-09-25 10:38:21'),
(120, 'Report Update', 'Your report about test 1 is now being worked on (In Progress).', '2025-09-25 11:26:28'),
(121, 'Report Update', 'Your report about wwwwwwwwwwwwwwww is now being worked on (In Progress).', '2025-09-25 11:26:43'),
(122, 'Report Update', 'Your report about Test  is now being worked on (In Progress).', '2025-09-25 11:26:58'),
(123, 'Report Update', 'Your report about test check box is now being worked on (In Progress).', '2025-09-25 11:27:08'),
(124, 'Report Update', 'Your report about test multiple staff is now being worked on (In Progress).', '2025-09-25 11:27:25'),
(125, 'Report Update', 'Your report about testasd is now being worked on (In Progress).', '2025-09-25 11:27:35'),
(126, 'Report Update', 'Your report about Test  has been marked as Resolved.', '2025-09-25 13:20:10'),
(127, 'Report Update', 'Your report about Test  has been reopened and is back to In Progress.', '2025-09-25 13:21:16'),
(128, 'New Report', 'A new report has been submitted about Test notification.', '2025-09-25 13:37:08'),
(129, 'New Report', 'A new report has been submitted about Test Location.', '2025-09-25 13:37:41'),
(130, 'New Report', 'A new report has been submitted about test.', '2025-09-25 13:38:01'),
(131, 'New Report', 'A new report has been submitted about Test Location.', '2025-09-25 13:38:20'),
(132, 'New Report', 'A new report has been submitted about Test.', '2025-09-25 13:38:44'),
(133, 'New Report', 'A new report has been submitted about IT Services and Development Office.', '2025-09-25 13:39:07'),
(134, 'New Report', 'A new report has been submitted about lcoalhost.', '2025-09-25 14:02:20'),
(135, 'New Report', 'A new report has been submitted about Test Status Progress.', '2025-09-25 15:17:46'),
(136, 'Report Update', 'Your report about Test Status Progress is now being worked on (In Progress).', '2025-09-25 15:19:01'),
(137, 'Report Update', 'Your report about Test Status Progress has been set back to Pending.', '2025-09-25 15:19:27'),
(138, 'Report Update', 'Your report about Test Status Progress is now being worked on (In Progress).', '2025-09-26 08:19:15'),
(139, 'Report Update', 'Your report about Test Status Progress has been set back to Pending.', '2025-09-26 08:20:42'),
(140, 'Report Update', 'Your report about Test Status Progress has been marked as Resolved.', '2025-09-26 08:21:23'),
(141, 'Report Update', 'Your report about Test  has been marked as Resolved.', '2025-09-26 08:23:00'),
(142, 'Report Update', 'Your report about Test  has been reopened and is back to In Progress.', '2025-09-26 08:53:28'),
(143, 'Report Update', 'Your report about Test Status Progress has been reopened and is back to In Progress.', '2025-09-26 09:04:31'),
(144, 'Report Update', 'Your report about Test Status Progress has been marked as Resolved.', '2025-09-26 09:34:37'),
(145, 'Report Update', 'Your report about lcoalhost is now being worked on (In Progress).', '2025-09-26 09:37:38'),
(146, 'Report Update', 'Your report about test test teseter is now being worked on (In Progress).', '2025-09-26 09:41:24'),
(147, 'New Report', 'A new report has been submitted about Test.', '2025-09-26 14:01:30'),
(148, 'New Report', 'A new report has been submitted about Test Quill.', '2025-09-29 10:59:43'),
(149, 'New Report', 'A new report has been submitted about This is test.', '2025-09-29 11:05:03'),
(150, 'New Report', 'A new report has been submitted about test.', '2025-09-29 11:10:30'),
(151, 'New Report', 'A new report has been submitted about test.', '2025-09-29 11:16:02'),
(152, 'New Report', 'A new report has been submitted about Test.', '2025-09-29 11:20:23'),
(153, 'New Report', 'A new report has been submitted about test.', '2025-09-29 11:46:29'),
(154, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-09-29 14:06:44'),
(155, 'New Report', 'A new report has been submitted about test.', '2025-09-29 15:34:40'),
(156, 'New Report', 'A new report has been submitted about test.', '2025-09-29 15:39:16'),
(157, 'New Report', 'A new report has been submitted about test.', '2025-09-29 15:39:52'),
(158, 'New Report', 'A new report has been submitted about test.', '2025-09-29 15:59:36'),
(159, 'New Report', 'A new report has been submitted about test.', '2025-09-30 08:57:45'),
(160, 'New Report', 'A new report has been submitted about test.', '2025-09-30 08:58:18'),
(161, 'Report Update', 'Your report about Test 8 is now being worked on (In Progress).', '2025-09-30 09:57:34'),
(162, 'Report Update', 'Your report about Test 11 is now being worked on (In Progress).', '2025-09-30 10:20:59'),
(163, 'Report Update', 'Your report about Test 11 has been marked as Resolved.', '2025-09-30 10:21:20'),
(164, 'Report Update', 'Your report about IT Services and Development Office is now being worked on (In Progress).', '2025-09-30 10:40:02'),
(165, 'Report Update', 'Your report about Test 7 is now being worked on (In Progress).', '2025-09-30 13:11:50'),
(166, 'Report Update', 'Your report about Test 7 has been set back to Pending.', '2025-09-30 13:13:30'),
(167, 'Report Update', 'Your report about Test 10 has been marked as Resolved.', '2025-09-30 14:01:15'),
(168, 'Report Update', 'Your report about Test 10 has been set back to Pending.', '2025-09-30 14:03:12'),
(169, 'Report Update', 'Your report about Test 10 is now being worked on (In Progress).', '2025-09-30 14:17:01'),
(170, 'Report Update', 'Your report about Test 10 has been set back to Pending.', '2025-09-30 14:18:01'),
(171, 'Report Update', 'Your report about Test 10 is now being worked on (In Progress).', '2025-09-30 14:49:21'),
(172, 'Report Update', 'Your report about Test 9 is now being worked on (In Progress).', '2025-09-30 14:54:33'),
(173, 'Report Update', 'Your report about Test 9 has been set back to Pending.', '2025-09-30 14:54:46'),
(174, 'Report Update', 'Your report about Test 9 is now being worked on (In Progress).', '2025-09-30 15:11:15'),
(175, 'New Report', 'A new report has been submitted about Test.', '2025-09-30 15:41:04'),
(176, 'Report Archived', 'Your report about Test has been archived. Reason: Test', '2025-09-30 15:53:14'),
(177, 'Returned Report', 'A report about Test 7 has been returned.', '2025-09-30 16:07:29'),
(178, 'Returned Report', 'A report about Test 6 has been returned.', '2025-09-30 16:07:39'),
(179, 'Returned Report', 'A report about Test 5 has been returned.', '2025-09-30 16:07:46'),
(180, 'Returned Report', 'A report about Test 4 has been returned.', '2025-09-30 16:07:49'),
(181, 'Returned Report', 'A report about Test 3 has been returned.', '2025-09-30 16:07:53'),
(182, 'Report Update', 'Your report about Test 2 is now being worked on (In Progress).', '2025-10-01 09:34:55'),
(183, 'Report Update', 'Your report about Test is now being worked on (In Progress).', '2025-10-01 09:39:30'),
(184, 'New Report', 'A new report has been submitted about console.log(report);.', '2025-10-01 09:44:47'),
(185, 'New Report', 'A new report has been submitted about console.log(report);.', '2025-10-01 09:44:57'),
(186, 'New Report', 'A new report has been submitted about console.log(report);.', '2025-10-01 09:45:01'),
(187, 'New Report', 'A new report has been submitted about console.log(report);.', '2025-10-01 09:45:05'),
(188, 'New Report', 'A new report has been submitted about console.log(report);.', '2025-10-01 09:45:10'),
(189, 'Report Archived', 'Your report about console.log(report); has been archived. Reason: Duplicate entry', '2025-10-01 09:51:43'),
(190, 'Report Update', 'Your report about console.log(report); is now being worked on (In Progress).', '2025-10-01 09:55:52'),
(191, 'Report Update', 'Your report about console.log(report); is now being worked on (In Progress).', '2025-10-01 10:52:01'),
(192, 'Returned Report', 'A report about test has been returned.', '2025-10-02 09:33:30'),
(193, 'Returned Report', 'A report about Test has been returned.', '2025-10-02 09:33:33'),
(194, 'Returned Report', 'A report about test has been returned.', '2025-10-02 09:33:38'),
(195, 'Returned Report', 'A report about test has been returned.', '2025-10-02 09:33:41'),
(196, 'Returned Report', 'A report about Test notification has been returned.', '2025-10-02 09:33:44'),
(197, 'Returned Report', 'A report about test has been returned.', '2025-10-02 09:33:48'),
(198, 'Returned Report', 'A report about gggg has been returned.', '2025-10-02 09:33:51'),
(199, 'New Report', 'A new report has been submitted about New Report.', '2025-10-02 11:02:31'),
(200, 'New Report', 'A new report has been submitted about Test.', '2025-10-02 11:15:13'),
(201, 'New Report', 'A new report has been submitted about Test new report.', '2025-10-02 11:49:32'),
(202, 'New Report', 'A new report has been submitted about test.', '2025-10-02 11:54:58'),
(203, 'Report Update', 'Your report about Test is now being worked on (In Progress).', '2025-10-02 14:31:58'),
(204, 'Report Update', 'Your report about Test has been set back to Pending.', '2025-10-02 14:32:06'),
(205, 'New Report', 'A new report has been submitted about Test.', '2025-10-02 15:21:09'),
(206, 'New Report', 'A new report has been submitted', '2025-10-06 08:57:35'),
(207, 'New Report', 'A new report has been submitted', '2025-10-06 08:59:47'),
(208, 'New Report', 'A new report has been submitted', '2025-10-06 09:03:17'),
(209, 'New Report', 'A new report has been submitted', '2025-10-06 10:41:05'),
(210, 'New Report', 'A new report has been submitted', '2025-10-06 10:54:10'),
(211, 'Report Update', 'Your report about test is now being worked on (In Progress).', '2025-10-09 16:43:38'),
(212, 'New Report', 'A new report has been submitted about New Location.', '2025-10-14 09:54:59'),
(213, 'New Report', 'A new report has been submitted about New Ticketing.', '2025-10-14 10:06:50'),
(214, 'New Report', 'A new report has been submitted about Test.', '2025-10-14 10:21:40'),
(215, 'New Report', 'A new report has been submitted', '2025-10-14 10:26:40'),
(216, 'New Report', 'A new report has been submitted', '2025-10-14 10:42:49'),
(217, 'New Report', 'A new report has been submitted about Test mobile.', '2025-10-16 08:50:46'),
(218, 'New Report', 'A new report has been submitted', '2025-10-16 08:51:15'),
(219, 'Report Update', 'Your report about Test mobile is now being worked on (In Progress).', '2025-10-16 08:52:39'),
(220, 'Report Update', 'Your report about Test mobile has been marked as Resolved.', '2025-10-16 08:52:55'),
(221, 'Report Update', 'Your report about New Ticketing is now being worked on (In Progress).', '2025-10-16 08:55:25'),
(222, 'New Report', 'A new report has been submitted about Test.', '2025-10-16 11:55:05'),
(223, 'New Report', 'A new report has been submitted about Test.', '2025-10-16 13:14:42'),
(224, 'New Report', 'A new report has been submitted about Test .', '2025-10-16 13:18:49'),
(225, 'New Report', 'A new report has been submitted about Test .', '2025-10-16 13:19:29'),
(226, 'New Report', 'A new report has been submitted', '2025-10-16 14:47:04'),
(227, 'New Report', 'A new report has been submitted', '2025-10-16 14:48:02'),
(228, 'New Report', 'A new report has been submitted about Test Text.', '2025-10-16 14:50:10'),
(229, 'New Report', 'A new report has been submitted', '2025-10-16 15:05:10'),
(230, 'New Report', 'A new report has been submitted', '2025-10-16 15:08:14'),
(231, 'New Report', 'A new report has been submitted', '2025-10-16 15:11:03'),
(232, 'New Report', 'A new report has been submitted about Test Data.', '2025-10-16 16:18:22'),
(233, 'New Report', 'A new report has been submitted about Test.', '2025-10-17 09:10:27'),
(234, 'New Report', 'A new report has been submitted about Test Remove.', '2025-10-17 09:29:21'),
(235, 'New Report', 'A new report has been submitted about Test 17.', '2025-10-17 09:38:06'),
(236, 'New Report', 'A new report has been submitted about localhost.', '2025-10-17 09:40:53'),
(237, 'New Report', 'A new report has been submitted about Test ResetForm.', '2025-10-17 09:45:50'),
(238, 'New Report', 'A new report has been submitted about Test Reset Form 2.', '2025-10-17 09:46:50'),
(239, 'New Report', 'A new report has been submitted about Test.', '2025-10-17 10:08:54'),
(240, 'New Report', 'A new report has been submitted about Test 17.', '2025-10-17 10:09:14'),
(241, 'Report Update', 'Your report about Test Text is now being worked on (In Progress).', '2025-10-17 10:55:40'),
(242, 'Report Update', 'Your report about Test Status Progress has been reopened and is back to In Progress.', '2025-10-17 11:01:17'),
(243, 'Report Update', 'Your report about Test Text has been marked as Resolved.', '2025-10-17 11:02:14'),
(244, 'New Report', 'A new report has been submitted', '2025-10-17 11:58:01'),
(245, 'New Report', 'A new report has been submitted', '2025-10-17 13:36:34'),
(246, 'Report Update', 'Your report about Test is now being worked on (In Progress).', '2025-10-17 13:37:25'),
(247, 'New Report', 'A new report has been submitted', '2025-10-17 13:38:46'),
(248, 'Report Update', 'Your report about Test Reset Form 2 is now being worked on (In Progress).', '2025-10-17 14:22:31');

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
(37, 83, 5, 1, NULL),
(38, 84, 6, 0, NULL),
(39, 85, 6, 0, NULL),
(40, 86, 6, 0, NULL),
(41, 93, 6, 0, NULL),
(42, 97, 4, 0, NULL),
(43, 97, 5, 0, NULL),
(44, 98, 4, 0, NULL),
(45, 98, 5, 0, NULL),
(46, 99, 4, 0, NULL),
(47, 99, 5, 0, NULL),
(48, 100, 4, 0, NULL),
(49, 100, 5, 0, NULL),
(50, 101, 4, 0, NULL),
(51, 101, 5, 0, NULL),
(52, 105, 6, 0, NULL),
(53, 106, 6, 0, NULL),
(54, 108, 6, 0, NULL),
(55, 109, 6, 0, NULL),
(56, 110, 6, 0, NULL),
(57, 111, 6, 0, NULL),
(58, 112, 6, 0, NULL),
(59, 113, 6, 0, NULL),
(60, 114, 6, 0, NULL),
(61, 115, 6, 0, NULL),
(62, 116, 6, 0, NULL),
(63, 117, 6, 0, NULL),
(64, 118, 6, 0, NULL),
(65, 119, 6, 1, NULL),
(66, 120, 5, 0, NULL),
(67, 121, 6, 0, NULL),
(68, 122, 6, 0, NULL),
(69, 123, 5, 0, NULL),
(70, 124, 5, 0, NULL),
(71, 125, 4, 0, NULL),
(72, 126, 6, 0, NULL),
(73, 127, 6, 0, NULL),
(74, 136, 6, 0, NULL),
(75, 137, 6, 0, NULL),
(76, 138, 6, 0, NULL),
(77, 139, 6, 0, NULL),
(78, 140, 6, 0, NULL),
(79, 141, 6, 1, NULL),
(80, 142, 6, 1, NULL),
(81, 143, 6, 1, NULL),
(82, 144, 6, 0, NULL),
(83, 145, 6, 0, NULL),
(84, 146, 5, 0, NULL),
(85, 147, 4, 0, NULL),
(86, 148, 4, 0, NULL),
(87, 149, 4, 0, NULL),
(88, 150, 4, 0, NULL),
(89, 151, 4, 0, NULL),
(90, 152, 4, 0, NULL),
(91, 153, 4, 0, NULL),
(92, 154, 6, 0, NULL),
(93, 155, 4, 0, NULL),
(94, 156, 4, 0, NULL),
(95, 157, 4, 0, NULL),
(96, 158, 4, 0, NULL),
(97, 159, 4, 0, NULL),
(98, 160, 4, 0, NULL),
(99, 161, 4, 0, NULL),
(100, 162, 4, 0, NULL),
(101, 163, 4, 0, NULL),
(102, 164, 6, 0, NULL),
(103, 165, 4, 0, NULL),
(104, 166, 4, 0, NULL),
(105, 167, 4, 0, NULL),
(106, 168, 4, 0, NULL),
(107, 169, 4, 0, NULL),
(108, 170, 4, 0, NULL),
(109, 171, 4, 0, NULL),
(110, 172, 4, 0, NULL),
(111, 173, 4, 0, NULL),
(112, 174, 4, 0, NULL),
(113, 175, 4, 0, NULL),
(114, 176, 6, 0, NULL),
(115, 177, 4, 0, NULL),
(116, 177, 5, 0, NULL),
(117, 178, 4, 0, NULL),
(118, 178, 5, 0, NULL),
(119, 179, 4, 0, NULL),
(120, 179, 5, 0, NULL),
(121, 180, 4, 0, NULL),
(122, 180, 5, 0, NULL),
(123, 181, 4, 0, NULL),
(124, 181, 5, 0, NULL),
(125, 182, 4, 0, NULL),
(126, 183, 5, 0, NULL),
(127, 184, 4, 0, NULL),
(128, 185, 4, 0, NULL),
(129, 186, 4, 0, NULL),
(130, 187, 4, 0, NULL),
(131, 188, 4, 0, NULL),
(132, 189, 6, 1, NULL),
(133, 190, 6, 0, NULL),
(134, 191, 6, 0, NULL),
(135, 192, 4, 0, NULL),
(136, 192, 5, 0, NULL),
(137, 193, 4, 0, NULL),
(138, 193, 5, 0, NULL),
(139, 194, 4, 0, NULL),
(140, 194, 5, 0, NULL),
(141, 195, 4, 0, NULL),
(142, 195, 5, 0, NULL),
(143, 196, 4, 0, NULL),
(144, 196, 5, 0, NULL),
(145, 197, 4, 0, NULL),
(146, 197, 5, 0, NULL),
(147, 198, 4, 0, NULL),
(148, 198, 5, 0, NULL),
(149, 199, 4, 0, NULL),
(150, 200, 4, 0, NULL),
(151, 201, 4, 0, NULL),
(152, 202, 4, 0, NULL),
(153, 203, 6, 0, NULL),
(154, 204, 6, 0, NULL),
(155, 205, 4, 0, NULL),
(156, 206, 4, 0, NULL),
(157, 207, 4, 0, NULL),
(158, 208, 4, 0, NULL),
(159, 209, 4, 1, NULL),
(160, 210, 4, 0, NULL),
(161, 211, 6, 0, NULL),
(162, 212, 4, 0, NULL),
(163, 213, 4, 0, NULL),
(164, 214, 4, 0, NULL),
(165, 215, 4, 0, NULL),
(166, 216, 4, 0, NULL),
(167, 217, 4, 0, NULL),
(168, 218, 4, 0, NULL),
(169, 219, 6, 0, NULL),
(170, 220, 6, 0, NULL),
(171, 221, 6, 0, NULL),
(172, 222, 4, 0, NULL),
(173, 223, 4, 0, NULL),
(174, 224, 4, 0, NULL),
(175, 225, 4, 0, NULL),
(176, 226, 4, 0, NULL),
(177, 227, 4, 0, NULL),
(178, 228, 4, 0, NULL),
(179, 229, 4, 0, NULL),
(180, 230, 4, 0, NULL),
(181, 231, 4, 0, NULL),
(182, 232, 4, 0, NULL),
(183, 233, 4, 0, NULL),
(184, 234, 4, 0, NULL),
(185, 235, 4, 0, NULL),
(186, 236, 4, 0, NULL),
(187, 237, 4, 0, NULL),
(188, 238, 4, 0, NULL),
(189, 239, 4, 0, NULL),
(190, 240, 4, 0, NULL),
(191, 241, 6, 0, NULL),
(192, 242, 6, 0, NULL),
(193, 243, 6, 0, NULL),
(194, 244, 4, 0, NULL),
(195, 245, 4, 1, NULL),
(196, 246, 6, 0, NULL),
(197, 247, 4, 1, NULL),
(198, 248, 6, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_maintenance_reports`
--

CREATE TABLE `tbl_maintenance_reports` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `category` enum('Electrical','Plumbing','Cleaning','General Repair','Others') DEFAULT 'Others',
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `assigned_staff` varchar(255) DEFAULT NULL,
  `acknowledged_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_maintenance_reports`
--

INSERT INTO `tbl_maintenance_reports` (`id`, `report_id`, `category`, `priority`, `assigned_staff`, `acknowledged_by`) VALUES
(1, 17, 'Cleaning', 'Medium', '', 5),
(10, 19, 'General Repair', 'Urgent', '1,7', 5),
(11, 18, 'General Repair', 'High', '', 5),
(12, 15, 'Others', 'High', '12', 5),
(13, 16, 'Electrical', 'Medium', NULL, 5),
(14, 11, 'Cleaning', 'High', '', 5),
(17, 22, 'Plumbing', 'Medium', '', 5),
(18, 23, 'Cleaning', 'Medium', '', 5),
(19, 24, 'Plumbing', 'High', '', 5),
(20, 25, 'Plumbing', 'Medium', '', 5),
(21, 26, 'General Repair', 'Medium', '2', 5),
(22, 21, 'Plumbing', 'Low', NULL, 5),
(23, 20, 'Cleaning', 'Medium', '', 5),
(24, 27, 'Cleaning', 'Urgent', '', 5),
(25, 14, 'Plumbing', 'Medium', '', 5),
(26, 32, 'General Repair', 'Medium', '', 5),
(27, 33, 'Plumbing', 'Medium', '', 5),
(28, 34, 'Plumbing', 'Medium', NULL, 5),
(29, 35, 'Electrical', 'High', '', 5),
(30, 36, 'Cleaning', 'High', '', 5),
(31, 37, 'Plumbing', 'High', '', 5),
(32, 38, 'Electrical', 'Medium', '', 5),
(33, 39, 'Plumbing', 'Medium', '', 5),
(34, 40, 'Electrical', 'Low', '', 5),
(35, 41, 'Cleaning', 'Low', '', 5),
(36, 42, 'Plumbing', 'Medium', '', 5),
(37, 43, 'Cleaning', 'Medium', '', 5),
(38, 44, 'General Repair', 'Low', '1', 5),
(39, 46, 'Electrical', 'Low', '1,2,3,4', 5),
(40, 47, 'Electrical', 'Low', '2,3,1', 5),
(41, 48, 'Electrical', 'Low', '1,2,3,4,7', 5),
(42, 49, 'Plumbing', 'Low', '3', 5),
(43, 50, 'Plumbing', 'Urgent', '1,2,3', 5),
(44, 51, 'Cleaning', 'Medium', '1,2', 5),
(45, 52, 'Cleaning', 'Medium', '1,,,4,,,5,2,3', 5),
(46, 53, 'Cleaning', 'High', '4,6,7', 5),
(47, 54, 'Plumbing', 'Low', '1,11,2,3,4,5,6,7,8,9,10', 5),
(48, 55, 'Plumbing', 'Low', '1,2', 5),
(49, 56, 'Plumbing', 'Medium', NULL, 5),
(50, 57, 'Electrical', 'Low', '12', 5),
(51, 58, 'Plumbing', 'High', '12', 5),
(52, 59, 'Plumbing', 'Low', '1,2', 5),
(53, 60, 'Electrical', 'Low', NULL, 5),
(58, 65, NULL, NULL, NULL, 5),
(67, 74, 'Electrical', 'Low', NULL, 5),
(68, 73, 'General Repair', 'Urgent', '1,2,3', 5),
(69, 72, 'General Repair', 'Urgent', NULL, 5),
(70, 71, 'General Repair', 'Medium', '1,2', 5),
(71, 70, 'General Repair', 'Medium', '1,2,3', 5),
(73, 68, 'Cleaning', 'Low', NULL, 5),
(74, 67, 'General Repair', 'Medium', NULL, 5),
(75, 66, 'Others', 'Low', NULL, 5),
(76, 64, 'General Repair', 'Low', NULL, 5),
(77, 63, 'General Repair', 'Medium', NULL, 5),
(78, 62, 'Cleaning', 'Low', '1,2', 5),
(79, 61, 'General Repair', 'Low', NULL, 5),
(80, 31, 'General Repair', 'Medium', NULL, 5),
(81, 30, 'General Repair', 'Medium', NULL, 5),
(82, 75, 'General Repair', 'Low', '2,3', 5),
(84, 82, 'Plumbing', 'High', '8,9', 5),
(87, 78, 'Plumbing', 'Medium', NULL, 5),
(88, 89, 'Electrical', 'Low', '8,9,1,2', NULL),
(89, 90, 'Plumbing', 'Low', '1,2,3', NULL),
(90, 91, 'Plumbing', 'Low', '2,3,4', NULL),
(96, 97, 'Cleaning', 'High', '1,2', NULL),
(97, 98, 'Cleaning', 'Low', '1', NULL),
(98, 99, 'General Repair', 'High', '11,12,2', NULL),
(99, 100, 'Plumbing', 'Medium', '1,2', NULL),
(100, 29, 'General Repair', 'Low', NULL, 5),
(101, 88, 'Cleaning', 'High', NULL, 5),
(105, 101, 'General Repair', 'Medium', NULL, 5),
(106, 101, 'Cleaning', 'Medium', NULL, 5),
(107, 101, 'Cleaning', 'Medium', NULL, 5),
(108, 101, 'Cleaning', 'High', NULL, 5),
(110, 86, 'General Repair', 'Urgent', NULL, 5),
(115, 92, 'General Repair', 'Medium', NULL, 5),
(125, 102, 'Plumbing', 'High', '1,2,3', NULL),
(126, 107, 'Cleaning', 'High', '1,2', 5),
(127, 106, 'Cleaning', 'Low', NULL, 5),
(128, 3, 'Electrical', 'Medium', NULL, 5),
(130, 94, 'Plumbing', 'Medium', NULL, 5),
(131, 92, 'General Repair', 'Medium', NULL, 5),
(132, 10, 'Electrical', 'Low', NULL, 5),
(136, 77, 'Plumbing', 'Low', NULL, 5),
(137, 76, 'Electrical', 'Low', NULL, 5),
(139, 87, 'Electrical', 'Low', NULL, 5),
(140, 104, 'Electrical', 'Low', NULL, 5),
(141, 14, 'Cleaning', 'Medium', NULL, 5),
(142, 14, 'Plumbing', 'Urgent', NULL, 5),
(143, 14, 'Cleaning', 'Medium', NULL, 5),
(144, 14, 'General Repair', 'Medium', NULL, 5),
(145, 7, 'General Repair', 'Low', NULL, 5),
(146, 3, 'Plumbing', 'Medium', NULL, 5),
(148, 7, 'General Repair', 'Low', NULL, 5),
(149, 7, 'General Repair', 'Low', NULL, 5),
(150, 7, 'General Repair', 'Low', NULL, 5),
(151, 7, 'General Repair', 'Low', NULL, 5),
(152, 7, 'General Repair', 'Low', NULL, 5),
(153, 7, 'General Repair', 'Low', NULL, 5),
(154, 7, 'General Repair', 'Low', NULL, 5),
(155, 7, 'General Repair', 'Low', NULL, NULL),
(157, 110, 'Electrical', 'Low', NULL, 5),
(159, 111, 'Electrical', 'Urgent', '1,2,15', 5),
(160, 84, 'Cleaning', 'Low', NULL, 5),
(161, 83, 'General Repair', 'Medium', NULL, 5),
(172, 113, 'Plumbing', 'Medium', '1,2,3', 5),
(174, 81, 'Plumbing', 'Medium', NULL, 5),
(175, 80, 'Plumbing', 'Medium', NULL, 5),
(176, 79, 'General Repair', 'Medium', NULL, 5),
(177, 12, 'Electrical', 'High', NULL, 5),
(178, 69, 'Plumbing', 'Low', NULL, 5),
(179, 28, 'Plumbing', 'High', NULL, 5),
(180, 117, 'Plumbing', 'Medium', '14', 5),
(181, 116, 'Plumbing', 'Medium', NULL, 5),
(182, 118, 'Cleaning', 'Medium', '1', 5),
(183, 120, 'Electrical', 'High', NULL, NULL),
(184, 124, 'Plumbing', 'Low', NULL, 5),
(185, 122, 'General Repair', 'Medium', NULL, NULL),
(186, 125, 'Cleaning', 'High', '2,3,5', 5),
(187, 123, 'Plumbing', 'Medium', NULL, NULL),
(188, 121, 'Plumbing', 'Medium', NULL, NULL),
(189, 135, 'Plumbing', 'Medium', '1,2,3', NULL),
(190, 136, 'Electrical', 'Medium', '15,1,2', NULL),
(191, 137, 'Electrical', 'Low', '1,15', NULL),
(192, 138, 'Electrical', 'Low', '15', NULL),
(193, 139, 'Plumbing', 'Low', '15', NULL),
(194, 140, 'Plumbing', 'Medium', '15,14', NULL),
(195, 134, 'Others', 'Low', NULL, 5),
(196, 133, 'Plumbing', 'Low', '15,14', 5),
(197, 132, 'Others', 'Medium', NULL, 5);

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
(13, 'Staff 12', 'staff12@gmail.com', '', NULL, '2025-09-19 03:28:55', '2025-09-19 03:28:55', 1),
(14, 'Staff 13', 'staff13@gmail.com', '', NULL, '2025-09-30 02:32:44', '2025-09-30 02:32:44', 1),
(15, 'John Doe', 'johndoe@example.com', '09090909', NULL, '2025-10-09 08:44:48', '2025-10-09 08:44:48', 1);

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
  `status` enum('Pending','Acknowledged','In Progress','Resolved') DEFAULT 'Pending',
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
(3, 5, 'test', 'Maintenance', 'test', NULL, 'Pending', 0, '2025-09-10 01:50:32', '2025-10-01 02:26:52', 0, 0),
(4, 5, 'test', '', 'test', NULL, 'Pending', 1, '2025-09-10 01:51:56', '2025-09-11 04:47:32', 0, 0),
(6, 6, 'test', '', 'Test', '1757487876565.jpg', 'Pending', 0, '2025-09-10 07:04:36', '2025-09-11 02:48:06', 0, 0),
(7, 6, 'test 2', 'Maintenance', 'test', '1757487893433.jpg', 'Pending', 0, '2025-09-10 07:04:53', '2025-10-02 02:33:50', 0, 0),
(8, 4, 'test', '', 'Hello World', '1757489463189.jpg', 'Pending', 0, '2025-09-10 07:31:03', '2025-09-11 04:47:32', 0, 0),
(9, 4, 'Hello World', '', 'Hello World', '1757489598938.jpg', 'Pending', 0, '2025-09-10 07:33:18', '2025-09-11 02:40:31', 0, 0),
(10, 4, 'ggggggg', 'Maintenance', 'gggg', NULL, 'Pending', 0, '2025-09-10 07:51:57', '2025-10-01 06:45:11', 0, 0),
(11, 4, 'gggg', 'Maintenance', 'ggg', NULL, 'Pending', 0, '2025-09-10 07:52:10', '2025-09-15 07:32:32', 1, 0),
(12, 4, 'gggg', 'Maintenance', 'ggggggg', NULL, 'Pending', 0, '2025-09-10 07:52:30', '2025-10-06 01:03:17', 1, 0),
(13, 4, 'adsas', '', 'sdadasdasd', NULL, 'Pending', 0, '2025-09-10 07:53:11', '2025-09-15 06:55:48', 0, 0),
(14, 6, 'test', 'Maintenance', 'test', '1757491981194.jpg', 'Pending', 0, '2025-09-10 08:13:01', '2025-09-16 01:54:26', 1, 0),
(15, 5, 'La Union', 'Maintenance', 'Test Report Form', NULL, 'Resolved', 0, '2025-09-11 00:47:02', '2025-09-17 01:29:20', 1, 0),
(16, 5, 'test', 'Maintenance', 'test', NULL, 'Pending', 0, '2025-09-11 00:49:27', '2025-09-17 03:31:54', 1, 0),
(17, 5, 'test', 'Maintenance', 'test', NULL, 'In Progress', 0, '2025-09-11 00:49:47', '2025-09-25 01:29:37', 1, 0),
(18, 6, 'Test Empty Category', 'Maintenance', 'Test Empty Category', '1757554457172.jpg', 'In Progress', 1, '2025-09-11 01:34:17', '2025-09-17 01:29:27', 1, 0),
(19, 6, 'Test', 'Maintenance', '{expandedReport && (\r\n  <Modal show onHide={() => setExpandedReport(null)} size=\"lg\" centered>\r\n    <Modal.Header closeButton>\r\n      <Modal.Title className=\"fw-bold\">Report Details</Modal.Title>\r\n    </Modal.Header>\r\n    <Modal.Body>\r\n      <Row>\r\n        {/* Image Section */}\r\n        <Col md={5} className=\"mb-3\">\r\n          {expandedReport.image_path ? (\r\n            <Image\r\n              src={`${import.meta.env.VITE_IMAGES}/${expandedReport.image_path}`}\r\n              alt=\"Report\"\r\n              fluid\r\n              rounded\r\n              className=\"border\"\r\n              style={{ maxHeight: \"300px\", objectFit: \"cover\", width: \"100%\" }}\r\n            />\r\n          ) : (\r\n            <div className=\"d-flex align-items-center justify-content-center border rounded bg-light\" style={{ height: \"300px\" }}>\r\n              <span className=\"text-muted\">No Image Available</span>\r\n            </div>\r\n          )}\r\n        </Col>\r\n\r\n        {/* Details Section */}\r\n        <Col md={7}>\r\n          <h5 className=\"fw-bold mb-2\">{expandedReport.location}</h5>\r\n          <span\r\n            className={`badge px-3 py-2 fs-6 mb-3 ${\r\n              expandedReport.status === \"Pending\"\r\n                ? \"bg-warning text-dark\"\r\n                : expandedReport.status === \"In Progress\"\r\n                ? \"bg-primary\"\r\n                : \"bg-success\"\r\n            }`}\r\n          >\r\n            {expandedReport.status}\r\n          </span>\r\n\r\n          <p className=\"text-muted mb-1\">\r\n            <strong>Reported on:</strong> {FormatDate(expandedReport.created_at)}\r\n          </p>\r\n\r\n          <hr />\r\n\r\n          <p>\r\n            <strong>Description:</strong>\r\n            <br />\r\n            {expandedReport.description}\r\n          </p>\r\n        </Col>\r\n      </Row>\r\n    </Modal.Body>\r\n    <Modal.Footer>\r\n      <button\r\n        className=\"btn btn-secondary\"\r\n        onClick={() => setExpandedReport(null)}\r\n      >\r\n        Close\r\n      </button>\r\n    </Modal.Footer>\r\n  </Modal>\r\n)}\r\n', '1757559178366.jpg', 'Resolved', 0, '2025-09-11 02:52:58', '2025-09-17 01:29:23', 1, 0),
(20, 6, 'Location', 'Maintenance', 'Location', '1757644886830.jpg', 'Pending', 1, '2025-09-12 02:41:26', '2025-09-15 07:08:09', 1, 0),
(21, 6, 'Test ', 'Maintenance', 'Test Description', NULL, 'In Progress', 1, '2025-09-12 07:34:28', '2025-09-25 03:26:58', 1, 0),
(22, 4, 'Test', 'Maintenance', 'Sample', NULL, 'In Progress', 0, '2025-09-12 08:01:32', '2025-09-18 05:39:43', 1, 0),
(23, 4, 'Test', 'Maintenance', 'Sampole', NULL, 'In Progress', 0, '2025-09-12 08:02:27', '2025-09-16 05:31:46', 1, 0),
(24, 4, 'test', 'Maintenance', 'Sample', NULL, 'In Progress', 0, '2025-09-12 08:03:15', '2025-09-18 05:39:45', 1, 0),
(25, 4, 'Sample', 'Maintenance', 'Sample', NULL, 'In Progress', 0, '2025-09-12 08:06:11', '2025-09-16 06:36:40', 1, 0),
(26, 4, 'Test Sample', 'Maintenance', 'Test Sample', NULL, 'Pending', 0, '2025-09-12 08:07:02', '2025-09-15 07:07:57', 1, 0),
(27, 6, 'Test Multiple Forms', 'Maintenance', 'Testing Multiple Forms', '1757900825003.jpg', 'In Progress', 0, '2025-09-15 01:47:05', '2025-09-16 01:03:57', 1, 0),
(28, 6, 'Test', 'Maintenance', 'Test', NULL, 'Pending', 1, '2025-09-16 01:14:06', '2025-10-06 02:54:10', 0, 0),
(29, 6, 'Test 09-16-2025', 'Maintenance', 'Test 09-16-2025', NULL, 'Pending', 0, '2025-09-16 03:32:18', '2025-09-30 02:54:20', 1, 0),
(30, 6, 'Test 09-16-2025', 'Maintenance', 'Test 09-16-2025', '1757993699754.jpg', 'Pending', 0, '2025-09-16 03:34:59', '2025-09-25 06:23:26', 1, 0),
(31, 6, 'Test 09-16-2025', 'Maintenance', 'Test 09-16-2025', '1757993807494.jpg', 'Pending', 1, '2025-09-16 03:36:47', '2025-09-25 06:20:56', 1, 0),
(32, 6, 'report_type', 'Maintenance', 'report_type', '1757993938915.jpg', 'In Progress', 0, '2025-09-16 03:38:58', '2025-09-16 03:57:11', 1, 0),
(33, 4, 'aasdsa', 'Maintenance', 'aasddasassad', '1758001183243.jpg', 'Pending', 0, '2025-09-16 05:39:43', '2025-09-16 05:39:53', 1, 0),
(34, 4, 'testasd', 'Maintenance', 'asdasdsadsadasasadasd', NULL, 'In Progress', 0, '2025-09-16 07:23:13', '2025-09-25 03:27:35', 1, 0),
(35, 4, 'asdsad', 'Maintenance', 'asdsadsadasd', NULL, 'In Progress', 0, '2025-09-16 07:32:24', '2025-09-16 07:32:24', 0, 0),
(36, 4, 'sadsa', 'Maintenance', 'asdsadsa', NULL, 'In Progress', 0, '2025-09-16 07:33:36', '2025-09-25 01:29:21', 1, 0),
(37, 4, 'aa', 'Maintenance', 'aaaaa', NULL, 'In Progress', 0, '2025-09-16 07:36:17', '2025-09-17 01:17:33', 1, 0),
(38, 4, 'asdas', 'Maintenance', 'asdasasdads', NULL, 'In Progress', 0, '2025-09-16 07:37:18', '2025-09-17 01:16:28', 1, 0),
(39, 4, 'asdas', 'Maintenance', 'asdsadasd', NULL, 'In Progress', 0, '2025-09-16 07:48:34', '2025-09-17 01:16:27', 1, 0),
(40, 5, 'sadasdas', 'Maintenance', 'asdasadasda', NULL, 'In Progress', 0, '2025-09-17 01:21:41', '2025-09-17 01:21:41', 0, 0),
(41, 5, 'Test', 'Maintenance', 'asdasdasdasdas', NULL, 'In Progress', 0, '2025-09-17 01:23:57', '2025-09-17 01:23:57', 0, 0),
(42, 5, 'tester', 'Maintenance', 'asdsadasdasdasd tester', NULL, 'In Progress', 0, '2025-09-17 01:25:08', '2025-09-25 03:03:55', 1, 0),
(43, 5, 'asdsada', 'Maintenance', 'test tester', NULL, 'Pending', 0, '2025-09-17 01:27:19', '2025-09-17 01:27:33', 1, 0),
(44, 5, 'test test teseter', 'Maintenance', 'test test teseter', NULL, 'In Progress', 0, '2025-09-17 01:32:34', '2025-09-26 01:41:24', 1, 0),
(45, 5, 'test multiple staff', 'Maintenance', 'test multiple staff', NULL, 'Resolved', 0, '2025-09-17 01:37:17', '2025-09-18 05:37:31', 1, 0),
(46, 5, 'test multiple staff', 'Maintenance', 'test multiple staff', NULL, 'In Progress', 0, '2025-09-17 01:39:47', '2025-09-25 03:27:25', 1, 0),
(47, 5, 'test 1', 'Maintenance', 'test 1', NULL, 'In Progress', 0, '2025-09-17 01:40:35', '2025-09-25 03:26:28', 1, 0),
(48, 5, 'test check box', 'Maintenance', 'test', '1758073974926.jpg', 'In Progress', 0, '2025-09-17 01:52:54', '2025-09-25 03:27:08', 1, 0),
(49, 6, 'Demo location', 'Maintenance', 'Demo Description', NULL, 'In Progress', 0, '2025-09-17 02:22:23', '2025-09-17 03:31:39', 1, 0),
(50, 6, 'wwwwwwwwwwwwwwww', 'Maintenance', 'wwwwwwwwww', NULL, 'In Progress', 0, '2025-09-17 07:14:58', '2025-09-25 03:26:43', 1, 0),
(51, 6, 'adsas', 'Maintenance', 'asdsadasdasdas', NULL, 'In Progress', 0, '2025-09-17 07:16:22', '2025-09-25 02:38:21', 1, 0),
(52, 6, 'asdsadsa', 'Maintenance', 'asdasdsa', NULL, 'In Progress', 0, '2025-09-17 07:16:29', '2025-09-25 02:37:37', 1, 0),
(53, 6, 'asa', 'Maintenance', 'asdasdsas', NULL, 'In Progress', 1, '2025-09-17 07:18:09', '2025-09-25 02:34:04', 1, 0),
(54, 5, 'Test', 'Maintenance', 'Test', NULL, 'In Progress', 0, '2025-09-18 03:26:11', '2025-09-18 03:42:16', 1, 0),
(55, 6, 'Library', 'Maintenance', 'Test Report', NULL, 'Resolved', 0, '2025-09-18 05:00:33', '2025-09-25 02:35:44', 1, 0),
(56, 6, '          ', 'Maintenance', '           ', NULL, 'Resolved', 0, '2025-09-18 06:58:59', '2025-09-25 02:33:13', 1, 0),
(57, 6, '', 'Maintenance', '', NULL, 'In Progress', 0, '2025-09-18 07:01:38', '2025-09-19 03:53:52', 1, 1),
(58, 6, '', 'Maintenance', '', NULL, 'Resolved', 0, '2025-09-18 07:02:53', '2025-09-25 02:34:49', 1, 0),
(59, 6, ' ', 'Maintenance', '    ', NULL, 'In Progress', 0, '2025-09-18 07:19:38', '2025-09-25 01:00:28', 1, 0),
(60, 6, ' ', 'Maintenance', '     ', NULL, 'In Progress', 0, '2025-09-18 07:19:55', '2025-09-25 02:32:48', 1, 0),
(61, 6, 'aa a sdsa', 'Maintenance', 'asdasd     sdd          dasdasdsadadsadsada          dsadsadasdasdsadasdsaasdasdasdasdasdsaasds', NULL, 'Pending', 0, '2025-09-18 07:33:08', '2025-09-25 06:14:27', 1, 0),
(62, 6, 'lcoalhost', 'Maintenance', 'Test.        test         TEST', NULL, 'In Progress', 1, '2025-09-19 00:51:02', '2025-09-26 01:37:38', 1, 0),
(63, 6, 'IT Services and Development Office', 'Maintenance', 'IT Services And Development Office', NULL, 'In Progress', 1, '2025-09-19 03:44:46', '2025-09-30 02:40:02', 1, 0),
(64, 6, 'Test', 'Maintenance', '|               |\r\n|               |\r\n|               |\r\n----------\r\n', NULL, 'Pending', 1, '2025-09-19 03:49:26', '2025-09-25 05:51:44', 1, 0),
(65, 6, 'Test', 'Maintenance', '_________________\r\n|                              |\r\n|                              |\r\n|                              |\r\n|                              |\r\n|                              |\r\n--------------------', NULL, 'Pending', 0, '2025-09-19 03:50:53', '2025-09-19 04:47:33', 1, 1),
(66, 6, 'Test Location', 'Maintenance', 'Test Description', NULL, 'Pending', 1, '2025-09-22 01:23:56', '2025-09-25 05:51:44', 1, 0),
(67, 6, 'test', 'Maintenance', 'test', NULL, 'Pending', 0, '2025-09-22 03:45:07', '2025-09-25 05:51:44', 1, 0),
(68, 5, 'Test Location', 'Maintenance', 'Test Description', NULL, 'Pending', 0, '2025-09-24 00:52:31', '2025-09-25 05:51:44', 1, 0),
(69, 6, 'Test notification', 'Maintenance', 'Test Notification', NULL, 'Pending', 0, '2025-09-24 01:04:06', '2025-10-06 02:41:05', 1, 0),
(70, 6, 'Test Notifications 2', 'Maintenance', 'Test Notifications 2', NULL, 'In Progress', 0, '2025-09-24 01:15:50', '2025-09-25 02:32:35', 1, 0),
(71, 6, 'Test', 'Maintenance', 'Test', NULL, 'In Progress', 0, '2025-09-24 01:21:36', '2025-09-25 01:05:51', 1, 0),
(72, 6, 'Test', 'Maintenance', 'Test', NULL, 'In Progress', 0, '2025-09-24 01:24:19', '2025-09-25 00:42:42', 1, 0),
(73, 6, 'Test ', 'Maintenance', 'Test', NULL, 'In Progress', 0, '2025-09-24 01:28:22', '2025-09-26 00:53:28', 1, 0),
(74, 6, 'Test Approver', 'Maintenance', 'Test Approver', NULL, 'Pending', 0, '2025-09-24 01:46:20', '2025-09-24 01:53:52', 1, 1),
(75, 6, 'Test Status Progress', 'Maintenance', 'Test Status Progress', NULL, 'In Progress', 0, '2025-09-25 07:17:46', '2025-10-17 03:01:17', 1, 0),
(76, 6, 'Test', 'Maintenance', 'Test', NULL, 'Pending', 0, '2025-09-26 06:01:30', '2025-10-02 00:22:41', 0, 0),
(77, 6, 'Test Quill', 'Maintenance', '<h1>Test Quil</h1>', NULL, 'Pending', 0, '2025-09-29 02:59:43', '2025-10-01 07:18:01', 0, 0),
(78, 6, 'This is test', 'Maintenance', '<p>This is example of <strong>quill <em>i</em></strong><em>nput</em> <u>data</u></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>1</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>2</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>3</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>4</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>5</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>6</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>7</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>8</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>9</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>10</li></ol>', NULL, 'Pending', 0, '2025-09-29 03:05:03', '2025-09-30 01:01:39', 1, 0),
(79, 6, 'test', 'Maintenance', '<ol><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>sadsadsadsaasdsadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>sdasdasd</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>asdsadas</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>sdsadsadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>asdsadsadas</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dasdasdasdas</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>asdasdasdsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>asdadsadsadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>asdsadsadas</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dasdddd</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>adada</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>daadadad</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>adadad</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>sdsadadsadsadas</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dsadsadsadsadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dasdsadsadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dasdasdsasa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>sdasdasdsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>sadasdsadsad</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>saddasdsadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dsadadadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dsadadsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dsad</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>sa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>da</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dasa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>dsa</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>d</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>ad</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>a</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>ds</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>ad</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>s</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>ada</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>d</li></ol><p>ds</p><p>sa</p><p>dsa</p><p>d</p><p>asd</p><p>as</p><p>d</p><p>asd</p><p><br></p><p>sd</p><p>as</p><p>das</p><p>d</p><p>sa</p>', NULL, 'Pending', 0, '2025-09-29 03:10:30', '2025-10-06 00:59:47', 1, 0),
(80, 6, 'test', 'Maintenance', '<p>                            </p>', NULL, 'Pending', 0, '2025-09-29 03:16:02', '2025-10-06 00:57:35', 1, 0),
(81, 6, 'Test', 'Maintenance', '<p>test    test</p>', NULL, 'Pending', 0, '2025-09-29 03:20:23', '2025-10-06 00:17:43', 1, 0),
(82, 6, 'test', 'Maintenance', '<p>🙃</p>', NULL, 'In Progress', 0, '2025-09-29 03:46:29', '2025-09-29 06:06:44', 1, 0),
(83, 6, 'test', 'Maintenance', '<p><span style=\"color: rgb(153, 153, 153);\">&lt;</span><span style=\"color: rgb(153, 0, 85);\">h1</span><span style=\"color: rgb(153, 153, 153);\">&gt;</span>My First Heading<span style=\"color: rgb(153, 153, 153);\">&lt;</span><span style=\"color: rgb(153, 0, 85);\">/h1</span><span style=\"color: rgb(153, 153, 153);\">&gt;</span></p><p><span style=\"color: rgb(153, 153, 153);\">&lt;</span><span style=\"color: rgb(153, 0, 85);\">p</span><span style=\"color: rgb(153, 153, 153);\">&gt;</span>My first paragraph.<span style=\"color: rgb(153, 153, 153);\">&lt;</span><span style=\"color: rgb(153, 0, 85);\">/p</span><span style=\"color: rgb(153, 153, 153);\">&gt;</span></p>', NULL, 'Pending', 0, '2025-09-29 07:34:40', '2025-10-02 03:48:40', 0, 0),
(84, 6, 'test', 'Maintenance', 'test', NULL, 'Pending', 0, '2025-09-29 07:39:16', '2025-10-02 03:46:54', 1, 0),
(85, 6, 'test', 'Incident', 'Hello\r\nthis is testing\r\nmultiple lines\r\nof \r\ndescription', NULL, 'Pending', 0, '2025-09-29 07:39:52', '2025-10-01 06:33:02', 0, 0),
(86, 6, 'test', 'Maintenance', '<p><img src=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA8QMBEQACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAQIDBAUGB//EADIQAQACAgEDAgQEAwkAAAAAAAABAgMRBAUhMRJRE0FxgQYiMmEUUuEVIyQzkaGx0fD/xAAbAQEBAQEBAQEBAAAAAAAAAAAAAQMCBgQFB//EADIRAQACAgEBBQQJBQEAAAAAAAABAgMRBBIFITFBUTJhcYEGExQiI7HR4fAzQpGhwVL/2gAMAwEAAhEDEQA/APAeseKAAIBVQABQEAAAAABQABAEAEARUFQCQSRUkWGEioioigOl2xAAABFABQAAAAAAAAQBQQAEEFQVJBJFSRYSAYz5FRFSRRB0u2IAACiAKAAAAAAAAAACAAAgoggqSCCpIsJMAgrEVJBEV0w6ZKIQCiAAAKAAAAAAAACAAAAgAqAkioKSgkisRUFQEFdEKyUQBRAAAFAAAAAAAAABAAAAQVJFQEFJBBWMoIKgqCulWIACiAAAKAoAQiLoEkAVdCIS6iFrW1p1Ws2n2iHFslKRu06j3u6Y7X7qxM/B1V6Xz7Ui0cTLr39L4bdrcGs6nLD647N5U9/RLXl4XKwxvLx8lY95q0w9o8PNOseSs/Nnk4PIx+1Sf58HP9N6fY+aY79IqAIKgIKSLCAmgYipKKgrpViAogAAAooAECLPZBNgfYU1PsDKlbZLRWkTNpnUREbmXN71pWbXnUR3y7pjm9orWNy+r6T+FKRgjl9XvbHTzGOvmXju0PpJadxx56ax/d5z8I/69Jw+xqb/ABPvW9PKPjL2cPN4PB/L0/hYq1/mtG5l5PJz7WtNrR1T62nc/s9Jj7P1WI3r3Q2163nm25rT0+0VZfb8seju3AxxDbHV8eWa0z4KzHzX7ZS/9SkacTwZrvps4Ovfh3ic7iTyuDWtMmtxMR5+r9zg9qZez5rfqm2KfGJ79e+H4/L4NORE1vGrx4S/Pb1ml5raNTE6mH9Fpat6xavhLx96zW01t4wnZ05QAViKSCCoCCpKKgOlWIABAKAoogAACeZRW6mHcb1sZzdtimo7VHHUemPaA2xrN8OSMmK00vWdxaJ1MM8mKmWk0vG4nyltiy3pbdZ1L1adez5rx/G3m1ta9f8AR4vtn6O+Objbn3enw/R63sntuv8ASz93v/X9XbjyfEnUT5/S8Zas1eti+3XSO39WMrFmdY7TP/pczKzO3v8ARp+JwsmPUTFZ7R9n6fF/E4t6z36fkcuOnLFvV+X9amv9scyK+Iyy/pnYszPZ2Hq/8x+TxvaUR9rya9XHEv1H55sACQQVJFgBiKiADoVkoAiwAAAAooMZlFhswx2HNpb9+j9MzsZa34sKxb1d5mR3MxptikjPa3p+VEie9y5K9+7mW9ZfR/g3kUrnzVy3iPTT8szPaHjO2+LjwX+viNb/ADep7K5mTNT6mfGv5fs9jlXwWyR/CxMUiPH7vFci9L2iaRp6jDFoj7zXXvaNd5/4fPqX0b09Xm8zF+H+h3zZZj419zWs+Zt8oem4HDtaK8avtW7590PwuZyYiZy28K+HxfkubPbLnyZLzu17TMv6NirXHSKVjUQ8hktOS02nxla2bbYzDPa7TS7EAAAAYioKIOjSsVBQAAQADaib0i6YTO5iP3HUR3OrFHiHTCzrrjpMbnf2cseqVnHWPAnVMpNdeYlF2xyTHfcotYcuSYnaeDerp6XFp5Fu3bTyX0ovEYKU85l6j6N495b29z6fj4rZJrEVndu0RHl/P9TM6r3vX7iIev8A4XovGnl9TvWLVjdKb3O/+36vC4WWcvRWvVefL098+j8zlcuvTveo/ng/OvxD1zN1nlWz5Z1jr2x4/wCWH9F7M7OpwcevG8+M+v7R5PJcrlTyL+keUPCi27bfobYzDdWzpnMNlbOtuJhnEq5lnCuVgQBBUkVJFTSDpVioAAAAiKqSKxmUWGuP8yv1Hfk7KzqVfPLfGXXdGfSvx9eP9w6C+fceY39e6EUcts0zPzG0U0xx7yXitY3Np1EM8uSuKk5LzqI75lpjx2vaK1jvl9v03oXH4eGmXqHKx4dxuaR5/wBX8w5nJjtDNN9zMeUREzMR8nu+LX7HgjFWIj1n1lr6h+MOndNpbD0fF8fJ4nJae0fd+r2f9H+Vl77fhV+U2n/kfzufByu0sdZ17U/6/wAviOq9W5PUs85+Xkm9vl7R9Iev4XBwcHF9Xhj5+c/H+f4fh5+Rk5Fuq8/Lyh5WXL67aq+mZcRTUM6V0sOZlsiHThnVYcy2Q6cSzgSWSuQAEFQVAdIxAAAAUE0okwK12hHcNdvdXUOqtomIkY2hl6hNMZuLENdrb3CO4jTGZ7+fuixEy8fP13FTl/DwZfTbHPe8Trv+z482TFlicdo3Hm/U4/Gy4tZY7pbsnVZ5X5s2eck+fzX2uGMOGuscaj3GX63JaZvMy05ObijvN4+0tZy1hnGG0+TT/EXz9sdZiPeWfXNvB39XFPF04cXpjv5axDG1tt8Q60z22RVdOJlnFViHMyzrCuZlnEDmZXQChoEkVjIuwHQMQFAAAAUJBhaB1EtcwO4lhFvRPfx7pM6da6mz4g4mqTfYsVaOTy8PGpvNeK+0fOfszvkrT2pa48F8k/dh4XUOocnm/wB3h3iwfPX6rfWfk+LJltl9nwfqYePjw99u+XFj4G/Nd/VzXDDa3I9G+nTazP6WkYYZW5Mu3B06le/ohrXFEPnvybT5u7Hx/T8m0ViHzWybb4xS60z6mcY5XTnqZxQc9TKKjnaxAiqAAAIKxkU0G29WSoAgACgKAGhWE1F2wtj38uw6i2nJl4uasTODLEftaNsprb+2X0UyUn24cWbF1K1fT8aKx70rrbG8ZvOX01vx474hz16ZaberJNrW+c2nbiMPfuWk8ru1DqpwteI7NIxsbZ9t9OLr5NIqynK304+vk7iGU5Nt0Yv2VnNmXoVOpfQJs0G10BoEFBAVAEEBFVEVvdMlQUQAAUAAUQAFRJDQqemPaA2noF2emA2RAm10AACACoBIMRQBBBUAFQG50zUFhEAAFAAAFEAEEFAAQUAAABABUAnwEIKiAKgICCoDe6ZqCwiAAACgCgAIAICggAIKAAAkgAgpPgEFSQEVAQEFAbnTNQEFEAAAAUAAAAEAABABQAEAkAVJ8AgqSCCgJKKgANzpmoCCwIAAAAoEggLCgggAAIAKAAgCgKk+ARFSQQAVJQQUB//Z\">a</p>', NULL, 'Pending', 0, '2025-09-29 07:59:36', '2025-09-30 07:52:52', 0, 0),
(87, 6, 'test', 'Maintenance', '<p><strong>Test </strong><em>Test </em><u>Test </u></p><ol><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Test</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"color: rgb(230, 0, 0);\">Test</span></li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Test</li></ol>', NULL, 'Pending', 0, '2025-09-30 00:57:45', '2025-10-02 02:20:53', 0, 0),
(88, 6, 'test', 'Maintenance', '<ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Test</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Test</li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Test</li></ol>', NULL, 'Pending', 0, '2025-09-30 00:58:18', '2025-09-30 08:12:48', 1, 0),
(89, 4, 'test', 'Maintenance', '<ReactQuill\r\n  theme=\"snow\"\r\n  value={formData.description}\r\n  onChange={val => { setFormData({ ...formData, description: val }); setErrorMessage(\"\"); }}\r\n  placeholder=\"Describe the issue...\"\r\n  style={{ height: \"200px\", marginBottom: \"50px\" }}\r\n  formats={formats}\r\n  modules={{\r\n    toolbar: [\r\n      [{ header: [1, 2, 3, false] }],          // Headers H1, H2, H3\r\n      [\'bold\', \'italic\', \'underline\', \'strike\'], // Text styling\r\n      [{ list: \'ordered\' }, { list: \'bullet\' }], // Lists\r\n      [\'blockquote\', \'code-block\'],            // Blockquote & code\r\n      [\'link\'],                                // Links\r\n      [{ align: [] }],                         // Text alignment\r\n      [{ color: [] }, { background: [] }],     // Color options\r\n      [\'clean\']                                // Remove formatting\r\n    ],\r\n    clipboard: {\r\n      matchVisual: false\r\n    }\r\n  }}\r\n/>\r\n', NULL, 'Pending', 1, '2025-09-30 01:14:34', '2025-09-30 01:14:42', 1, 0),
(90, 4, 'Test location', 'Maintenance', 'Tes Description', NULL, 'Pending', 1, '2025-09-30 01:18:55', '2025-09-30 01:18:58', 1, 0),
(91, 4, 'Test 2', 'Maintenance', 'Test 2', NULL, 'In Progress', 1, '2025-09-30 01:21:50', '2025-10-01 01:34:55', 1, 0),
(92, 4, 'Test 3', 'Maintenance', 'Test 3', NULL, 'Pending', 1, '2025-09-30 01:23:34', '2025-10-01 06:03:47', 1, 0),
(93, 4, 'Test 4', 'Incident', 'Test 4', NULL, 'Pending', 1, '2025-09-30 01:27:26', '2025-10-01 06:04:14', 1, 0),
(94, 4, 'Test 5', 'Maintenance', 'Test 5', NULL, 'Pending', 1, '2025-09-30 01:33:22', '2025-10-01 05:42:37', 1, 0),
(95, 4, 'Test 6', 'Lost And Found', 'Test 6', NULL, 'Pending', 1, '2025-09-30 01:34:18', '2025-10-01 01:35:53', 1, 0),
(96, 4, 'Test 7', 'Lost And Found', 'Test 7', NULL, 'Pending', 1, '2025-09-30 01:38:01', '2025-10-01 01:05:25', 1, 0),
(97, 4, 'Test 8', 'Maintenance', 'Test 8', NULL, 'In Progress', 1, '2025-09-30 01:40:52', '2025-09-30 01:57:34', 1, 0),
(98, 4, 'Test 9', 'Maintenance', 'Test 9', NULL, 'In Progress', 1, '2025-09-30 01:43:35', '2025-09-30 07:11:15', 1, 0),
(99, 4, 'Test 10', 'Maintenance', 'Test 10', NULL, 'In Progress', 1, '2025-09-30 01:45:09', '2025-09-30 06:49:21', 1, 0),
(100, 4, 'Test 11', 'Maintenance', 'Test 11', NULL, 'Resolved', 1, '2025-09-30 01:49:40', '2025-09-30 02:21:20', 1, 0),
(101, 6, 'Test', 'Maintenance', '<h1><strong style=\"color: rgb(0, 138, 0);\">TEST</strong></h1><h2><strong style=\"color: rgb(230, 0, 0);\"><em><u>TEST</u></em></strong></h2>', NULL, 'Pending', 0, '2025-09-30 07:41:04', '2025-09-30 07:53:14', 1, 1),
(102, 5, 'Test', 'Maintenance', 'Test Created Report From Reports Approver', NULL, 'In Progress', 0, '2025-10-01 01:39:00', '2025-10-01 01:39:30', 0, 0),
(103, 6, 'console.log(report);', 'Maintenance', '<p>console.log(report);</p>', NULL, 'Pending', 0, '2025-10-01 01:44:47', '2025-10-01 05:41:08', 0, 0),
(104, 6, 'console.log(report);', 'Maintenance', '<p>Report.log</p>', NULL, 'Pending', 0, '2025-10-01 01:44:57', '2025-10-01 05:39:49', 0, 0),
(105, 6, 'console.log(report);', '', '<p>Test</p>', NULL, 'Pending', 0, '2025-10-01 01:45:01', '2025-10-01 01:51:43', 0, 1),
(106, 6, 'console.log(report);', 'Maintenance', '<p>Test </p>', NULL, 'In Progress', 0, '2025-10-01 01:45:05', '2025-10-01 06:53:43', 0, 0),
(107, 6, 'console.log(report);', 'Maintenance', '<p>Lost</p>', NULL, 'In Progress', 0, '2025-10-01 01:45:10', '2025-10-01 06:54:11', 0, 0),
(108, 5, 'Test', 'Incident', 'Test', NULL, 'Pending', 0, '2025-10-01 06:50:03', '2025-10-01 06:50:03', 0, 0),
(109, 5, 'Test', 'Lost And Found', 'Test', NULL, 'Pending', 0, '2025-10-01 06:50:11', '2025-10-02 01:54:54', 0, 0),
(110, 6, 'New Report', 'Maintenance', '<p>Test New Report</p>', NULL, 'Pending', 0, '2025-10-02 03:02:31', '2025-10-02 03:14:36', 0, 0),
(111, 6, 'Test', 'Maintenance', '<p>Test</p>', NULL, 'Pending', 0, '2025-10-02 03:15:13', '2025-10-02 06:32:06', 0, 0),
(112, 6, 'Test new report', 'Maintenance', '<p>Test new report</p>', NULL, 'Pending', 0, '2025-10-02 03:49:32', '2025-10-02 06:08:08', 0, 0),
(113, 6, 'test', 'Maintenance', '<p>test</p>', NULL, 'In Progress', 0, '2025-10-02 03:54:58', '2025-10-09 08:43:38', 0, 0),
(114, 6, 'Test', 'Lost And Found', '<h1><strong style=\"color: rgb(230, 0, 0);\"><u>TEST</u></strong></h1><p><u>Test </u></p>', NULL, 'Pending', 0, '2025-10-02 07:21:09', '2025-10-06 01:04:29', 0, 0),
(115, 6, 'New Location', '', '<p>New Report @ 10-14-2025</p>', NULL, 'Pending', 0, '2025-10-14 01:54:59', '2025-10-14 01:54:59', 0, 0),
(116, 6, 'New Ticketing', 'Maintenance', '<p>New Ticketing</p>', NULL, 'In Progress', 0, '2025-10-14 02:06:50', '2025-10-16 00:55:25', 0, 0),
(117, 6, 'Test', 'Maintenance', '<p><strong><em><u>Test</u></em></strong></p>', NULL, 'Pending', 0, '2025-10-14 02:21:40', '2025-10-14 02:26:40', 0, 0),
(118, 6, 'Test mobile', 'Maintenance', '<p>Test mobile</p>', '1760575845869.jpg', 'Resolved', 0, '2025-10-16 00:50:46', '2025-10-16 00:52:55', 0, 0),
(119, 5, 'Test', 'Lost And Found', ' <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} />', NULL, 'In Progress', 0, '2025-10-16 03:50:43', '2025-10-16 03:50:43', 0, 0),
(120, 5, 'Test', 'Maintenance', ' <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} /> <Route path=\'/staff\' element={<Staff/>} />\r\n                  <Route path=\'/reports\' element={<Reports />} />\r\n                  <Route path=\'/view-report\' element={<ViewReportPage/>}/>\r\n                  <Route path=\"/inventory\" element={<Inventory />} />\r\n                  <Route path=\"/borrowing\" element={<BorrowingScreen />} />\r\n                  <Route path=\"/notifications\" element={<Notifications />} />\r\n                  <Route path=\"*\" element={<Navigate to=\"/\" />} />', NULL, 'In Progress', 0, '2025-10-16 03:50:53', '2025-10-16 03:50:53', 0, 0),
(121, 6, 'Test', 'Maintenance', '<p>Data data data data Data</p><p> data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data</p><p>data data data data data data data data data data data data data data data</p><p>data data data data data data data data data</p>', NULL, 'Pending', 0, '2025-10-16 03:55:05', '2025-10-16 07:11:03', 0, 0),
(122, 6, 'Test', 'Maintenance', '<p><strong style=\"color: rgb(230, 0, 0);\">Test Desctiption</strong></p>', NULL, 'Pending', 0, '2025-10-16 05:14:42', '2025-10-16 06:48:02', 0, 0),
(123, 6, 'Test ', 'Maintenance', '<h1><strong style=\"color: rgb(0, 138, 0);\">Test</strong></h1>', NULL, 'Pending', 0, '2025-10-16 05:18:49', '2025-10-16 07:08:14', 0, 0),
(124, 6, 'Test ', 'Maintenance', '<h1><strong style=\"color: rgb(0, 138, 0);\">Test</strong></h1>', NULL, 'Pending', 0, '2025-10-16 05:19:29', '2025-10-16 06:47:04', 0, 0),
(125, 6, 'Test Text', 'Maintenance', '<p>Test Text</p>', NULL, 'Resolved', 0, '2025-10-16 06:50:10', '2025-10-17 03:02:14', 0, 0),
(126, 6, 'Test Data', 'Incident', '<p>Test Data</p>', NULL, 'Pending', 0, '2025-10-16 08:18:22', '2025-10-17 00:12:52', 0, 0),
(127, 6, 'Test', '', '<p>Test </p>', '1760663427577.jpg', 'Pending', 0, '2025-10-17 01:10:27', '2025-10-17 01:10:27', 0, 0),
(128, 6, 'Test Remove', '', '<p>Test Remove</p>', '1760664561189.jpg', 'Pending', 0, '2025-10-17 01:29:21', '2025-10-17 01:29:21', 0, 0),
(129, 6, 'Test 17', '', '<p>Test 17</p>', NULL, 'Pending', 0, '2025-10-17 01:38:06', '2025-10-17 01:38:06', 0, 0),
(130, 6, 'localhost', '', '<p>Localhost</p>', NULL, 'Pending', 0, '2025-10-17 01:40:53', '2025-10-17 01:40:53', 0, 0),
(131, 6, 'Test ResetForm', '', '<p>Test ResetForm</p>', NULL, 'Pending', 0, '2025-10-17 01:45:50', '2025-10-17 01:45:50', 0, 0),
(132, 6, 'Test Reset Form 2', 'Maintenance', '<p>TestResetForm 2</p>', NULL, 'In Progress', 0, '2025-10-17 01:46:50', '2025-10-17 06:22:31', 0, 0),
(133, 6, 'Test', 'Maintenance', '<p>Test</p>', NULL, 'In Progress', 0, '2025-10-17 02:08:54', '2025-10-17 05:37:25', 0, 0),
(134, 6, 'Test 17', 'Maintenance', '<p>Test 17</p>', NULL, 'Pending', 0, '2025-10-17 02:09:14', '2025-10-17 03:58:01', 0, 0),
(135, 4, 'Test Create', 'Maintenance', 'Test Create', NULL, 'Pending', 1, '2025-10-17 03:23:26', '2025-10-17 03:23:26', 0, 0),
(136, 4, 'Test Creation', 'Maintenance', 'Test Creation 2', NULL, 'Pending', 1, '2025-10-17 03:25:28', '2025-10-17 03:25:28', 0, 0),
(137, 4, 'New Created Report', 'Maintenance', 'New Created Report', NULL, 'In Progress', 1, '2025-10-17 03:29:44', '2025-10-17 03:29:44', 0, 0),
(138, 4, 'Newly Created Report', 'Maintenance', 'Newly Created Report', NULL, 'Pending', 1, '2025-10-17 03:31:19', '2025-10-17 03:31:19', 0, 0),
(139, 4, 'test', 'Maintenance', 'Test ', NULL, 'Pending', 1, '2025-10-17 03:32:22', '2025-10-17 03:32:22', 0, 0),
(140, 4, 'Test Newly Created Report', 'Maintenance', 'Test Newly Created Report', NULL, 'Pending', 1, '2025-10-17 03:35:46', '2025-10-17 03:35:46', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_report_remarks`
--

CREATE TABLE `tbl_report_remarks` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `remark` text DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_report_remarks`
--

INSERT INTO `tbl_report_remarks` (`id`, `report_id`, `action`, `remark`, `updated_by`, `created_at`) VALUES
(1, 70, 'Pending', 'test', 4, '2025-09-25 09:54:35'),
(2, 17, 'In Progress', 'test', 4, '2025-09-25 09:59:43'),
(3, 60, 'Pending', 'Testing', 4, '2025-09-25 10:03:08'),
(4, 70, 'update_maintenance', 'Updated category to Cleaning, priority to Medium, assigned staff to 1,2', 4, '2025-09-25 10:11:43'),
(5, 70, 'Update Maintenance', 'Updated category to Cleaning, priority to Medium, assigned staff to Staff 00', 4, '2025-09-25 10:14:19'),
(6, 70, 'Pending', 'Test Progress Remarks', 4, '2025-09-25 10:15:04'),
(7, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00', 4, '2025-09-25 10:16:36'),
(8, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00', 4, '2025-09-25 10:16:59'),
(9, 70, 'Pending', 'test', 4, '2025-09-25 10:18:07'),
(10, 70, 'Pending', 'test', 4, '2025-09-25 10:23:35'),
(11, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00', 4, '2025-09-25 10:23:47'),
(12, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00', 4, '2025-09-25 10:24:08'),
(13, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 10:26:32'),
(14, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 10:27:22'),
(15, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00, Staff 01, Staff 02, Staff 03', 4, '2025-09-25 10:29:07'),
(16, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00, Staff 01, Staff 02, Staff 03, Staff 04', 4, '2025-09-25 10:29:14'),
(17, 70, 'Pending', 'test', 4, '2025-09-25 10:29:29'),
(18, 70, 'Pending', 'test', 4, '2025-09-25 10:29:33'),
(19, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00, Staff 01, Staff 02, Staff 03', 4, '2025-09-25 10:30:10'),
(20, 70, 'Update Maintenance', 'Updated category to General Repair, priority to High, assigned staff to Staff 00', 4, '2025-09-25 10:31:07'),
(21, 70, 'Update Maintenance', 'Updated category to General Repair, priority to High, assigned staff to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 10:31:20'),
(22, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Urgent, assigned staff to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 10:32:03'),
(23, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 10:32:35'),
(24, 70, 'update_status', 'Status changed from Pending to In Progress', 4, '2025-09-25 10:32:35'),
(25, 70, 'Update Maintenance', 'Updated category to General Repair, priority to Medium, assigned staff to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 10:32:40'),
(26, 60, 'Update Maintenance', 'Updated category to Electrical, priority to Low, assigned staff to None', 4, '2025-09-25 10:32:48'),
(27, 60, 'update_status', 'Status changed from Pending to In Progress', 4, '2025-09-25 10:32:48'),
(28, 56, 'Update Maintenance', 'Updated category to Plumbing, priority to Medium, assigned staff to None', 4, '2025-09-25 10:33:13'),
(29, 56, 'update_status', 'Status changed from Pending to Resolved', 4, '2025-09-25 10:33:13'),
(30, 53, 'Update Maintenance', 'Updated category to Plumbing, priority to High, assigned staff to Staff 03, Staff 05, Staff 06', 4, '2025-09-25 10:33:55'),
(31, 53, 'Update Maintenance', 'Updated category to Plumbing, priority to High, assigned staff to Staff 03, Staff 05, Staff 06', 4, '2025-09-25 10:34:04'),
(32, 53, 'update_status', 'Status changed from Pending to In Progress', 4, '2025-09-25 10:34:04'),
(33, 53, 'Update Maintenance', 'Updated category to Cleaning, priority to High, assigned staff to Staff 03, Staff 05, Staff 06', 4, '2025-09-25 10:34:22'),
(34, 58, 'Update Maintenance', 'Updated category to Plumbing, priority to High, assigned staff to Staff 11', 4, '2025-09-25 10:34:49'),
(35, 58, 'update_status', 'Status changed from Pending to Resolved', 4, '2025-09-25 10:34:49'),
(36, 55, 'Update Maintenance', 'Updated category to Plumbing, priority to Low, assigned staff to Staff 00, Staff 01', 4, '2025-09-25 10:35:44'),
(37, 55, 'Updated Status', 'Status changed from Pending to Resolved', 4, '2025-09-25 10:35:44'),
(38, 52, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 10:37:37'),
(39, 52, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 03, Staff 04', 4, '2025-09-25 10:37:59'),
(40, 51, 'Update Category', 'Category changed from Electrical to Cleaning', 4, '2025-09-25 10:38:21'),
(41, 51, 'Update Priority', 'Priority changed from Low to Medium', 4, '2025-09-25 10:38:21'),
(42, 51, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-25 10:38:21'),
(43, 51, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 10:38:21'),
(44, 50, 'Update Priority', 'Priority changed from Low to High', 4, '2025-09-25 10:41:33'),
(45, 50, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 10:41:33'),
(46, 50, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-25 10:41:39'),
(47, 50, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-25 10:41:54'),
(48, 50, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-09-25 10:44:01'),
(49, 73, 'Update Category', 'Category changed from Electrical to Plumbing', 4, '2025-09-25 10:55:24'),
(50, 73, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-25 10:55:24'),
(51, 19, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-09-25 11:16:39'),
(52, 47, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 11:17:29'),
(53, 50, 'Pending', 'Hello World\n', 4, '2025-09-25 11:25:10'),
(54, 50, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-25 11:25:30'),
(55, 50, 'Update Category', 'Category changed from Cleaning to Plumbing', 4, '2025-09-25 11:25:40'),
(56, 50, 'Update Priority', 'Priority changed from High to Urgent', 4, '2025-09-25 11:25:40'),
(57, 50, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 11:25:40'),
(58, 47, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 11:26:28'),
(59, 50, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 11:26:43'),
(60, 21, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 11:26:58'),
(61, 48, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 11:27:08'),
(62, 46, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 11:27:25'),
(63, 34, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 11:27:35'),
(64, 44, 'Update Category', 'Category changed from Plumbing to General Repair', 4, '2025-09-25 12:58:52'),
(65, 73, 'Updated Status', 'Status changed from In Progress to Resolved', 4, '2025-09-25 13:20:10'),
(66, 73, 'Updated Status', 'Status changed from Resolved to In Progress', 4, '2025-09-25 13:21:16'),
(67, 73, 'In Progress', 'Hello world', 4, '2025-09-25 13:21:58'),
(68, 73, 'In Progress', 'Test', 4, '2025-09-25 13:25:34'),
(69, 73, 'Update Priority', 'Priority changed from Medium to Urgent', 4, '2025-09-25 13:25:40'),
(70, 73, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-25 13:26:33'),
(71, 73, 'Update Category', 'Category changed from Plumbing to General Repair', 4, '2025-09-25 13:26:43'),
(72, 61, 'Acknowledged', 'Report acknowledged by angelo cabase', NULL, '2025-09-25 14:17:47'),
(73, 61, 'Update', 'Priority set to Low, category set to General Repair', NULL, '2025-09-25 14:17:47'),
(74, 31, 'Acknowledged', 'Report acknowledged by angelo cabase', NULL, '2025-09-25 14:20:49'),
(75, 30, 'Acknowledged', 'Report acknowledged', 5, '2025-09-25 14:23:08'),
(76, 75, 'Acknowledged', 'Report acknowledged', 5, '2025-09-25 15:18:19'),
(77, 75, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-25 15:19:01'),
(78, 75, 'Updated Status', 'Status changed from In Progress to Pending', 4, '2025-09-25 15:19:27'),
(79, 75, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-26 08:19:15'),
(80, 75, 'Updated Status', 'Status changed from In Progress to Pending', 4, '2025-09-26 08:20:42'),
(81, 75, 'Resolved', 'This is Remarks to Resolved', 4, '2025-09-26 08:21:18'),
(82, 75, 'Update Priority', 'Priority changed from Low to Medium', 4, '2025-09-26 08:21:23'),
(83, 75, 'Updated Status', 'Status changed from Pending to Resolved', 4, '2025-09-26 08:21:23'),
(84, 73, 'Resolved', 'This is the progress remarks', 4, '2025-09-26 08:22:48'),
(85, 73, 'Updated Status', 'Status changed from In Progress to Resolved', 4, '2025-09-26 08:23:00'),
(86, 73, 'Updated Status', 'Status changed from Resolved to In Progress', 4, '2025-09-26 08:53:28'),
(87, 75, 'Update Priority', 'Priority changed from Medium to High', 4, '2025-09-26 08:54:52'),
(88, 75, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-26 08:54:52'),
(89, 75, 'Updated Status', 'Status changed from Resolved to In Progress', 4, '2025-09-26 09:04:31'),
(90, 75, 'Update Priority', 'Priority changed from High to Low', 4, '2025-09-26 09:20:18'),
(91, 75, 'Update Category', 'Category changed from Others to Electrical', 4, '2025-09-26 09:20:39'),
(92, 75, 'In Progress', 'Hello this is not coverage of the maintenance', 4, '2025-09-26 09:21:12'),
(93, 75, 'In Progress', 'This is test  log\n', 4, '2025-09-26 09:24:26'),
(94, 75, 'Updated Status', 'Status changed from In Progress to Resolved', 4, '2025-09-26 09:34:37'),
(95, 62, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-26 09:37:38'),
(96, 62, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-26 09:37:38'),
(97, 44, 'Pending', 'Test \n', 4, '2025-09-26 09:41:06'),
(98, 44, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-26 09:41:24'),
(99, 44, 'In Progress', 'Test in progress', 4, '2025-09-26 09:41:27'),
(100, 69, 'Update Priority', 'Priority changed from Medium to High', 4, '2025-09-26 14:03:35'),
(101, 69, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-26 14:03:53'),
(102, 81, 'Acknowledged', 'Report acknowledged', 5, '2025-09-29 11:27:50'),
(103, 82, 'Acknowledged', 'Report acknowledged', 5, '2025-09-29 13:09:28'),
(104, 80, 'Acknowledged', 'Report acknowledged', 5, '2025-09-29 13:39:17'),
(105, 79, 'Acknowledged', 'Report acknowledged', 5, '2025-09-29 13:47:37'),
(106, 82, 'Update Staff', 'Assigned staff updated to Staff 07, Staff 08', 4, '2025-09-29 14:06:44'),
(107, 82, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-29 14:06:44'),
(108, 82, 'In Progress', 'Hello World', 4, '2025-09-29 14:07:05'),
(109, 81, 'Pending', '<TextTruncate\n                text={\n                  report?.description\n                    ? report.description\n                      .replace(/<[^>]+>/g, \" \")   // strip HTML tags from Quill\n                      .replace(/\\s+/g, \" \")       // collapse whitespace\n                      .trim()\n                    : \"No description provided.\"\n                }\n                maxLength={50}\n              /><TextTruncate\n                text={\n                  report?.description\n                    ? report.description\n                      .replace(/<[^>]+>/g, \" \")   // strip HTML tags from Quill\n                      .replace(/\\s+/g, \" \")       // collapse whitespace\n                      .trim()\n                    : \"No description provided.\"\n                }\n                maxLength={50}\n              /><TextTruncate\n                text={\n                  report?.description\n                    ? report.description\n                      .replace(/<[^>]+>/g, \" \")   // strip HTML tags from Quill\n                      .replace(/\\s+/g, \" \")       // collapse whitespace\n                      .trim()\n                    : \"No description provided.\"\n                }\n                maxLength={50}\n              /><TextTruncate\n                text={\n                  report?.description\n                    ? report.description\n                      .replace(/<[^>]+>/g, \" \")   // strip HTML tags from Quill\n                      .replace(/\\s+/g, \" \")       // collapse whitespace\n                      .trim()\n                    : \"No description provided.\"\n                }\n                maxLength={50}\n              /><TextTruncate\n                text={\n                  report?.description\n                    ? report.description\n                      .replace(/<[^>]+>/g, \" \")   // strip HTML tags from Quill\n                      .replace(/\\s+/g, \" \")       // collapse whitespace\n                      .trim()\n                    : \"No description provided.\"\n                }\n                maxLength={50}\n              /><TextTruncate\n                text={\n                  report?.description\n                    ? report.description\n                      .replace(/<[^>]+>/g, \" \")   // strip HTML tags from Quill\n                      .replace(/\\s+/g, \" \")       // collapse whitespace\n                      .trim()\n                    : \"No description provided.\"\n                }\n                maxLength={50}\n              />', 4, '2025-09-29 14:29:00'),
(110, 81, 'Pending', 'test data', 4, '2025-09-29 14:30:40'),
(111, 81, 'Update Staff', 'Assigned staff updated to Staff 10, Staff 11, Staff 12', 4, '2025-09-29 15:10:34'),
(112, 81, 'Update Category', 'Category changed from General Repair to Cleaning', 4, '2025-09-29 15:10:55'),
(113, 81, 'Update Category', 'Category changed from Cleaning to Plumbing', 4, '2025-09-29 15:14:12'),
(114, 81, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 03, Staff 10, Staff 11, Staff 12', 4, '2025-09-29 15:14:27'),
(115, 78, 'Acknowledged', 'Report acknowledged', 5, '2025-09-29 15:18:20'),
(116, 89, 'Pending', 'Test Logs', 4, '2025-09-30 09:16:46'),
(117, 89, 'Pending', 'Test Logs 2', 4, '2025-09-30 09:17:03'),
(118, 89, 'Pending', 'Test Logs 3', 4, '2025-09-30 09:17:17'),
(119, 100, 'Pending', 'Test', 4, '2025-09-30 09:50:03'),
(120, 97, 'Pending', 'Test Logs', 4, '2025-09-30 09:57:20'),
(121, 97, 'Update Category', 'Category changed from Electrical to Cleaning', 4, '2025-09-30 09:57:34'),
(122, 97, 'Update Priority', 'Priority changed from Low to High', 4, '2025-09-30 09:57:34'),
(123, 97, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 09:57:34'),
(124, 94, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-30 10:10:54'),
(125, 94, 'Update Priority', 'Priority changed from Low to Medium', 4, '2025-09-30 10:11:02'),
(126, 91, 'Pending', 'Logs', 4, '2025-09-30 10:17:21'),
(127, 100, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 10:20:59'),
(128, 100, 'Updated Status', 'Status changed from In Progress to Resolved', 4, '2025-09-30 10:21:20'),
(129, 63, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 10:40:02'),
(130, 29, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 10:53:44'),
(131, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 10, Staff 11', 4, '2025-09-30 11:00:23'),
(132, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 11:42:06'),
(133, 88, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 11:56:59'),
(134, 84, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 12:52:45'),
(135, 84, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 12:53:40'),
(136, 84, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 12:53:44'),
(137, 96, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-30 12:56:14'),
(138, 96, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 03', 4, '2025-09-30 13:09:55'),
(139, 96, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-30 13:11:45'),
(140, 96, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 13:11:50'),
(141, 96, 'In Progress', 'Test', 4, '2025-09-30 13:11:58'),
(142, 96, 'Pending', 'Test', 4, '2025-09-30 13:12:23'),
(143, 96, 'Update Category', 'Category changed from Cleaning to General Repair', 4, '2025-09-30 13:13:30'),
(144, 96, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-30 13:13:30'),
(145, 96, 'Updated Status', 'Status changed from In Progress to Pending', 4, '2025-09-30 13:13:30'),
(146, 96, 'Update Category', 'Category changed from General Repair to Cleaning', 4, '2025-09-30 13:13:38'),
(147, 96, 'Update Priority', 'Priority changed from Low to Medium', 4, '2025-09-30 13:13:43'),
(148, 92, 'Pending', 'Test', 4, '2025-09-30 13:13:56'),
(149, 92, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-09-30 13:17:36'),
(150, 92, 'Pending', 'Inputted logs\n', 4, '2025-09-30 13:18:43'),
(151, 95, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 13', 4, '2025-09-30 13:33:36'),
(152, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:01:15'),
(153, 99, 'Updated Status', 'Status changed from Pending to Resolved', 4, '2025-09-30 14:01:15'),
(154, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 10, Staff 11', 4, '2025-09-30 14:03:12'),
(155, 99, 'Updated Status', 'Status changed from Resolved to Pending', 4, '2025-09-30 14:03:12'),
(156, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 03, Staff 04, Staff 10, Staff 11', 4, '2025-09-30 14:10:06'),
(157, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 10, Staff 11', 4, '2025-09-30 14:15:37'),
(158, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 10, Staff 11', 4, '2025-09-30 14:16:50'),
(159, 99, 'Update Priority', 'Priority changed from Low to Medium', 4, '2025-09-30 14:16:56'),
(160, 99, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 14:17:01'),
(161, 99, 'Update Priority', 'Priority changed from Medium to Low', 4, '2025-09-30 14:18:01'),
(162, 99, 'Updated Status', 'Status changed from In Progress to Pending', 4, '2025-09-30 14:18:01'),
(163, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 10, Staff 11', 4, '2025-09-30 14:20:28'),
(164, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 10, Staff 11', 4, '2025-09-30 14:20:36'),
(165, 99, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:20:57'),
(166, 99, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:21:51'),
(167, 99, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:24:29'),
(168, 99, 'Update Staff', 'Assigned staff updated to Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:25:21'),
(169, 99, 'Update Staff', 'Assigned staff updated to Staff 10, Staff 11', 4, '2025-09-30 14:25:34'),
(170, 99, 'Update Staff', 'Assigned staff updated to Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:27:47'),
(171, 99, 'Update Priority', 'Priority changed from Low to Medium', 4, '2025-09-30 14:28:29'),
(172, 99, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:28:29'),
(173, 99, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-09-30 14:28:44'),
(174, 99, 'Update Priority', 'Priority changed from Medium to Low', 4, '2025-09-30 14:28:44'),
(175, 80, 'Update Priority', 'Priority changed from Low to Urgent', 4, '2025-09-30 14:30:44'),
(176, 80, 'Update Priority', 'Priority changed from Urgent to Low', 4, '2025-09-30 14:36:26'),
(177, 80, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 14:36:26'),
(178, 99, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:49:21'),
(179, 99, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 14:49:21'),
(180, 99, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 03, Staff 10, Staff 11', 4, '2025-09-30 14:49:25'),
(181, 99, 'Update Priority', 'Priority changed from Low to High', 4, '2025-09-30 14:49:32'),
(182, 99, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 10, Staff 11', 4, '2025-09-30 14:49:36'),
(183, 99, 'In Progress', 'test', 4, '2025-09-30 14:49:43'),
(184, 99, 'Update Category', 'Category changed from Cleaning to General Repair', 4, '2025-09-30 14:49:48'),
(185, 95, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 13', 4, '2025-09-30 14:50:02'),
(186, 98, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 14:50:15'),
(187, 98, 'Update Staff', 'Assigned staff updated to None', 4, '2025-09-30 14:54:25'),
(188, 98, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 14:54:33'),
(189, 98, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 14:54:33'),
(190, 98, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-30 14:54:46'),
(191, 98, 'Updated Status', 'Status changed from In Progress to Pending', 4, '2025-09-30 14:54:46'),
(192, 98, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 14:57:52'),
(193, 98, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-30 15:07:29'),
(194, 98, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 15:07:51'),
(195, 98, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-09-30 15:08:53'),
(196, 98, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 15:10:22'),
(197, 98, 'Update Staff', 'Assigned staff updated to None', 4, '2025-09-30 15:10:28'),
(198, 98, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 15:10:59'),
(199, 98, 'Update Staff', 'Assigned staff updated to None', 4, '2025-09-30 15:11:04'),
(200, 98, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-09-30 15:11:09'),
(201, 98, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-09-30 15:11:15'),
(202, 98, 'Update Category', 'Category changed from Electrical to Plumbing', 4, '2025-09-30 15:11:22'),
(203, 98, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-09-30 15:14:04'),
(204, 93, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 08', 4, '2025-09-30 15:14:16'),
(205, 93, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 08', 4, '2025-09-30 15:14:24'),
(206, 93, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 08', 4, '2025-09-30 15:14:28'),
(207, 93, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-09-30 15:14:38'),
(208, 93, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 06', 4, '2025-09-30 15:21:01'),
(209, 93, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 02, Staff 06', 4, '2025-09-30 15:21:08'),
(210, 93, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 06', 4, '2025-09-30 15:21:12'),
(211, 93, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-09-30 15:21:21'),
(212, 93, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 06', 4, '2025-09-30 15:27:16'),
(213, 101, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 15:41:39'),
(214, 101, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 15:42:57'),
(215, 101, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 15:43:03'),
(216, 101, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 15:51:19'),
(217, 87, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 15:51:55'),
(218, 86, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 15:52:52'),
(219, 12, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 15:59:14'),
(220, 12, 'Update Priority', 'Priority changed from Urgent to High', 4, '2025-09-30 16:02:23'),
(221, 12, 'Update Category', 'Category changed from General Repair to Plumbing', 4, '2025-09-30 16:02:41'),
(222, 12, 'Acknowledged', 'Report acknowledged', 5, '2025-09-30 16:03:03'),
(223, 12, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-09-30 16:03:12'),
(224, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:43:17'),
(225, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:43:58'),
(226, 92, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:46:43'),
(227, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:48:01'),
(228, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:49:27'),
(229, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:50:17'),
(230, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:50:44'),
(231, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:54:21'),
(232, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:54:28'),
(233, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:54:34'),
(234, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:54:39'),
(235, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 08:54:45'),
(236, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:01:20'),
(237, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:03:06'),
(238, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:03:19'),
(239, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:03:41'),
(240, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:04:08'),
(241, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:04:43'),
(242, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:04:54'),
(243, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:05:07'),
(244, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:05:11'),
(245, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:05:17'),
(246, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:05:21'),
(247, 96, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:05:25'),
(248, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:05:34'),
(249, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:05:47'),
(250, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:06:06'),
(251, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:06:17'),
(252, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:10:12'),
(253, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:10:25'),
(254, 91, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 03', 4, '2025-10-01 09:34:35'),
(255, 91, 'Update Staff', 'Assigned staff updated to Staff 02, Staff 03', 4, '2025-10-01 09:34:43'),
(256, 91, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 03', 4, '2025-10-01 09:34:48'),
(257, 91, 'Update Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 03', 4, '2025-10-01 09:34:55'),
(258, 91, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-01 09:34:55'),
(259, 91, 'Update Category', 'Category changed from Electrical to Cleaning', 4, '2025-10-01 09:35:10'),
(260, 91, 'Update Category', 'Category changed from Cleaning to Plumbing', 4, '2025-10-01 09:35:21'),
(261, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:35:42'),
(262, 95, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:35:53'),
(263, 102, 'Update Category', 'Category changed from Electrical to Plumbing', 4, '2025-10-01 09:39:16'),
(264, 102, 'Update Priority', 'Priority changed from Medium to High', 4, '2025-10-01 09:39:16'),
(265, 102, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-10-01 09:39:16'),
(266, 102, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-01 09:39:30'),
(267, 107, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 09:54:50'),
(268, 107, 'Pending', 'This is test logs', 4, '2025-10-01 09:55:28'),
(269, 107, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-10-01 09:55:38'),
(270, 107, 'Update Category', 'Category changed from General Repair to Cleaning', 4, '2025-10-01 09:55:43'),
(271, 107, 'Update Priority', 'Priority changed from Low to High', 4, '2025-10-01 09:55:49'),
(272, 107, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-01 09:55:52'),
(273, 107, 'In Progress', 'Test Logs', 4, '2025-10-01 09:55:57'),
(274, 106, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 10:26:25'),
(275, 106, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 10:26:32'),
(276, 3, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 10:26:52'),
(277, 106, 'Update Category', 'Category changed from Plumbing to Cleaning', 4, '2025-10-01 10:51:55'),
(278, 106, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-01 10:52:01'),
(279, 106, 'In Progress', 'Hello world', 4, '2025-10-01 10:52:13'),
(280, 89, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 07, Staff 08', 4, '2025-10-01 10:55:37'),
(281, 19, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 06', 4, '2025-10-01 10:58:50'),
(282, 19, 'Update Category', 'Category changed from Cleaning to General Repair', 4, '2025-10-01 10:58:56'),
(283, 19, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 06', 4, '2025-10-01 10:58:56'),
(284, 104, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:40:16'),
(285, 104, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:40:23'),
(286, 104, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:40:27'),
(287, 103, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:40:57'),
(288, 103, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:41:13'),
(289, 103, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:41:49'),
(290, 103, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:41:54'),
(291, 103, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:42:01'),
(292, 94, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:42:13'),
(293, 94, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:42:28'),
(294, 94, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 13:42:37'),
(295, 92, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 14:03:47'),
(296, 93, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 14:04:14'),
(297, 85, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 14:33:02'),
(298, 10, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 14:45:11'),
(299, 106, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 14:53:43'),
(300, 107, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 14:54:11'),
(301, 77, 'Acknowledged', 'Report acknowledged', 5, '2025-10-01 15:18:01'),
(302, 76, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 08:22:41'),
(303, 104, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 09:51:26'),
(304, 103, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 09:52:40'),
(305, 109, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 09:54:47'),
(306, 109, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 09:54:54'),
(307, 87, 'Update Priority', 'Priority changed from High to Urgent', NULL, '2025-10-02 10:19:45'),
(308, 87, 'Update Staff', 'Assigned staff updated to None', NULL, '2025-10-02 10:19:45'),
(309, 87, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:19:45'),
(310, 87, 'Update Type', 'Report type changed from Maintenance to Lost And Found', NULL, '2025-10-02 10:20:21'),
(311, 87, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:20:21'),
(312, 87, 'Update Type', 'Report type changed from Lost And Found to Maintenance', NULL, '2025-10-02 10:20:53'),
(313, 87, 'Update Category', 'Category changed from None to Electrical', NULL, '2025-10-02 10:20:53'),
(314, 87, 'Update Priority', 'Priority changed from None to Low', NULL, '2025-10-02 10:20:53'),
(315, 87, 'Update Staff', 'Assigned staff updated to None', NULL, '2025-10-02 10:20:53'),
(316, 87, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:20:53'),
(317, 104, 'Update Category', 'Category changed from None to Electrical', NULL, '2025-10-02 10:21:20'),
(318, 104, 'Update Priority', 'Priority changed from None to Low', NULL, '2025-10-02 10:21:20'),
(319, 104, 'Update Staff', 'Assigned staff updated to None', NULL, '2025-10-02 10:21:20'),
(320, 104, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:21:20'),
(321, 14, 'Update Category', 'Category changed from Plumbing to Cleaning', NULL, '2025-10-02 10:25:42'),
(322, 14, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:25:42'),
(323, 14, 'Update Priority', 'Priority changed from Medium to Urgent', NULL, '2025-10-02 10:26:03'),
(324, 14, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:26:03'),
(325, 14, 'Update Category', 'Category changed from Plumbing to Cleaning', NULL, '2025-10-02 10:31:30'),
(326, 14, 'Update Category', 'Category changed from Plumbing to General Repair', NULL, '2025-10-02 10:32:30'),
(327, 7, 'Update Type', 'Report type changed from None to Lost And Found', NULL, '2025-10-02 10:33:39'),
(328, 7, 'Update Type', 'Report type changed from Lost And Found to Maintenance', NULL, '2025-10-02 10:33:50'),
(329, 7, 'Update Category', 'Category changed from None to Electrical', NULL, '2025-10-02 10:33:50'),
(330, 7, 'Update Priority', 'Priority changed from None to Low', NULL, '2025-10-02 10:33:50'),
(331, 3, 'Update Category', 'Category changed from Electrical to Plumbing', NULL, '2025-10-02 10:34:45'),
(332, 7, 'Update Category', 'Category changed from Electrical to Cleaning', NULL, '2025-10-02 10:36:23'),
(333, 7, 'Update Category', 'Category changed from Electrical to Plumbing', NULL, '2025-10-02 10:40:41'),
(334, 7, 'Update Category', 'Category changed from Electrical to Plumbing', NULL, '2025-10-02 10:41:31'),
(335, 7, 'Update Category', 'Category changed from Electrical to Cleaning', NULL, '2025-10-02 10:43:11'),
(336, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:43:11'),
(337, 7, 'Update Category', 'Category changed from Electrical to Cleaning', NULL, '2025-10-02 10:43:22'),
(338, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:43:22'),
(339, 7, 'Update Category', 'Category changed from Electrical to Plumbing', NULL, '2025-10-02 10:43:41'),
(340, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:43:41'),
(341, 7, 'Update Category', 'Category changed from Electrical to Cleaning', NULL, '2025-10-02 10:45:01'),
(342, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:45:01'),
(343, 7, 'Update Category', 'Category changed from Electrical to Plumbing', NULL, '2025-10-02 10:45:29'),
(344, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:45:29'),
(345, 7, 'Update Priority', 'Priority changed from Low to High', NULL, '2025-10-02 10:47:05'),
(346, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:47:05'),
(347, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:48:50'),
(348, 7, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 10:49:31'),
(349, 110, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 11:02:57'),
(350, 110, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 11:03:08'),
(351, 111, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 11:20:38'),
(352, 84, 'Update Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-02 11:47:04'),
(353, 84, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-02 11:47:37'),
(354, 83, 'Update Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-02 11:48:51'),
(355, 83, 'Update Category', 'Category changed from Plumbing to General Repair', 5, '2025-10-02 11:49:02'),
(356, 112, 'Update Category', 'Category changed from Cleaning to General Repair', 5, '2025-10-02 11:52:12'),
(357, 112, 'Update Category', 'Category changed from General Repair to Others', 5, '2025-10-02 11:52:48'),
(358, 112, 'Update Category', 'Category changed from Others to General Repair', 5, '2025-10-02 11:54:41'),
(359, 112, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 11:54:41'),
(360, 113, 'Update Category', 'Category changed from General Repair to Cleaning', 5, '2025-10-02 11:59:38'),
(361, 113, 'Update Category', 'Category changed from Cleaning to General Repair', 5, '2025-10-02 12:54:18'),
(362, 113, 'Update Category', 'Category changed from General Repair to Plumbing', 5, '2025-10-02 12:56:58'),
(363, 113, 'Update Category', 'Category changed from None to Electrical', 5, '2025-10-02 12:57:54'),
(364, 113, 'Update Priority', 'Priority changed from None to Medium', 5, '2025-10-02 12:57:54'),
(365, 113, 'Update Category', 'Category changed from None to Plumbing', 5, '2025-10-02 12:59:08'),
(366, 113, 'Update Priority', 'Priority changed from None to Low', 5, '2025-10-02 12:59:08'),
(367, 113, 'Update Category', 'Category changed from Plumbing to General Repair', 5, '2025-10-02 13:02:47'),
(368, 113, 'Update Category', 'Category changed from None to Plumbing', 5, '2025-10-02 13:10:10'),
(369, 113, 'Update Priority', 'Priority changed from None to Medium', 5, '2025-10-02 13:10:10'),
(370, 113, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 13:10:10'),
(371, 113, 'Update Category', 'Category changed from Plumbing to Electrical', 5, '2025-10-02 13:11:25'),
(372, 113, 'Update Category', 'Category changed from Electrical to Cleaning', 5, '2025-10-02 13:11:35'),
(373, 113, 'Update Category', 'Category changed from None to Electrical', 5, '2025-10-02 13:12:20'),
(374, 113, 'Update Priority', 'Priority changed from None to Low', 5, '2025-10-02 13:12:20'),
(375, 113, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 13:12:20'),
(376, 113, 'Update Category', 'Category changed from None to Electrical', 5, '2025-10-02 13:16:13'),
(377, 113, 'Update Priority', 'Priority changed from None to Low', 5, '2025-10-02 13:16:13'),
(378, 113, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 13:16:13'),
(379, 113, '5', 'Report acknowledged', NULL, '2025-10-02 13:16:13'),
(380, 113, 'Update Category', 'Category changed from None to Plumbing', 5, '2025-10-02 13:16:38'),
(381, 113, 'Update Priority', 'Priority changed from None to Medium', 5, '2025-10-02 13:16:38'),
(382, 113, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 13:16:38'),
(383, 113, '5', 'Report acknowledged', NULL, '2025-10-02 13:16:38'),
(384, 113, 'Update Category', 'Category changed from None to Electrical', 5, '2025-10-02 13:17:26'),
(385, 113, 'Update Priority', 'Priority changed from None to High', 5, '2025-10-02 13:17:26'),
(386, 113, 'Acknowledged', 'Report acknowledged', 5, '2025-10-02 13:17:26'),
(387, 113, '5', 'Report acknowledged', NULL, '2025-10-02 13:17:26'),
(388, 113, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-02 13:19:50'),
(389, 113, 'Update Category', 'Category changed from Cleaning to Others', 5, '2025-10-02 13:20:01'),
(390, 113, 'Update Category', 'Category changed from Cleaning to General Repair', 5, '2025-10-02 13:22:43'),
(391, 113, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-02 13:23:39'),
(392, 113, 'Update Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-02 13:42:55'),
(393, 113, 'Update Category', 'Category changed from Plumbing to Electrical', 5, '2025-10-02 14:06:17'),
(394, 113, 'Update Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-02 14:06:31'),
(395, 110, 'Pending', 'Test', 4, '2025-10-02 14:21:27'),
(396, 111, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-10-02 14:31:02'),
(397, 111, 'Pending', 'Test Logs', 4, '2025-10-02 14:31:48'),
(398, 111, 'Update Priority', 'Priority changed from Medium to High', 4, '2025-10-02 14:31:54'),
(399, 111, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-02 14:31:58'),
(400, 111, 'Update Priority', 'Priority changed from High to Urgent', 4, '2025-10-02 14:32:03'),
(401, 111, 'Updated Status', 'Status changed from In Progress to Pending', 4, '2025-10-02 14:32:06'),
(402, 113, 'Pending', 'Test', 4, '2025-10-02 16:20:32'),
(403, 113, 'Pending', 'This is test logs', 4, '2025-10-02 16:31:12'),
(404, 12, 'Update Category', 'Category changed from Plumbing to Electrical', 5, '2025-10-06 09:03:27'),
(405, 114, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-06 09:03:51'),
(406, 113, 'Pending', 'Pending', 4, '2025-10-09 16:42:07'),
(407, 113, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-10-09 16:43:38'),
(408, 113, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-09 16:43:38'),
(409, 111, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, John Doe', 4, '2025-10-09 16:45:08'),
(410, 117, 'Update Staff', 'Assigned staff updated to Staff 13', 4, '2025-10-14 10:41:06'),
(411, 116, 'Update Category', 'Category changed from Cleaning to General Repair', 5, '2025-10-14 10:45:58'),
(412, 116, 'Acknowledged', 'Report acknowledge', 5, '2025-10-14 10:45:58'),
(413, 116, 'Update Category', 'Category changed from General Repair to Cleaning', 5, '2025-10-14 10:46:05'),
(414, 116, 'Acknowledged', 'Report acknowledge', 5, '2025-10-14 10:46:05'),
(415, 116, 'Update Category', 'Category changed from Cleaning to General Repair', 5, '2025-10-14 10:47:57'),
(416, 118, 'Update Category', 'Category changed from General Repair to Cleaning', 4, '2025-10-16 08:51:46'),
(417, 118, 'Update Staff', 'Assigned staff updated to Staff 00', 4, '2025-10-16 08:51:46'),
(418, 118, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-16 08:52:39'),
(419, 118, 'Updated Status', 'Status changed from In Progress to Resolved', 4, '2025-10-16 08:52:55'),
(420, 116, 'Update Category', 'Category changed from General Repair to Plumbing', 4, '2025-10-16 08:54:36'),
(421, 116, 'Pending', 'test logs\n', 4, '2025-10-16 08:55:05'),
(422, 116, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-16 08:55:25'),
(423, 121, 'Acknowledged', 'Report acknowledged', 5, '2025-10-16 15:11:03'),
(424, 121, 'Update Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-16 15:11:11'),
(425, 125, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-16 15:21:34'),
(426, 125, 'Update Category', 'Category changed from Cleaning to General Repair', 5, '2025-10-16 15:23:29'),
(427, 125, 'Update Category', 'Category changed from General Repair to Cleaning', 5, '2025-10-16 15:29:21'),
(428, 125, 'Acknowledge', 'Report acknowledged', 5, '2025-10-16 15:29:21'),
(429, 125, 'Update Category', 'Category changed from Cleaning to Plumbing', 5, '2025-10-16 15:29:35'),
(430, 125, 'Acknowledge', 'Report acknowledged', 5, '2025-10-16 15:29:35'),
(431, 125, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-16 15:29:59'),
(432, 124, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-16 15:30:45'),
(433, 124, 'Update Category', 'Category changed from Cleaning to General Repair', 5, '2025-10-16 15:31:41'),
(434, 124, 'Update Category', 'Category changed from General Repair to Others', 5, '2025-10-16 15:33:05'),
(435, 124, 'Update Category', 'Category changed from Others to Plumbing', 5, '2025-10-16 15:33:12'),
(436, 125, 'Update Category', 'Category changed from Cleaning to Plumbing', 5, '2025-10-16 15:34:01'),
(437, 125, 'Acknowledged', 'Report acknowledged', 5, '2025-10-16 15:34:01'),
(438, 125, 'Update Category', 'Category changed from Plumbing to Electrical', 5, '2025-10-16 15:34:09'),
(439, 125, 'Update Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-16 15:45:10'),
(440, 125, 'Update Category', 'Category changed from Plumbing to Cleaning', 5, '2025-10-16 15:45:31'),
(441, 125, 'Acknowledge', 'Report acknowledged', 5, '2025-10-16 15:45:31'),
(442, 125, 'Update Category', 'Category changed from Cleaning to Plumbing', 5, '2025-10-16 15:45:40'),
(443, 125, 'Update Category', 'Category changed from Plumbing to General Repair', 4, '2025-10-16 15:46:25'),
(444, 125, 'Pending', 'Test Remarks \n        Test Remarks\n                  Test Remarks\n                           Test Remarks', 4, '2025-10-17 10:22:59'),
(445, 125, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-10-17 10:53:48'),
(446, 125, 'Pending', 'System Generated', 4, '2025-10-17 10:55:32'),
(447, 125, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-17 10:55:40'),
(448, 75, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 03', 4, '2025-10-17 11:00:14'),
(449, 75, 'Resolved', 'Test Remarks', 4, '2025-10-17 11:00:27'),
(450, 75, 'Resolved', 'Test', 4, '2025-10-17 11:00:41'),
(451, 75, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-10-17 11:00:48'),
(452, 75, 'Update Staff', 'Assigned staff updated to Staff 00, Staff 01', 4, '2025-10-17 11:00:54'),
(453, 75, 'Updated Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-10-17 11:01:11'),
(454, 75, 'Updated Status', 'Status changed from Resolved to In Progress', 4, '2025-10-17 11:01:17'),
(455, 75, 'In Progress', 'Test', 4, '2025-10-17 11:01:22'),
(456, 125, 'Updated Status', 'Status changed from In Progress to Resolved', 4, '2025-10-17 11:02:14'),
(457, 125, 'Updated Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02, Staff 04', 4, '2025-10-17 11:02:27'),
(458, 125, 'Updated Category', 'Category changed from General Repair to Cleaning', 4, '2025-10-17 11:08:07'),
(459, 125, 'Updated Staff', 'Assigned staff updated to Staff 01, Staff 02, Staff 04', 4, '2025-10-17 11:21:01'),
(460, 75, 'Updated Staff', 'Assigned staff updated to Staff 01, Staff 02', 4, '2025-10-17 11:21:45'),
(461, 75, 'Updated Category', 'Category changed from Electrical to Plumbing', 4, '2025-10-17 11:22:05'),
(462, 75, 'Updated Category', 'Category changed from Plumbing to General Repair', 4, '2025-10-17 11:22:20'),
(463, 136, 'Pending', 'Test\n', 4, '2025-10-17 11:30:01'),
(464, 140, 'New Report Created', 'A new report has been created', 4, '2025-10-17 11:35:46'),
(465, 135, 'Updated Category', 'Category changed from Electrical to Plumbing', 4, '2025-10-17 11:42:15'),
(466, 135, 'Updated Staff', 'Assigned staff updated to Staff 00, Staff 01, Staff 02', 4, '2025-10-17 11:43:27'),
(467, 140, 'Pending', 'This is test log', 4, '2025-10-17 11:54:53'),
(468, 134, 'Acknowledged', 'Report acknowledged', 5, '2025-10-17 11:58:01'),
(469, 134, 'Updated Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-17 11:58:23'),
(470, 134, 'Updated Category', 'Category changed from Plumbing to Others', 5, '2025-10-17 11:59:28'),
(471, 140, 'Updated Staff', 'Assigned staff updated to Staff 13, John Doe', 4, '2025-10-17 13:35:33'),
(472, 133, 'Acknowledged', 'Report acknowledged', 5, '2025-10-17 13:36:34'),
(473, 133, 'Updated Category', 'Category changed from Electrical to Plumbing', 5, '2025-10-17 13:37:09'),
(474, 133, 'Updated Staff', 'Assigned staff updated to Staff 13, John Doe', 4, '2025-10-17 13:37:25'),
(475, 133, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-17 13:37:25'),
(476, 132, 'Acknowledged', 'Report acknowledged', 5, '2025-10-17 13:38:46'),
(477, 132, 'Updated Category', 'Category changed from Plumbing to General Repair', 5, '2025-10-17 13:39:29'),
(478, 132, 'Pending', 'Test Data\n', 4, '2025-10-17 14:21:33'),
(479, 132, 'Pending', 'This is Progress Logs In Pending Status', 4, '2025-10-17 14:22:22'),
(480, 132, 'Updated Status', 'Status changed from Pending to In Progress', 4, '2025-10-17 14:22:31'),
(481, 132, 'In Progress', 'This is progress Logs In In-Progress Status', 4, '2025-10-17 14:23:11'),
(482, 132, 'Updated Category', 'Category changed from General Repair to Others', 5, '2025-10-17 14:24:05');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Super Admin','Admin','Report Approver','Maintenance Manager','Lost & Found Manager','Incident Manager','User') NOT NULL DEFAULT 'User',
  `image_url` text DEFAULT NULL,
  `token` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`id`, `name`, `email`, `password`, `role`, `image_url`, `token`, `status`, `created_at`) VALUES
(4, 'Angelo Cabase', 'gelocabase1324@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'Admin', 'profile/1757466065021.jpg', '117007367720928788994', 1, '2025-09-10 01:01:05'),
(5, 'angelo cabase', 'goldengrape777@gmail.com', '$2b$10$/Des5DS6YyWQx4gGyXRj0egG3wIbj4VfxzjwienlVNB1QgHmmeLta', 'Report Approver', 'profile/1757466665920.jpg', '111521943834505403428', 1, '2025-09-10 01:11:05'),
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
-- Indexes for table `tbl_report_remarks`
--
ALTER TABLE `tbl_report_remarks`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT for table `notification_receivers`
--
ALTER TABLE `notification_receivers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=199;

--
-- AUTO_INCREMENT for table `tbl_maintenance_reports`
--
ALTER TABLE `tbl_maintenance_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

--
-- AUTO_INCREMENT for table `tbl_maintenance_staff`
--
ALTER TABLE `tbl_maintenance_staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tbl_reports`
--
ALTER TABLE `tbl_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `tbl_report_remarks`
--
ALTER TABLE `tbl_report_remarks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=483;

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
