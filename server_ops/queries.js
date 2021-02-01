// Initialize Postgres pool
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'postgres',
    port: 5432,
});


// get user by id
const getUserById = (request, response) => {
    const id = parseInt(request.params.id);
    const text = 'SELECT id, username, first_name, last_name, email, phone, registered FROM customer WHERE id = $1';

    pool.query(text, [id], (error, results) => {
        if(isNaN(id)){
            response.status(400).send()
            //throw error;
        } else if(results.rows[0] === undefined){
            response.status(404).send();
        } else {
            response.status(200).json(results.rows[0]);
        };
    });
    
};

module.exports = {getUserById};