-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 24, 2024 at 09:07 AM
-- Server version: 10.11.9-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u291518478_project1`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `patient_name` varchar(100) DEFAULT NULL,
  `patient_email` varchar(100) DEFAULT NULL,
  `patient_phone` varchar(20) DEFAULT NULL,
  `appointment_date` date DEFAULT NULL,
  `appointment_time` time DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `mail_status` varchar(50) DEFAULT 'Not Sent',
  `mail_id` varchar(100) DEFAULT NULL,
  `reference_no` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `doctor_id`, `patient_name`, `patient_email`, `patient_phone`, `appointment_date`, `appointment_time`, `reason`, `status`, `created_at`, `mail_status`, `mail_id`, `reference_no`) VALUES
(10, 6, 'B MOKSHAGNA REDDY', 'moksha10171@gmail.com', '6305062093', '2024-12-05', '15:00:00', 'gbdf', 'Confirmed', '2024-11-16 10:02:48', 'Sent', '<wIKi2Gbe9k6kTx1o1LEkIEC5xmcrPCeyjRCxNysbQ@www.bmreducation.com>', '63447460318'),
(11, 3, 'm.nandeeswar', 'nandeeswarnandeeswar23@gmail.com', '8309453162', '2024-11-28', '10:00:00', 'for health condition', 'Confirmed', '2024-11-16 17:38:29', 'Sent', '<RdAuDItJjS7k0nwf8hI6vtoG1me0AK8MKgn4m54A@www.bmreducation.com>', '7962040231'),
(12, 1, 'B MOKSHAGNA REDDY', 'moksha10171@gmail.com', '6305062093', '2024-11-22', '16:30:00', 'zxcascda', 'Confirmed', '2024-11-17 13:52:17', 'Sent', '<iESoMlOggiXNfreY9ptzoRsWhn6O2PrLtTghCs8Fo@www.bmreducation.com>', '13328821130'),
(13, 6, 's.harshith', 'sharshith1319@gmail.com', '8712364027', '2024-11-18', '11:00:00', 'not feeling well', 'Confirmed', '2024-11-17 16:18:27', 'Sent', '<zTJadKNAfCj5EqmC21mEWhRa4Gczr4y7PLePXRqxY@www.bmreducation.com>', '37403912080'),
(14, 3, 'B MOKSHAGNA REDDY', 'moksha10171@gmail.com', '6305062093', '2024-11-28', '18:00:00', ';k\';l', 'Confirmed', '2024-11-19 04:38:32', 'Sent', '<CdvcrfVapv1xaW6kahFAGKDeHZRtLqD1jkP7felA@www.bmreducation.com>', '6707283600');

-- --------------------------------------------------------

--
-- Table structure for table `connections`
--

CREATE TABLE `connections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `requester_id` bigint(20) UNSIGNED NOT NULL,
  `recipient_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','accepted','rejected','blocked') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_submissions`
--

CREATE TABLE `contact_submissions` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `submission_date` timestamp NULL DEFAULT current_timestamp(),
  `status` enum('new','read','responded','archived') DEFAULT 'new',
  `response_notes` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_submissions`
--

INSERT INTO `contact_submissions` (`id`, `full_name`, `email`, `phone`, `subject`, `message`, `submission_date`, `status`, `response_notes`, `ip_address`, `user_agent`) VALUES
(2, 'Nandeeshwar', 'nadeeshwarnandeeshwar22@gmail.com', '9845653064', 'Testing', 'Testing', '2024-11-17 10:07:10', 'new', NULL, '43.247.158.70', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `timings` varchar(255) DEFAULT NULL,
  `emergency_available` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`, `description`, `location`, `timings`, `emergency_available`) VALUES
