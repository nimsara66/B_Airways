const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddeware = (err, req, res, next) => {
    // remove the session
    // req.logout()
    // TODO: remove in production
    console.log(err)
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong, try again later'
    }

    res.status(defaultError.statusCode).render('component/error', { message: defaultError.message })
}

module.exports = errorHandlerMiddeware