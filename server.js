//Install express server
const express = require('express');
const path = require('path');
const app = express();
var session = require('express-session');
var CASAuthentication = require('cas-authentication');

app.use( session({
  secret            : 'super secret key',
  resave            : false,
  saveUninitialized : true
}));

// Create a new instance of CASAuthentication.
var cas = new CASAuthentication({
  cas_url     : 'https://cas-auth.rpi.edu/cas',
  service_url : 'http://localhost:8080',
  port: '443',
  cas_version : '3.0',
  session_info: 'session_inf',
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
              cas_session: req.session[ cas.session_inf ] 
          } );
});

// Unauthenticated clients will be redirected to the CAS login and then to the
// provided "redirectTo" query parameter once authenticated.
app.get( '/authenticate', cas.bounce, function(req, res) {
  console.log(session);
  // console.log('--------------');
  // console.log(res);
  // console.log('--------------');
  res.send('<html><body>xx</body></html>');
});

// This route will de-authenticate the client with the Express server and then
// redirect the client to the CAS logout page.
app.get( '/logout', cas.logout );

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/itws4500project'));

app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname + '/dist/itws4500project/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);