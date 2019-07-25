require('dotenv').config()
const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const btoa = require('btoa')
const jwt = require('jsonwebtoken')
const AuthUser = require('../models/AuthUsers')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent(`${process.env.EXPRESS_SERVER_URL}/api/discord/callback`);


// From the front end, when a user is trying to access the admin dashboard they are redirected to /api/discord/login. We take our user to discord's
// OAuth2 authentification site. The user allows access then are again redirected to /api/discord/callback (encoded above and into the URL)
router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

//Fun Stuff. We are expecting a code to be provided in the request object, if there isn't (ie someone comes directly to the page
// without going through OAuth first) we throw an error. If that code IS there, we take the code and our b64 encoded credentials (CLIENT ID & SECRET)
// and post to the discord API a request for information. If our credentials match what was provided to Discord through the users authorization we are
// sent a data object back that we convert to json.
//
router.get('/callback', async function(request, response) {
  if (!request.query.code) throw new Error('No Code Provided')
  const code = request.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const grant = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  let token = await grant.json()
  token = token.access_token
  const userData = await fetch('http://discordapp.com/api/users/@me',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  const jsonUserData = await userData.json()

// with the json data, we compare the ID against our database of authorized users. if they match the user we create a JWT
// and redirect the user back to the react front end with the JWT where it will be decoded and the user allowed in.
// If no matches a 404 is returned..

  const authorizedUsers = await AuthUser.find()
  authorizedUsers.forEach(function(adminUser) {
    if (jsonUserData.id == adminUser.user_id) {
      ////fix this please
      const webtoken = jwt.sign({authorized: true}, 'superSecretKey')
      response.redirect(`${process.env.FRONT_END_URL}/api/discord/confirmed/${webtoken}`)
    }
  })
  response.sendStatus(404)
})


module.exports = router
