let unavailableSeatIds = JSON.parse(document.getElementById("unavailable-seats").value);
unavailableSeatIds.forEach(seatId => {
    const unavailableSeat = document.getElementById(`Seat-${seatId}`);
    unavailableSeat.style.backgroundColor = "red";
    unavailableSeat.disabled = true;
});

let occupiedSeatIds = JSON.parse(document.getElementById("occupied-seats").value);
occupiedSeatIds.forEach(seatId => {
    const occupiedSeat = document.getElementById(`Seat-${seatId}`);
    occupiedSeat.style.backgroundColor = "red";
    occupiedSeat.disabled = true;
});


var frontMsgElement = document.getElementById("front-msg");

var bookNowButton = document.getElementById("book-now-btn");
bookNowButton.disabled = "true";

var selectedSeatStoreElement = document.getElementById("selected-seat");

/*
    Sets base price and final price (after discount) by considering
    given data.
    If seat=0 set all prices to 0;
    Otherwise, set prices to given seat prices.
*/
const setPrices = (seat) => {

    let base_price_element = document.getElementById('base-price');
    let final_price_element = document.getElementById('final-price');

    if(seat === 0){
        base_price_element.value = "0";
        final_price_element.value = "0";
        return;
    }

    let platinum_price = parseFloat(document.getElementById("platinum-price").value);
    let business_price = parseFloat(document.getElementById("business-price").value);
    let economy_price  = parseFloat(document.getElementById("economy-price").value);
    let after_discount_platinum_price = parseFloat(document.getElementById("after-discount-platinum-price").value);
    let after_discount_business_price = parseFloat(document.getElementById("after-discount-business-price").value);
    let after_discount_economy_price  = parseFloat(document.getElementById("after-discount-economy-price").value);
    
    if(seat.classList.contains("economy-seat-button")){
        base_price_element.value = parseFloat(economy_price);
        final_price_element.value = parseFloat(after_discount_economy_price);
    }else if(seat.classList.contains("business-seat-button")){
        base_price_element.value = parseFloat(business_price);
        final_price_element.value = parseFloat(after_discount_business_price);
    }else if(seat.classList.contains("platinum-seat-button")){
        base_price_element.value = parseFloat(platinum_price);
        final_price_element.value = parseFloat(after_discount_platinum_price);
    }    

}


var alreadyBookedSeatId =  parseInt(document.getElementById("already-booked-seat").value);
if(alreadyBookedSeatId>0){
    let alreadyBookedSeat = document.getElementById(`Seat-${alreadyBookedSeatId}`);
    alreadyBookedSeat.style.backgroundColor = "blue";
    alreadyBookedSeat.disabled = "true";
    frontMsgElement.value = "You cannot book two seats for same passport. Log out, reenter details and select seats.";
    setPrices(alreadyBookedSeat);
}else{
    frontMsgElement.value = "Select a seat.";
    setPrices(0);
}


/*
    Follwing actions are taken when a seat book button clicked.
*/
const handleSeatButtonClick = (seat)=>{
    if(seat.style.backgroundColor === "red" || seat.style.backgroundColor=="blue"){
        return;
    }
    if(alreadyBookedSeatId>0){
        return;
    }
    if(seat.style.backgroundColor === "green"){
        seat.style.backgroundColor = "aqua";
        selectedSeatStoreElement.value = "0";
        bookNowButton.disabled = true;
        frontMsgElement.value = "Select a seat.";
        setPrices(0);
        return;
    }
    let seatId = parseInt(seat.id.substring(5));
    let selectedSeatId = parseInt(selectedSeatStoreElement.value);
    if(selectedSeatId>0){
        let selectedSeat = document.getElementById(`Seat-${selectedSeatId}`);
        selectedSeat.style.backgroundColor = "aqua";
    }
    selectedSeatStoreElement.value = seatId;
    seat.style.backgroundColor = "green";
    frontMsgElement.value = "Seat selected.";
    setPrices(seat);
    bookNowButton.disabled = false;
    return ;
}




let totalSeatCapacity = parseInt(document.getElementById("total-seat-capacity").value);
for (let seatId = 1; seatId < totalSeatCapacity+1; seatId++) {
    const seat = document.getElementById(`Seat-${seatId}`);
    if(seat.style.backgroundColor === "black"){
        seat.style.backgroundColor = "aqua";
        seat.onclick = () => {
            handleSeatButtonClick(seat);
        }
    }  
};


