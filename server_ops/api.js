const express = require('express');
const apiRouter = express.Router();
const {getCustomerById, 
       getCustomerByUsername,
       addNewCustomer,
       checkNewCustomerInfo,
       checkIfUniqueEmail,
       checkIfUniqueUsername,
       checkIfUniquePhone} = require('./queries');

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

module.exports = apiRouter;