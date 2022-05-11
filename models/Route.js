const db = require('../db/connect')

class Route{

    constructor(route_id){
        this.route_id = route_id;
    }

    init(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let data = await this.getRouteFromDB(); 
                if(data){
                    this.route_id = data.route_id;
                    this.origin = data.origin;
                    this.destination = data.destination;
                    this.duration = data.duration;
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

    getRouteFromDB(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT * from Route where route_id=? LIMIT 1',
                    [this.route_id]
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

module.exports = Route;