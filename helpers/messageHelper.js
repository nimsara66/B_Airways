const createAbleSeatBookMessage = (ableToBookSeats)=>{
    let msg = "";
    if(ableToBookSeats && ableToBookSeats.length>0){
        msg = msg + "Seat numbers "
        let i =0;
        ableToBookSeats.forEach(seat_id => {
            i+=1;
            msg = msg + seat_id
            if(i!=ableToBookSeats.length){
                msg = msg + ","
            }
            msg = msg + " ";
        });
        msg = msg + "were succesfully booked.\n"
    }
    return msg;
}

const createUnableSeatBookMessage = (unableToBookSeats)=>{
    let msg = "";
    if(unableToBookSeats && unableToBookSeats.length){
        msg = msg + "Seat numbers "
        i =0;
        unableToBookSeats.forEach(seat_id => {
            i+=1;
            msg = msg + seat_id
            if(i!==unableToBookSeats.length){
               msg = msg + ","
            }
            msg = msg + " ";
        });
        msg = msg + "were aready booked. Please try to book diffrent seats.\n"
    }
    return msg;
}


module.exports = {createAbleSeatBookMessage,createUnableSeatBookMessage}