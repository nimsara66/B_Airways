const res = require('express/lib/response');
const db = require('../db/connect')

class SeatBooking{

    constructor(booking_id){
        this.booking_id = booking_id;
    }

    //TODO Transactions and condition xhecking
    book(customer_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'UPDATE Seat_Booking SET customer_id=?, booking_date=?, state=? WHERE booking_id=? and state=?',
                    [customer_id, new Date().toISOString(), "occupied", this.booking_id, "available"]
                )
                if(rows.affectedRows){
                    resolve(true)
                }else{
                    resolve(false)
                }
            } catch(e){return reject(e)}            
        })
    }
    
    static findBookingIdfromScheduleIdAndSeatId(schedule_id, seat_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'SELECT booking_id from Seat_Booking where schedule_id=? and seat_id=? LIMIT 1',
                    [schedule_id, seat_id]
                )
                if(rows.length){
                    return resolve(rows[0].booking_id)
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })        
    }
    

    static findSeatIdsForCustomerIdAndScheduleId(customer_id, schedule_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'SELECT seat_id from Seat_Booking where schedule_id=? and customer_id=?',
                    [schedule_id, customer_id]
                )
                let bookedSeats = []
                rows.forEach(row => {
                    bookedSeats.push(row.seat_id)
                });
                resolve(bookedSeats)
            } catch(e){return reject(e)}
        })          
    }



}

module.exports = SeatBooking;