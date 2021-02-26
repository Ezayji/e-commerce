const pool = require('./postgres_pool');
// crypting pw
const bcrypt = require('bcrypt');


// GETTING CUSTOMER INFO

// verify access based on params username and req user
const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user === req.params.username){
        next();
    } else {
        res.status(400).send('Access not verified');
    };
};

// check if not authenticated
const checkNotAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        next();
    } else {
        res.status(400).send('You are already authenticated');
    };
};

// verify access based on req.user and return username
const verifyAuth = (req, res) => {
    if (req.isAuthenticated()){
        res.status(200).send({user: {username: req.user}});
    } else {
        res.status(400).send('Access not verified');
    };
};

// verify access based on req.user and call next middleware
const verifyPayer = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
    } else {
        res.status(400).send('Access not verified');
    };
};

// get customer by username
const getCustomerByUsername = (request, response) => {
    const username = request.params.username;
    const text = 'SELECT id, username, first_name, last_name, email, phone, registered FROM customer WHERE username = $1';
    if(!isNaN(username)){
        response.status(400).send();
    } else {
        pool.query(text, [username], (error, results) => {
            if (results.rows[0] === undefined) {
                response.status(404).send('No user with that username');
            } else {
                response.status(200).json(results.rows[0]);
            };
        });
    };
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

// check for existing email where the user is not the one requesting
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
};


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

// check for empty and unnecessary fields in update request
const checkUpdatedInfo = (request, response, next) => {
    const {first_name, last_name, email, phone} = request.body;
    const body = request.body;

    if(first_name === '' || first_name === undefined || last_name === '' || last_name === undefined || email === '' || email === undefined || phone === '' || phone === undefined){
        response.status(404).send('Some field(s) missing');
    } else if (body.id !== undefined || body.username !== undefined || body.password !== undefined || body.registered !== undefined || body.appartment_nr !== undefined || body.street !== undefined || body.city !== undefined || body.province !== undefined || body.zip !== undefined || body.country !== undefined){
        response.status(400).send('Too much information');
    } else {
        next();
    };
};

// check if no other user has the email in update request(accept old email)
const checkUpdatedEmail = (request, response, next) => {
    const text = 'SELECT id FROM customer WHERE email = $1 AND username != $2';
    const {email} = request.body;
    const username = request.params.username;

    pool.query(text, [email, username], (error, results) => {
        if (results.rows[0] === undefined){
            next();
        } else {
            response.status(400).send('Not unique email');
        }
    });
};

// check if no other user has the phone nr in update request(accept old phone nr)
const checkUpdatedPhone = (request, response, next) => {
    const text = 'SELECT id FROM customer WHERE phone = $1 AND username != $2';
    const {phone} = request.body;
    const username = request.params.username;

    pool.query(text, [phone, username], (error, results) => {
        if(results.rows[0] === undefined){
            next();
        } else {
            response.status(400).send('Not unique phone');
        }
    });
};

// update query
const updateCustomer = async (request, response, next) => {
    const text = 'UPDATE customer SET first_name = $1, last_name = $2, email = $3, phone = $4 WHERE username = $5';
    const {first_name, last_name, email, phone} = request.body;
    const username = request.params.username;
    
    pool.query(text, [first_name, last_name, email, phone, username], (error, results) => {
        if(error){
            throw error;
        } else {
            next();
        };
    });
};

// UPDATE CUSTOMER PASSWORD

// check old password and request body
const checkOldPw = (request, response, next) => {
    const {password, new_password} = request.body;
    const username = request.params.username;
    const text = 'SELECT password FROM customer WHERE username = $1';

    if(password === undefined || password === '' || new_password === undefined || new_password === ''){
        response.status(404).send('Some Field(s) not present');
    } else {
        pool.query(text, [username], async (error, results) => {
            if(error){
                throw error;
            } else if(await bcrypt.compare(password, results.rows[0].password)){
                next();
            } else {
                response.status(400).send('Wrong Password Provided');
            };
        });
    };
};

// password update quey
const updatePw = async (request, response) => {
    const text = 'UPDATE customer SET password = $1 WHERE username = $2';
    const {password, new_password} = request.body;
    const username = request.params.username;
    const cryptedPw = await bcrypt.hash(new_password, 10);

    pool.query(text, [cryptedPw, username], (error, results) => {
        if(error){
            throw error;
        } else {
            response.status(200).send('Password Updated Succesfully');
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
                verifyAuth,
                checkNotAuthenticated,
                updateCustomer,
                checkOldPw,
                updatePw,
                checkUpdatedInfo,
                getCustomerAddress,
                updateCustomerAddress,
                checkUpdatedAddress,
                checkUpdatedEmail,
                checkUpdatedPhone};