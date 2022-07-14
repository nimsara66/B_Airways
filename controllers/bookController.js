/*   Models   */
const FlightSchedule = require('../models/FlightSchedule')
const Aircraft = require('../models/Aircraft')
const SeatBooking = require('../models/SeatBooking')
const Pricing = require('../models/Pricing')
const RegisteredCustomer = require('../models/RegisteredCustomer')
const { RegUserDisConstants } = require('../models/Constants')

require('dotenv').config()

/*
    GET Renders booking interface for releavant schedule id.
*/
const viewBook = async (req, res, next) => {
  let user = req.user
  let schedule_id = req.params.schedule_id
  let msg = ''
  let customer_id
  if (req.session.msg) {
    msg = req.session.msg
    delete req.session.msg
  }
  try {
    let flightSchedule = new FlightSchedule(schedule_id)
    let flightScheduleData = await flightSchedule.getScheduleData()
    let aircraft = new Aircraft(flightScheduleData.aircraft_id)
    let seatData = await aircraft.getAircraftSeatData()
    if (req.user && req.user.customer_id) {
      customer_id = user.customer_id
    }
    let seatBookingData = await flightSchedule.getSeatBookingData(customer_id)

    // get customer frequency
    const [check, __] = await RegUserDisConstants()
    var constants = check.reduce(
      (obj, item) => ((obj[item.id] = item.value), obj),
      {}
    )

    let frequency = 0
    const interval = constants.INTERVAL || 30
    if (req.user && req.user.user_type === 'registered_customer') {
      const [result, __] = await RegisteredCustomer.getFrequency(
        req.user.customer_id,
        interval
      )
      frequency = result[0].frequency
    }

    // select frequent_discount
    let frequent_discount = 0
    let frequent_type = undefined

    GOLD_MARGIN = constants.GOLD_MARGIN ? parseInt(constants.GOLD_MARGIN) : 5
    FREQUENT_MARGIN = constants.FREQUENT_MARGIN
      ? parseInt(constants.FREQUENT_MARGIN)
      : 3
    GOLD_DISCOUNT = constants.GOLD_DISCOUNT
      ? parseInt(constants.GOLD_DISCOUNT)
      : 9
    FREQUENT_DISCOUNT = constants.FREQUENT_DISCOUNT
      ? parseInt(constants.FREQUENT_DISCOUNT)
      : 5

    switch (frequency) {
      case frequency > GOLD_MARGIN:
        frequent_discount = constants.GOLD_DISCOUNT
        frequent_type = 'gold'
        break
      case frequency > FREQUENT_MARGIN:
        frequent_discount = constants.FREQUENT_DISCOUNT
        frequent_type = 'frequent'
      default:
        break
    }

    // get ticket price with discount part
    let [pricelist, _] = await Pricing.getPrices(schedule_id)
    let prices = {}
    pricelist.map(
      (priceRow) => (prices[priceRow.traveller_class_name] = priceRow.price)
    )
    let [discount, d] = await Pricing.getDiscount(user ? user.user_type : '')
    discount =
      discount && discount.length > 0 ? discount[0].discount_percentage : 0
    let afterDiscount = {}
    pricelist.map(
      (pricelist) =>
        (afterDiscount[pricelist.traveller_class_name] =
          parseFloat(pricelist.price) -
          (parseFloat(frequent_discount) * parseFloat(pricelist.price)) / 100)
    )
    let priceData = { prices, afterDiscount, frequent_discount }
    res.render('book/book', {
      flightScheduleData,
      seatData,
      seatBookingData,
      msg,
      user,
      priceData,
    })
  } catch (err) {
    return next(err)
  }
}

/*
    POST Booking is made if that requested seat is already not booked.
*/
const bookTickets = async (req, res, next) => {
  let schedule_id = req.body.schedule_id
  if (!(req.user && req.user.customer_id)) {
    req.session.msg =
      'Fill Guest Customer Form or log in as registered customer.'
    return res.redirect(`/book/${schedule_id}`)
  }
  let selected_seat = parseInt(req.body.selected_seat)
  if (selected_seat === 0) {
    req.session.msg = 'Select at least one seat to prceed.'
    return res.redirect(`/book/${schedule_id}`)
  }
  let customer_id = req.user.customer_id
  try {
    let booking_id = await SeatBooking.findBookingIdfromScheduleIdAndSeatId(
      schedule_id,
      selected_seat
    )
    let seatbooking = new SeatBooking(booking_id)
    let isBookingSuccess = await seatbooking.book(customer_id)
    if (isBookingSuccess) req.session.msg = 'Seat booked successfully.'
    else req.session.msg = 'Seat was already booked.'
    return res.redirect(`/book/${schedule_id}`)
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  viewBook,
  bookTickets,
}
