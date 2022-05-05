const { StatusCodes } = require('http-status-codes')

const notFoundMiddleware = (req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).render('error', { message: 'Route does not exist' })
}

module.exports = notFoundMiddleware