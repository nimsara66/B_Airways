INSERT INTO Route VALUES
(1,3, 8, '03:20'),
(2,3, 1, '04:45'),
(3,3, 2, '07:15'),
(4,3, 5, '03:05'),
(5,3, 6, '02:25'),
(6,3, 7, '01:15'),
(7,3, 9, '03:50'),
(8,3, 10, '03:50'),
(9,4, 10, '03:40'),
(10,10, 3, '03:40'),
(11,10, 4, '03:30'),
(12,10, 1, '01:40'),
(13,10, 2, '02:20'),
(14,10, 5, '05:40'),
(15,10, 6, '05:05'),
(16,10, 7, '03:55'),
(17,10, 8, '02:15'),
(18,10, 9, '02:20'),
(19,1, 3, '04:35'),
(20,1, 5, '08:50'),
(21,1, 6, '08:10'),
(22,1, 7, '07:05'),
(23,1, 8, '03:15'),
(24,1, 9, '03:40'),
(25,1, 10, '01:40'),
(26,2, 3, '07:50'),
(27,2, 5, '09:55'),
(28,2, 6, '09:00'),
(29,2, 7, '08:40'),
(30,2, 8, '04:10'),
(31,2, 9, '04:15'),
(32,2, 10, '02:25'),
(33,5, 1, '08:20'),
(34,5, 2, '08:20'),
(35,5, 3, '03:25'),
(36,5, 8, '03:45'),
(37,5, 9, '03:45'),
(38,5, 10, '05:30'),
(39,6, 1, '06:15'),
(40,6, 2, '09:00'),
(41,6, 3, '02:25'),
(42,6, 8, '04:05'),
(43,6, 9, '04:00'),
(44,6, 10, '05:14'),
(45,7, 1, '05:00'),
(46,7, 2, '06:30'),
(47,7, 3, '01:15'),
(48,7, 8, '03:20'),
(49,7, 9, '03:30'),
(50,7, 10, '04:10'),
(51,8, 1, '03:20'),
(52,8, 2, '04:10'),
(53,8, 3, '03:25'),
(54,8, 5, '04:10'),
(55,8, 6, '04:50'),
(56,8, 7, '03:20'),
(57,8, 10, '02:15'),
(58,9, 1, '03:20'),
(59,9, 2, '04:10'),
(60,9, 3, '03:20'),
(61,9, 5, '04:00'),
(62,9, 6, '04:00'),
(63,9, 7, '03:25'),
(64,9, 10, '02:20');

DROP FUNCTION IF EXISTS get_datetime;
DELIMITER $$

CREATE FUNCTION get_datetime(val_date DATE, val_time TIME)
RETURNS datetime
BEGIN
	DECLARE val_datetime datetime;
  	set val_datetime=concat(val_date,' ',val_time);
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS get_arrival;
DELIMITER $$

CREATE FUNCTION get_arrival(
    val_route_id int(10),
    val_departure_datetime datetime,
    val_delay double
    )
RETURNS datetime
BEGIN
    DECLARE route_duration varchar(10);
    DECLARE val_arrival_datetime datetime;
    
  	SELECT duration INTO route_duration
  	FROM route WHERE route_id=val_route_id;

  	set val_arrival_datetime = ADDDATE(ADDTIME(val_departure_datetime, route_duration), INTERVAL val_delay MINUTE);
  	RETURN val_arrival_datetime;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS insert_route_price;
DELIMITER $$

CREATE PROCEDURE insert_route_price(
    route_id int,
    pat_price numeric,
    bus_price numeric,
    econ_price numeric)
BEGIN
	INSERT INTO seat_price VALUES (route_id,1,pat_price);
	INSERT INTO seat_price VALUES (route_id,2,bus_price);
	INSERT INTO seat_price VALUES (route_id,3,econ_price);

END $$
DELIMITER ;

CALL insert_route_price(1, 800, 500, 300);
CALL insert_route_price(2,610,510,147);
CALL insert_route_price(3, 750,670,166);
CALL insert_route_price(4,620,410,180);
CALL insert_route_price(5,730,520,200);
CALL insert_route_price(6,512,370,128);
CALL insert_route_price(7,430,290,90);
CALL insert_route_price(8,680,420,150);
CALL insert_route_price(9,1000, 500, 300);
CALL insert_route_price(10,660,490,200);
CALL insert_route_price(11,560,430,170);
CALL insert_route_price(12,390,220,83);
CALL insert_route_price(13,660,490,200);
CALL insert_route_price(14,420,290,105);
CALL insert_route_price(15,580,300,116);
CALL insert_route_price(16,560,430,170);
