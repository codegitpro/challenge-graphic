const express = require('express');

const { SERVE_HOSTNAME, SERVE_PORT } = require('../src/config.json');
const cookieSession = require('cookie-session');
const { v4: uuid } = require('uuid')
require('dotenv-safe').config();

const app = express();

app.use(cookieSession({
  name: 'shortlinks',
  keys: [process.env.SESHSECRET],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}))


app.use(function(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  req.session.id = (req.session.id || uuid());
  res.header('Access-Control-Allow-Origin', '*');
  next(); // pass control to the next handler
});


app.get('/', (req, res) => {
  res.json({
    backend: 'ok',
    session_id: req.session.id
  })
})


app.get(
  '/api/links', 
  (req, res, next)=> {
    res.json([
      'test1',
      'test2'
    ])
    // TODO
    next();
  }
)

app.post(
  '/api/links', 
  (req, res, next)=> {
    // TODO
    next();
  }
)


app.get(
  '/api/links/:id', 
  (req, res, next)=> {
    // TODO
    res.send(`Id=${req.params.id}`);
    next();
  }
)


app.listen(
  SERVE_PORT, 
  SERVE_HOSTNAME,
  ()=> console.log(`Shortlinks backend listening on ${SERVE_HOSTNAME}:${SERVE_PORT}!`)
)