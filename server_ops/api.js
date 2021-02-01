const express = require('express');
const apiRouter = express.Router();
const {getCustomerById, 
       getCustomerByUsername,
       addNewCustomer} = require('./queries');

// test get req
apiRouter.get('/', (req, res, next) => {
    res.status(200).send();
})

// get customer by ID
apiRouter.get('/customer/:id', getCustomerById);

// get customer by USERNAME
apiRouter.get('/customer_un/:username', getCustomerByUsername);

// register a new customer
apiRouter.post('/register', addNewCustomer);

module.exports = apiRouter;