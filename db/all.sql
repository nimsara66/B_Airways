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