const db = require('../db/connect')

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

    static getAircraftModelIdUsingAircraftId(aircraft_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'SELECT model_id from Aircraft where aircraft_id=? LIMIT 1',
                    [aircraft_id]
                )
                if(rows.length){
                    return resolve(rows[0].model_id)
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })        
    }


    static getUnavailableSeatsForAircraft(aircraft_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'SELECT seat_id from Seat_Booking where state=? and aircraft_id=?',
                    ['unavailable', aircraft_id]
                )
                let seats = []
                rows.forEach(element => {
                    seats.push(element.seat_id)
                });
                resolve(seats)
            } catch(e){return reject(e)}
        })         
    }


    static getOccupiedSeatsForAircraft(aircraft_id){  
        return new Promise(async (resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT seat_id from Seat_Booking where state=? and aircraft_id=?',
                    ['occupied', aircraft_id]
                )
                let seats = []
                rows.forEach(element => {
                    seats.push(element.seat_id)
                });
                resolve(seats)
            }
            try{
                func();
            } catch(e){return reject(e)}
        })         
    }


    static getUnavailableAndOccupiedSeatsForAircraft(aircraft_id){
        return new Promise(async (resolve, reject)=>{
            try{               
               let occupied_seats = await Aircraft.getOccupiedSeatsForAircraft(aircraft_id)
                let unavailable_seats = await Aircraft.getUnavailableSeatsForAircraft(aircraft_id)
                resolve(occupied_seats.concat(unavailable_seats))
            } catch(e){return reject(e)}
        })         
    }


}

module.exports = Aircraft;