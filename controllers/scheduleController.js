const FlightSchedule = require("../models/FlightSchedule")

const home =async (req,res,next) => {
    let user=false;

    const schedules =await FlightSchedule.getFullSchedule();
    // console.log(schedules);
    res.render('schedule' , { title: 'Express' ,user:user,schedules});
}



module.exports={home};