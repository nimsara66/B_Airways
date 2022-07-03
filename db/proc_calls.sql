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




DROP PROCEDURE IF EXISTS CreateSeatBooking;
DELIMITER $$
CREATE PROCEDURE CreateSeatBooking(in schedule_id_in int)
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
		CALL CreateSeatBooking(new.schedule_id);
	END$$
DELIMITER ;




	