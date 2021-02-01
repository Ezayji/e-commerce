const express = require('express');
const apiRouter = express.Router();
const {getUserById} = require('./queries');

// test get req
apiRouter.get('/', (req, res, next) => {
    res.status(200).send();
})

// get user by ID
apiRouter.get('/customer/:id', getUserById);

module.exports = apiRouter;