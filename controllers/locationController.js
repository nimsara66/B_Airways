const Location = require('../models/Location')

const get_create = async (req, res, next) => {
  let user = false
  let msg = req.session.msg
  const locations = await Location.getAllLocations()
  // console.log(locations)
  res.render('location/create', {
    title: 'Express',
    user: user,
    locations,
    msg,
  })
}

module.exports = { get_create }
