// Initialize Postgres pool
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'postgres',
    port: 5432,
});


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
    const text = 'SELECT id, username, first_name, last_name, email, phone, registered FROM customer WHERE username = $1';
    
    pool.query(text, [username], (error, results) => {
        if(!isNaN(parseInt(username))){
            response.status(400).send();
        } else if (results.rows[0] === undefined) {
            response.status(404).send();
        } else {
            response.status(200).json(results.rows[0]);
        };
    });
};

// register a new customer
const addNewCustomer = (request, response) => {
    const text = "INSERT INTO customer (id, username, first_name, last_name, email, phone, password, registered) VALUES (nextval('customer_sequence'), $1, $2, $3, $4, $5, crypt($6, gen_salt('bf')), $7)";
    const {username, first_name, last_name, email, phone, password, registered} = request.body;

    pool.query(text, [username, first_name, last_name, email, phone, password, registered], (error, results) => {
        if(error){
            response.status(400).send();
        } else {
            response.status(201).send();
        };

    });
};


module.exports = {getCustomerById, getCustomerByUsername, addNewCustomer};