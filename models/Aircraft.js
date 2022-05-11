const db = require('../db/connect')

class Aircraft{

    constructor(aircraft_id){
        this.aircraft_id = aircraft_id;
    }

    init(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let data = await this.getAircraftDataFromDB(); 
                if(data){
                    this.model_id = data.model_id
                    this.airport_id = data.airport_id
                    data.aircraft_state = data.aircraft_state
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

    getAircraftDataFromDB(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT * from Aircraft where aircraft_id=? LIMIT 1',
                    [this.aircraft_id]
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


    getUnavailableSeats(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT seat_id from Seat_Booking where state=?',
                    ['unavailable']
                )
               resolve(rows)
            }
            try{
                func();
            } catch(e){return reject(e)}
        })         
    }


    getOccupiedSeats(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT seat_id from Seat_Booking where state=?',
                    ['occupied']
                )
                resolve(rows)
            }
            try{
                func();
            } catch(e){return reject(e)}
        })         
    }


    getUnavailableAndOccupiedSeats(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let seats = []
                let occupied_seats = await this.getOccupiedSeats()
                console.log(occupied_seats)
                occupied_seats.forEach(element => {
                    seats.push(element.seat_id)
                });
                let unavailable_seats = await this.getUnavailableSeats()
                unavailable_seats.forEach(element => {
                    seats.push(element.seat_id)
                });
                resolve(seats)
            }
            try{
                func();
            } catch(e){return reject(e)}
        })         
    }


}

module.exports = Aircraft;