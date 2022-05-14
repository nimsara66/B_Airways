const db = require('../db/connect')

class AircraftModel{

    constructor(model_id){
        this.model_id = model_id;
    }

    static getSeatDataUsingModelId(model_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'SELECT ' +  
                    'economy_seat_capacity,' + 
                    'business_seat_capacity,' + 
                    'platnum_seat_capacity,' + 
                    'economy_seats_per_row,' + 
                    'business_seats_per_row,' + 
                    'platinum_seats_per_row ' +                     
                    'from Aircraft_Model where model_id=? LIMIT 1',
                    [model_id]
                )
                if(rows.length){
                    let seatData = {
                        economy_seat_capacity   : rows[0].economy_seat_capacity,
                        business_seat_capacity  : rows[0].business_seat_capacity,
                        platinum_seat_capacity  : rows[0].platnum_seat_capacity,
                        economy_seats_per_row   : rows[0].economy_seats_per_row,
                        business_seats_per_row  : rows[0].business_seats_per_row,
                        platinum_seats_per_row  : rows[0].platinum_seats_per_row,
                        economy_seats_num_rows  : rows[0].economy_seat_capacity/rows[0].economy_seats_per_row,
                        business_seats_num_rows : rows[0].business_seat_capacity/rows[0].business_seats_per_row,
                        platinum_seats_num_rows : rows[0].platnum_seat_capacity/rows[0].platinum_seats_per_row,
                        total_num   :   rows[0].economy_seat_capacity+rows[0].business_seat_capacity+rows[0].platnum_seat_capacity
                    }
                    resolve(seatData)
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })         
    }

}

module.exports = AircraftModel;