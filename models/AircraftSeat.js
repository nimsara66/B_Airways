const db = require('../db/connect')

class AircraftSeat{

    constructor(aircraft_id, seat_id){
        this.aircraft_id = aircraft_id
        this.seat_id = seat_id
    }

}

module.exports = AircraftSeat;