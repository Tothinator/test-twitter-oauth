const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const TwitterTokenStrategy = require("passport-twitter-token");
const { User } = require("../models");

// Telling passport we want to use a Local Strategy.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // When a user tries to sign in this code runs
        User.findOne({ username: username })
            .then(dbUser => {
                if (!dbUser || !dbUser.validPassword(password)) {
                    return done(null, false, { message: "Incorrect Username or Password"})
                } else {
                    done(null, dbUser);
                }
            }).catch(err => console.log(err));
    }
));

passport.use(new TwitterTokenStrategy({

    consumerKey: "PUKeIFz9XrfpLMaePxdSBCOpo",
    consumerSecret: "u6YVPzov7A2RKOd37PGIASbQAG09aHUrolU93YXhqL9aBZuyXJ",
    passReqToCallback: true
},
    function(req, token, tokenSecret, profile, done) {

        if (req.user) {
            User.findOne({
                username: req.user.username
            })
            .then(dbUser => {
                // If there's no user with the given
                if (!dbUser) {
                    console.log("Failed to find user in DB!");
                    return done(null, false, {
                        message: "User doesn't have an account"
                    });
                } else if (dbUser.twitter.id !== undefined) {
        
                    console.log("Twitter is already connected!")
                    // Twitter is already connected
                    return done(null, dbUser);
                } else {

                    // Update user model to include twitter info
                    dbUser.twitter.id = profile.id;
                    dbUser.twitter.token = token;
                    dbUser.twitter.displayName = profile.displayName;
                    dbUser.twitter.handle = profile.username;
                    dbUser.twitter.photo = profile.photos[0].value || '';

                    User.updateOne({ username: dbUser.username}, dbUser)
                        .then(newUser => {
                            const user = newUser;
                            done(null, user);
                        })
                        .catch(err => console.log(err));
                }
            }).catch(err => console.log(err));
        } else {
            return done(null, false, {
                message: "User isn't Authenticated with this application!"
            })
        }
    }
))

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
})

module.exports = passport;