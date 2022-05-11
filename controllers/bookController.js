/*   Models   */
const SeatBooking = require('../models/SeatBooking')
const FlightSchedule = require("../models/FlightSchedule")
const AircraftModel = require("../models/AircraftModel")
const Aircraft = require("../models/Aircraft")
const Route = require("../models/Route")


/*
    Renders booking interface for releavant schedule id.
*/
const viewBook = async (req,res,next)=>{
    let schedule_id = req.params.schedule_id;
    let customer_id = 15;      //get from req.user
    let flightSchedule , aircraft , aircraftModel, unavailableSeats, route ;
    try{
        flightSchedule = new FlightSchedule(schedule_id);
        await flightSchedule.init();
        route = new Route(flightSchedule.route_id)
        await route.init()
        aircraft = new Aircraft(flightSchedule.aircraft_id)
        await aircraft.init();
        aircraftModel = new AircraftModel(aircraft.aircraft_id);
        await aircraftModel.init();
        seatData = aircraftModel.seatData
        aircraft_id = flightSchedule.aircraft_id
        unavailableSeats = await aircraft.getUnavailableAndOccupiedSeats()
        console.log(seatData)
        seatData.available_num = seatData.total_num - unavailableSeats.length
        res.render('book/book', {flightSchedule, route, customer_id, seatData, unavailableSeats});
    }catch(err){
        return res.json({msg:err.message})
    }
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