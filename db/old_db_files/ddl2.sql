
BEGIN;

create table Seat_Price(
    route_id             varchar(10),
    traveller_class_id      varchar(10),
    price                    numeric(10, 2),
    CONSTRAINT PK_seat PRIMARY KEY (route_id,traveller_class_id),
    foreign key     (route_id)
        references Route(route_id),
    foreign key     (traveller_class_id)
        references Traveller_Class(traveller_class_id)
    
);

INSERT INTO Seat_Price VALUES
(1,1,500),
(1,2,600),
(1,3,700),
(2,1,400),
(2,2,500),
(2,3,600);


COMMIT;