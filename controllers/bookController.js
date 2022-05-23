/*   Models   */
const FlightSchedule = require("../models/FlightSchedule")
const AircraftModel = require("../models/AircraftModel")
const Aircraft = require("../models/Aircraft")
const Route = require("../models/Route")
const AircraftSeat = require("../models/AircraftSeat")
const SeatBooking = require("../models/SeatBooking")
const Pricing = require("../models/Pricing")
const { session } = require("passport/lib")
const messageHelper = require("../helpers/messageHelper")

/*
    GET Renders booking interface for releavant schedule id.
*/
const viewBook = async (req,res,next)=>{
    let user=req.user;
    let schedule_id = req.params.schedule_id;
    let msg = ""
    let customer_id;
    if(req.session.msg){
        msg=req.session.msg
        delete req.session.msg
    } 
    try{
        let flightSchedule = new FlightSchedule(schedule_id)
        let flightScheduleData = await flightSchedule.getScheduleData();
        let aircraft = new Aircraft(flightScheduleData.aircraft_id)
        let seatData = await aircraft.getAircraftSeatData()
        console.log(seatData)
        if(req.user && req.user.customer_id){
            customer_id = user.customer_id;  
            /* Message Creating */
            if(req.session.ableToBookSeats && req.session.ableToBookSeats[customer_id]){
                msg = msg + messageHelper.createAbleSeatBookMessage(req.session.ableToBookSeats[customer_id])
                delete req.session.ableToBookSeats[customer_id]
            }
            if(req.session.unableToBookSeats && req.session.unableToBookSeats[customer_id]){
                msg = msg + messageHelper.createUnableSeatBookMessage(req.session.unableToBookSeats[customer_id])
                delete req.session.unableToBookSeats[customer_id]
            }
        }
        let seatBookingData = await flightSchedule.getSeatBookingData(customer_id)
        res.render('book/book', {flightScheduleData, seatData, seatBookingData, msg,user});
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
            /*   Message Creating  */
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

const getSeatPrice = async (req, res, next) =>{

    try {
        let schedule_id = req.params.schedule_id;
        let user = req.user;
        let [pricelist, _] = await Pricing.getPrices(schedule_id);
        let [discount, d] = await Pricing.getDiscount(user? user.user_type :'');

        const afterdiscount = pricelist.map(pricelist => parseInt(pricelist.price)-parseInt(discount[0]?discount[0].discount_percentage : 0));
        console.log(afterdiscount)
        res.json(pricelist.length>0?{ data: pricelist,afterdiscount:afterdiscount , msg: 'success' } :{ data: "", msg: 'route_id not found' })
        
    } catch (error) {
        console.log(error)
        res.json({ data: "", msg: 'failed' })
    }

}



module.exports = {
    viewBook,
    bookTickets,
    getSeatPrice
}