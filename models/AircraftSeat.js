
const SeatBooking = require('./SeatBooking')

class AircraftSeat{

    constructor(aircraft_id, seat_id){
        this.aircraft_id = aircraft_id
        this.seat_id = seat_id
    }


    /*
        Create a seat booking for given aircraft_id and seat_id
    */
    async createSeatBooking(schedule_id){
        return SeatBooking.createSeatBooking(schedule_id, this.aircraft_id, this.seat_id)
    }


}

module.exports = AircraftSeat;