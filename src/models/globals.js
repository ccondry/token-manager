const db = require('./db')

// globals cache - these values all come from toolbox.globals in mongo db
let cache = {}

// gets global value from database
async function refresh () {
  // update cache
  try {
    const globals = await db.find('toolbox', 'globals', {})
    const newCache = {}
    for (const global of globals) {
      newCache[global.name] = global.value
    }
    // overwrite old cache object
    cache = newCache
  } catch (e) {
    console.log('error updating globals cache:', e.message)
  }
}

// prime the cache now:
const initialLoad = refresh()

// update globals cache values every 1 minute
const throttle = 1000 * 60 * 1
setInterval(refresh, throttle)

function get (name) {
  return cache[name]
}

// export our specific cache value methods and the generic getCache method
module.exports = {
  refresh,
  initialLoad,
  get
}