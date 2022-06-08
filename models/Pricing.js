const db = require('../db/connect')

class Pricing {
    
    static getDiscount(userType){
        return db.query(
        "SELECT discount_percentage FROM Discount WHERE customer_type=? LIMIT 1",
            [userType]
        )

    }

     static  getPrices(scheduleID) {
        return db.query(
            'SELECT * FROM Seat_Price INNER JOIN Traveller_Class USING (traveller_class_id) where route_id=(SELECT route_id FROM Flight_Schedule WHERE schedule_id= ?) ',
            [scheduleID]
        )
    }
}

module.exports = Pricing;