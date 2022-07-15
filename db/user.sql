CREATE USER 'b_airways_server'@'localhost' IDENTIFIED BY '123456';
GRANT SELECT on B_Airways.* TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Customer TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Registered_Customer TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Seat_Booking TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Guest_Customer TO 'b_airways_server'@'localhost';
GRANT UPDATE, INSERT on B_Airways.Flight_Schedule TO 'b_airways_server'@'localhost';
GRANT ALL on B_Airways.sessions TO 'b_airways_server'@'localhost';
FLUSH PRIVILEGES;