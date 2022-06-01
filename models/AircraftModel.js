const db = require('../db/connect')

class AircraftModel {

    constructor(
        model_name,
        variant,
        economy_seat_capacity,
        business_seat_capacity,
        platinum_seat_capacity,
        economy_seats_per_row,
        business_seats_per_row,
        platinum_seats_per_row,
        max_weight
    ) {
        this.model_name=model_name,
        this.variant=variant,
        this.economy_seat_capacity=economy_seat_capacity,
        this.business_seat_capacity=business_seat_capacity,
        this.platinum_seat_capacity=platinum_seat_capacity,
        this.economy_seats_per_row=economy_seats_per_row,
        this.business_seats_per_row=business_seats_per_row,
        this.platinum_seats_per_row=platinum_seats_per_row,
        this.max_weight=max_weight
    }

    create() {
        return db.query(
            "INSERT INTO Aircraft_Model(model_name,variant,economy_seat_capacity, business_seat_capacity,platinum_seat_capacity, economy_seats_per_row, business_seats_per_row, platinum_seats_per_row, max_weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                this.model_name,
                this.variant,
                this.economy_seat_capacity,
                this.business_seat_capacity,
                this.platinum_seat_capacity,
                this.economy_seats_per_row,
                this.business_seats_per_row,
                this.platinum_seats_per_row,
                this.max_weight
            ]
        )
    }

    static findById(model_id) {
        return db.query(
            'SELECT * FROM Aircraft_Model WHERE model_id = ? LIMIT 1',
            [model_id]
        )
    }

    static findByModel(model_name) {
        return db.query(
            'SELECT * FROM Aircraft_Model WHERE model_name = ?',
            [model_name]
        )
    }

    static getAll() {
        return db.query(
            'SELECT * FROM Aircraft_Model'
        )
    }


}

module.exports = AircraftModel;