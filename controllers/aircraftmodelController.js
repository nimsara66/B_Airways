const AircraftModel = require("../models/AircraftModel")

const viewAircraftModels =async (req,res,next) => {
    let user=false;

    const [aircraftModels, _] =await AircraftModel.getAll();
    console.log(aircraftModels.length);
    res.render('staff/edit_airplanes' , { title: 'Express' ,user:user,aircraftModels});
}

const insertAircraftmodel = async(req, res, next) => {
    let user=false;

    let aircraftModel = new AircraftModel(
        req.body.modelname,
        req.body.varient,
        req.body.E_seat_cap,
        req.body.B_seat_cap,
        req.body.P_seat_cap,
        req.body.E_SPR,
        req.body.B_SPR,
        req.body.P_SPR,
        req.body.max_weight
    )
    await aircraftModel.create();
    res.redirect("/aircraft");
    
}



module.exports={viewAircraftModels, insertAircraftmodel};