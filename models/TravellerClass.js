const db = require('../db/connect')

class TravellerClass{

    constructor(traveller_class_id){
        this.traveller_class_id = traveller_class_id;
    }

    init(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let data = await this.getTravellerClassNameFromDB(); 
                if(data){
                    this.traveller_class_name = data.traveller_class_name
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

    getTravellerClassNameFromDB(){
        return new Promise((resolve, reject)=>{
            const func = async ()=>{
                let [rows, cols] = await db.query(
                    'SELECT * from Traveller_Class where traveller_class_id=? LIMIT 1',
                    [this.traveller_class_id]
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

module.exports = TravellerClass;