CREATE USER 'b_airways_server'@'localhost' IDENTIFIED BY '123456';
-- GRANT SELECT on B_Airways.* TO 'b_airways_server'@'localhost';
-- GRANT UPDATE, INSERT on B_Airways.Customer TO 'b_airways_server'@'localhost';
-- GRANT UPDATE, INSERT on B_Airways.Registered_Customer TO 'b_airways_server'@'localhost';
-- GRANT UPDATE, INSERT on B_Airways.Seat_Booking TO 'b_airways_server'@'localhost';
-- GRANT UPDATE, INSERT on B_Airways.Guest_Customer TO 'b_airways_server'@'localhost';
-- GRANT UPDATE, INSERT on B_Airways.Flight_Schedule TO 'b_airways_server'@'localhost';
-- GRANT ALL on B_Airways.sessions TO 'b_airways_server'@'localhost';
-- FLUSH PRIVILEGES;

create table Traveller_Class(
    traveller_class_id      int(10) primary key,
    traveller_class_name    varchar(15) not null
);

create table Aircraft_Model(
    model_id                    int(10) primary key,
    model_name                  varchar(10) not null,
    variant                     varchar(10) not null,
    economy_seat_capacity       int(5),
    business_seat_capacity      int(5),
    platinum_seat_capacity       int(5),
    economy_seats_per_row       int(3),
    business_seats_per_row      int(3),
    platinum_seats_per_row      int(3),
    max_weight                  numeric(10, 2)
);

create table Location(
    location_id             int(10) auto_increment primary key,
    parent_location_id      int(10),
    location_name                    varchar(30),
    foreign key     (parent_location_id)
        references Location(location_id)
);

create table Airport(
    airport_id      int(10) auto_increment primary key,
    airport_name    varchar(20) not null,
    location_id     int(10),
    foreign key     (location_id)
        references Location(location_id)
);

create table Route(
    route_id        int(10) auto_increment primary key,
    origin          int(10) not null,
    destination     int(10) not null,
    duration        varchar(10),
    foreign key     (origin)
        references Airport(airport_id),
    foreign key     (destination)
        references Airport(airport_id)
);

create table Aircraft(
    aircraft_id         int(10) primary key,
    model_id            int(10),
    airport_id          int(10),
    aircraft_state      enum('active', 'inactive', 'depricated'),
    foreign key     (model_id)
        references Aircraft_Model(model_id),
    foreign key     (airport_id)
        references Airport(airport_id)
);

create table Aircraft_Seat(
    aircraft_id             int(10),
    seat_id                 int(10),
    traveller_class_id      int(10) not null,
    primary key     (aircraft_id, seat_id),
    foreign key     (traveller_class_id)
        references  Traveller_Class(traveller_class_id)
);

create table Flight_Schedule(
    schedule_id         int(10) auto_increment primary key,
    route_id            int(10) not null,
    aircraft_id         int(10) not null,
    departure_date      date not null,
    departure_time      time not null,
    arrival_date        date not null,
    arrival_time        time not null,
    flight_state        enum('active', 'closed' ,'cancelled') default 'active',
    flight_delay        double default 0,
    foreign key         (route_id)
        references  Route(route_id),
    foreign key         (aircraft_id)
        references  Aircraft(aircraft_id)
);

create table Discount(
    customer_type varchar(20) not null,
    discount_percentage numeric(4, 2),
    primary key (customer_type)
);

create table Customer(
    customer_id     int(10)     auto_increment,
    customer_type   varchar(20),
    primary key     (customer_id),
    foreign key     (customer_type)
        references Discount(customer_type)
);


create table Seat_Booking(
    booking_id          int(10) auto_increment primary key,
    customer_id         int(10),
    schedule_id         int(10) not null,
    seat_id             int(10) not null,
    aircraft_id         int(10) not null,
    state               enum('available', 'occupied', 'unavailable') not null default 'available',
    booking_date        date,
    foreign key         (aircraft_id, seat_id)
        references Aircraft_Seat(aircraft_id, seat_id),
    foreign key         (schedule_id)
        references Flight_Schedule(schedule_id),
    foreign key         (customer_id)
        references Customer(customer_id)
);


