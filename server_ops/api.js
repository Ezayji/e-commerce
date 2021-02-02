const express = require('express');
const apiRouter = express.Router();
const passport = require('passport');
const {getCustomerById, 
       getCustomerByUsername,
       addNewCustomer,
       checkNewCustomerInfo,
       checkIfUniqueEmail,
       checkIfUniqueUsername,
       checkIfUniquePhone,
       checkUserName,
       checkUserPw} = require('./queries');

const initializePassport = require('./passport-config');
initializePassport(passport);


// test get req
apiRouter.get('/', (req, res, next) => {
    res.status(200).send();
})

// get customer by ID
apiRouter.get('/customer/:id', getCustomerById);

// get customer by USERNAME
apiRouter.get('/customer_un/:username', getCustomerByUsername);

// register a new customer
apiRouter.post('/register', checkNewCustomerInfo, checkIfUniqueEmail, checkIfUniqueUsername, checkIfUniquePhone, addNewCustomer);

// post login
apiRouter.post('/login', checkUserName, checkUserPw, passport.authenticate('local'), (req, res) => {
    res.status(200).send();
});

module.exports = apiRouter;