(1, 'Cardiology', 'Expert heart care and cardiovascular treatments', 'Block A, 2nd Floor', '24/7 Emergency, Regular: 8:00 AM - 8:00 PM', 1),
(2, 'Neurology', 'Specialized brain and nervous system care', 'Block B, 3rd Floor', 'Mon-Sat: 9:00 AM - 6:00 PM', 1),
(3, 'Pediatrics', 'Complete child healthcare and vaccinations', 'Block A, Ground Floor', '24/7 Emergency, Regular: 9:00 AM - 7:00 PM', 1),
(4, 'Orthopedics', 'Bone, joint, and muscle treatments', 'Block C, 2nd Floor', 'Mon-Sat: 8:00 AM - 8:00 PM', 1),
(5, 'Oncology', 'Cancer care and chemotherapy', 'Block D, 1st Floor', 'Mon-Sat: 8:00 AM - 6:00 PM', 0),
(6, 'Dermatology', 'Skin care and cosmetic treatments', 'Block B, 1st Floor', 'Mon-Sat: 10:00 AM - 6:00 PM', 0),
(7, 'Ophthalmology', 'Complete eye care and surgery', 'Block C, 1st Floor', 'Mon-Sat: 9:00 AM - 5:00 PM', 0),
(8, 'Dentistry', 'Dental care and oral surgery', 'Block A, 1st Floor', 'Mon-Sat: 9:00 AM - 7:00 PM', 0),
(9, 'ENT', 'Ear, nose, and throat specialists', 'Block B, 2nd Floor', 'Mon-Sat: 9:00 AM - 6:00 PM', 0),
(10, 'Psychiatry', 'Mental health and counseling', 'Block D, 2nd Floor', 'Mon-Sat: 10:00 AM - 6:00 PM', 0);

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `schedule` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `consultation_fee` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `name`, `specialty`, `schedule`, `location`, `image`, `consultation_fee`) VALUES
(1, 'Dr. Sarah Johnson', 'Cardiology', 'Mon - Fri: 9:00 AM - 5:00 PM', 'Heart Center, Floor 2', 'images/sarah-johnson.jpg', 2500.00),
(2, 'Dr. Michael Chen', 'Cardiology', 'Mon - Fri: 10:00 AM - 6:00 PM', 'Heart Center, Floor 2', 'images/michael-chen.jpg', 2200.00),
(3, 'Dr. Emily Parker', 'Neurology', 'Tue - Sat: 9:00 AM - 4:00 PM', 'Neurology Center, Floor 3', 'images/emily-parker.jpg', 2300.00),
(4, 'Dr. Robert Wilson', 'Neurology', 'Mon - Fri: 8:00 AM - 3:00 PM', 'Neurology Center, Floor 3', 'images/robert-wilson.jpg', 2800.00),
(5, 'Dr. Lisa Martinez', 'Pediatrics', 'Mon - Fri: 9:00 AM - 6:00 PM', 'Children\'s Wing, Floor 1', 'images/lisa-martinez.jpg', 1800.00),
(6, 'Dr. James Anderson', 'Orthopedics', 'Mon - Thu: 8:00 AM - 4:00 PM', 'Orthopedic Center, Floor 3', 'images/james-anderson.jpg', 2400.00),
(7, 'Dr. Rachel Kim', 'Oncology', 'Mon - Fri: 8:30 AM - 4:30 PM', 'Cancer Center, Floor 4', 'images/rachel-kim.jpg', 2600.00),
(8, 'Dr. David Thompson', 'Oncology', 'Tue - Sat: 9:00 AM - 5:00 PM', 'Cancer Center, Floor 4', 'images/david-thompson.jpg', 2500.00);

-- --------------------------------------------------------

--
-- Table structure for table `medcare_token_blacklist`
--

CREATE TABLE `medcare_token_blacklist` (
  `id` int(11) NOT NULL,
  `token` text NOT NULL,
  `expiry` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medcare_users`
--

CREATE TABLE `medcare_users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `verification_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` datetime DEFAULT NULL,
  `last_activity` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `medcare_users`
--

INSERT INTO `medcare_users` (`id`, `first_name`, `last_name`, `email`, `password`, `reset_token`, `reset_token_expiry`, `email_verified`, `verification_token`, `created_at`, `updated_at`, `last_login`, `last_activity`) VALUES
(3, 'Moksha', 'Bandi', 'moksha10171@gmail.com', '$2y$10$Ab/kn4zHd3F4AVzHO1pVH.wc7UGbrEpeSutYcJpbgXcTl88oYiQzi', NULL, NULL, 0, '630e7c8be51fc314359b9858aa3a493ba1cec5f78dde14bf2428ed9478d4e595', '2024-11-24 09:03:05', '2024-11-24 09:03:05', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `medcare_user_activities`
--

CREATE TABLE `medcare_user_activities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `timestamp` datetime NOT NULL,
  `additional_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`additional_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `connections`
--
ALTER TABLE `connections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_connections_requester_id` (`requester_id`),
  ADD KEY `idx_connections_recipient_id` (`recipient_id`);

--
-- Indexes for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medcare_token_blacklist`
--
ALTER TABLE `medcare_token_blacklist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token_expiry` (`expiry`);

--
-- Indexes for table `medcare_users`
--
ALTER TABLE `medcare_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `medcare_user_activities`
--
ALTER TABLE `medcare_user_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_timestamp` (`user_id`,`timestamp`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `connections`
--
ALTER TABLE `connections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_submissions`
--
ALTER TABLE `contact_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `medcare_token_blacklist`
--
ALTER TABLE `medcare_token_blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `medcare_users`
--
ALTER TABLE `medcare_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `medcare_user_activities`
--
ALTER TABLE `medcare_user_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `medcare_user_activities`
--
ALTER TABLE `medcare_user_activities`
  ADD CONSTRAINT `medcare_user_activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `medcare_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
