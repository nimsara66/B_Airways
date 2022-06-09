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
    DECLARE seat_count INT Default 0;
    
    -- get modal id
	SELECT aircraft.model_id 
    INTO model_id
    FROM aircraft
    WHERE aircraft.aircraft_id = aircraft_id;    

    -- get seat capacity
    SELECT aircraft_model.economy_seat_capacity, aircraft_model.business_seat_capacity, aircraft_model.platinum_seat_capacity
    INTO economy_seat_capacity, business_seat_capacity, platinum_seat_capacity
    FROM aircraft_model
    WHERE aircraft_model.model_id = model_id;

    -- TODO: check by aircraft_state
    
    -- Add platinum_seats
    simple_loop: LOOP
     IF seat_count >= platinum_seat_capacity THEN
        LEAVE simple_loop;
     END IF;
     -- add to seats
     INSERT INTO aircraft_seat VALUES (
        aircraft_id, seat_count, 1
     );
     SET seat_count=seat_count+1;
   END LOOP simple_loop;
   
  simple_loop: LOOP
     IF seat_count >= business_seat_capacity+platinum_seat_capacity THEN
        LEAVE simple_loop;
     END IF;
     -- add to seats
     INSERT INTO aircraft_seat VALUES (
        aircraft_id, seat_count, 2
     );
     SET seat_count=seat_count+1;
   END LOOP simple_loop;
   
  simple_loop: LOOP
     IF seat_count >= economy_seat_capacity+business_seat_capacity+platinum_seat_capacity THEN
        LEAVE simple_loop;
     END IF;
     -- add to seats
	INSERT INTO aircraft_seat VALUES (
        aircraft_id, seat_count, 2
     );
     SET seat_count=seat_count+1;
   END LOOP simple_loop;
END$$

DELIMITER ;