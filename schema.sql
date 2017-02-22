-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 22, 2017 at 05:52 PM
-- Server version: 5.7.17-0ubuntu0.16.04.1
-- PHP Version: 7.0.13-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `docman_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `Document`
--

CREATE TABLE `Document` (
  `id` int(11) NOT NULL,
  `creatorId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` varchar(255) DEFAULT 'add short description',
  `content` text,
  `access` varchar(255) NOT NULL DEFAULT 'private',
  `authorized` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `auth_token` text,
  `roleId` int(11) NOT NULL DEFAULT '1',
  `password_digest` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `username`, `firstname`, `lastname`, `email`, `auth_token`, `roleId`, `password_digest`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'victor', 'enogwe', 'victor.enogwe@andela.com', NULL, 0, '$2a$10$7y.lUKETxMSt6pyUvWnTzOT5ibX7.nw2YGUovpfA1CttPMvK6kdRy', '2017-02-22 16:46:14', '2017-02-22 16:46:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Document`
--
ALTER TABLE `Document`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creatorId` (`creatorId`);
ALTER TABLE `Document` ADD FULLTEXT KEY `Search_Index` (`title`,`excerpt`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_username_unique` (`username`),
  ADD UNIQUE KEY `User_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Document`
--
ALTER TABLE `Document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Document`
--
ALTER TABLE `Document`
  ADD CONSTRAINT `Document_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
