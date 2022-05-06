const db = require('../db/connect')
const bcrypt = require('bcryptjs')

class Admin {
    constructor(email, password) {
        this.email=email
        this.password=password
    }

    async create() {
        // hash password
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        return db.query(
            'INSERT INTO Admin(email, password) VALUES (?, ?)',
            [ this.email, this.password ]
        )
    }

    static findById(adminId) {
        return db.query(
            'SELECT * FROM Admin WHERE admin_id = ? LIMIT 1',
            [adminId]
        )
    }

    static findByEmail(email) {
        return db.query(
            'SELECT * FROM Admin WHERE email = ? LIMIT 1',
            [email]
        )
    }
}

module.exports = Admin