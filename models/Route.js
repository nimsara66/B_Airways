const db = require('../db/connect')

class Route{

    constructor(route_id){
        this.route_id = route_id;
    }

    /*
        Returns all locations.
        Return Values
            Object          Containing all location data
    */
    static getAllRoutes(){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT Route.route_id,duration,Airport.airport_name origin, airport2.airport_name destination FROM Route left outer join Airport on Route.origin = Airport.airport_id left outer join Airport as airport2 on airport2.airport_id=Route.destination'
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

module.exports = Route;