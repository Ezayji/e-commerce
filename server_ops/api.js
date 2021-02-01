const express = require('express');
const apiRouter = express.Router();
const {getCustomerById} = require('./queries');

// test get req
apiRouter.get('/', (req, res, next) => {
    res.status(200).send();
})

// get customer by ID
apiRouter.get('/customer/:id', getCustomerById);

// register a new user

module.exports = apiRouter;