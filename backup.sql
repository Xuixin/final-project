-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2024 at 02:29 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `restaurant`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `employeeId` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `employeeId`, `status`, `createdAt`) VALUES
(1, 3, 1, '2024-09-09 10:02:55.212'),
(2, 4, 1, '2024-09-09 12:06:25.706'),
(3, 3, 1, '2024-09-11 01:40:51.615'),
(6, 4, 1, '2024-09-11 02:27:02.701'),
(11, 4, 1, '2024-09-14 02:05:45.000'),
(12, 3, 1, '2024-09-14 02:05:45.000'),
(13, 4, 1, '2024-09-18 12:58:07.356'),
(14, 4, 1, '2024-09-19 17:56:36.199'),
(15, 4, 1, '2024-09-20 17:34:24.724'),
(16, 4, 1, '2024-09-21 17:36:45.040'),
(17, 4, 1, '2024-09-22 17:22:12.066'),
(18, 3, 1, '2024-09-22 17:34:58.288'),
(19, 5, 1, '2024-09-22 17:49:19.599'),
(20, 5, 1, '2024-09-23 18:09:26.426'),
(21, 5, 1, '2024-09-25 17:49:20.933'),
(22, 5, 1, '2024-09-30 16:18:30.255'),
(23, 4, 1, '2024-09-30 16:53:55.575'),
(24, 4, 1, '2024-10-01 17:33:18.051'),
(25, 4, 1, '2024-10-01 17:33:18.045'),
(26, 4, 1, '2024-10-01 17:33:18.043');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `createdAt`) VALUES
(1, 'tomyam', '2024-08-05 18:37:15.279'),
(2, 'soup', '2024-08-05 18:37:29.221'),
(3, 'masak', '2024-08-05 18:37:37.637'),
(4, 'kerabu', '2024-08-12 14:52:55.449'),
(5, 'telur', '2024-08-12 14:53:06.747'),
(6, 'sayur', '2024-08-12 14:53:14.818'),
(7, 'nasi', '2024-08-12 14:53:29.444'),
(8, 'mee', '2024-08-12 14:54:29.514'),
(9, 'ikan', '2024-08-12 14:54:46.315'),
(10, 'special', '2024-08-12 14:55:09.661'),
(11, 'nasi goreng', '2024-08-12 14:56:23.634'),
(12, 'juice', '2024-08-12 14:56:34.308'),
(13, 'kopi peket', '2024-08-12 14:57:08.689'),
(14, 'teh', '2024-08-12 14:57:35.704'),
(15, 'sirap', '2024-08-12 14:57:43.569'),
(16, 'neslo', '2024-08-12 14:57:52.587'),
(17, 'limau', '2024-08-12 14:57:59.258');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `lastname` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `tel` varchar(191) DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `lastname`, `email`, `address`, `tel`, `password`, `createdAt`) VALUES
(1, 'imron', 'basor', 'imron@test.com', '36', '0120120120', '$2b$10$k8YXlvM3cUq1v5BYk78nF.dVygMYSb22cDF3NtFga8gzoxnXC2/EC', '2024-08-29 15:39:06.281'),
(2, 'cus_tes', '1', 'cus1@test', 'a 36 66 58 ', '0650650650', '$2b$10$r5y2zpD0dKOCLFr/fH1iCuFKVWQ5ljVLLifsqonw9h1L8bVQl0g6W', '2024-09-15 14:25:14.948'),
(3, 'cus2', 'cus2', 'cus2@test', NULL, NULL, '$2b$10$fR6n8tBytdaToGhiosiLueTVKjILhHq4VBYt.CSCFwcBdoFGLW/Ru', '2024-09-17 17:49:04.807'),
(4, 'cus3', 'cus3', 'cus3@test', '000', '00', '$2b$10$c.Bvp/mfdgK9Jhf/vX8T3ObfXP.Aicrz104fVfNdTL4VaIIxyqtI.', '2024-09-17 17:49:18.657'),
(6, 'imron', 'basor', 'lulu@cus', NULL, NULL, '$2b$10$v66RGPM2Gv0kInjR2bVv9umqzqPXYmPaX7kCxHWShvVX7VpYjj.xC', '2024-10-01 18:15:34.082'),
(7, 'arr', 'deng', 'ang@cus', 'arr 16/*22', '0120120120', '$2b$10$OMy48og4SEjBUyZY9WiBXOsryVIziyRSagDhiVbZMY4Ht4VqsvYVC', '2024-10-01 18:17:19.226');

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `discount` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `discount`
--

INSERT INTO `discount` (`id`, `name`, `discount`, `createdAt`) VALUES
(1, 'new year', 0.5, '2024-08-19 16:22:22.389'),
(2, 'edil fitree', 0.7, '2024-08-19 16:24:38.919');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `lastname` varchar(191) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `name`, `lastname`, `address`, `email`, `password`, `createdAt`, `roleId`) VALUES
(3, 'dish', 'wash', '11/11', 'dish@test', '$2b$10$JXf7Tjp.BGNdc6FP0DI3beyheLfEitElHdfHwzGEm03GZ1FPwF8LW', '2024-09-08 16:17:06.441', 2),
(4, 'chef', 'chef', '11/29', 'chef@test', '$2b$10$k0PE43.ujKC4nkbrmlOjnutzKZsGYd5dKFUKdhiSmgUR6sAYHnvFK', '2024-09-09 19:04:54.000', 1),
(5, 'test', 'yest', '11/29', 'test@test', '$2b$10$Q1JGQ/RPL8RMWwBw380WPO/zrTK6qFE7lQkc3m4F7/OAXhCBNq6QW', '2024-09-14 05:09:38.616', 7);

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `category` enum('wage','food') NOT NULL,
  `amount` double NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `category`, `amount`, `date`) VALUES
