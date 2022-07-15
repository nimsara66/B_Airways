const db = require('../db/connect')

const RegUserDisConstants = () => {
  return db.query('SELECT * FROM RegUserDisConstants')
}

module.exports = { RegUserDisConstants }
