const db = require('../db/connect')

class AircraftSeat{

    constructor(aircraft_id, seat_id){
        this.aircraft_id = aircraft_id
        this.seat_id = seat_id
    }

    getAircraftSeatClassFromDB(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT traveller_class_id from Aircraft_Seat where aircraft_id=? and seat_id=? LIMIT 1',
                    [this.aircraft_id, this.seat_id]
                )
                if(rows.length){
                    return resolve(rows[0].traveller_class_id)
                }else{
                    return resolve(false)
                }
            }
            try{
                func();
            } catch(e){return reject(e)}
        })        
    }

}

module.exports = AircraftSeat;