// load .env file into process.env 
require('dotenv').config()

// load main script
const main = require('./main')
const environment = require('./models/environment')
const teamsLogger = require('./models/teams-logger')

// check tokens every 10 minutes
const throttle = 1000 * 60 * 10

// run now
main()

// and run every throttle ms
setInterval(main, throttle)

// log service started
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const message = `${environment.name} version ${environment.version} service started on ${environment.hostname}.`
console.log(message)
teamsLogger.log(`service started on in ${mode} mode.`)