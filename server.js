const http = require('http');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('express-jwt');


var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});


// require the Mongoose Database Model and Configs
require('./models/db');
require('./config/passport');
var mgConf = require('./config.js');
console.log(mgConf.mongoUrl);
const app = express();

app.use(passport.initialize());


const mongo = require("mongodb");
const MongoClient = require('mongodb').MongoClient;

const eventsUrl = 'http://events.rpi.edu:7070/feeder/main/eventsFeed.do?f=y&skinName=list-json&count=200';

const User = mongoose.model("User");

// code to enable CORS for dev mode (serving angular via ng serve)
const cors = require('cors'); //<-- required installing 'cors' (npm i cors --save)
app.use(cors()); //<-- That`s it, no more code needed!

// =============================================================================
// The following block of code grabs the events from the events.rpi.edu feed, and
// pulls them as JSON format. A mongodb connection is established, and the events
// are either skipped if they exist, or are inserted if they do not.
app.get('/database/create', (req, response) => {
  http.get(eventsUrl, (res) => {
    var completeResponse = '';
    // since the events.rpi.edu page is not a 'true' API, the data is read in
    // as chunks from the page its being displayed on. 
    res.on('data', function (chunk) {
        completeResponse += chunk;
    });
    // once the page is completely read, parse the JSON data and pull the events 
    // array into is own variable.
    res.on('end', function() {
      var completeJSON = JSON.parse(completeResponse);
      var eventsArr =completeJSON['bwEventList']['events']; 

      // mongodb connection is established, and events are either added or 
      // skipped.
      MongoClient.connect(mgConf.mongoUrl, { useNewUrlParser: true }, (err, db) => {
        if (err) throw err;
        var dbo = db.db('rpievents');
        dbo.collection('events').find().count((err, res) => {console.log(res);});
        for (let i = 0; i < eventsArr.length; i++) {
          // the 'eventlink' is the most unique feature of the events, since recurring events 
          // include their recurrance date (since the GUID field is not-unique for recurring events)
          dbo.collection('events').find({eventlink:eventsArr[i]['eventlink']}).count((err, count) => {
            if (err) throw err;
            if (count > 0) {
              // console.log('Record with guid: ' + eventsArr[i]['guid'] + ' exists, skipping.')
            }
            else {
              dbo.collection('events').insertOne(eventsArr[i], (err, response) => {
                if (err) throw err;
                // console.log('Inserted event with guid: ' + eventsArr[i]['guid']);
              });
            }
          });
        }
      })
    })
  });
});
// =============================================================================
app.get('/events', (req, res) => {
  MongoClient.connect(mgConf.mongoUrl, { useNewUrlParser : true }, (err, db) => {
    if (err) throw err;
    var dbo = db.db('rpievents');
    dbo.collection('events').find().toArray((err, data) => {
      if (err) throw err;
      // console.log(data);
      res.send({status: 200, json: data});
      db.close();
    });
  });
});

app.get('/events/id', (req, res) => {
  // console.log(req.query.eventid);
  MongoClient.connect(mgConf.mongoUrl, { useNewUrlParser : true }, (err, db) => {
    if (err) throw err;
    var dbo = db.db('rpievents');
    dbo.collection('events').find({_id: mongo.ObjectId(req.query.eventid)}).toArray((err, data) => {
      if (err) throw err;
      // console.log(data);
      res.send({status: 200, json: data});
      db.close();
    });
  });
});

app.get('/events/comments', (req, res) => {
  // console.log(req.query.eventid);
  MongoClient.connect(mgConf.mongoUrl, { useNewUrlParser : true }, (err, db) => {
    if (err) throw err;
    var dbo = db.db('rpievents');
    dbo.collection('discussion').find({event_id: mongo.ObjectId(req.query.eventid)}).toArray((err, data) => {
      if (err) throw err;
      // console.log(data);
      res.send({status: 200, json: data});
      db.close();
    });
  });
});

app.post('/auth/register', (req, res) => {
  var user = new User();

  console.log(req.query);

  user.name = req.query.name;
  user.email = req.query.email;

  console.log(req.query.password);

  user.setPassword(req.query.password);

  user.save((err) => {
    res.status(200);
    res.json({'token': user.generateJwt()});
  });
});

app.post('/auth/login', (req,res,next) => {
  console.log('rcvd login request');
  console.log(req);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.status(404).json(err);
      return;
    }
    if (user) {
      res.status(200).json({"token": user.generateJwt()});
    }
    else {
      res.status(401).json(info);
    }
  })(req,res,next);
});


// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3000);

// https://www.sitepoint.com/user-authentication-mean-stack/