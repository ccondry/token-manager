// load .env file into process.env 
require('dotenv').config()

// load main script
const main = require('./main')

// check tokens every 10 minutes
const throttle = 1000 * 60 * 10

// run now
main()

// and run every throttle ms
setInterval(main, throttle)