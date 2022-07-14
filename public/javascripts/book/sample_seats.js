/*
    Sets base price and final price (after discount) by considering
    given data.
        If reduce==false, add the prices for traveller class for btn
        else    , substitute prices for traveller class for btn
*/
const setPrices = (btn, reduce) => {
  let platinum_price = parseFloat(
    document.getElementById('platinum-price').value
  )
  let business_price = parseFloat(
    document.getElementById('business-price').value
  )
  let economy_price = parseFloat(document.getElementById('economy-price').value)
  let after_discount_platinum_price = parseFloat(
    document.getElementById('after-discount-platinum-price').value
  )
  let after_discount_business_price = parseFloat(
    document.getElementById('after-discount-business-price').value
  )
  let after_discount_economy_price = parseFloat(
    document.getElementById('after-discount-economy-price').value
  )

  let base_price_element = document.getElementById('base-price')
  let final_price_element = document.getElementById('final-price')
  if (!reduce) {
    // console.log = final_price_element
    if (btn.classList.contains('economy-seat-button')) {
      base_price_element.value =
        parseFloat(base_price_element.value) + parseFloat(economy_price)
      final_price_element.value =
        parseFloat(final_price_element.value) +
        parseFloat(after_discount_economy_price)
    } else if (btn.classList.contains('business-seat-button')) {
      base_price_element.value =
        parseFloat(base_price_element.value) + parseFloat(business_price)
      final_price_element.value =
        parseFloat(final_price_element.value) +
        parseFloat(after_discount_business_price)
    } else if (btn.classList.contains('platinum-seat-button')) {
      base_price_element.value =
        parseFloat(base_price_element.value) + parseFloat(platinum_price)
      final_price_element.value =
        parseFloat(final_price_element.value) +
        parseFloat(after_discount_platinum_price)
    }
  } else {
    if (btn.classList.contains('economy-seat-button')) {
      base_price_element.value =
        parseFloat(base_price_element.value) - parseFloat(economy_price)
      final_price_element.value =
        parseFloat(final_price_element.value) -
        parseFloat(after_discount_economy_price)
    } else if (btn.classList.contains('business-seat-button')) {
      base_price_element.value =
        parseFloat(base_price_element.value) - parseFloat(business_price)
      final_price_element.value =
        parseFloat(final_price_element.value) -
        parseFloat(after_discount_business_price)
    } else if (btn.classList.contains('platinum-seat-button')) {
      base_price_element.value =
        parseFloat(base_price_element.value) - parseFloat(platinum_price)
      final_price_element.value =
        parseFloat(final_price_element.value) -
        parseFloat(after_discount_platinum_price)
    }
  }
}

/*
    booked seat list is taken from "#selected-seats" element.
    Follwing actions are taken when a seat book button clicked.
        If it is aqua colour (available)
            Add seat id to booked seat list.
            Change colour to green.
        Else If it is aqua colour (booked just now)
            Remove seat id from booked seat list.
            Change colour to aqua.
        Else    
            No change
*/
const handleSeatButtonClick = (btn) => {
  let seatId = parseInt(btn.id.substring(5))
  const selectedSeatElement = document.getElementById('selected-seats')
  let arr = JSON.parse(selectedSeatElement.value)
  let retVal = 0

  if (btn.style.backgroundColor === 'aqua') {
    btn.style.backgroundColor = 'green'
    arr.push(seatId)
    retVal = 1
    setPrices(btn)
  } else if (btn.style.backgroundColor === 'green') {
    btn.style.backgroundColor = 'aqua'
    arr.splice(arr.indexOf(seatId), 1)
    retVal = -1
    setPrices(btn, 1)
  }
  selectedSeatElement.value = JSON.stringify(arr)
  return retVal
}

let seatIdButtons = [].slice.call(
  document.getElementsByClassName('seat-id-button')
)
const numBookedSeatsElement = document.getElementById('num-booked-seats')
let bookNowButton = document.getElementById('book-now-btn')

document.getElementById('base-price').value = 0
document.getElementById('final-price').value = 0

seatIdButtons.forEach((btn) => {
  /* Initilizes Parametre */
  btn.style.backgroundColor = 'aqua'
  bookNowButton.disabled = true
  numBookedSeatsElement.value = 0
  document.getElementById('selected-seats').value = JSON.stringify([])
  /*          */

  btn.onclick = () => {
    numBookedSeatsElement.value =
      parseInt(numBookedSeatsElement.value) + handleSeatButtonClick(btn)
    if (parseInt(numBookedSeatsElement.value) > 0) {
      bookNowButton.disabled = false
    } else {
      bookNowButton.disabled = true
    }
  }
})

let unavailableSeats = JSON.parse(
  document.getElementById('unavailable-seats').value
)
unavailableSeats.forEach((seatId) => {
  const btn = document.getElementById(`Seat-${seatId}`)
  btn.style.backgroundColor = 'red'
  btn.disabled = true
})

let occupiedSeats = JSON.parse(document.getElementById('occupied-seats').value)
occupiedSeats.forEach((seatId) => {
  const btn = document.getElementById(`Seat-${seatId}`)
  btn.style.backgroundColor = 'red'
  btn.disabled = true
})

let alreadyBookedSeats = JSON.parse(
  document.getElementById('already-booked-seats').value
)
numBookedSeatsElement.value = alreadyBookedSeats.length
alreadyBookedSeats.forEach((seatId) => {
  const btn = document.getElementById(`Seat-${seatId}`)
  btn.style.backgroundColor = 'blue'
  btn.disabled = true
  setPrices(btn)
})
