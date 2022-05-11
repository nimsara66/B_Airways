const db = require('../db/connect')

class AircraftModel{

    constructor(model_id){
        this.model_id = model_id;
    }

    init(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let data = await this.getAircraftModelDataFromDB(); 
                if(data){
                    this.model_name = data.model_name;
                    this.variant = data.variant;
                    this.max_weight  = data.max_weight ;
                    this.seatData = {
                        economy_seat_capacity : data.economy_seat_capacity,
                        business_seat_capacity : data.business_seat_capacity,
                        platinum_seat_capacity : data.platnum_seat_capacity,
                        economy_seats_per_row  : data.economy_seats_per_row,
                        business_seats_per_row : data.business_seats_per_row,
                        platinum_seats_per_row : data.platinum_seats_per_row,
                        economy_seats_num_rows : data.economy_seat_capacity/data.economy_seats_per_row,
                        business_seats_num_rows : data.business_seat_capacity/data.business_seats_per_row,
                        platinum_seats_num_rows : data.platnum_seat_capacity/data.platinum_seats_per_row,
                        total_num   :   data.economy_seat_capacity+data.business_seat_capacity+data.platinum_seat_capacity
                    }
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

    getAircraftModelDataFromDB(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT * from Aircraft_Model where model_id=? LIMIT 1',
                    [this.model_id]
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

module.exports = AircraftModel;