DROP PROCEDURE IF EXISTS getPassengerReport;

DELIMITER $$

CREATE PROCEDURE getPassengerReport(
    start_date DATE,
    end_date DATE
)

BEGIN
	-- get passenger count to a destination
    SELECT Location.location_name, COUNT(booking_id) as passenger_count
    FROM Flight_Schedule
    INNER JOIN Seat_Booking
    ON Flight_Schedule.schedule_id=Seat_Booking.schedule_id
    INNER JOIN Route
    USING (route_id)
    INNER JOIN Location
    ON Location.location_id=Route.destination
    WHERE departure_date BETWEEN start_date AND end_date AND Seat_Booking.state='occupied'
    GROUP BY Location.location_name;

END$$
DELIMITER ;