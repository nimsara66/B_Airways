const db = require('../db/connect')

class FlightSchedule{

    constructor(schedule_id){
        this.schedule_id = schedule_id;
    }

    init(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let data = await this.getScheduleDataFromDB(); 
                if(data){
                    this.route_id = data.route_id;
                    this.aircraft_id = data.aircraft_id;
                    this.departure_date = data.departure_date;
                    this.departure_time = data.departure_time;
                    this.arrival_date = data.arrival_date;
                    this.arrival_time = data.arrival_time;
                    this.flight_state = data.flight_state;
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

    getScheduleDataFromDB(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT * from Flight_Schedule where schedule_id=? LIMIT 1',
                    [this.schedule_id]
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

    findAircraftId(){
        return new Promise((resolve, reject)=>{
            let aircraft_id;
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT aircraft_id from Flight_Schedule where schedule_id=? LIMIT 1',
                    [this.schedule_id]
                )
                if(rows.length){
                    return resolve(rows[0].aircraft_id)
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

module.exports = FlightSchedule;