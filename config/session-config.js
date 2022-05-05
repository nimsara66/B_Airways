const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)

// env setup
require('dotenv').config()

const getExpressSessionStore = () => {
	return session({
		key: process.env.SESSION_NAME,
		secret: process.env.SESSION_SECRET,
		store: new MySQLStore({
		  host: process.env.DB_HOST,
		  port: process.env.DB_PORT,
		  user: process.env.DB_USER,
		  password: process.env.DB_PASSWORD,
		  database: process.env.DB_DATABASE
		}),
		resave: false,
		saveUninitialized: false,
		cookie: {
		  maxAge: 1000 * 60 * 60 * 24
		}
	  })
}

exports.getExpressSessionStore = getExpressSessionStore;