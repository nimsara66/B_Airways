const db = require('../db/connect')
const AircraftSeat = require('./AircraftSeat') 
/*
    NOTES
        When adding Seat ids follow below pattern.
            Platinum seats      1,2,3,.......,p
            Business seats      p+1, p+2, p+3, ............, b
            Economy seats       b+1, b+2, b+3, .............., e
            ( p = number of platinum seats, b=number of busniness seats, e=number of economy seats)
*/

class Aircraft{

    constructor(aircraft_id){
        this.aircraft_id = aircraft_id;
    }

    /*
        Returns aircraft seat formation data of this arcraft.
        Return Values
            seatData        Object          All data about seats (Not including booking data)
    */
    getAircraftSeatData(){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT '+ 
                    'economy_seat_capacity,' + 
                    'business_seat_capacity,' + 
                    'platinum_seat_capacity,' + 
                    'economy_seat_capacity+business_seat_capacity+platinum_seat_capacity AS total_seat_capacity, '+
                    'economy_seats_per_row,' + 
                    'business_seats_per_row,' + 
                    'platinum_seats_per_row, ' +  
                    'economy_seat_capacity/economy_seats_per_row AS economy_seats_num_rows, '  +   
                    'business_seat_capacity/business_seats_per_row AS business_seats_num_rows, '  + 
                    'platinum_seat_capacity/platinum_seats_per_row AS platinum_seats_num_rows, '  +  
                    'economy_seat_capacity+business_seat_capacity+platinum_seat_capacity AS total_num ' +              
                    'from Aircraft INNER JOIN Aircraft_Model USING(model_id) WHERE aircraft_id=? LIMIT 1',
                    [this.aircraft_id]
                )
                if(rows.length>0){
                    return resolve(rows[0])
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })         
    }


    /*
        Returns all aircrafts.
        Return Values
            Object          Containing all aircraft data
    */
    static getAllAircrafts(){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT * from Aircraft left outer join Aircraft_Model using (model_id)'
                )
                if(rows.length){
                    return resolve(rows)
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })        
    }


}

module.exports = Aircraft;