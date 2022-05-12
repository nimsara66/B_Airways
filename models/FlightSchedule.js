const db = require('../db/connect')

class FlightSchedule{

    constructor(schedule_id){
        this.schedule_id = schedule_id;
    }

    static getScheduleDataUsingScheduleId(schedule_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'SELECT * from Flight_Schedule where schedule_id=? LIMIT 1',
                    [schedule_id]
                )
                if(rows.length){
                    return resolve(rows[0])
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })        
    }

  
}

module.exports = FlightSchedule;