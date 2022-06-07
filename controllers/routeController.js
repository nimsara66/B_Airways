const Location = require("../models/Route")

const get_all_routes =async (req,res,next) => {
    let user=false;
    let msg = req.session.msg
    const routes =await Location. getAllRoutes();
    console.log(routes)
    res.render('route/route' , { title: 'Express' ,user:user,routes, msg});
}



module.exports={get_all_routes};