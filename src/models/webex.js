const oauth2 = require('./oauth2')
const globals = require('./globals')

module.exports = {
  jds: {
    async refresh (token) {
      // wait for globals to exist
      await Promise.resolve(globals.initialLoad)
      // refresh oauth2 token
      return oauth2.refresh({
        url: 'https://webexapis.com/v1/access_token',
        token,
        clientId: globals.get('jdsClientId'),
        clientSecret: globals.get('jdsClientSecret')
      }) 
    }
  },
  v6: {
    async refresh (token) {
      // wait for globals to exist
      await Promise.resolve(globals.initialLoad)
      // refresh oauth2 token
      return oauth2.refresh({
        url: 'https://webexapis.com/v1/access_token',
        token,
        clientId: globals.get('webexV6ClientId'),
        clientSecret: globals.get('webexV6ClientSecret')
      }) 
    }
  },
  v4: {
    async refresh (token) {
      // wait for globals to exist
      await Promise.resolve(globals.initialLoad)
      // refresh oauth2 token
      return oauth2.refresh({
        url: 'https://webexapis.com/v1/access_token',
        token,
        clientId: globals.get('webexV4ClientId'),
        clientSecret: globals.get('webexV4ClientSecret')
      }) 
    }
  },
  v3: {
    async refresh (token) {
      // wait for globals to exist
      await Promise.resolve(globals.initialLoad)
      // refresh oauth2 token
      return oauth2.refresh({
        url: 'https://webexapis.com/v1/access_token',
        token,
        clientId: globals.get('webexV3ClientId'),
        clientSecret: globals.get('webexV3ClientSecret')
      }) 
    }
  }
}