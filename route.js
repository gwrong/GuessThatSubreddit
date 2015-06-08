// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var mysql      = require('mysql');
var util = require('./reddit_scraper/util')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'masked_password2',
  multipleStatements: true
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... \n\n");  
} else {
    console.log("Error connecting database ... \n\n");  
}
});


// custom library
// model
var Model = require('./model');

// index
var index = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/signin');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('index', {title: 'Home', user: user});
   }
};

// sign in
// GET
var signIn = function(req, res, next) {
   if(req.isAuthenticated()) res.redirect('/');
   res.render('signin', {title: 'Sign In'});
};

// sign in
// POST
var signInPost = function(req, res, next) {
   passport.authenticate('local', { successRedirect: '/',
                          failureRedirect: '/signin'}, function(err, user, info) {
      if(err) {
         return res.render('signin', {title: 'Sign In', errorMessage: err.message});
      } 

      if(!user) {
         return res.render('signin', {title: 'Sign In', errorMessage: info.message});
      }
      return req.logIn(user, function(err) {
         if(err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
         } else {
            return res.redirect('/');
         }
      });
   })(req, res, next);
};

// sign up
// GET
var signUp = function(req, res, next) {
   if(req.isAuthenticated()) {
      res.redirect('/');
   } else {
      res.render('signup', {title: 'Sign Up'});
   }
};


// sign up
// POST
var signUpPost = function(req, res, next) {
   var user = req.body;
   var usernamePromise = null;
   usernamePromise = new Model.User({username: user.username}).fetch();

   return usernamePromise.then(function(model) {
      if(model) {
         res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
      } else {
         //****************************************************//
         // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
         //****************************************************//
         var password = user.password;
         var hash = bcrypt.hashSync(password);

         var signUpUser = new Model.User({username: user.username, password: hash});

         signUpUser.save().then(function(model) {
            // sign in the newly registered user
            signInPost(req, res, next);
         });	
      }
   });
};


// sign out
var signOut = function(req, res, next) {
   if(!req.isAuthenticated()) {
      notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect('/signin');
   }
};

// guess
// GET
var guess = function(req, res, next) {
   if(!req.isAuthenticated()) return res.redirect('/');
   var guessValues = {}
   connection.query('use reddit; call proc_get_random_comment();', function(err, rows, fields) {
      if (!err) {
         //console.log(rows[1][0].body);
         var guessComment = rows[1][0].body;
         var guessSubreddit = rows[1][0].subreddit
         guessValues["comment"] = guessComment;
         guessValues["subreddit"] = guessSubreddit;
         util.getRandomSubreddits(guessSubreddit, function (err, guessSubreddits) {
            util.shuffleArray(guessSubreddits);
            guessValues["guessSubreddits"] = guessSubreddits;
            return res.render('guess', guessValues);
         });
      }
      else {
         console.log(err)
         guessValues["comment"] = 'error';
         return res.render('guess', guessValues);
      }
   });
};


// guess
// POST
var guessPost = function(req, res, next) {
   console.log('you made it');
};

// 404 not found
var notFound404 = function(req, res, next) {
   res.status(404);
   res.render('404', {title: '404 Not Found'});
};


// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// guess
//GET
module.exports.guess = guess;
// POST
module.exports.guessPost = guessPost;

// 404 not found
module.exports.notFound404 = notFound404;
