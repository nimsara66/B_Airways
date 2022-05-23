const db = require('../db/connect')

class Pricing {
    
    static getDiscount(userType){
        return db.query(
        "SELECT discount_percentage FROM discount WHERE customer_type=? LIMIT 1",
            [userType]
        )

    }

     static  getPrices(scheduleID) {
        return db.query(
            'SELECT * FROM Seat_Price where route_id=(SELECT route_id FROM flight_schedule WHERE schedule_id= ?) ',
            [scheduleID]
        )
    }
}

module.exports = Pricing;