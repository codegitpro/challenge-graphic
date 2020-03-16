const express = require('express');

const { SERVE_HOSTNAME, SERVE_PORT } = require('../src/config.json');
const cookieSession = require('cookie-session');
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const urlController = require('./controllers/url.controller');
require('dotenv-safe').config();

mongoose.connect(
  process.env.MONGO_URI, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  }
);

const app = express();

console.log("SITE_URL", process.env.SITE_URL)
app.use(cors({ 
  origin: process.env.SITE_URL,
  credentials: true 
}));
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'shortlinks',
  keys: [process.env.SESHSECRET],
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}));

app.use(function(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  req.session.id = (req.session.id || uuid());
  next(); // pass control to the next handler
});


app.get('/', (req, res) => {
  res.json({
    backend: 'ok',
    session_id: req.session.id
  })
})


app.get('/api/links', urlController.list);

app.post('/api/links', urlController.shorten);

app.get('/api/links/:id', urlController.get);

app.get('/:id', urlController.redirect);

app.listen(
  SERVE_PORT, 
  SERVE_HOSTNAME,
  ()=> console.log(`Shortlinks backend listening on ${SERVE_HOSTNAME}:${SERVE_PORT}!`)
)