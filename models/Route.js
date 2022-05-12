const db = require('../db/connect')

class Route{

    constructor(route_id){
        this.route_id = route_id;
    }

    static getRouteUsingRouteId(route_id){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, cols] = await db.query(
                    'SELECT * from Route where route_id=? LIMIT 1',
                    [route_id]
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

module.exports = Route;