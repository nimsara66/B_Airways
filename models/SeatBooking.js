const res = require('express/lib/response');
const db = require('../db/connect')

class SeatBooking{

    constructor(booking_id){
        this.booking_id = booking_id;
    }


    /*
        Books this seat booking for given customer_id if it is available. If not booking falis.
        Return Value
            If booking success,     1   int
            Otherwise               0   int
            If fails                -1  int
    */
    static book(schedule_id, seat_id, customer_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, __] = await db.query(
                    'CALL SeatBook(?,?,?,@isBookingSuccess)',
                    [schedule_id, seat_id, customer_id]
                );
                let [bookingSuccess, _ ] = await db.query('SELECT @isBookingSuccess');
                return resolve(bookingSuccess[0]['@isBookingSuccess']);
            } catch(e){return reject(e)}            
        })
    }
    

    /*
        Returns booking id for given schedue_id and seat_id.
        If there is not such id retuns false.
        Return Values
            booking_id      int
    */
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



}

module.exports = SeatBooking;