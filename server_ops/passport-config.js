const LocalStrategy = require('passport-local').Strategy;
const {getCustomer} = require('./queries');

const initialize = (passport) => {
    
    passport.use(new LocalStrategy(
    function(username, password, done){
        const user = {
            username,
            password
        };
        return done(null, user);
    }));

    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser((username, done) => done(null, getCustomer(username)));
};

module.exports = initialize;