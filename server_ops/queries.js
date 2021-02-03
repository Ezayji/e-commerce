// Initialize Postgres pool
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'postgres',
    port: 5432,
});
// crypting pw
const bcrypt = require('bcrypt');


// GETTING CUSTOMER INFO

// verify access
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user === req.params.username){
        next();
    } else {
        res.status(400).send('Access not verified');
    };
};

// get customer by id
const getCustomerById = (request, response) => {
    const id = parseInt(request.params.id);
    const text = 'SELECT id, username, first_name, last_name, email, phone, registered FROM customer WHERE id = $1';

    pool.query(text, [id], (error, results) => {
        if(isNaN(id)){
            response.status(400).send()
        } else if(results.rows[0] === undefined){
            response.status(404).send();
        } else {
            response.status(200).json(results.rows[0]);
        };
    });
};

// get customer by username
const getCustomerByUsername = (request, response) => {
    const username = request.params.username;

    if(!isNaN(parseInt(username))){
        response.status(400).send();
    }

    const text = 'SELECT id, username, first_name, last_name, email, phone, registered FROM customer WHERE username = $1';

    pool.query(text, [username], (error, results) => {
        if (results.rows[0] === undefined) {
            response.status(404).send();
        } else {
            response.status(200).json(results.rows[0]);
        };
    });
};


// REGISTERING PROCCESS

// check for empty fields in registration
const checkNewCustomerInfo = (request, response, next) => {
    const {username, first_name, last_name, email, phone, password, registered} = request.body;
    
    if(username === undefined || username === '' || first_name === undefined || first_name === '' || last_name === undefined || last_name === '' || email === undefined || email === '' || phone === undefined || phone === '' || password === undefined || password === '' || registered === undefined || registered === ''){
        response.status(400).send();
    } else {
        next();
    };
};

// check for existing email
const checkIfUniqueEmail = (request, response, next) => {
    const text = 'SELECT id FROM customer WHERE email = $1';
    const {email} = request.body;
    
    pool.query(text, [email], (error, results) => {
        if (results.rows[0] === undefined){
            next();
        } else {
            response.status(400).send('Not unique email');
        }
    });
};
// check for existing username
const checkIfUniqueUsername = (request, response, next) => {
    const text = 'SELECT id FROM customer WHERE username = $1';
    const {username} = request.body;

    pool.query(text, [username], (error, results) => {
        if(results.rows[0] === undefined){
            next();
        } else {
            response.status(400).send('Not unique username');
        }
    });
};
// check for existing phone number
const checkIfUniquePhone = (request, response, next) => {
    const text = 'SELECT id FROM customer WHERE phone = $1';
    const {phone} = request.body;

    pool.query(text, [phone], (error, results) => {
        if(results.rows[0] === undefined){
            next();
        } else {
            response.status(400).send('Not unique phone');
        }
    })
}


// register a new customer
const addNewCustomer = async (request, response) => {
    const text = "INSERT INTO customer (id, username, first_name, last_name, email, phone, password, registered) VALUES (setval('customer_sequence', (SELECT MAX(id) FROM customer)+1), $1, $2, $3, $4, $5, $6, $7)";
    const {username, first_name, last_name, email, phone, password, registered} = request.body;
    const cryptedPw = await bcrypt.hash(password, 10);
    pool.query(text, [username, first_name, last_name, email, phone, cryptedPw, registered], (error, results) => {
        if(error){
            response.status(400).send();
        } else {
            response.status(201).send();
        };

    });
};


// LOGIN

//check if username is registered
const checkUserName = (request, response, next) => {
    const text = 'SELECT id FROM customer WHERE username = $1';
    const {username} = request.body;

    pool.query(text, [username], (error, results) => {
        if(results.rows[0] === undefined){
            response.status(404).send('User not found');
        } else {
            next();
        };
    });
};

//check if password is correct
const checkUserPw = (request, response, next) => {
    const text = 'SELECT password FROM customer WHERE username = $1';
    const {username, password} = request.body;

    pool.query(text, [username], async (error, results) => {
        if(await bcrypt.compare(password, results.rows[0].password)){
            next();
        } else {
            response.status(400).send('Wrong password');
        };
    });
};


module.exports = {getCustomerById, 
                getCustomerByUsername, 
                addNewCustomer, 
                checkNewCustomerInfo, 
                checkIfUniqueEmail, 
                checkIfUniquePhone, 
                checkIfUniqueUsername, 
                checkUserName, 
                checkUserPw,
                checkAuthenticated};