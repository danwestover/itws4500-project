const http = require('http');
const express = require('express');
// const path = require('path');
const app = express();
var session = require('express-session');
var CASAuthentication = require('cas-authentication');
const mongo = require("mongodb");
const MongoClient = require('mongodb').MongoClient;

const eventsUrl = 'http://events.rpi.edu:7070/feeder/main/eventsFeed.do?f=y&skinName=list-json&count=200';
const mongoUrl = 'mongodb+srv://dbUser:UUvw0MzBK77rIb4N@cluster0-3htsp.mongodb.net/test?retryWrites=true'

app.use(session({
  secret            : 'super secret key',
  resave            : false,
  saveUninitialized : true
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
  cas_url     : 'https://cas-auth.rpi.edu/cas',
  service_url : 'http://localhost:3000'
});

// code to enable CORS for dev mode (serving angular via ng serve)
const cors = require('cors'); //<-- required installing 'cors' (npm i cors --save)
app.use(cors()); //<-- That`s it, no more code needed!

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
      MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, db) => {
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
  MongoClient.connect(mongoUrl, { useNewUrlParser : true }, (err, db) => {
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
  MongoClient.connect(mongoUrl, { useNewUrlParser : true }, (err, db) => {
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


// Unauthenticated clients will be redirected to the CAS login and then back to
// this route once authenticated.
app.get( '/app', cas.bounce, function ( req, res ) {
  res.send( '<html><body>Hello!</body></html>' );
});

// Unauthenticated clients will receive a 401 Unauthorized response instead of
// the JSON data.
app.get( '/api', cas.block, function ( req, res ) {
  res.json( { success: true } );
});

// An example of accessing the CAS user session variable. This could be used to
// retrieve your own local user records based on authenticated CAS username.
app.get( '/api/user', cas.block, function ( req, res ) {
  console.log({cas_info: req.session});
  res.json( { cas_user: req.session[ cas.session_name ],
              // cas_session: req.session[ cas.session_inf ] 
          } );
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
app.get( '/authenticate', cas.bounce, function(req, res) {
  console.log(session);
  res.redirect("http://localhost:4200");
});

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
app.get( '/logout', cas.logout );



// Serve only the static files form the dist directory
// app.use(express.static(__dirname + '/dist/itws4500project'));

// app.get('/*', function (req, res) {
    // res.sendFile(path.join(__dirname + '/dist/itws4500project/index.html'));
// });

// app.get('/', function(req,res) {
//   res.send("<a href=/authenticate>Click here to login</a>");
// });

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3000);