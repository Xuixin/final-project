
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";


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



INSERT INTO `customer` (`id`, `name`, `lastname`, `email`, `address`, `tel`, `password`, `createdAt`) VALUES
(1, 'imron', 'basor', 'imron@test.com', '36', '0120120120', '$2b$10$k8YXlvM3cUq1v5BYk78nF.dVygMYSb22cDF3NtFga8gzoxnXC2/EC', '2024-08-29 15:39:06.281'),
(2, 'cus_tes', '1', 'cus1@test', 'a 36 66 58 ', '0650650650', '$2b$10$r5y2zpD0dKOCLFr/fH1iCuFKVWQ5ljVLLifsqonw9h1L8bVQl0g6W', '2024-09-15 14:25:14.948'),
(3, 'cus2', 'cus2', 'cus2@test', NULL, NULL, '$2b$10$fR6n8tBytdaToGhiosiLueTVKjILhHq4VBYt.CSCFwcBdoFGLW/Ru', '2024-09-17 17:49:04.807'),
(4, 'cus3', 'cus3', 'cus3@test', '000', '00', '$2b$10$c.Bvp/mfdgK9Jhf/vX8T3ObfXP.Aicrz104fVfNdTL4VaIIxyqtI.', '2024-09-17 17:49:18.657'),
(6, 'imron', 'basor', 'lulu@cus', NULL, NULL, '$2b$10$v66RGPM2Gv0kInjR2bVv9umqzqPXYmPaX7kCxHWShvVX7VpYjj.xC', '2024-10-01 18:15:34.082'),
(7, 'arr', 'deng', 'ang@cus', 'arr 16/*22', '0120120120', '$2b$10$OMy48og4SEjBUyZY9WiBXOsryVIziyRSagDhiVbZMY4Ht4VqsvYVC', '2024-10-01 18:17:19.226');


INSERT INTO `discount` (`id`, `name`, `discount`, `createdAt`) VALUES
(1, 'new year', 0.5, '2024-08-19 16:22:22.389'),
(2, 'edil fitree', 0.7, '2024-08-19 16:24:38.919');



INSERT INTO `employee` (`id`, `name`, `lastname`, `address`, `email`, `password`, `createdAt`, `roleId`) VALUES
(3, 'dish', 'wash', '11/11', 'dish@test', '$2b$10$JXf7Tjp.BGNdc6FP0DI3beyheLfEitElHdfHwzGEm03GZ1FPwF8LW', '2024-09-08 16:17:06.441', 2),
(4, 'chef', 'chef', '11/29', 'chef@test', '$2b$10$k0PE43.ujKC4nkbrmlOjnutzKZsGYd5dKFUKdhiSmgUR6sAYHnvFK', '2024-09-09 19:04:54.000', 1),
(5, 'test', 'yest', '11/29', 'test@test', '$2b$10$Q1JGQ/RPL8RMWwBw380WPO/zrTK6qFE7lQkc3m4F7/OAXhCBNq6QW', '2024-09-14 05:09:38.616', 7);



INSERT INTO `expense` (`id`, `category`, `amount`, `date`) VALUES
(1, 'wage', 310, '2024-09-22 17:39:37.324'),
(2, 'wage', 150, '2024-09-30 16:50:27.463'),
(3, 'wage', 60, '2024-10-01 17:34:17.086');



INSERT INTO `ingredient` (`id`, `name`, `min_quantity`, `quantity`, `unit`, `createdAt`) VALUES
(1, 'orange', 20, 0, 'ลูก', '2024-10-04 15:41:09.941'),
(2, 'teh', 2.5, 0, 'kilogram(kg)', '2024-10-04 16:27:32.669'),
(4, 'limao', 20, 0, 'ลูก', '2024-10-04 17:09:34.379'),
(5, 'apple', 20, 0, 'ลูก', '2024-10-04 17:10:34.330'),
(6, 'susu', 25, 0, 'kilogram(kg)', '2024-10-04 17:12:03.365');



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


INSERT INTO `menurecipes` (`id`, `menuId`, `ingredientId`, `quantity`, `unit`, `createdAt`) VALUES
(5, 4, 4, 1, 'kilogram(kg)', '2024-10-05 08:25:39.981'),
(6, 4, 2, 0.05, 'kilogram(kg)', '2024-10-05 08:25:39.982');


INSERT INTO `menuset` (`id`, `name`, `totalMenu`, `price`, `createdAt`, `soldQuantity`, `status`) VALUES
(1, 'teh party', 7, 8, '2024-08-30 15:03:09.501', 4, 'Draft'),
(2, '1 orang', 2, 4, '2024-08-30 15:04:57.795', 3, 'Draft'),
(8, 'test set 1', 4, 4, '2024-09-13 17:56:30.175', 2, 'Published');



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


INSERT INTO `order_source` (`id`, `source_name`) VALUES
(1, 'delivery'),
(2, 'dine-in'),
(3, 'takeaway');


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


INSERT INTO `role` (`id`, `name`, `wageperday`, `wagepermonth`) VALUES
(1, 'chef', 60, 1800),
(2, 'Drink maker', 50, 1500),
(3, 'Waiter', 40, 1200),
(4, 'Dish cleaner', 25, 750),
(5, 'owner', 0, 0),
(6, 'test role', 100, 3000),
(7, 'shipper', 30, 900);


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


SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