create table Registered_Customer (
    customer_id     int(10),
    email           varchar(320),
    password        varchar(100),
    first_name      varchar(100),
    last_name       varchar(100),
    gender          varchar(6),
    contact_number  varchar(15),
    passport_number varchar(10),
    address_line1   varchar(100),
    address_line2   varchar(100),
    country         varchar(60),
    province        varchar(100),
    city            varchar(100),
    birthday        varchar(15),
    joined_at       timestamp(6),
    primary key     (customer_id),
    foreign key     (customer_id)
        references Customer(customer_id)
);


create table Guest_Customer (
    customer_id     int(10),
    email           varchar(320),
    first_name      varchar(100),
    last_name       varchar(100),
    gender          varchar(6),
    contact_number  varchar(15),
    passport_number varchar(10),
    address_line1   varchar(100),
    address_line2   varchar(100),
    birthday        varchar(15),
    primary key     (customer_id),
    foreign key     (customer_id)
        references Customer(customer_id)
);


create table Staff (
    staff_id     int(10)   auto_increment,
    email           varchar(320),
    password        varchar(100),
    category        varchar(100),
    first_name      varchar(100),
    last_name       varchar(100),
    gender          varchar(6),
    contact_number  varchar(15),
    birthday        varchar(15),
    country        varchar(100),
    assigned_airport        varchar(100),
    state           varchar(100) ,       
    primary key     (staff_id)
);


create table Admin(
    admin_id    int(10) auto_increment,
    email       varchar(320),
    password    varchar(100),
    primary key (admin_id)
);

create table Seat_Price(
    route_id             int(10),
    traveller_class_id      int(10),
    price                    numeric(10, 2),
    CONSTRAINT PK_seat PRIMARY KEY (route_id,traveller_class_id),
    foreign key     (route_id)
        references Route(route_id),
    foreign key     (traveller_class_id)
        references Traveller_Class(traveller_class_id)
    
);

/* Constant required to calculate Frequent User discounts */
create table RegUserDisConstants(
    id      varchar(100) primary key,
    value   varchar(100)
);

insert into RegUserDisConstants values
('INTERVAL', '30'),
('GOLD_MARGIN', '5'),
('FREQUENT_MARGIN', '3'),
('GOLD_DISCOUNT', '9'),
('FREQUENT_DISCOUNT', '5');

DROP PROCEDURE IF EXISTS addAircraftSeats;

DELIMITER $$

CREATE PROCEDURE addAircraftSeats(
    -- aircraft_state VARCHAR(10),
    aircraft_id INT(10)
)
BEGIN
	DECLARE model_id INT(10);
    DECLARE economy_seat_capacity INT;
    DECLARE business_seat_capacity INT;
    DECLARE platinum_seat_capacity INT;
    DECLARE seat_count INT Default 1;
    
    -- get modal id
	SELECT Aircraft.model_id 
    INTO model_id
    FROM Aircraft
    WHERE Aircraft.aircraft_id = aircraft_id;    

    -- get seat capacity
    SELECT Aircraft_Model.economy_seat_capacity, Aircraft_Model.business_seat_capacity, Aircraft_Model.platinum_seat_capacity
    INTO economy_seat_capacity, business_seat_capacity, platinum_seat_capacity
    FROM Aircraft_Model
    WHERE Aircraft_Model.model_id = model_id;

    -- TODO: check by aircraft_state
    
    -- Add platinum_seats
    simple_loop: LOOP
     IF seat_count > platinum_seat_capacity THEN
        LEAVE simple_loop;
     END IF;
     -- add to seats
     INSERT INTO Aircraft_Seat VALUES (
        aircraft_id, seat_count, 1
     );
     SET seat_count=seat_count+1;
   END LOOP simple_loop;
   
  simple_loop: LOOP
     IF seat_count > business_seat_capacity+platinum_seat_capacity THEN
        LEAVE simple_loop;
     END IF;
     -- add to seats
     INSERT INTO Aircraft_Seat VALUES (
        aircraft_id, seat_count, 2
     );
     SET seat_count=seat_count+1;
   END LOOP simple_loop;
   
  simple_loop: LOOP
     IF seat_count > economy_seat_capacity+business_seat_capacity+platinum_seat_capacity THEN
        LEAVE simple_loop;
     END IF;
     -- add to seats
	INSERT INTO Aircraft_Seat VALUES (
        aircraft_id, seat_count, 2
     );
     SET seat_count=seat_count+1;
   END LOOP simple_loop;
END$$

DELIMITER ;


