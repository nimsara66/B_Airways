
const { promiseImpl } = require('ejs');
const db = require('../db/connect')
const Aircraft = require('./Aircraft')

class FlightSchedule{

    constructor(schedule_id){
        this.schedule_id = schedule_id;
    }

    /*
        Returns schedule data for this schedule id.
        Return Values
            Object          Containing all scheduling data
    */
    getScheduleData(){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT schedule_id, ' +
                    'aircraft_id, ' +
                    'departure_date, ' +      
                    'departure_time, ' +     
                    'arrival_date, ' +     
                    'arrival_time, ' +    
                    'originAirport.airport_name as origin, ' +
                    'destinationAirport.airport_name as destination ' +  
                    'from Flight_Schedule INNER JOIN Route USING(route_id) ' +
                    'INNER JOIN Airport as originAirport on originAirport.airport_id=Route.origin ' + 
                    'INNER JOIN Airport as destinationAirport on destinationAirport.airport_id =Route.destination ' + 
                    'WHERE schedule_id=? LIMIT 1',
                    [this.schedule_id]
                )
                if(rows.length){
                    return resolve(rows[0])
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })        
    }


    static getFullSchedule(){
        // today_date = Date.now();
        // query_string = "select * from Flight_Schedule where departure_date > "+String(today_date);
        // fullSchedule = db.query(query_string);
        // return fullSchedule;
        return new Promise(async (resolve, reject)=>{
            try{
                const today_date = Date.now();
                let [rows, cols] = await db.query(
                    `SELECT f.schedule_id, origin_l.location_name as origin,destination_l.location_name as destination, f.departure_date as date,f.departure_time as time FROM Flight_Schedule as f 
                    left outer join Route as r on f.Route_id = r.Route_id
                    left outer join Airport as origin_a on origin_a.airport_id = r.origin
                    left outer join Airport as destination_a on destination_a.airport_id = r.destination
                    left outer join Location as origin_l on origin_a.location_id = origin_l.location_id
                    left outer join Location as destination_l on destination_a.location_id = destination_l.location_id
                    WHERE f.departure_date>=?`,
                    // [today_date]
                    ['2022-05-10']
                
                )
                if(rows.length){
                    return resolve(rows)
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })       
    }

    static searchFlight(destination){
        return new Promise(async (resolve, reject)=>{
            try{
                const today_date = Date.now();
                let [rows, cols] = await db.query(
                    `SELECT origin_l.location_id as origin,destination_l.location_id as destination, f.departure_date as date,f.departure_time as time FROM flight_schedule as f 
                    left outer join Route as r on f.Route_id = r.Route_id
                    left outer join Airport as origin_a on origin_a.airport_id = r.origin
                    left outer join Airport as destination_a on destination_a.airport_id = r.destination
                    left outer join Location as origin_l on origin_a.location_id = origin_l.location_id
                    left outer join Location as destination_l on destination_a.location_id = destination_l.location_id
                    WHERE f.departure_date>=? and ()`,
                    [today_date,]
                    // ['2022-05-10']
                
                )
                if(rows.length){
                    return resolve(rows)
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })       
    }


    /*
        Returns Seats for seat booking for given state and this schedule_id.
        Return Values
            seats       Array          Containing seats for seat bookings in given state
    */
    getSeatBookingHelper(state){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT seat_id from Seat_Booking where state=? and schedule_id=?',
                    [state, this.schedule_id]
                )
                let seats = []
                rows.forEach(element => {
                    seats.push(element.seat_id)
                });
                return resolve(seats)
            } catch(e){return reject(e)}    
        })
    }


    /*
        Returns Seats grouped considering seat booking state for this schedule_id.
        Return Values
            Object         Containing separate arrays for each state
    */
    getSeatBookingData(customer_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let availableSeats = await this.getSeatBookingHelper('available');
                let occupiedSeats = await this.getSeatBookingHelper('occupied');
                let unavailableSeats = await this.getSeatBookingHelper('unavailable');
                let bookedSeatByThisCustomer = 0;
                console.log(customer_id)
                if(customer_id){
                    let [rows, _] = await db.query(
                        'SELECT seat_id from Seat_Booking where customer_id=? and schedule_id=? LIMIT 1',
                        [customer_id, this.schedule_id]
                    ) 
                    console.log(rows)
                    if(rows.length>0)   bookedSeatByThisCustomer = rows[0].seat_id
                    else    bookedSeatByThisCustomer = 0
                }
                return resolve({availableSeats,occupiedSeats,unavailableSeats,bookedSeatByThisCustomer});
            } catch(e){return reject(e)}
        })         

    }


    static create(schedule_data) {
        if(schedule_data){
            console.log(schedule_data)
            return db.query(
                'INSERT INTO Flight_Schedule (route_id, aircraft_id,departure_date,departure_time,arrival_date,arrival_time) VALUES(?,?,?,?,?,?)',
                [
                    schedule_data.route_id,
                    schedule_data.aircraft_id,
                    schedule_data.departure_date,
                    schedule_data.departure_time,
                    schedule_data.arrival_date,
                    schedule_data.arrival_time
                ]
            )
        }else{
            return false
        }
    }

  
}

module.exports = FlightSchedule;