const express = require('express')
const { getExpressSessionStore } = require('./config/session-config')
const passport = require('passport');

require('dotenv').config()

const app = express()

// morgan setup
const morgan = require('morgan');
if (process.env.NODE_ENV !== 'Production') {
    app.use(morgan('dev'))
}

// Express Incoming data Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Set up EJS
app.set('view engine', 'ejs')
app.use(express.static('public'))

//Set up Session
app.use(getExpressSessionStore());

//Set up Passport
require('./config/passport-config')
app.use(passport.initialize({}))
app.use(passport.session({}))

const homeRoute = require('./routes/homeRoute')
app.use('/', homeRoute);

const authRoute = require('./routes/authRoute')
app.use('/auth', authRoute);

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddeware = require('./middleware/error-handler')
app.use(notFoundMiddleware)
app.use(errorHandlerMiddeware)

const PORT = process.env.PORT || 5500

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}...`);
        })
    } catch (error) {
        console.log(error)
    }
}

start()