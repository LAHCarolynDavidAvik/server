'use strict';
var express = require('express');
var router = express.Router();
var low = require('lowdb');
var db = low(`${__dirname}/../db.json`);
console.log(JSON.stringify(db.getState()));
db.defaults(require('./dbDefaults'))
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

router.post('/add_friend', (req, res) => {
  console.log(req.body.username, req.body.friendUsername);
  if(!db.get('users').find({username: req.body.username}).value() 
    || !db.get('users').find({username: req.body.friendUsername}).value())
    res.sendStatus(404);
  db.get('users')
    .find({ username: req.body.username })
    .get('friendUsernames')
    .push(req.body.friendUsername).value();
  db.get('users')
    .find({ username: req.body.friendUsername })
    .get('friendUsernames')
    .push(req.body.username).value();
  res.sendStatus(200);
});

router.get('/login', (req, res) => {
  const user = db.get('users').find({ 
    username: req.query.username,
    password: req.query.password
  }).value();
  console.log(user);
  if(user) {
    return res.json(populateUser(user));
  }
  res.send(404);
});

router.post('/add_transaction', (req, res) => {
  db.get('transactions')
    .push({
      lender: req.body.lender,
      debtor: req.body.debtor,
      quantity: req.body.quantity,
      description: req.body.description,
      deadline: req.body.deadline,
      interest: req.body.interest,
      createdAt: Date.now(),
      status: 0
    }).value();
  res.sendStatus(200);
});

//router.get('/user_transactions')
module.exports = router;

// helper functions
function populateUser(user) {
  var result = Object.assign({}, user);
  result.friends = user.friendUsernames
    .map(friendUsername => db.get('users').find({ username: friendUsername }).value());
  return result;
}