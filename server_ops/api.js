const express = require('express');
const apiRouter = express.Router();
const passport = require('passport');
const {getCustomerByUsername,
       addNewCustomer,
       checkNewCustomerInfo,
       checkIfUniqueEmail,
       checkIfUniqueUsername,
       checkIfUniquePhone,
       checkUserName,
       checkUserPw,
       checkAuthenticated,
       updateCustomer,
       checkUpdatedInfo,
       updateCustomerAddress,
       getCustomerAddress,
       checkUpdatedAddress} = require('./queries');

const initializePassport = require('./passport-config');
initializePassport(passport);


// test get req
apiRouter.get('/', (req, res, next) => {
    res.status(200).send();
})
/*
// get customer by ID
apiRouter.get('/customer/:id', getCustomerById);
*/
// get customer by USERNAME
apiRouter.get('/customer_un/:username', checkAuthenticated, getCustomerByUsername);

// register a new customer
apiRouter.post('/register', checkNewCustomerInfo, checkIfUniqueEmail, checkIfUniqueUsername, checkIfUniquePhone, addNewCustomer);

// update customer profile info
apiRouter.put('/customer_un/:username', checkAuthenticated, checkUpdatedInfo, checkIfUniqueEmail, checkIfUniquePhone, updateCustomer, getCustomerByUsername);

// get customer address
apiRouter.get('/customer_address/:username', checkAuthenticated, getCustomerAddress);

//update customer address
apiRouter.put('/customer_address/:username', checkAuthenticated, checkUpdatedAddress, updateCustomerAddress, getCustomerAddress);

// post login
apiRouter.post('/login', checkUserName, checkUserPw, passport.authenticate('local'), (req, res) => {
    res.status(200).send({user: req.user});
});

// logout
apiRouter.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send();
})

module.exports = apiRouter;