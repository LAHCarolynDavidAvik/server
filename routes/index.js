'use strict';
var express = require('express');
var router = express.Router();
var low = require('lowdb');
var db = low(`${__dirname}/../db.json`);
console.log(JSON.stringify(db.getState()));
db.defaults({ users: [], transactions: [] })
  .value()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/signup', (req, res) => {
  db.get('users')
    .push({
      username: req.body.username,
      name: req.body.name,
      password: req.body.password,
      score: 0,
      transactions: [],
      imgUrl: req.body.imgUrl,
      createdAt: Date.now(),
      friendUsernames: []
    }).value();
  res.sendStatus(200);
});

router.get('/login', (req, res) => {
  const user = db.get('users').find({ 
    username: req.query.username
  }).value();
  console.log(user);
  if(user)
    return res.json(user);
  res.send(404);
});

module.exports = router;
