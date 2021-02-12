const fetch = require('./fetch')

// refresh access token and return the new token
async function refresh ({url, token, clientId, clientSecret}) {
  try {
    // get new access token using the refresh token
		const urlencoded = new URLSearchParams()
		urlencoded.append('grant_type', 'refresh_token')
		// client ID and secret are in .env file. hopefully they don't change often.
		urlencoded.append('client_id', clientId)
		urlencoded.append('client_secret', clientSecret)
		urlencoded.append('refresh_token', token.refresh_token)

		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: urlencoded.toString(),
			redirect: 'follow'
		}
		
		// return entire token object
		return fetch(url, options)
  } catch (e) {
		// rethrow all
		throw e
  }
}

// expose get and refresh methods
module.exports = {
  refresh
}
