if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

module.exports = app;

const PORT = process.env.PORT || 5000;

// cors
app.use(cors({
    credentials: true,
    origin: [`http://localhost:${PORT}`, `https://localhost:${PORT}`],
}));

// body-parser
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// session and passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(path.join(__dirname, 'client/build')));
// static content
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'client/build')));
};

// API ROUTER MOUNT
const apiRouter = require('./server_ops/api');
app.use('/api', apiRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// server 
app.listen(PORT, () => {
    console.log(`The app is now listening on PORT${PORT}`);
});