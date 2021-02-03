const LocalStrategy = require('passport-local').Strategy;

const initialize = (passport) => {
    
    passport.use(new LocalStrategy(
    function(username, password, done){
        const user = {
            username,
        };
        return done(null, user);
    }));

    passport.serializeUser((user, done) => done(null, user.username));
    passport.deserializeUser((username, done) => done(null, username));
};

module.exports = initialize;
/*getCustomer(username)*/