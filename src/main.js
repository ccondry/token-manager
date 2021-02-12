const db = require('./models/db')
const webex = require('./models/webex')
const teamsLogger = require('./models/teams-logger')

const issuers = [
  'webexV3',
  'webexV4'
]

module.exports = async function () {
  let tokens
  try {
    // get oauth2 tokens
    tokens = await db.find('toolbox', 'globals', {type: 'OAUTH2'})
    // console.log('found', tokens.length, 'OAUTH2 tokens')
  } catch (e) {
    console.log('could not get OAUTH2 tokens from database:', e.message)
    // stop now, hopefully things improve on the next interval
    return
  }
  // count of successfully refreshed tokens
  let successCount = 0
  // check each token expiration
  for (const token of tokens) {
    // time now, in ms
    const now = new Date().getTime()
    // calculate token expiration time, in ms
    let expires
    try {
      expires = token.modified.getTime() + (token.value.expires_in * 1000)
    } catch (e) {
      // console.log(`could not determine expiration of token named "${token.name}": ${e.message}`)
      console.log(`could not determine expiration of token named "${token.name}". Assuming it is expired and renewing it now...`)
      expires = 0
    }
    // renew tokens that expire in 10 minutes or less
    const threshold = 1000 * 60 * 10
    if (now + threshold > expires) {
      // renew
      if (issuers.includes(token.iss)) {
        // valid issuer
        let newToken
        try {
          // refresh token with proper issuer method
          switch (token.iss) {
            case 'webexV4': newToken = await webex.v4.refresh(token.value); break
            case 'webexV3': newToken = await webex.v3.refresh(token.value); break
          }
          successCount++
        } catch (e) {
          // refresh token REST failed
          // console.log('failed to renew token', token, e.message)
          let message
          if (e.status === 401) {
            // call for help - this must be manually fixed
            message = `failed to refresh OAUTH2 token named "${token.name}" with issuer "${token.iss}": ${e.message}`
          } else {
            message = `failed to refresh OAUTH2 token named "${token.name}" with issuer "${token.iss}": ${e.message}`
          }
          console.log(message)
          teamsLogger.log(message)
          // continue for loop to next token
          continue
        }
        // update token value and modified time in database
        const updates = {
          $set: {
            value: newToken
          },
          $currentDate: {
            modified: { $type: 'date' }
          }
        }
        try {
          await db.updateOne('toolbox', 'globals', {_id: db.ObjectID(token._id)}, updates)
        } catch (e) {
          const message = `failed to update database with OAUTH2 token named "${token.name}" with issuer "${token.iss}": ${e.message}`
          console.log(message)
          teamsLogger.log(message)
        }
      } else {
        // unknown issuer
        const message = `not renewing OAUTH2 token named "${token.name}" with unrecognized issuer "${token.iss}"`
        console.log(message)
        // continue for loop to next token
        continue
      }
    } else {
      // token doesn't need to be renewed yet
      // continue for loop to next token
      continue
    }
  }
  // for loop done
  if (successCount > 0) {
    console.log('successfully updated', successCount, 'OAUTH2 tokens.')
  }
}
