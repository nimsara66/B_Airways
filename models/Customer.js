const db = require('../db/connect')

class Customer {
    constructor(customerType) {
        this.customerType=customerType
    }

    create() {
        return db.query(
            'INSERT INTO Customer(customer_type) VALUES (?)',
            [this.customerType]
        )
    }

    static findOne(customerId) {
        return db.query(
            'SELECT * FROM Customer WHERE customer_id = ? LIMIT 1',
            [customerId]
        )
    }
}

module.exports = Customer