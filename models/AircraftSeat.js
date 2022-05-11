const db = require('../db/connect')

class AircraftSeat{

    constructor(aircraft_id, seat_id){
        this.aircraft_id = aircraft_id
        this.seat_id = seat_id
    }

    init(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let data = await this.getAircraftSeatClassFromDB(); 
                if(data){
                    this.traveller_class_id = data.traveller_class_id
                    resolve(true)
                }else{resolve(false)}
            }
            try{
                func();
            }catch(err){
                reject(err)
            }
        })
    }

    getAircraftSeatClassFromDB(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT * from Aircraft_Seat where aircraft_id=? and seat_id=? LIMIT 1',
                    [this.aircraft_id, this.seat_id]
                )
                if(rows.length){
                    return resolve(rows[0])
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