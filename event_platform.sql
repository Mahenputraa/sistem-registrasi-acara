SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `venue_id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `poster_url` varchar(255) DEFAULT 'https://placehold.co/600x400/3498db/ffffff?text=Event'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `events`

INSERT INTO `events` (`id`, `name`, `description`, `start_time`, `end_time`, `venue_id`, `organizer_id`, `poster_url`) VALUES
(1, 'Workshop Machine Learning', 'Pelajari dasar-dasar machine learning dari nol.', '2025-09-15 09:00:00', '2025-09-15 17:00:00', 1, 1, 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'),
(2, 'React Conference 2025', 'Konferensi tahunan untuk para pengembang React.', '2025-10-20 08:00:00', '2025-10-21 18:00:00', 2, 1, 'https://images.unsplash.com/photo-1560439514-4e9645039924?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'),
(3, 'Webinar: State of Frontend', 'Diskusi panel tentang tren frontend terbaru.', '2025-11-05 19:00:00', '2025-11-05 21:00:00', 3, 1, 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80');


-- Table structure for table `registrations`

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'paid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Table structure for table `tickets`

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `registration_id` int(11) NOT NULL,
  `ticket_type_id` int(11) NOT NULL,
  `attendee_name` varchar(255) NOT NULL,
  `ticket_code` varchar(255) NOT NULL,
  `status` enum('active','checked-in','cancelled') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Table structure for table `ticket_types`

CREATE TABLE `ticket_types` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `capacity` int(10) UNSIGNED NOT NULL,
  `available_from` datetime NOT NULL,
  `available_until` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Dumping data for table `ticket_types`

INSERT INTO `ticket_types` (`id`, `event_id`, `name`, `price`, `capacity`, `available_from`, `available_until`) VALUES
(1, 1, 'General Admission', '150000.00', 100, '2025-07-01 00:00:00', '2025-09-14 23:59:59'),
(2, 1, 'VIP', '350000.00', 20, '2025-07-01 00:00:00', '2025-09-14 23:59:59'),
(3, 2, 'Early Bird', '500000.00', 50, '2025-08-01 00:00:00', '2025-08-31 23:59:59'),
(4, 2, 'Regular', '750000.00', 200, '2025-09-01 00:00:00', '2025-10-19 23:59:59');


-- Table structure for table `users`

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table `users`

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(1, 'Admin Acara', 'admin@acara.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '2025-07-12 17:58:31'),
(2, 'Budi Santoso', 'budi@user.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', '2025-07-12 17:58:31');


-- Table structure for table `venues`

CREATE TABLE `venues` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('physical','online') NOT NULL,
  `address` text DEFAULT NULL,
  `platform` varchar(100) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Dumping data for table `venues`

INSERT INTO `venues` (`id`, `name`, `type`, `address`, `platform`, `url`) VALUES
(1, 'Tech Hub Jakarta', 'physical', 'Jl. Gatot Subroto No. 42, Jakarta Selatan', NULL, NULL),
(2, 'Inovasi Center Bandung', 'physical', 'Jl. Asia Afrika No. 8, Bandung', NULL, NULL),
(3, 'Sesi Online Zoom', 'online', NULL, 'Zoom', 'https://zoom.us/j/1234567890');


-- Indexes for table `events`

ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`),
  ADD KEY `venue_id` (`venue_id`);


-- Indexes for table `registrations`

ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);


-- Indexes for table `tickets`

ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_code` (`ticket_code`),
  ADD KEY `registration_id` (`registration_id`),
  ADD KEY `ticket_type_id` (`ticket_type_id`);


-- Indexes for table `ticket_types`

ALTER TABLE `ticket_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);


-- Indexes for table `users`

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);


-- Indexes for table `venues`

ALTER TABLE `venues`
  ADD PRIMARY KEY (`id`);



-- AUTO_INCREMENT for table `events`

ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


-- AUTO_INCREMENT for table `registrations`

ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


-- AUTO_INCREMENT for table `tickets`

ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


-- AUTO_INCREMENT for table `ticket_types`

ALTER TABLE `ticket_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


-- AUTO_INCREMENT for table `users`

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


-- AUTO_INCREMENT for table `venues`

ALTER TABLE `venues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;



-- Constraints for table `events`

ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`);


-- Constraints for table `registrations`

ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);


-- Constraints for table `tickets`

ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`),
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`ticket_type_id`) REFERENCES `ticket_types` (`id`);


-- Constraints for table `ticket_types`

ALTER TABLE `ticket_types`
  ADD CONSTRAINT `ticket_types_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);
COMMIT;

