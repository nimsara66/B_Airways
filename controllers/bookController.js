/*   Models   */
const FlightSchedule = require("../models/FlightSchedule")
const Aircraft = require("../models/Aircraft")
const SeatBooking = require("../models/SeatBooking")
const Pricing = require("../models/Pricing")



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
        if(req.user && req.user.customer_id){
            customer_id = user.customer_id;  
        }
        let seatBookingData = await flightSchedule.getSeatBookingData(customer_id)

        // get ticket price with discount part
        let [pricelist, _] = await Pricing.getPrices(schedule_id);
        let prices = {}
        pricelist.map(priceRow=>prices[priceRow.traveller_class_name]=priceRow.price)
        let [discount, d] = await Pricing.getDiscount(user? user.user_type :'');
        discount = discount && discount.length>0?discount[0].discount_percentage:0
        let afterDiscount = {}
        pricelist.map(pricelist => afterDiscount[pricelist.traveller_class_name] = parseFloat(pricelist.price)-parseFloat(discount)*parseFloat(pricelist.price)/100)
        let priceData = {prices,afterDiscount,discount};
        res.render('book/book', {flightScheduleData, seatData, seatBookingData, msg,user, priceData});
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
    let selected_seat = parseInt(req.body.selected_seat); 
    if(selected_seat===0){
        req.session.msg = "Select at least one seat to prceed."
        return res.redirect(`/book/${schedule_id}`)
    } 
    let customer_id = req.user.customer_id; 
    try{
        let isBookingSuccess = await SeatBooking.book(schedule_id, selected_seat, customer_id);
        console.log(isBookingSuccess)
        if(isBookingSuccess)    req.session.msg = "Seat booked successfully.";
        else    req.session.msg = "Seat was already booked.";
        return res.redirect(`/book/${schedule_id}`)      
    }catch(err){
        return next(err)
    }    
}




module.exports = {
    viewBook,
    bookTickets
}