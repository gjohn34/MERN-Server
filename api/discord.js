const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const btoa = require('btoa')

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const FRONT_END_CALLBACK = process.env.FRONT_END_URL
const redirect = encodeURIComponent('https://stormy-tundra-35633.herokuapp.com/api/discord/callback');

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', async function(request, response) {
  if (!request.query.code) throw new Error('NoCodeProvided')
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
  if (jsonUserData.id == '365065121149485058') {
    response.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: false })
    response.redirect('https://elated-lovelace-d9b735.netlify.com/api/discord/confirmed')
  } else {
    response.sendStatus(401)
  }
})


module.exports = router
