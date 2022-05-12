/*   Models   */
const FlightSchedule = require("../models/FlightSchedule")
const AircraftModel = require("../models/AircraftModel")
const Aircraft = require("../models/Aircraft")
const Route = require("../models/Route")
const AircraftSeat = require("../models/AircraftSeat")
const SeatBooking = require("../models/SeatBooking")


/*
    Renders booking interface for releavant schedule id.
*/
const viewBook = async (req,res,next)=>{
    let schedule_id = req.params.schedule_id;
    let customer_id = 15;      //get from req.user
    let flightSchedule , aircraft , model_id, unavailableSeats, route ;
    try{
        flightSchedule = await FlightSchedule.getScheduleDataUsingScheduleId(schedule_id);
        route = await Route.getRouteUsingRouteId(flightSchedule.route_id)
        model_id = await Aircraft.getAircraftModelIdUsingAircraftId(flightSchedule.aircraft_id)
        seatData = await AircraftModel.getSeatDataUsingModelId(model_id)
        unavailableSeats = await Aircraft.getUnavailableAndOccupiedSeatsForAircraft(flightSchedule.aircraft_id)
        seatData.available_num = seatData.total_num - unavailableSeats.length
        res.render('book/book', {customer_id, flightSchedule, route, seatData, unavailableSeats});
    }catch(err){
        return res.json(err)
    }
}


/*
    handles POST book request.
    Booking is made if that requested seat is already not booked.
*/
const bookTickets = async (req,res,next)=>{
    let schedule_id = req.body.schedule_id;
    let customer_id = 1;      //get from req.user
    let selected_seats = JSON.parse(req.body.selected_seats)    
    try{
        let i = 0;
        selected_seats.forEach(async (seat_id) => {
            let booking_id = await SeatBooking.findBookingIdfromScheduleIdAndSeatId(schedule_id, seat_id)
            let seatbooking = new SeatBooking(booking_id)
            await seatbooking.book(customer_id) 
            i+=1;
            if(i===selected_seats.length)       return res.redirect(`/book/${schedule_id}`)
        });       
    }catch(err){
        return res.json({msg:err.message})
    }    
}


module.exports = {
    viewBook,
    bookTickets
}