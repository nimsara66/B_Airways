const db = require('../db/connect')

/*
    id  type
    1   Platinum
    2   Business
    3   Economy
*/

class TravellerClass{

    constructor(traveller_class_id){
        this.traveller_class_id = traveller_class_id;
    }

}

module.exports = TravellerClass;