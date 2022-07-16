/*
    Assumptions
        Customer age in years is determined only considering current year and birth year.
        Next immediate flight means flight that has departure date and time after and closest
            to current date and time 
*/

DROP FUNCTION IF EXISTS GetCustomerType;
DELIMITER $$
CREATE FUNCTION GetCustomerType(customer_id_in int(10))
RETURNS VARCHAR(20)
BEGIN
    DECLARE customer_type_out VARCHAR(20);
    SELECT customer_type INTO customer_type_out FROM Customer WHERE customer_id=customer_id_in;
    RETURN customer_type_out;
END$$
DELIMITER ;



DROP FUNCTION IF EXISTS GetCustomerBirthday;
DELIMITER $$
CREATE FUNCTION GetCustomerBirthday(customer_id_in int(10))
RETURNS VARCHAR(15)
BEGIN
    DECLARE birthday_out VARCHAR(15);
    DECLARE customer_type_out VARCHAR(20);
    SELECT GetCustomerType(customer_id_in) INTO customer_type_out;
    IF customer_type_out LIKE 'guest_customer' THEN
        SELECT birthday INTO birthday_out FROM Guest_Customer WHERE customer_id=customer_id_in;
    ELSEIF customer_type_out LIKE 'registered_customer' THEN
        SELECT birthday INTO birthday_out FROM Registered_Customer WHERE customer_id=customer_id_in;
    END IF;
    RETURN birthday_out;
END$$
DELIMITER ;


DROP FUNCTION IF EXISTS GetCustomerAge;
DELIMITER $$
CREATE FUNCTION GetCustomerAge(customer_id_in int(10))
RETURNS INT
BEGIN
    DECLARE customer_birthday_out VARCHAR(15);
    DECLARE age_in_years INT;
    DECLARE birth_year INT;
    DECLARE current_year INT;
    SELECT GetCustomerBirthday(customer_id_in) INTO customer_birthday_out;
    SELECT YEAR(customer_birthday_out) INTO birth_year;
    SELECT YEAR(CURDATE()) INTO current_year;
    RETURN current_year-birth_year;
END$$
DELIMITER ;

DROP FUNCTION IF EXISTS GetCountGreater18;
DELIMITER $$
CREATE FUNCTION GetCountGreater18(aircraft_id_in int(10))
RETURNS DOUBLE
BEGIN
    DECLARE passenger_count_out DOUBLE;
    SELECT count(*) INTO passenger_count_out FROM Seat_Booking WHERE schedule_id=
(SELECT schedule_id FROM Flight_Schedule WHERE aircraft_id=aircraft_id_in AND departure_date>CURDATE() OR departure_date=CURDATE() AND departure_time>=CURRENT_TIME() 
    ORDER BY departure_date, departure_time LIMIT 1) AND state='occupied'
    AND GetCustomerAge(customer_id)>18;
    RETURN passenger_count_out;
END$$
DELIMITER ;

DROP FUNCTION IF EXISTS GetCountBelow18;
DELIMITER $$
CREATE FUNCTION GetCountBelow18(aircraft_id_in int(10))
RETURNS DOUBLE
BEGIN
    DECLARE passenger_count_out DOUBLE;
    SELECT count(*) INTO passenger_count_out FROM Seat_Booking WHERE schedule_id=
(SELECT schedule_id FROM Flight_Schedule WHERE aircraft_id=aircraft_id_in AND departure_date>CURDATE() OR departure_date=CURDATE() AND departure_time>=CURRENT_TIME() ORDER
    BY departure_date, departure_time LIMIT 1) AND state='occupied'
    AND GetCustomerAge(customer_id)<18;
    RETURN passenger_count_out;
END$$
DELIMITER ;




SELECT GetCountGreater18(1);
SELECT GetCountBelow18(1);

/*   Testing  */
CALL insert_flight_schedule(1,1,'2022-07-17','12:00:00', 0);

CALL SeatBook(87,1,3,@isBookingSuccess);
CALL SeatBook(87,2,4,@isBookingSuccess);
CALL SeatBook(87,3,5,@isBookingSuccess);
CALL SeatBook(87,4,6,@isBookingSuccess);
CALL SeatBook(87,5,7,@isBookingSuccess);

CALL SeatBook(87,6,8,@isBookingSuccess);
CALL SeatBook(87,7,9,@isBookingSuccess);
CALL SeatBook(87,8,10,@isBookingSuccess);
CALL SeatBook(87,9,11,@isBookingSuccess);
CALL SeatBook(87,10,12,@isBookingSuccess);
CALL SeatBook(87,11,13,@isBookingSuccess);
CALL SeatBook(87,12,14,@isBookingSuccess);
CALL SeatBook(87,13,15,@isBookingSuccess);
CALL SeatBook(87,14,16,@isBookingSuccess);
CALL SeatBook(87,15,7,@isBookingSuccess);

