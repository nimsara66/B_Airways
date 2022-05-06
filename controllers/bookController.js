const SeatBooking = require('../models/SeatBooking')



const viewBook = (req,res,next)=>{
    let schedule_id = req.params.schedule_id;
    let customer_id = 15;      //get from req.user
    let aircraft_id = 10;    //get from database
    let model_id = 12;      //get from database
    /* Get From Database */
    const economy_seat_capacity = 6
    const business_seat_capacity = 10
    const platinum_seat_capacity = 20
    const economy_seats_per_row = 3
    const business_seats_per_row = 5
    const platinum_seats_per_row = 4
    let seatData = {
        economy_seat_capacity ,
        business_seat_capacity ,
        platinum_seat_capacity ,
        economy_seats_per_row,
        business_seats_per_row ,
        platinum_seats_per_row ,
        economy_seats_num_rows : economy_seat_capacity/economy_seats_per_row,
        business_seats_num_rows : business_seat_capacity/business_seats_per_row,
        platinum_seats_num_rows : platinum_seat_capacity/platinum_seats_per_row
    }
    let unavailableSeats = [3,6,9,10,22,30,31]     //get from database, unavailable seats 
    res.render('book/book', {schedule_id, customer_id, seatData, aircraft_id, unavailableSeats});
}


const bookTickets = (req,res,next)=>{
    let schedule_id = req.body.schedule_id;
    let customer_id = 15;      //get from req.user
    let aircraft_id = 10;    //get from database
    let selected_seats = JSON.parse(req.body.selected_seats)
    res.json({
        schedule_id,
        customer_id,
        aircraft_id,
        selected_seats
    })
    //res.redirect(`/book/${schedule_id}`)
}


module.exports = {
    viewBook,
    bookTickets
}