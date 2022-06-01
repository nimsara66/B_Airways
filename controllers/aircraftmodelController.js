const AircraftModel = require("../models/AircraftModel")

const viewAircraftModels =async (req,res,next) => {
    let user=false;

    const aircraftModels =await AircraftModel.getAll();
    console.log(aircraftModels);
    res.render('/staff/edit_airplanes' , { title: 'Express' ,user:user,aircraftModels});
}



module.exports={viewAircraftModels};