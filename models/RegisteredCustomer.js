const db = require('../db/connect')
const Customer = require('./Customer')
const moment = require('moment')
const bcrypt = require('bcryptjs')

class RegisteredCustomer{
    constructor(
        email, 
        password, 
        first_name, 
        last_name, 
        gender, 
        contact_number, 
        passport_number, 
        address_line1,
        address_line2,
        country,
        province,
        city,
        birthday
        ) {
        this.email=email,
        this.password=password,
        this.first_name=first_name,
        this.last_name=last_name,
        this.gender=gender, 
        this.contact_number=contact_number,   
        this.passport_number=passport_number,
        this.address_line1=address_line1,
        this.address_line2=address_line2,
        this.country=country,
        this.province=province,
        this.city=city,
        this.birthday=birthday,
        this.joined_at=moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    }

    async create() {
        const customer = new Customer('registered_customer')
        const [ result, _ ] = await customer.create()
        this.customer_id = result.insertId
        // hash password
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        return db.query(
            'INSERT INTO '
            +'Registered_Customer(customer_id, email, password, first_name, '
            +'last_name, gender, contact_number, passport_number, address_line1, '
            +'address_line2, country, province, city, birthday, joined_at) VALUES '
            +'(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                this.customer_id,
                this.email,
                this.password,
                this.first_name,
                this.last_name,
                this.gender,
                this.contact_number,
                this.passport_number,
                this.address_line1,
                this.address_line2,
                this.country,
                this.province,
                this.city,
                this.birthday,
                this.joined_at
            ]
        )
    }

    static findById(customerId) {
        return db.query(
            'SELECT * FROM Registered_Customer WHERE customer_id = ? LIMIT 1',
            [customerId]
        )
    }

    static findByEmail(email) {
        return db.query(
            'SELECT * FROM Registered_Customer WHERE email = ? LIMIT 1',
            [email]
        )
    }
}

module.exports = RegisteredCustomer