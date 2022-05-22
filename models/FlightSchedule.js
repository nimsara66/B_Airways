const { query } = require('express');
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

    static getFullSchedule(){
        // today_date = Date.now();
        // query_string = "select * from Flight_Schedule where departure_date > "+String(today_date);
        // fullSchedule = db.query(query_string);
        // return fullSchedule;
        return new Promise(async (resolve, reject)=>{
            try{
                const today_date = Date.now();
                let [rows, cols] = await db.query(
                    `SELECT origin_l.name as origin,destination_l.name as destination, f.departure_date as date,f.departure_time as time FROM flight_schedule as f 
                    left outer join route as r on f.route_id = r.route_id
                    left outer join airport as origin_a on origin_a.airport_id = r.origin
                    left outer join airport as destination_a on destination_a.airport_id = r.destination
                    left outer join location as origin_l on origin_a.location_id = origin_l.location_id
                    left outer join location as destination_l on destination_a.location_id = destination_l.location_id
                    WHERE f.departure_date>=?`,
                    // [today_date]
                    ['2022-05-10']
                
                )
                if(rows.length){
                    return resolve(rows)
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })       
    }

    static searchFlight(destination){
        return new Promise(async (resolve, reject)=>{
            try{
                const today_date = Date.now();
                let [rows, cols] = await db.query(
                    `SELECT origin_l.location_id as origin,destination_l.location_id as destination, f.departure_date as date,f.departure_time as time FROM flight_schedule as f 
                    left outer join route as r on f.route_id = r.route_id
                    left outer join airport as origin_a on origin_a.airport_id = r.origin
                    left outer join airport as destination_a on destination_a.airport_id = r.destination
                    left outer join location as origin_l on origin_a.location_id = origin_l.location_id
                    left outer join location as destination_l on destination_a.location_id = destination_l.location_id
                    WHERE f.departure_date>=? and ()`,
                    [today_date,]
                    // ['2022-05-10']
                
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

module.exports = FlightSchedule;