DROP TRIGGER IF EXISTS AircraftInsertTrigger;
DELIMITER $$
CREATE TRIGGER AircraftInsertTrigger AFTER INSERT ON Aircraft
	FOR EACH ROW
	BEGIN
		CALL addAircraftSeats(new.aircraft_id);
	END$$
DELIMITER ;




DROP PROCEDURE IF EXISTS AddSeatBooking;
DELIMITER $$
CREATE PROCEDURE AddSeatBooking(in schedule_id_in int)
BEGIN    
    
   DECLARE total_seat_capacity INT; 
   DECLARE aircraft_id_in INT;
   DECLARE seat_no INT DEFAULT 1;
    
   SELECT aircraft_id INTO aircraft_id_in FROM Flight_Schedule WHERE schedule_id=schedule_id_in;
    
   SELECT economy_seat_capacity+business_seat_capacity+platinum_seat_capacity INTO total_seat_capacity
	 FROM Aircraft_Model INNER JOIN Aircraft USING (model_id) WHERE aircraft_id=aircraft_id_in;
	
   WHILE seat_no <= total_seat_capacity DO 
      INSERT INTO Seat_Booking (schedule_id,seat_id,aircraft_id) VALUES (schedule_id_in,seat_no,aircraft_id_in);
	   SET seat_no = seat_no + 1;
	END WHILE;
	
END$$
DELIMITER ;



DROP TRIGGER IF EXISTS ScheduleInsertTrigger;
DELIMITER $$
CREATE TRIGGER ScheduleInsertTrigger AFTER INSERT ON Flight_Schedule
	FOR EACH ROW
	BEGIN
		CALL AddSeatBooking(new.schedule_id);
	END$$
DELIMITER ;

DROP PROCEDURE IF EXISTS insert_route_price;
DELIMITER $$

CREATE PROCEDURE insert_route_price(
    route_id int,
    pat_price numeric,
    bus_price numeric,
    econ_price numeric)
BEGIN
	INSERT INTO Seat_Price VALUES (route_id,1,pat_price);
	INSERT INTO Seat_Price VALUES (route_id,2,bus_price);
	INSERT INTO Seat_Price VALUES (route_id,3,econ_price);

END $$
DELIMITER ;

DROP FUNCTION IF EXISTS get_datetime;
DELIMITER $$

CREATE FUNCTION get_datetime(val_date DATE, val_time TIME)
RETURNS datetime
BEGIN
	DECLARE val_datetime datetime;
  	set val_datetime=concat(val_date,' ',val_time);
    RETURN val_datetime;
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
  	FROM Route WHERE route_id=val_route_id;

  	set val_arrival_datetime = ADDDATE(ADDTIME(val_departure_datetime, route_duration), INTERVAL val_delay MINUTE);
  	RETURN val_arrival_datetime;
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS insert_flight_schedule;
DELIMITER $$

CREATE PROCEDURE insert_flight_schedule(
    val_route_id int(10),
    val_aircraft_id int(10),
    val_departure_date date,
    val_departure_time time,
    val_flight_delay double
	)
BEGIN
	DECLARE val_arrival_date date;
    DECLARE val_arrival_time time;
    DECLARE val_arrival datetime;

    SET val_arrival = get_arrival(
        val_route_id, 
        get_datetime(val_departure_date, val_departure_time), 
		val_flight_delay);

    SET val_arrival_date = CAST(val_arrival AS DATE);
    SET val_arrival_time = CAST(val_arrival AS TIME);

    INSERT INTO Flight_Schedule 
    (route_id, aircraft_id, departure_date, departure_time, arrival_date,arrival_time, flight_delay) 
    VALUES
    (val_route_id, val_aircraft_id, val_departure_date, val_departure_time, val_arrival_date,val_arrival_time, val_flight_delay);
    
END $$
DELIMITER ;

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

INSERT INTO Aircraft VALUES
(1,1,1,'active'),
(2,1,1,'active'),
(3,1,2,'active'),
(4,2,1,'active'),
(5,2,3,'active'),
(6,2,1,'active'),
(7,2,2,'active'),
(8,3,3,'active');


