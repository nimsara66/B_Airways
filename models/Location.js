const db = require('../db/connect')


class Location{

    constructor(location_id){
        this.location_id = location_id;
    }

    /*
        Returns location data for this location id.
        Return Values
            Object          Containing all scheduling data
    */
    getLocationData(){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT parent_location_id, ' +
                    'name ' +  
                    'from Location WHERE location_id=? LIMIT 1',
                    [this.location_id]
                )
                if(rows.length){
                    return resolve(rows[0])
                }else{
                    return resolve(false)
                }
            } catch(e){return reject(e)}
        })        
    }


    /*
        Returns all locations.
        Return Values
            Object          Containing all location data
    */
    static getAllLocations(){
        return new Promise(async (resolve, reject)=>{
            try{
                let [rows, _] = await db.query(
                    'SELECT * from Location'
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

module.exports = Location;