const FlightSchedule = require("../models/FlightSchedule")
const Aircraft = require("../models/Aircraft")

const home =async (req,res,next) => {
    let user=false;

    const schedules =await FlightSchedule.getFullSchedule();
    // console.log(schedules);
    res.render('schedule' , { title: 'Express' ,user:user,schedules});
}


const getCreate = async (req,res,next)=>{
    let user = req.user;
    let msg = req.session.msg;
    let route_id = req.params.route_id;
    try{
        let aircrafts = await Aircraft.getAllAircrafts()
        console.log(aircrafts)
        res.render('schedule/create', {user,msg, route_id, aircrafts})
    }catch(err){
        if(err){
            return next(err)
        }
    }
}


const create = async (req,res,next)=>{
    let user = req.user;
    console.log(req.body.aircraft_id)
    try{
        await FlightSchedule.create({
            route_id:req.params.route_id,
            aircraft_id:req.body.aircraft_id,
            departure_date:req.body.departure_date,
            departure_time:req.body.departure_time,
            arrival_date:req.body.departure_date,
            arrival_time:req.body.departure_time
        })
        res.redirect('/schedule/create/'+req.params.route_id)
    }catch(err){
        if(err) next(err)
    }
}


module.exports={
    home,
    getCreate,
    create
};