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


// server 
app.listen(PORT, () => {
    console.log(`The app is now listening on PORT${PORT}`);
});