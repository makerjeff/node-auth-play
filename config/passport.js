// config/passport.js

// load all dependencies
var LocalStrategy = require('passport-local').Strategy;

// load user model
var User = require('../app/models/user.js');

// expose this function to our app using module.exports
module.exports = function(passport){

    // ==================================
    // passport session setup ===========
    // ==================================
    // require for persistent login sessions
    // passport needs to be able to serialize and deserialize users out of sessions

    // used to serialize user for the session
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    //used to deserialize user
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    // =================================
    // LOCAL SIGNUP ====================
    // =================================
    // using named strategies since we have one for login, one for signup.
    // by default, it would just be called 'local'.

    passport.use('local-signup', new LocalStrategy({
        //by default, local strategy uses username and password, which we'll override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done){
        //async
        //User.findOne wont fire unless data is sent back
        process.nextTick(function(){
            //waits until the next pass of the loop before executing in here:

            //find a user whose email is the same as the forms email
            //check to see if the user trying to login exists
            User.findOne({'local.email':email}, function(err, user){

                if(err) return done(err);

                //check to see if theres already a user with that email
                if(user) {
                    return done(null,false,req.flash('signupMessage'), 'That email is already taken.');
                } else {
                    // if there is no user with that email...
                    var newUser = new User();

                    //set the users local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    //save the user
                    newUser.save(function(err){
                        if(err) {
                            throw err;
                        } else {
                            return done(null, newUser);
                        }
                    });
                }
            });
        });
    }));

    // ===================================
    // LOCAL LOGIN =======================
    // ===================================
    // we are using named strategies since we have both login and signup, otherwise it'd be 'local'
    passport.use('local-login', new LocalStrategy({
        //override default fields
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true    //allow pass back
    },
    function(req, email, password, done) {  //callback with email and pw from our form
        //find a user whos email is the same as the forms email
        //check if user exists
        User.findOne({'local.email' : email}, function (err, user){

            //errors (TODO: clean up with else-ifs
            if(err) {
                return done(err);
            }
            //no user found
            if(!user){
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }

            //if user is found, but password is wrong
            if(!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }

            //if all is well, fall through to...
            return done(null, user);


        });

    }
    ));
};