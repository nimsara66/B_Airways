const db = require('../db/connect')
const bcrypt = require('bcryptjs')

class Staff {
    constructor(
        email, 
        password, 
        category,
        first_name, 
        last_name, 
        gender, 
        contact_number, 
        birthday,
        country,
        assigned_airport,
        state,
        ) {
        this.email=email,
        this.password=password,
        this.category=category,
        this.first_name=first_name,
        this.last_name=last_name,
        this.gender=gender, 
        this.contact_number=contact_number,
        this.birthday=birthday,
        this.country=country,
        this.assigned_airport=assigned_airport,
        this.state=state
    }

    async create() {
        // hash password
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        console.log(this.gender)
        return db.query(
            'INSERT INTO '
            +'Staff(email, password, category, first_name, '
            +'last_name, gender, contact_number, '
            +'birthday, country, assigned_airport, state) VALUES '
            +'(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                this.email,
                this.password,
                this.category,
                this.first_name,
                this.last_name,
                this.gender,
                this.contact_number,
                this.birthday,
                this.country,
                this.assigned_airport,
                this.state
            ]
        )
    }

    static findById(staffId) {
        return db.query(
            'SELECT * FROM Staff WHERE staff_id = ? LIMIT 1',
            [staffId]
        )
    }

    static findByEmail(email) {
        return db.query(
            'SELECT * FROM Staff WHERE email = ? LIMIT 1',
            [email]
        )
    }
}

module.exports = Staff