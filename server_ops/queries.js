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

// get customer by username
const getCustomerByUsername = (request, response) => {
    const username = request.params.username;

    if(!isNaN(parseInt(username))){
        response.status(400).send();
    }

    const text = 'SELECT id, username, first_name, last_name, email, phone, registered FROM customer WHERE username = $1';

    pool.query(text, [username], (error, results) => {
        if (results.rows[0] === undefined) {
            response.status(404).send('No user with that username');
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
        response.status(400).send('Some field(s) not represented');
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


// UPDATE customer info

// chekc for empty and unnecessary fields in update request
const checkUpdatedInfo = (request, response, next) => {
    const {first_name, last_name, email, phone, password} = request.body;
    const body = request.body;

    if(first_name === '' || first_name === undefined || last_name === '' || last_name === undefined || email === '' || email === undefined || phone === '' || phone === undefined || password === '' || password === undefined){
        response.status(404).send('Some field(s) missing');
    } else if (body.registered !== undefined || body.appartment_nr !== undefined || body.street !== undefined || body.city !== undefined || body.province !== undefined || body.zip !== undefined || body.country !== undefined){
        response.status(400).send('Too much information');
    } else {
        next();
    };
};

// update query
const updateCustomer = async (request, response, next) => {
    const text = 'UPDATE customer SET first_name = $1, last_name = $2, email = $3, phone = $4, password = $5 WHERE username = $6';
    const {first_name, last_name, email, phone, password} = request.body;
    const username = request.params.username;
    const cryptedPw = await bcrypt.hash(password, 10);

    pool.query(text, [first_name, last_name, email, phone, cryptedPw, username], (error, results) => {
        if(error){
            throw error;
        } else {
            next();
        };
    });
};


// CUSTOMER ADDRESS

// GET customer address
const getCustomerAddress = (request, response) => {
    const text = 'SELECT username, appartment_nr, street, city, province, zip, country FROM customer WHERE username = $1';
    const username = request.params.username;

    pool.query(text, [username], (error, results) => {
        if(error){
            throw error;
        } else {
            response.status(200).send(results.rows[0])
        };
    });
};

//check for empty and unnecessary fields in the update request
const checkUpdatedAddress = (request, response, next) => {
    const {appartment_nr, street, city, province, zip, country} = request.body;
    const body = request.body;

    if(appartment_nr === undefined || appartment_nr === '' || street === undefined || street === '' || city === undefined || city === '' || province === undefined || province === '' || zip === undefined || zip === '' || country === undefined || country === ''){
        response.status(404).send('Some field(s) missing');
    } else if (isNaN(zip)) {
        response.status(400).send('Not a valid zip')
    } else if(body.id !== undefined || body.username !== undefined || body.first_name !== undefined || body.last_name !== undefined || body.email !== undefined || body.phone !== undefined || body.password !== undefined || body.registered !== undefined){
        response.status(400).send('Too much information');
    } else {
        next();
    };
};

//Update customer address
const updateCustomerAddress = (request, response, next) => {
    const text = 'UPDATE customer SET appartment_nr = $1, street = $2, city = $3, province = $4, zip = $5, country = $6 WHERE username = $7';
    const {appartment_nr, street, city, province, zip, country} = request.body;
    const username = request.params.username;

    pool.query(text, [appartment_nr, street, city, province, zip, country, username], (error, results) => {
        if(error){
            throw error;
        } else {
            next();
        };
    });
};


module.exports = {getCustomerByUsername, 
                addNewCustomer, 
                checkNewCustomerInfo, 
                checkIfUniqueEmail, 
                checkIfUniquePhone, 
                checkIfUniqueUsername, 
                checkUserName, 
                checkUserPw,
                checkAuthenticated,
                updateCustomer,
                checkUpdatedInfo,
                getCustomerAddress,
                updateCustomerAddress,
                checkUpdatedAddress};