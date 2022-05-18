/*   Models   */
const FlightSchedule = require("../models/FlightSchedule")
const AircraftModel = require("../models/AircraftModel")
const Aircraft = require("../models/Aircraft")
const Route = require("../models/Route")
const AircraftSeat = require("../models/AircraftSeat")
const SeatBooking = require("../models/SeatBooking")
const { session } = require("passport/lib")
const messageHelper = require("../helpers/messageHelper")

/*
    GET Renders booking interface for releavant schedule id.
*/
const viewBook = async (req,res,next)=>{
    let user=req.user;
    let schedule_id = req.params.schedule_id;
    let flightSchedule , model_id, unavailableSeats, route, bookedSeatsByThisCustomer ;
    let msg = ""
    if(req.session.msg){
        msg=req.session.msg
        delete req.session.msg
    } 
    try{
        flightSchedule = await FlightSchedule.getScheduleDataUsingScheduleId(schedule_id);
        route = await Route.getRouteUsingRouteId(flightSchedule.route_id)
        model_id = await Aircraft.getAircraftModelIdUsingAircraftId(flightSchedule.aircraft_id)
        seatData = await AircraftModel.getSeatDataUsingModelId(model_id)
        unavailableSeats = await Aircraft.getUnavailableAndOccupiedSeatsForAircraft(flightSchedule.aircraft_id)
        seatData.available_num = seatData.total_num - unavailableSeats.length
        if(req.user && req.user.customer_id){
            let customer_id = user.customer_id;  
            bookedSeatsByThisCustomer = await SeatBooking.findSeatIdsForCustomerIdAndScheduleId(customer_id, schedule_id)
            if(req.session.ableToBookSeats && req.session.ableToBookSeats[customer_id]){
                msg = msg + messageHelper.createAbleSeatBookMessage(req.session.ableToBookSeats[customer_id])
                delete req.session.ableToBookSeats[customer_id]
            }
            if(req.session.unableToBookSeats && req.session.unableToBookSeats[customer_id]){
                msg = msg + messageHelper.createUnableSeatBookMessage(req.session.unableToBookSeats[customer_id])
                delete req.session.unableToBookSeats[customer_id]
            }
        }
        res.render('book/book', {flightSchedule, route, seatData, unavailableSeats, msg, bookedSeatsByThisCustomer,user});
    }catch(err){
        return next(err)
    }
}


/*
    POST Booking is made if that requested seat is already not booked.
*/
const bookTickets = async (req,res,next)=>{
    let schedule_id = req.body.schedule_id;
    if(!(req.user && req.user.customer_id)){
        req.session.msg = "Fill Guest Customer Form or log in as registered customer."
        return res.redirect(`/book/${schedule_id}`)
    } 
    if(!(req.body.selected_seats)){
        req.session.msg = "Select at least one seat to prceed."
        return res.redirect(`/book/${schedule_id}`)
    } 
    let customer_id = req.user.customer_id;    
    let selected_seats = JSON.parse(req.body.selected_seats) 
    try{
        let i = 0;
        let unableToBookSeats = []
        let ableToBookSeats = []
        selected_seats.forEach(async (seat_id) => {
            let booking_id = await SeatBooking.findBookingIdfromScheduleIdAndSeatId(schedule_id, seat_id)
            let seatbooking = new SeatBooking(booking_id)
            let isBookingSuccess = await seatbooking.book(customer_id)
            if(!isBookingSuccess)   unableToBookSeats.push(seat_id) 
            else    ableToBookSeats.push(seat_id)
            i+=1;
            if(i===selected_seats.length){
                if(!req.session.unableToBookSeats){
                    req.session.unableToBookSeats = {}
                }
                if(!req.session.ableToBookSeats){
                    req.session.ableToBookSeats = {}
                }                
                req.session.unableToBookSeats[customer_id] = unableToBookSeats
                req.session.ableToBookSeats[customer_id] = ableToBookSeats
                return res.redirect(`/book/${schedule_id}`)
            }      
        });       
    }catch(err){
        return next(err)
    }    
}


module.exports = {
    viewBook,
    bookTickets
}