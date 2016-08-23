// app/routes.js

//JWX NOTE: export a function that you can plug in arguments to.
module.exports = function(app, passport) {

    // ==============================
    // HOME PAGE (with login) =======
    // ==============================
    app.get('/', function(req, res){
        res.render('index.ejs');
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
    // app.post('/login', login here);

    // ==============================
    // SIGNUP =======================
    // ==============================
    // show the signup form
    app.get('/signup', function(req, res){
        //render the page, and any flash messages
        res.render('signup.ejs', {message:req.flash('signupMessage')});
    });

    //process the signup form (JWX: using the same route, just post
    // app.post('/signup', process here);

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