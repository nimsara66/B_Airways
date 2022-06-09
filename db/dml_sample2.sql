START TRANSACTION;

INSERT INTO Traveller_Class VALUES
(1, 'platinum'),
(2, 'business'),
(3, 'economy');

INSERT INTO Aircraft_Model VALUES
(1, 'Boeing', '737', 20, 10, 6, 4, 5, 3, 500),
(2, 'Boeing', '757', 40, 20, 12, 8, 10, 6, 800),
(3, 'Airbus', 'A380', 80, 40, 24, 16, 20, 12, 1600);

insert into Location (location_id, parent_location_id, location_name) VALUES
(1, null,'Indonesia'),
(2, null,'Sri Lanka'),
(3, null,'India'),
(4, null,'Thailand'),
(5, null,'Singapore'),
(6, 1,'Bantern'),
(7, 6,'Tangeran City'),
(8, 1,'Bali'),
(9, 8,'Bdung Regency'),   
(10, 2,'Colombo'),   
(11, 3,'Delhi'),
(12, 11,'New Delhi'),
(13, 3,'Mahastra'),     
(14, 13,'Mumbai'),
(15, 4,'Samut Prakan'),
(16, 15,'Bang Phil District'),
(17, 16, 'Bangkok'),
(18, 17, 'Don Mueang'),
(19, 5, 'Blvd.'),
(20, 3, 'Tamilnadu'),
(21, 20, 'Chennai');


insert into Airport VALUES
(1,'CGK', 7),
(2,'DPS', 9),
(3,'BIA', 10),
(4,'HRI', 10),
(5,'DEL', 12),
(6,'BOM', 14),
(7,'MAA', 21),
(8,'BKK', 16),
(9,'DMK', 18),
(10,'SIN', 19);


insert into Route VALUES
(1,1,2,'2'),
(2,8,4,'3'),
(3,9,6,'2'),
(4,3,7,'4'),
(5,6,10,'1');

INSERT INTO Aircraft VALUES
(1,1,1,'active'),
(2,1,1,'active'),
(3,1,2,'active'),
(4,2,1,'active'),
(5,2,3,'active'),
(6,2,1,'active'),
(7,2,2,'active'),
(8,3,3,'active');

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

INSERT INTO Discount VALUES
('registered_customer', 5),
('guest_customer', 0);

INSERT INTO Customer VALUES
(1, 'registered_customer');


INSERT INTO Seat_Price VALUES
(1,1,500),
(1,2,600),
(1,3,700),
(2,1,400),
(2,2,500),
(2,3,600);


commit;