var app = require('express')();
var session = require('express-session');
var passport = require('passport');
var CasStrategy = require('passport-cas2').Strategy;
    
app.use(passport.initialize());
app.use(passport.session());

passport.use(new CasStrategy({
    casURL: 'https://cas-auth.rpi.edu/cas',
    propertyMap: { 
      id: 'guid',
      givenName: 'givenname',
      familyName: 'surname',
      emails: 'defaultmail'
    }
  }, 
  function(username, profile, done) {
    console.log(username, profile, done);
    User.findOrCreate({ id: profile.id }, function(err, user) {
      user.name = profile.name.givenName + ' ' + profile.name.familyName;
      done(err, user);
    });
  })
);

app.get('/auth/cas',
passport.authenticate('cas', { failureRedirect: '/login' }),
function(req, res) {
    console.log(req, res);
  // Successful authentication, redirect home.
  res.redirect('/');
});

app.listen(process.env.PORT || 8080);