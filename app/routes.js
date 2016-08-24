// app/routes.js

//JWX NOTE: export a function that you can plug in arguments to.
module.exports = function(app, passport) {

    // ==============================
    // HOME PAGE (with login) =======
    // ==============================
    // 2016.AUG.24: modifying to check if there's a req.user, if so, go straight to profile.
    // NOTE: don't forget to pass the req.user object to the front end.
    app.get('/', function(req, res){

        if(!req.user) {
            res.render('index.ejs', {
                user: req.user  //get the user out of the session and pass to template
            });
        } else {
            res.render('profile.ejs', {
                user: req.user  //get the user out of the session and pass to template

            });
            console.log('logged in with this user: ');
            console.log(req.user);
        }

    });

    // ==============================
    // LOGIN ========================
    // ==============================
    // show the login form
    app.get('/login', function(req,res){
        //render the page and pass in any flash data, if exists
        res.render('login.ejs', {message: req.flash('loginMessage')} );
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', //redirect to the secure profile section
        failureRedirect: '/login' //redirect to the login page if failure
    }));

    // ==============================
    // SIGNUP =======================
    // ==============================
    // show the signup form
    app.get('/signup', function(req, res){
        //render the page, and any flash messages
        res.render('signup.ejs', {message:req.flash('signupMessage')});
    });

    //process the signup form (JWX: using the same route, just post
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',    //redirect to the secure profile section
        failureRedirect: '/signup',     //redirect to signup page if there's an error
        failureFlash: true  //allow flash messages
    }));

    // ==============================
    // PROFILE SECTION ==============
    // ==============================
    // this needs to be protected, so login is required.
    // use 'route middleware' to verify, (isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', {
            user: req.user  //get the user out of the session and pass to template

        });
    });

    // ==============================
    // LOGOUT =======================
    // ==============================
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

};

// route middleware to check that the user is logged in
function isLoggedIn(req, res, next){
    //if user is authenticated in the session, proceed forward
    if(req.isAuthenticated()) {
        return next();
    } else {
        //if they aren't, redirect to home page
        res.redirect('/');
    }
}