(1, 'wage', 310, '2024-09-22 17:39:37.324'),
(2, 'wage', 150, '2024-09-30 16:50:27.463'),
(3, 'wage', 60, '2024-10-01 17:34:17.086');

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `min_quantity` double NOT NULL,
  `quantity` double NOT NULL,
  `unit` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ingredient`
--

INSERT INTO `ingredient` (`id`, `name`, `min_quantity`, `quantity`, `unit`, `createdAt`) VALUES
(1, 'orange', 20, 0, 'ลูก', '2024-10-04 15:41:09.941'),
(2, 'teh', 2.5, 0, 'kilogram(kg)', '2024-10-04 16:27:32.669'),
(4, 'limao', 20, 0, 'ลูก', '2024-10-04 17:09:34.379'),
(5, 'apple', 20, 0, 'ลูก', '2024-10-04 17:10:34.330'),
(6, 'susu', 25, 0, 'kilogram(kg)', '2024-10-04 17:12:03.365');

-- --------------------------------------------------------

--
-- Table structure for table `menu`
--

CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `img` varchar(191) DEFAULT NULL,
  `price` double NOT NULL,
  `categoryId` int(11) NOT NULL,
  `discountId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `soldQuantity` int(11) NOT NULL DEFAULT 0,
  `status` enum('Draft','Published','Archived') NOT NULL DEFAULT 'Draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu`
--

INSERT INTO `menu` (`id`, `name`, `img`, `price`, `categoryId`, `discountId`, `createdAt`, `soldQuantity`, `status`) VALUES
(3, 'teh o halia panas', '/No Image Upload', 1, 14, 2, '2024-08-12 15:02:44.172', 16, 'Published'),
(4, 'teh o panas', '/uploads/1727889413383-4m8vky9f4re.png', 1, 14, NULL, '2024-08-12 15:03:57.325', 19, 'Published'),
(5, 'teh o limau panas', '/No Image Upload', 1.5, 14, NULL, '2024-08-12 15:04:51.150', 19, 'Published'),
(6, 'teh tarek', '/No file Uploaded', 2, 14, NULL, '2024-08-12 15:05:14.543', 10, 'Published'),
(7, 'teh halia panas', '/No file Uploaded', 2.5, 14, NULL, '2024-08-12 15:05:40.443', 6, 'Published'),
(8, 'teh o ais', '/No file Uploaded', 1.5, 14, NULL, '2024-08-12 15:06:01.411', 5, 'Published'),
(9, 'teh o ais limau', '/No file Uploaded', 2, 14, NULL, '2024-08-12 15:06:13.048', 5, 'Published'),
(10, 'teh o ais laici', '/No file Uploaded', 3, 14, NULL, '2024-08-12 15:06:34.124', 3, 'Published'),
(11, 'teh ais', '/No file Uploaded', 2, 14, NULL, '2024-08-12 15:06:54.593', 3, 'Published'),
(12, 'teh ais cincau', '/No file Uploaded', 2.5, 14, NULL, '2024-08-12 15:07:15.319', 2, 'Published'),
(13, 'teh halia ais', '/No file Uploaded', 2.5, 14, NULL, '2024-08-12 15:07:34.828', 2, 'Published'),
(16, 'test3', '/no', 1.6, 12, NULL, '2024-09-05 16:12:43.000', 3, 'Published'),
(19, 'test5', '/No Image Upload', 1, 7, NULL, '2024-09-14 17:31:10.228', 1, 'Published'),
(20, 'orang juice', '/uploads/1728066655487-yx7bzu83yin.jpg', 4, 12, NULL, '2024-10-04 18:31:03.614', 0, 'Published'),
(21, 'apple juice', '/uploads/1728112680849-egs1sa5vqul.jpg', 4, 12, NULL, '2024-10-05 07:18:01.118', 0, 'Published');

-- --------------------------------------------------------

--
-- Table structure for table `menurecipes`
--