INSERT INTO Discount VALUES
('registered_customer', 5),
('guest_customer', 0);

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
CALL insert_route_price(17,480,280,110);
CALL insert_route_price(18,450,330,97);
CALL insert_route_price(19,1050,820,318);
CALL insert_route_price(20,600,430,134);
CALL insert_route_price(21,820,580,236);
CALL insert_route_price(22,1050,790,320);
CALL insert_route_price(23,420,290,105);
CALL insert_route_price(24,600,430,134);
CALL insert_route_price(25,480,280,110);
CALL insert_route_price(26,500,350,92);
CALL insert_route_price(27,1050,790,320);
CALL insert_route_price(28,450,330,97);
CALL insert_route_price(29,500,350,92);
CALL insert_route_price(30,1050,790,320);
CALL insert_route_price(31,420,290,105);
CALL insert_route_price(32,1050,820,318);
CALL insert_route_price(33,820,580,236);
CALL insert_route_price(34,420,280,87);
CALL insert_route_price(35,450,330,97);
CALL insert_route_price(36,420,280,87);
CALL insert_route_price(37,430,290,90);
CALL insert_route_price(38,512,370,128);
CALL insert_route_price(39,730,520,200);
CALL insert_route_price(40,880,620,300);
CALL insert_route_price(41,730,520,200);
CALL insert_route_price(42,480,300,85);
CALL insert_route_price(43,500,310,90);
CALL insert_route_price(44,680,420,150);
CALL insert_route_price(45,580,320,121);
CALL insert_route_price(46,590,350,140);
CALL insert_route_price(47,480,280,110);
CALL insert_route_price(48,480,320,80);
CALL insert_route_price(49,470,310,130);
CALL insert_route_price(50,480,320,80);
CALL insert_route_price(51,580,300,116);
CALL insert_route_price(52,520,340,148);
CALL insert_route_price(53,510,320,144);
CALL insert_route_price(54,650,420,238);
CALL insert_route_price(55,420,290,105);
CALL insert_route_price(56,610,310,86);
CALL insert_route_price(57,380,200,46);
CALL insert_route_price(58,430,280,100);
CALL insert_route_price(59,620,470,226);
CALL insert_route_price(60,530,340,144);
CALL insert_route_price(61,640,470,180);
CALL insert_route_price(62,660,490,200);
CALL insert_route_price(63,560,430,170);
CALL insert_route_price(64,390,220,83);



CALL insert_flight_schedule(1,1,'2022-07-03','07:00:00', 0);
CALL insert_flight_schedule(53,1,'2022-07-03','21:00:00', 0);
CALL insert_flight_schedule(1,1,'2022-07-04','07:00:00', 0);
CALL insert_flight_schedule(57,1,'2022-07-04','20:00:00', 0);
CALL insert_flight_schedule(10,1,'2022-07-05','09:00:00', 0);
CALL insert_flight_schedule(1,1,'2022-07-06','07:00:00', 0);
CALL insert_flight_schedule(57,1,'2022-07-06','20:00:00', 0);
CALL insert_flight_schedule(10,1,'2022-07-07','09:00:00', 0);
CALL insert_flight_schedule(1,1,'2022-07-08','07:00:00', 0);
CALL insert_flight_schedule(57,1,'2022-07-08','20:00:00', 0);
CALL insert_flight_schedule(1,1,'2022-07-09','09:00:00', 0);

CALL insert_flight_schedule(47,2,'2022-07-03','08:00:00', 0);
CALL insert_flight_schedule(02,2,'2022-07-03','20:00:00', 0);
CALL insert_flight_schedule(47,2,'2022-07-04','07:30:00', 0);
CALL insert_flight_schedule(07,2,'2022-07-04','20:00:00', 0);
CALL insert_flight_schedule(23,2,'2022-07-05','09:30:00', 0);
CALL insert_flight_schedule(50,2,'2022-07-05','21:00:00', 0);
CALL insert_flight_schedule(17,2,'2022-07-02','10:00:00', 0);
CALL insert_flight_schedule(52,2,'2022-07-02','21:00:00', 0);
CALL insert_flight_schedule(47,2,'2022-07-07','10:30:00', 0);
CALL insert_flight_schedule(07,2,'2022-07-07','20:00:00', 0);
CALL insert_flight_schedule(23,2,'2022-07-08','09:30:00', 0);
CALL insert_flight_schedule(50,2,'2022-07-08','21:00:00', 0);
CALL insert_flight_schedule(17,2,'2022-07-09','07:00:00', 0);
CALL insert_flight_schedule(52,2,'2022-07-09','21:00:00', 0);

