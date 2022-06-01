const AircraftModel = require("../models/AircraftModel")

const viewAircraftModels =async (req,res,next) => {
    let user=false;

    const aircraftModels =await AircraftModel.getAll();
    // console.log(schedules);
    res.render('aircraftModel' , { title: 'Express' ,user:user,aircraftModels});
}



module.exports={viewAircraftModels};