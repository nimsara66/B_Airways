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
    state               enum('available', 'occupied', 'unavailable') not null,
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