CALL insert_flight_schedule(02,3,'2022-07-03','03:00:00', 0);
CALL insert_flight_schedule(19,3,'2022-07-03','23:00:00', 0);
CALL insert_flight_schedule(02,3,'2022-07-04','22:30:00', 0);
CALL insert_flight_schedule(19,3,'2022-07-05','20:00:00', 0);
CALL insert_flight_schedule(02,3,'2022-07-06','22:30:00', 0);
CALL insert_flight_schedule(19,3,'2022-07-07','20:00:00', 0);
CALL insert_flight_schedule(02,3,'2022-07-03','22:30:00', 0);
CALL insert_flight_schedule(19,3,'2022-07-09','20:00:00', 0);
CALL insert_flight_schedule(02,3,'2022-07-10','22:30:00', 0);
CALL insert_flight_schedule(19,3,'2022-07-11','20:00:00', 0);

CALL insert_flight_schedule(40,4,'2022-04-03','08:00:00', 0);
CALL insert_flight_schedule(28,4,'2022-04-03','20:00:00', 0);
CALL insert_flight_schedule(40,4,'2022-04-04','04:30:00', 0);
CALL insert_flight_schedule(31,4,'2022-04-04','20:00:00', 0);
CALL insert_flight_schedule(64,4,'2022-04-05','09:30:00', 0);
CALL insert_flight_schedule(15,4,'2022-04-05','21:00:00', 0);
CALL insert_flight_schedule(40,4,'2022-04-06','04:30:00', 0);
CALL insert_flight_schedule(31,4,'2022-04-06','20:00:00', 0);
CALL insert_flight_schedule(64,4,'2022-04-04','09:30:00', 0);
CALL insert_flight_schedule(15,4,'2022-04-04','21:00:00', 0);
CALL insert_flight_schedule(40,4,'2022-04-08','04:30:00', 0);
CALL insert_flight_schedule(31,4,'2022-04-08','20:00:00', 0);
CALL insert_flight_schedule(64,4,'2022-04-09','09:30:00', 0);
CALL insert_flight_schedule(15,4,'2022-04-10','21:00:00', 0);

CALL insert_flight_schedule(34,5,'2022-07-03','07:15:00', 0);
CALL insert_flight_schedule(27,5,'2022-07-03','19:00:00', 0);
CALL insert_flight_schedule(34,5,'2022-07-04','09:00:00', 0);
CALL insert_flight_schedule(31,5,'2022-07-05','03:00:00', 0);
CALL insert_flight_schedule(61,5,'2022-07-06','16:30:00', 0);
CALL insert_flight_schedule(34,5,'2022-07-07','09:00:00', 0);
CALL insert_flight_schedule(31,5,'2022-07-08','03:00:00', 0);
CALL insert_flight_schedule(61,5,'2022-07-09','16:30:00', 0);
CALL insert_flight_schedule(34,5,'2022-07-10','09:00:00', 0);
CALL insert_flight_schedule(31,5,'2022-07-11','03:00:00', 0);
CALL insert_flight_schedule(61,5,'2022-07-12','16:30:00', 0);

CALL insert_flight_schedule(17,6,'2022-07-03','07:10:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-03','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-04','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-04','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-05','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-05','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-06','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-06','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-07','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-07','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-08','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-08','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-09','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-09','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-10','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-10','15:00:00', 0);
CALL insert_flight_schedule(17,6,'2022-07-11','03:30:00', 0);
CALL insert_flight_schedule(57,6,'2022-07-11','15:00:00', 0);

CALL insert_flight_schedule(11,7,'2022-07-03','07:15:00', 0);
CALL insert_flight_schedule(09,7,'2022-07-03','20:00:00', 0);
CALL insert_flight_schedule(11,7,'2022-07-04','07:30:00', 0);
CALL insert_flight_schedule(09,7,'2022-07-04','20:00:00', 0);
CALL insert_flight_schedule(11,7,'2022-07-08','09:30:00', 0);
CALL insert_flight_schedule(09,7,'2022-07-08','21:00:00', 0);
CALL insert_flight_schedule(11,7,'2022-07-12','07:30:00', 0);
CALL insert_flight_schedule(09,7,'2022-07-12','20:00:00', 0);


commit;	


GRANT SELECT on B_Airways.* TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Customer TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Registered_Customer TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Seat_Booking TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Guest_Customer TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Flight_Schedule TO 'b_airways_server'@'localhost';
GRANT ALL on B_Airways.sessions TO 'b_airways_server'@'localhost';
FLUSH PRIVILEGES;