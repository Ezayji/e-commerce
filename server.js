const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app;

const PORT = process.env.PORT || 3000;

// cors
app.use(cors());

// body-parser
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// API ROUTER MOUNT
const apiRouter = require('./server_ops/api');
app.use('/api', apiRouter);

// server 
app.listen(PORT, () => {
    console.log(`The app is now listening on PORT${PORT}`);
});