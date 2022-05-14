/*   Models   */
const FlightSchedule = require("../models/FlightSchedule")
const AircraftModel = require("../models/AircraftModel")
const Aircraft = require("../models/Aircraft")
const Route = require("../models/Route")
const AircraftSeat = require("../models/AircraftSeat")
const SeatBooking = require("../models/SeatBooking")
const { session } = require("passport/lib")


/*
    Renders booking interface for releavant schedule id.
*/
const viewBook = async (req,res,next)=>{
    let user=false;
    let schedule_id = req.params.schedule_id;
    let customer_id = '1';      //get from req.user  TODO
    let flightSchedule , model_id, unavailableSeats, route, bookedSeatsByThisCustomer ;
    let msg = ""
    try{
        flightSchedule = await FlightSchedule.getScheduleDataUsingScheduleId(schedule_id);
        route = await Route.getRouteUsingRouteId(flightSchedule.route_id)
        model_id = await Aircraft.getAircraftModelIdUsingAircraftId(flightSchedule.aircraft_id)
        seatData = await AircraftModel.getSeatDataUsingModelId(model_id)
        unavailableSeats = await Aircraft.getUnavailableAndOccupiedSeatsForAircraft(flightSchedule.aircraft_id)
        bookedSeatsByThisCustomer = await SeatBooking.findSeatIdsForCustomerIdAndScheduleId(customer_id, schedule_id)
        seatData.available_num = seatData.total_num - unavailableSeats.length
        if(req.session.ableToBookSeats && req.session.ableToBookSeats[customer_id] && req.session.ableToBookSeats[customer_id].length){
            msg = msg + "Seat numbers "
            let i =0;
            req.session.ableToBookSeats[customer_id].forEach(seat_id => {
                i+=1;
                msg = msg + seat_id
                if(i!=req.session.ableToBookSeats[customer_id].length){
                    msg = msg + ","
                }
                msg = msg + " ";
            });
            msg = msg + "were succesfully booked.\n"
            delete req.session.ableToBookSeats.customer_id
        }
        if(req.session.unableToBookSeats && req.session.unableToBookSeats[customer_id] && req.session.unableToBookSeats[customer_id].length){
            msg = msg + "Seat numbers "
            let i =0;
            req.session.unableToBookSeats[customer_id].forEach(seat_id => {
                i+=1;
                msg = msg + seat_id
                if(i!==req.session.unableToBookSeats[customer_id].length){
                   msg = msg + ","
                }
                msg = msg + " ";
            });
            msg = msg + "were aready booked. Please try to book diffrent seats.\n"
            delete req.session.unableToBookSeats.customer_id
        }
        res.render('book/book', {flightSchedule, route, seatData, unavailableSeats, msg, bookedSeatsByThisCustomer,user:user});
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
    let customer_id = '1';      //get from req.user
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
        return res.json({msg:err.message})
    }    
}


module.exports = {
    viewBook,
    bookTickets
}