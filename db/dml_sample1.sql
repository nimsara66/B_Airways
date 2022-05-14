begin;

INSERT INTO Traveller_Class VALUES
(1, 'platinum'),
(2, 'business'),
(3, 'economy');

INSERT INTO Aircraft_Model VALUES
(1, 'Model-1', 'Variant-3', 20, 10, 6, 4, 5, 3, 500),
(2, 'Model-2', 'Variant-2', 40, 20, 12, 8, 10, 6, 800),
(3, 'Model-3', 'Variant-1', 80, 40, 24, 16, 20, 12, 1600);

INSERT INTO Location VALUES
(1, NULL),
(2, 1),
(3, 2),
(4, NULL),
(5, 4);

INSERT INTO Airport VALUES
(1, 3),
(2, 3),
(3, 5),
(4, 5);

INSERT INTO Route VALUES
(1, 3, 4, '10 hours'),
(2, 4, 3, '5 hours');

INSERT INTO Aircraft VALUES
(1, 1, 1, 'inactive'),
(2, 2, 2, 'inactive'),
(3, 3, 3, 'inactive'),
(4, 2, 4, 'inactive'),
(5, 1, 1, 'inactive');

INSERT INTO Aircraft_Seat VALUES
(1, 1, 3),
(1, 2, 3),
(1, 3, 3),
(1, 4, 3),
(1, 5, 3),
(1, 6, 3),
(1, 7, 3),
(1, 8, 3),
(1, 9, 3),
(1, 10, 3),
(1, 11, 3),
(1, 12, 3),
(1, 13, 3),
(1, 14, 3),
(1, 15, 3),
(1, 16, 3),
(1, 17, 3),
(1, 18, 3),
(1, 19, 3),
(1, 20, 3),
(1, 21, 2),
(1, 22, 2),
(1, 23, 2),
(1, 24, 2),
(1, 25, 2),
(1, 26, 2),
(1, 27, 2),
(1, 28, 2),
(1, 29, 2),
(1, 30, 2),
(1, 31, 1),
(1, 32, 1),
(1, 33, 1),
(1, 34, 1),
(1, 35, 1),
(1, 36, 1);

INSERT INTO Flight_Schedule VALUES
(1,1,1,'2022-05-09', '08:00:00', '2022-05-10', '07:00:00', 'active'),
(2,1,2,'2022-05-10', '07:00:00', '2022-05-11', '08:00:00', 'active'),
(3,1,3,'2022-05-11', '09:00:00', '2022-05-12', '10:00:00', 'active');

INSERT INTO Discount VALUES
('registered-customer', 5);

INSERT INTO Customer VALUES
(1, 'registered-customer');

INSERT INTO Seat_Booking VALUES
(1,null,1,1,1,'available',null),
(2,null,1,2,1,'available',null),
(3,null,1,3,1,'available',null),
(4,null,1,4,1,'available',null),
(5,null,1,5,1,'available',null),
(6,null,1,6,1,'available',null),
(7,null,1,7,1,'available',null),
(8,null,1,8,1,'available',null),
(9,null,1,9,1,'available',null),
(10,null,1,10,1,'available',null),
(11,null,1,11,1,'available',null),
(12,null,1,12,1,'available',null),
(13,null,1,13,1,'available',null),
(14,null,1,14,1,'available',null),
(15,null,1,15,1,'available',null),
(16,null,1,16,1,'available',null),
(17,null,1,17,1,'available',null),
(18,null,1,18,1,'available',null),
(19,null,1,19,1,'available',null),
(20,null,1,20,1,'available',null),
(21,null,1,21,1,'available',null),
(22,null,1,22,1,'available',null),
(23,null,1,23,1,'available',null),
(24,null,1,24,1,'available',null),
(25,null,1,25,1,'available',null),
(26,null,1,26,1,'available',null),
(27,null,1,27,1,'available',null),
(28,null,1,28,1,'available',null),
(29,null,1,29,1,'available',null),
(30,null,1,30,1,'available',null),
(31,null,1,31,1,'available',null),
(32,null,1,32,1,'available',null),
(33,null,1,33,1,'available',null),
(34,null,1,34,1,'available',null),
(35,null,1,35,1,'available',null),
(36,null,1,36,1,'available',null);


commit;