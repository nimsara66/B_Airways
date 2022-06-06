const { query } = require('express');
const db = require('../db/connect')

class FlightSchedule{

    constructor(schedule_id){
        this.schedule_id = schedule_id;
    }

    /*
        Returns schedule data for this schedule id.
        Return Values
            Object          Containing all scheduling data
    */
    getScheduleData(schedule_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT schedule_id, ' +
                    'aircraft_id, ' +
                    'departure_date, ' +      
                    'departure_time, ' +     
                    'arrival_date, ' +     
                    'arrival_time, ' +    
                    'origin, ' +
                    'destination ' +  
                    'from Flight_Schedule INNER JOIN Route USING(route_id) WHERE schedule_id=? LIMIT 1',
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
                    `SELECT origin_l.name as origin,destination_l.name as destination, f.departure_date as date,f.departure_time as time FROM flight_schedule as f 
                    left outer join route as r on f.route_id = r.route_id
                    left outer join airport as origin_a on origin_a.airport_id = r.origin
                    left outer join airport as destination_a on destination_a.airport_id = r.destination
                    left outer join location as origin_l on origin_a.location_id = origin_l.location_id
                    left outer join location as destination_l on destination_a.location_id = destination_l.location_id
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
                    left outer join route as r on f.route_id = r.route_id
                    left outer join airport as origin_a on origin_a.airport_id = r.origin
                    left outer join airport as destination_a on destination_a.airport_id = r.destination
                    left outer join location as origin_l on origin_a.location_id = origin_l.location_id
                    left outer join location as destination_l on destination_a.location_id = destination_l.location_id
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
                let bookedSeatsByThisCustomer = []
                if(customer_id){
                    let [rows, _] = await db.query(
                        'SELECT seat_id from Seat_Booking where customer_id=? and schedule_id=?',
                        [customer_id, this.schedule_id]
                    ) 
                    rows.forEach(element => {
                        bookedSeatsByThisCustomer.push(element.seat_id)
                    }); 
                }
                return resolve({availableSeats,occupiedSeats,unavailableSeats,bookedSeatsByThisCustomer});
            } catch(e){return reject(e)}
        })         

    }
  
}

module.exports = FlightSchedule;