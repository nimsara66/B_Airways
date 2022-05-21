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
const handleSeatButtonClick = (btn)=>{
    let seatId = parseInt(btn.id.substring(5))
    const selectedSeatElement = document.getElementById("selected-seats")    
    let arr = JSON.parse(selectedSeatElement.value)
    let retVal = 0
    if(btn.style.backgroundColor==="aqua"){
        btn.style.backgroundColor="green"
        arr.push(seatId)
        retVal = 1;
    }else if (btn.style.backgroundColor==="green"){
        btn.style.backgroundColor = "aqua"
        arr.splice(arr.indexOf(seatId),1)
        retVal =  -1;
    }
    selectedSeatElement.value = JSON.stringify(arr)
    return retVal
}



let seatIdButtons = [].slice.call(document.getElementsByClassName("seat-id-button"))
const numBookedSeatsElement = document.getElementById("num-booked-seats")
let bookNowButton = document.getElementById("book-now-btn")

seatIdButtons.forEach(btn=>{

    /* Initilizes Parametre */
    btn.style.backgroundColor = "aqua"
    bookNowButton.disabled = true
    numBookedSeatsElement.value = 0
    document.getElementById("selected-seats").value = JSON.stringify([])
    /*          */
    
    btn.onclick = ()=>{
        numBookedSeatsElement.value = parseInt(numBookedSeatsElement.value) + handleSeatButtonClick(btn)
        if(parseInt(numBookedSeatsElement.value)>0){
            bookNowButton.disabled = false
        }else{
            bookNowButton.disabled = true
        }
    };
    
})


let unavailableSeats = JSON.parse(document.getElementById("unavailable-seats").value)
unavailableSeats.forEach(seatId => {
    const btn = document.getElementById(`Seat-${seatId}`)
    btn.style.backgroundColor = "red"
    btn.disabled = true
});

let occupiedSeats = JSON.parse(document.getElementById("occupied-seats").value)
occupiedSeats.forEach(seatId => {
    const btn = document.getElementById(`Seat-${seatId}`)
    btn.style.backgroundColor = "red"
    btn.disabled = true
});


let alreadyBookedSeats = JSON.parse(document.getElementById("already-booked-seats").value)
numBookedSeatsElement.value = alreadyBookedSeats.length
alreadyBookedSeats.forEach(seatId => {
    const btn = document.getElementById(`Seat-${seatId}`)
    btn.style.backgroundColor = "blue"
    btn.disabled = true
});