DROP PROCEDURE IF EXISTS getPastFlightDetailReport;
DELIMITER $$
CREATE PROCEDURE getPastFlightDetailReport(
    origin_in int(10),
    destination_in int(10)
    )
BEGIN    
   DECLARE total_seat_capacity INT; 

   SELECT Flight_Schedule.schedule_id , flight_state, COUNT(Seat_Booking.customer_id) as Passenger_Count 
   FROM Flight_Schedule LEFT JOIN Seat_Booking USING(schedule_id) 
   WHERE Flight_Schedule.route_id=
   (
    SELECT route_id FROM ROUTE WHERE origin=origin_in AND destination=destination_in
    ) 
    AND (get_datetime(Flight_Schedule.departure_date, Flight_Schedule.departure_time)< CURDATE()) 
   GROUP BY(Flight_Schedule.schedule_id);
END$$
DELIMITER ;