CREATE TABLE `menurecipes` (
  `id` int(11) NOT NULL,
  `menuId` int(11) NOT NULL,
  `ingredientId` int(11) NOT NULL,
  `quantity` double NOT NULL,
  `unit` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menurecipes`
--

INSERT INTO `menurecipes` (`id`, `menuId`, `ingredientId`, `quantity`, `unit`, `createdAt`) VALUES
(5, 4, 4, 1, 'kilogram(kg)', '2024-10-05 08:25:39.981'),
(6, 4, 2, 0.05, 'kilogram(kg)', '2024-10-05 08:25:39.982');

-- --------------------------------------------------------

--
-- Table structure for table `menuset`
--

CREATE TABLE `menuset` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `totalMenu` int(11) NOT NULL,
  `price` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `soldQuantity` int(11) NOT NULL DEFAULT 0,
  `status` enum('Draft','Published','Archived') NOT NULL DEFAULT 'Draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menuset`
--

INSERT INTO `menuset` (`id`, `name`, `totalMenu`, `price`, `createdAt`, `soldQuantity`, `status`) VALUES
(1, 'teh party', 7, 8, '2024-08-30 15:03:09.501', 4, 'Draft'),
(2, '1 orang', 2, 4, '2024-08-30 15:04:57.795', 3, 'Draft'),
(8, 'test set 1', 4, 4, '2024-09-13 17:56:30.175', 2, 'Published');

-- --------------------------------------------------------

--
-- Table structure for table `menusetdetail`
--

CREATE TABLE `menusetdetail` (
  `id` int(11) NOT NULL,
  `menusetId` int(11) NOT NULL,
  `menuId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menusetdetail`
--

INSERT INTO `menusetdetail` (`id`, `menusetId`, `menuId`, `quantity`, `createdAt`) VALUES
(15, 2, 13, 1, '2024-08-30 15:04:57.809'),
(16, 2, 11, 1, '2024-08-30 15:04:57.815'),
(24, 8, 3, 3, '2024-09-13 17:56:30.200'),
(25, 8, 5, 1, '2024-09-13 17:56:30.208'),
(34, 1, 6, 1, '2024-09-13 18:10:26.406'),
(35, 1, 4, 1, '2024-09-13 18:10:26.413'),
(36, 1, 3, 1, '2024-09-13 18:10:26.421'),
(37, 1, 5, 1, '2024-09-13 18:10:26.430'),
(38, 1, 7, 1, '2024-09-13 18:10:26.439'),
(39, 1, 8, 1, '2024-09-13 18:10:26.445'),
(40, 1, 10, 1, '2024-09-13 18:10:26.451');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `tableId` int(11) DEFAULT NULL,
  `employeeId` int(11) DEFAULT NULL,
  `status` enum('InQueue','InProgress','Finished','Cancelled') NOT NULL DEFAULT 'InQueue',
  `quantity` int(11) NOT NULL,
  `totalPrice` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `order_sourceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `customerId`, `tableId`, `employeeId`, `status`, `quantity`, `totalPrice`, `createdAt`, `order_sourceId`) VALUES
(29, 1, NULL, NULL, 'Finished', 8, 9, '2024-09-05 09:06:06.450', 1),
(30, 1, NULL, NULL, 'Finished', 11, 14, '2024-09-05 09:09:30.407', 1),
(31, NULL, 1, 4, 'InProgress', 118, 125.6, '2024-09-14 02:21:59.000', 2),
(32, 2, NULL, NULL, 'Finished', 7, 9.5, '2024-09-15 14:31:36.011', 1),
(33, 3, NULL, NULL, 'Finished', 6, 7.1, '2024-09-17 17:50:40.672', 1),
(34, 4, NULL, NULL, 'Finished', 3, 3.5, '2024-09-17 17:52:33.741', 1),
(36, 4, NULL, NULL, 'Finished', 2, 3.5, '2024-09-17 18:12:07.655', 1),
(37, 4, NULL, NULL, 'Finished', 1, 2, '2024-09-17 18:15:31.751', 1),
(40, NULL, 3, 4, 'InProgress', 1, 1, '2024-09-22 18:54:33.705', 2),
(41, NULL, NULL, 5, 'Finished', 1, 1, '2024-09-22 19:13:18.301', 3),
(44, NULL, 4, NULL, 'InQueue', 2, 2.5, '2024-09-29 16:59:58.294', 2),
(45, NULL, 9, NULL, 'InQueue', 1, 0.3, '2024-09-29 17:35:02.696', 2),
(46, NULL, NULL, NULL, 'InQueue', 1, 1, '2024-09-30 16:18:21.250', 3),
(47, 7, NULL, NULL, 'InQueue', 8, 8.3, '2024-10-02 17:58:14.519', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orderdetail`
--

CREATE TABLE `orderdetail` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `menuId` int(11) DEFAULT NULL,
  `menusetId` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` double DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderdetail`
--

INSERT INTO `orderdetail` (`id`, `orderId`, `menuId`, `menusetId`, `quantity`, `price`, `createdAt`) VALUES
(86, 29, 4, NULL, 1, 1, '2024-09-05 09:06:06.479'),
(87, 29, 6, 1, 1, NULL, '2024-09-05 09:06:06.479'),
(88, 29, 4, 1, 1, NULL, '2024-09-05 09:06:06.479'),
(89, 29, 3, 1, 1, NULL, '2024-09-05 09:06:06.479'),
(90, 29, 5, 1, 1, NULL, '2024-09-05 09:06:06.479'),
(91, 29, 7, 1, 1, NULL, '2024-09-05 09:06:06.479'),
(92, 29, 8, 1, 1, NULL, '2024-09-05 09:06:06.479'),
(93, 29, 10, 1, 1, NULL, '2024-09-05 09:06:06.479'),
(94, 30, 4, NULL, 1, 1, '2024-09-05 09:09:30.438'),
(95, 30, 3, NULL, 1, 1, '2024-09-05 09:09:30.438'),
(96, 30, 6, 1, 1, NULL, '2024-09-05 09:09:30.438'),
(97, 30, 4, 1, 1, NULL, '2024-09-05 09:09:30.438'),
(98, 30, 3, 1, 1, NULL, '2024-09-05 09:09:30.438'),
(99, 30, 5, 1, 1, NULL, '2024-09-05 09:09:30.438'),
(100, 30, 7, 1, 1, NULL, '2024-09-05 09:09:30.438'),
(101, 30, 8, 1, 1, NULL, '2024-09-05 09:09:30.438'),
(102, 30, 10, 1, 1, NULL, '2024-09-05 09:09:30.438'),
(103, 30, 13, 2, 1, NULL, '2024-09-05 09:09:30.438'),
(104, 30, 11, 2, 1, NULL, '2024-09-05 09:09:30.438'),
(106, 31, 5, NULL, 3, 1.5, '2024-09-14 17:40:54.057'),
(107, 31, 6, 1, 3, NULL, '2024-09-14 17:40:54.057'),
(108, 31, 4, 1, 3, NULL, '2024-09-14 17:40:54.057'),
(109, 31, 3, 1, 3, NULL, '2024-09-14 17:40:54.057'),
(110, 31, 5, 1, 3, NULL, '2024-09-14 17:40:54.057'),
(111, 31, 7, 1, 3, NULL, '2024-09-14 17:40:54.057'),
(112, 31, 8, 1, 3, NULL, '2024-09-14 17:40:54.057'),
(113, 31, 10, 1, 3, NULL, '2024-09-14 17:40:54.057'),
(114, 32, NULL, NULL, 1, 1.5, '2024-09-15 14:31:36.087'),
(115, 32, 3, 8, 3, NULL, '2024-09-15 14:31:36.087'),
(116, 32, 5, 8, 1, NULL, '2024-09-15 14:31:36.087'),
(117, 32, 13, 2, 1, NULL, '2024-09-15 14:31:36.087'),
(118, 32, 11, 2, 1, NULL, '2024-09-15 14:31:36.087'),
(119, 33, NULL, NULL, 1, 1.5, '2024-09-17 17:50:40.721'),
(120, 33, 16, NULL, 1, 1.6, '2024-09-17 17:50:40.721'),
(121, 33, 3, 8, 3, NULL, '2024-09-17 17:50:40.721'),
(122, 33, 5, 8, 1, NULL, '2024-09-17 17:50:40.721'),
(123, 34, 3, NULL, 1, 1, '2024-09-17 17:52:33.765'),
(124, 34, 4, NULL, 1, 1, '2024-09-17 17:52:33.765'),
(125, 34, 5, NULL, 1, 1.5, '2024-09-17 17:52:33.765'),
(128, 36, 5, NULL, 1, 1.5, '2024-09-17 18:12:07.674'),
(129, 36, 6, NULL, 1, 2, '2024-09-17 18:12:07.674'),
(130, 37, 6, NULL, 1, 2, '2024-09-17 18:15:31.786'),
(134, 31, 13, NULL, 1, 2.5, '2024-09-22 06:41:59.117'),
(135, 31, 13, 2, 1, NULL, '2024-09-22 08:02:54.622'),
(136, 31, 11, 2, 1, NULL, '2024-09-22 08:02:54.622'),
(137, 31, 3, 8, 6, NULL, '2024-09-22 08:15:15.457'),
(138, 31, 5, 8, 2, NULL, '2024-09-22 08:15:15.457'),
(139, 31, 4, NULL, 1, 1, '2024-09-22 16:17:49.152'),
(144, 40, 4, NULL, 1, 1, '2024-09-22 18:54:35.793'),
(145, 41, 4, NULL, 1, 1, '2024-09-22 19:13:18.635'),
(153, 44, 5, NULL, 1, 1.5, '2024-09-29 16:59:58.306'),
(154, 44, 4, NULL, 1, 1, '2024-09-29 16:59:58.306'),
(155, 45, 3, NULL, 1, 1, '2024-09-29 17:35:02.782'),
(156, 31, 16, NULL, 1, 1.6, '2024-09-30 16:06:33.088'),
(157, 46, 19, NULL, 1, 1, '2024-09-30 16:18:21.297'),
(158, 47, 3, NULL, 1, 1, '2024-10-02 17:58:15.034'),
(159, 47, 6, 1, 1, NULL, '2024-10-02 17:58:15.034'),
(160, 47, 4, 1, 1, NULL, '2024-10-02 17:58:15.034'),
(161, 47, 3, 1, 1, NULL, '2024-10-02 17:58:15.034'),
(162, 47, 5, 1, 1, NULL, '2024-10-02 17:58:15.034'),
(163, 47, 7, 1, 1, NULL, '2024-10-02 17:58:15.034'),
(164, 47, 8, 1, 1, NULL, '2024-10-02 17:58:15.034'),
(165, 47, 10, 1, 1, NULL, '2024-10-02 17:58:15.034');

-- --------------------------------------------------------

--
-- Table structure for table `order_source`
--

CREATE TABLE `order_source` (
  `id` int(11) NOT NULL,
  `source_name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_source`
--

INSERT INTO `order_source` (`id`, `source_name`) VALUES
(1, 'delivery'),
(2, 'dine-in'),
(3, 'takeaway');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `amount` double NOT NULL,
  `status` enum('InComplete','Completed','Refunded') NOT NULL DEFAULT 'InComplete',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `method` enum('Cash','PayPal','QRCode') NOT NULL DEFAULT 'PayPal',
  `imgQr` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `orderId`, `amount`, `status`, `createdAt`, `method`, `imgQr`) VALUES
(7, 29, 9, 'Completed', '2024-09-05 09:06:07.687', 'PayPal', NULL),
(8, 30, 14, 'Completed', '2024-09-05 09:09:31.046', 'PayPal', NULL),
(10, 32, 9.5, 'Completed', '2024-09-15 14:31:37.933', 'PayPal', NULL),
(11, 33, 7.1, 'Completed', '2024-09-17 17:50:41.311', 'PayPal', NULL),
(12, 34, 3.5, 'Completed', '2024-09-17 17:52:34.594', 'PayPal', NULL),
(14, 36, 3.5, 'Completed', '2024-09-17 18:12:08.177', 'PayPal', NULL),
(15, 37, 2, 'Completed', '2024-09-17 18:15:32.512', 'PayPal', NULL),
(16, 41, 1, 'Completed', '2024-09-25 18:51:48.451', 'Cash', NULL),
(17, 40, 1, 'Completed', '2024-09-25 18:59:47.507', 'Cash', NULL),
(20, 31, 125.6, 'Completed', '2024-10-01 17:07:31.793', 'Cash', NULL),
(21, 47, 8.3, 'Completed', '2024-10-02 17:58:16.443', 'PayPal', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `wageperday` int(11) NOT NULL,
  `wagepermonth` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `wageperday`, `wagepermonth`) VALUES
(1, 'chef', 60, 1800),
(2, 'Drink maker', 50, 1500),
(3, 'Waiter', 40, 1200),
(4, 'Dish cleaner', 25, 750),
(5, 'owner', 0, 0),
(6, 'test role', 100, 3000),
(7, 'shipper', 30, 900);

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `employeeId` int(11) DEFAULT NULL,
  `status` enum('Pending','Shipped','Delivered','Cancelled') NOT NULL DEFAULT 'Pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`id`, `orderId`, `employeeId`, `status`, `createdAt`) VALUES
(1, 31, NULL, 'Cancelled', '2024-09-14 17:40:58.638'),
(2, 32, 5, 'Shipped', '2024-09-15 14:31:38.645'),
(3, 30, 5, 'Shipped', '2024-09-17 00:59:43.000'),
(4, 29, 5, 'Shipped', '2024-09-17 00:59:43.000'),
(5, 33, 5, 'Shipped', '2024-09-17 17:50:42.340'),
(6, 34, 5, 'Shipped', '2024-09-17 17:52:35.226'),
(8, 36, 5, 'Shipped', '2024-09-17 18:12:08.935'),
(9, 37, 5, 'Shipped', '2024-09-17 18:15:33.275'),
(10, 47, NULL, 'Pending', '2024-10-02 17:58:17.963');

-- --------------------------------------------------------

--
-- Table structure for table `table`
--

CREATE TABLE `table` (
  `id` int(11) NOT NULL,
  `table_NO` varchar(191) NOT NULL,
  `status` enum('available','occupied') NOT NULL DEFAULT 'available',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `type` enum('inside','outside') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `table`
--

INSERT INTO `table` (`id`, `table_NO`, `status`, `createdAt`, `type`) VALUES
(1, 'in1', 'available', '2024-09-20 02:12:37.000', 'inside'),
(2, 'ot1', 'available', '2024-09-20 02:13:28.000', 'outside'),
(3, 'in2', 'occupied', '2024-09-20 02:17:11.000', 'inside'),
(4, 'in3', 'occupied', '2024-09-20 02:17:11.000', 'inside'),
(5, 'in4', 'available', '2024-09-20 02:17:11.000', 'inside'),
(6, 'in5', 'available', '2024-09-20 02:17:11.000', 'inside'),
(7, 'in6', 'available', '2024-09-20 02:17:11.000', 'inside'),
(8, 'in7', 'available', '2024-09-20 02:17:11.000', 'inside'),
(9, 'in8', 'occupied', '2024-09-20 02:17:11.000', 'inside'),
(10, 'in9', 'available', '2024-09-20 02:17:11.000', 'inside'),
(11, 'in10', 'available', '2024-09-20 02:17:11.000', 'inside'),
(12, 'ot2', 'available', '2024-09-20 02:17:11.000', 'outside'),
(13, 'ot3', 'available', '2024-09-20 02:17:11.000', 'outside'),
(14, 'ot4', 'available', '2024-09-20 02:17:11.000', 'outside'),
(15, 'ot5', 'available', '2024-09-20 02:17:11.000', 'outside'),
(16, 'ot6', 'available', '2024-09-20 02:17:11.000', 'outside'),
(17, 'ot7', 'available', '2024-09-20 02:17:11.000', 'outside'),
(18, 'ot8', 'available', '2024-09-20 02:17:11.000', 'outside'),
(19, 'ot9', 'available', '2024-09-20 02:17:11.000', 'outside'),
(20, 'ot10', 'available', '2024-09-20 02:17:11.000', 'outside'),
(21, 'in11', 'available', '2024-09-20 10:40:29.705', 'inside'),
(22, 'ot11', 'available', '2024-09-20 10:47:29.565', 'outside'),
(23, 'in12', 'available', '2024-09-20 10:48:42.855', 'inside');

-- --------------------------------------------------------

--
-- Table structure for table `wages`
--

CREATE TABLE `wages` (
  `id` int(11) NOT NULL,
  `attendanceId` int(11) NOT NULL,
  `amount` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wages`
--

INSERT INTO `wages` (`id`, `attendanceId`, `amount`, `createdAt`) VALUES
(5, 12, 50, '2024-09-13 19:07:56.679'),
(6, 11, 60, '2024-09-13 19:07:56.676'),
(7, 18, 50, '2024-09-22 17:39:35.618'),
(8, 17, 60, '2024-09-22 17:39:35.617'),
(9, 19, 30, '2024-09-22 17:51:05.843'),
(10, 16, 60, '2024-09-22 17:54:07.639'),
(11, 22, 30, '2024-09-30 16:50:22.203'),
(12, 21, 30, '2024-09-30 16:50:45.500'),
(13, 23, 60, '2024-09-30 16:56:36.225'),
(14, 26, 60, '2024-10-01 17:34:15.671');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('11a7c0e9-3612-4a4d-bed4-08a1410d6bf0', 'f2703d804a1140ab1a7f7c5f42195d2d5e4926fc12535ee6ff9f73a20b8b5f54', '2024-09-11 18:59:02.396', '20240911185902_enum_menustatus', NULL, NULL, '2024-09-11 18:59:02.373', 1),
('1657d56e-aa19-4878-b645-921151126f10', '8ba17253d64c435629410ee3d17d379484eb7182d62309ae047269c7109e861a', '2024-09-14 16:43:12.053', '20240914085355_enum_order', NULL, NULL, '2024-09-14 16:43:11.992', 1),
('18b191dd-da4d-4bcc-95d3-edadb4f114cc', '08d2c0110b375a829ba0ad9c481f27981532134af5afacd6fe5228ccec72772e', '2024-09-11 14:28:16.543', '20240806093957_add_img', NULL, NULL, '2024-09-11 14:28:16.493', 1),
('197819a9-ba46-4021-9f29-9e81c1ff793c', '0da1aa7a66e01c252ec01aa673b04a9cd0d34cd9254404acb462f5847643655f', '2024-09-19 19:09:52.933', '20240919190952_string_table_no', NULL, NULL, '2024-09-19 19:09:52.867', 1),
('2506531b-1e55-4ebe-b289-f864165de593', '8bac7b9f93cf8d7842cb89209b650788570fb420acb09001c9d05e719b7bba4f', '2024-09-22 08:09:25.910', '20240922080925_contrans', NULL, NULL, '2024-09-22 08:09:25.868', 1),
('2f5d7f99-71fb-474b-a879-030b8afacbcb', '690540c58a98d840a58e2a4ce7669150d9f80d10d87e306ed3e4bcf1cac33e9b', '2024-09-11 19:14:50.765', '20240911191450_enum_menu_again', NULL, NULL, '2024-09-11 19:14:50.743', 1),
('3e20bc19-678c-481a-8d65-00ad3e67d938', '29550b2c33005b90797068bca30676cbcfee2f407ca5b0294839cbd19d8df429', '2024-09-11 14:28:16.765', '20240817083357_fix_name', NULL, NULL, '2024-09-11 14:28:16.729', 1),
('3f754859-98c5-4265-8e57-436bb29d3f92', 'de712ced884b2d2e606b77c866708649edda5d7491e017864c52824ea39d208e', '2024-09-11 14:28:17.227', '20240911123524_drop_table', NULL, NULL, '2024-09-11 14:28:17.211', 1),
('4c323bcf-3084-43df-945d-a64570627db9', 'b24f86f0067c2c268aec5eae3b2e1753d09c2a4377ca843e253e1191278be1b0', '2024-09-14 16:43:11.899', '20240914083413_enum_payment', NULL, NULL, '2024-09-14 16:43:11.882', 1),
('4dad3cdd-4f23-4296-8f0c-45f15a964552', '144deca98187b0abddc2c35b94736e7e68aabb7804ccfa57d82de968d98a3d93', '2024-09-22 17:03:46.579', '20240922170346_qrcode', NULL, NULL, '2024-09-22 17:03:46.560', 1),
('51847ae2-3136-48d2-86dd-06e0eb181d5b', '71f2f54d59a1a105b11a96393ea86d779562bb607d4f71c70573651de6207702', '2024-10-04 14:24:30.181', '20241004142429_i_ngredient', NULL, NULL, '2024-10-04 14:24:30.037', 1),
('58d3690e-56c3-4861-a056-45d5f0c795a2', '9bfc1882c13afe7aafc51329c61c5785c12fbf91dfa1bfd54235a4f4ff373298', '2024-09-17 08:36:44.493', '20240917083644_cancel_shipping', NULL, NULL, '2024-09-17 08:36:44.482', 1),
('5c68ae5c-9868-4dd4-b579-99dbfac1fe68', '8d808cab50e2b5c5d0dd0c56901f5d7ad8f16dded0d6384aac8080987da08d17', '2024-09-11 14:28:16.881', '20240903180827_add_paypal_fields', NULL, NULL, '2024-09-11 14:28:16.871', 1),
('6c70d5a8-b0a8-4d2e-99e5-dbc8a5e12e34', '3ceaa19dc4c92ce1d7ad2fec4bd0ff6b1b2636ae61a2b0a6cd11c78847c45aee', '2024-09-17 08:34:34.023', '20240917083433_refund', NULL, NULL, '2024-09-17 08:34:33.949', 1),
('6f9d665e-c443-424a-a2ed-8839579bf99c', '798fa81e081a6a20abe1d78252e82840cd6c699eca30378bf3e9715022510c1e', '2024-09-11 14:28:17.028', '20240906155255_optainal', NULL, NULL, '2024-09-11 14:28:16.938', 1),
('719b2b51-51cd-4213-a9f4-dbcecaeb1f4e', '82f95865495641df14ce61886f3ca70103a9bd2697e8351b9f8179e97d4d419f', '2024-09-13 15:46:26.517', '20240913154626_enum_expenses', NULL, NULL, '2024-09-13 15:46:26.494', 1),
('7f289b11-e9bb-4c57-af2c-e5742aca8236', 'bd4f2e6ab3076a86c8a62ffc5e339fa591b534e107dd96a30a7449bf33e08d55', '2024-09-11 14:28:17.080', '20240909165451_booleen', NULL, NULL, '2024-09-11 14:28:17.030', 1),
('8be1f471-68bc-43a1-98f0-7fff6990ca4d', '9d68a9d14dfc1786db22d7cd7b9bdb2b530d3dae03897a19aa385d14a2276379', '2024-09-11 14:28:16.727', '20240817050225_ad_baner', NULL, NULL, '2024-09-11 14:28:16.706', 1),
('95af3f5f-a63a-4baa-965d-f65f22375407', '1d438ef3df12d81b41b5c13538a153d5eff3001c74e996be742ec8da0ec001dd', '2024-09-19 18:50:51.392', '20240919185051_enum_table_status', NULL, NULL, '2024-09-19 18:50:51.328', 1),
('975136d5-48fb-4cba-b93d-1831efe2fda1', '07cbf13a12f5fd441ee61d99b125f1615aee96a761ce692378a3a95392dba1ab', '2024-09-14 16:43:40.155', '20240914164340_enum', NULL, NULL, '2024-09-14 16:43:40.067', 1),
('97d3f4c0-26ab-40e5-aa7d-8dfa11aed0cc', 'f2703d804a1140ab1a7f7c5f42195d2d5e4926fc12535ee6ff9f73a20b8b5f54', '2024-09-12 15:30:53.474', '20240912153053_status_menuset', NULL, NULL, '2024-09-12 15:30:53.453', 1),
('9a5f7071-cd35-42e9-bb40-9165e10ba690', '5233f8c116d1885a918c997f37a848d7e2a5436be34799dc34c43292222717d0', '2024-09-11 14:28:16.349', '20240803080021_add_created_at_field', NULL, NULL, '2024-09-11 14:28:15.503', 1),
('9ecba5d0-3de0-4962-bdf1-179e9a9fee0c', '5c3b646c33658236cbf1a4ea03101f864668275435ff8523b1a51935ab5b5266', '2024-09-18 13:24:26.728', '20240918132426_enum_typetable', NULL, NULL, '2024-09-18 13:24:26.707', 1),
('a3448899-d1d6-4514-8b1f-82cb9fd59a5b', '1e4070f6d8af6aea57166f15f3de8713c3e04966d8562f2dc1badf2536f3789c', '2024-09-11 14:28:16.626', '20240813073425_add_role', NULL, NULL, '2024-09-11 14:28:16.544', 1),
('bbe869e6-823e-4146-bc5f-a027874422c6', 'f24be24efc850c2ddeb056e1dfbc64cec25fa47c2c74c8a0de7b1dc4902e4bb3', '2024-09-11 14:28:20.618', '20240911142820_drop_expenss', NULL, NULL, '2024-09-11 14:28:20.606', 1),
('c04a0017-2a28-4f15-8f61-2ef2fd721699', '9b70550a18b82ec30d45305864ef057777538e4c12b34ce841e3da39a7fe51b6', '2024-09-11 14:28:16.868', '20240901070831_add_order_source', NULL, NULL, '2024-09-11 14:28:16.789', 1),
('cb0d64e7-1a86-415d-9870-2c6b802c62eb', 'fccddbae01f376208e4a51af1427fe5966e1aa2ee8788af96cc5ed2a3c283f2b', '2024-09-17 07:30:33.211', '20240917073033_add_canceled', NULL, NULL, '2024-09-17 07:30:33.197', 1),
('ded125d5-e3fa-4202-ab79-e64b94025187', '970a6deabaef919c7f11b79ab12e92fdb41354067f4c066f837f39c46d302b80', '2024-09-11 14:28:16.703', '20240813085520_', NULL, NULL, '2024-09-11 14:28:16.639', 1),
('e5c9a353-9188-412a-849a-9621c60ff05c', 'e081f0e034473748b0ca500c61c9e15b4573a81aa95b4ce673986f06c4c6bb3a', '2024-09-13 19:09:36.113', '20240913190936_defaoult_time', NULL, NULL, '2024-09-13 19:09:36.086', 1),
('e6de0f6b-05c6-48f8-8b40-ea4a3002bae2', '5e8bec5c3b886a0f8e390379a8b6f74a299473eb87bd0684dfd12875f963e188', '2024-09-11 14:28:17.205', '20240911095108_date', NULL, NULL, '2024-09-11 14:28:17.145', 1),
('e6f798a4-f02d-48f0-8aed-03e31cc4df7e', 'a3e6c7dff0decbace0e87bec4d7475ad77dfd14c54bddf63876de014db5969d1', '2024-09-14 16:43:12.135', '20240914090001_enum_shipping', NULL, NULL, '2024-09-14 16:43:12.055', 1),
('ebe51c55-9765-4282-8c63-22db89e11d0d', '9592c27be38c071fcbe372310c7f5589ab35fb231cf0c5332d3cd1f96155a4dd', '2024-09-11 14:28:16.491', '20240803081342_change_customer_model', NULL, NULL, '2024-09-11 14:28:16.440', 1),
('ed3940ab-759c-4c58-a8e4-9f28d9970c48', '05ed5622ab04c6ce8f63633a66234f2e0927ad0edb212fb69cb6bbabb8329e71', '2024-09-11 14:28:16.936', '20240904175038_null_price', NULL, NULL, '2024-09-11 14:28:16.883', 1),
('efdb2460-1da3-4bde-a12e-48f5c5c064fc', '4d8cb4147a217f8bf9aa52c1bf0b30b8154c3108d83d4a2e0cb81c799d4de6b8', '2024-09-11 14:28:16.638', '20240813075640_add_wage', NULL, NULL, '2024-09-11 14:28:16.627', 1),
('f3682a24-0cbf-442a-bcd1-4a2d0f8de815', 'f5a031d97d2e404df44d4463b7f41f703c0e0e91171155d35184bc8095b58caa', '2024-09-11 14:28:16.786', '20240827154025_add_sold_quantity_column', NULL, NULL, '2024-09-11 14:28:16.767', 1),
('f61ad0a2-91bd-49ac-a9c3-dea701dd5f91', '79b71dc36f07c4c25c7b94dc5fd2b53c78e6d2a9ac78f5ddb4f206a47ec8c138', '2024-09-11 14:28:16.438', '20240803081013_add_field', NULL, NULL, '2024-09-11 14:28:16.351', 1),
('f6fc13f2-eeaf-44c0-a2ce-1bcad61b67a2', '1465279c7e786527939fbedf263fbd80db85566edc0a3ddc9dab58f3d75e82d4', '2024-09-11 14:28:17.143', '20240911093524_db_d_ate', NULL, NULL, '2024-09-11 14:28:17.082', 1),
('f92e5154-4efb-4b40-b6e9-e4d63e1b9734', '31e89b3dff7436358d52d838cfc8c4507d291f2c90764bf27614c63578604b2c', '2024-09-14 16:43:11.982', '20240914083635_enum_status_payment', NULL, NULL, '2024-09-14 16:43:11.907', 1),
('faab827f-a8d1-41ab-8a96-c494b881e6c4', 'a634d9615bfaa37901c60016cd13fae5f30e6e7e2c3d6277874c04f13f5556a3', '2024-09-11 14:44:33.968', '20240911144433_openal', NULL, NULL, '2024-09-11 14:44:33.820', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Attendance_employeeId_fkey` (`employeeId`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Customer_email_key` (`email`);

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Discount_name_key` (`name`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Employee_email_key` (`email`),
  ADD KEY `Employee_roleId_fkey` (`roleId`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Menu_categoryId_fkey` (`categoryId`),
  ADD KEY `Menu_discountId_fkey` (`discountId`);

--
-- Indexes for table `menurecipes`
--
ALTER TABLE `menurecipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MenuRecipes_menuId_fkey` (`menuId`),
  ADD KEY `MenuRecipes_ingredientId_fkey` (`ingredientId`);

--
-- Indexes for table `menuset`
--
ALTER TABLE `menuset`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menusetdetail`
--
ALTER TABLE `menusetdetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MenuSetDetail_menusetId_fkey` (`menusetId`),
  ADD KEY `MenuSetDetail_menuId_fkey` (`menuId`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Order_tableId_fkey` (`tableId`),
  ADD KEY `Order_employeeId_fkey` (`employeeId`),
  ADD KEY `Order_order_sourceId_fkey` (`order_sourceId`),
  ADD KEY `Order_customerId_fkey` (`customerId`);

--
-- Indexes for table `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `OrderDetail_orderId_menuId_menusetId_key` (`orderId`,`menuId`,`menusetId`),
  ADD KEY `OrderDetail_menuId_fkey` (`menuId`),
  ADD KEY `OrderDetail_menusetId_fkey` (`menusetId`);

--
-- Indexes for table `order_source`
--
ALTER TABLE `order_source`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_source_source_name_key` (`source_name`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Payment_orderId_key` (`orderId`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Shipping_orderId_key` (`orderId`),
  ADD KEY `Shipping_employeeId_fkey` (`employeeId`);

--
-- Indexes for table `table`
--
ALTER TABLE `table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wages`
--
ALTER TABLE `wages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Wages_attendanceId_fkey` (`attendanceId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `menu`
--
ALTER TABLE `menu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `menurecipes`
--
ALTER TABLE `menurecipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `menuset`
--
ALTER TABLE `menuset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `menusetdetail`
--
ALTER TABLE `menusetdetail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `orderdetail`
--
ALTER TABLE `orderdetail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=166;

--
-- AUTO_INCREMENT for table `order_source`
--
ALTER TABLE `order_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `table`
--
ALTER TABLE `table`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `wages`
--
ALTER TABLE `wages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `Attendance_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `Employee_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `menu`
--
ALTER TABLE `menu`
  ADD CONSTRAINT `Menu_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Menu_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `discount` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `menurecipes`
--
ALTER TABLE `menurecipes`
  ADD CONSTRAINT `MenuRecipes_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredient` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `MenuRecipes_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `menusetdetail`
--
ALTER TABLE `menusetdetail`
  ADD CONSTRAINT `MenuSetDetail_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `MenuSetDetail_menusetId_fkey` FOREIGN KEY (`menusetId`) REFERENCES `menuset` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Order_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Order_order_sourceId_fkey` FOREIGN KEY (`order_sourceId`) REFERENCES `order_source` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Order_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `table` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD CONSTRAINT `OrderDetail_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `menu` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderDetail_menusetId_fkey` FOREIGN KEY (`menusetId`) REFERENCES `menuset` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderDetail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
  ADD CONSTRAINT `Shipping_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Shipping_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `wages`
--
ALTER TABLE `wages`
  ADD CONSTRAINT `Wages_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `attendance` (`id`) ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
