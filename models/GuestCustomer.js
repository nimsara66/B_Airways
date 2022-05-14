const db = require('../db/connect')
const Customer = require('./Customer')
const bcrypt = require('bcryptjs')

class GuestCustomer{
    constructor(
        email,
        first_name, 
        last_name, 
        gender, 
        contact_number, 
        passport_number, 
        address_line1,
        address_line2,
        birthday
        ) {
        this.email=email,
        this.first_name=first_name,
        this.last_name=last_name,
        this.gender=gender, 
        this.contact_number=contact_number,   
        this.passport_number=passport_number,
        this.address_line1=address_line1,
        this.address_line2=address_line2,
        this.birthday=birthday
    }

    async create() {
        const customer = new Customer('guest-customer')
        const [ result, _ ] = await customer.create()
        this.customer_id = result.insertId
        return db.query(
            'INSERT INTO '
            +'Guest_Customer(customer_id, email, first_name, '
            +'last_name, gender, contact_number, passport_number, address_line1, '
            +'address_line2, birthday) VALUES '
            +'(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                this.customer_id,
                this.email,
                this.first_name,
                this.last_name,
                this.gender,
                this.contact_number,
                this.passport_number,
                this.address_line1,
                this.address_line2,
                this.birthday
            ]
        )
    }

    static findById(customerId) {
        return db.query(
            'SELECT * FROM Guest_Customer WHERE customer_id = ? LIMIT 1',
            [customerId]
        )
    }

    static findByEmail(email) {
        return db.query(
            'SELECT * FROM Guest_Customer WHERE email = ? LIMIT 1',
            [email]
        )
    }
}

module.exports = GuestCustomer