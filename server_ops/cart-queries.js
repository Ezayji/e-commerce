// Initialize Postgres pool
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'postgres',
    port: 5432,
});

// POST NEW CART LOG

// check new cart log fields and if the product is in stock
const checkNewCartLog = (request, response, next) => {
    const {product_id, quantity, size} = request.body;
    const body = request.body;
    const text = 'SELECT id FROM size WHERE product_id = $1 AND quantity >= $2 AND size = $3';

    if(product_id === undefined || product_id === '' || quantity === undefined || quantity === '' || size === undefined || size === ''){
        response.status(404).send('Some Field(s) Not Present');
    } else if (body.id !== undefined || body.customer_username !== undefined){
        response.status(400).send('Too Many Fields');
    } else if(isNaN(product_id) || product_id <= 0 || isNaN(quantity) || quantity <= 0){
        response.status(400).send('Product ID and Quantity must be numeric values')
    } else {
        pool.query(text, [product_id, quantity, size], (error, results) => {
            if(error){
                throw error;
            } else if (results.rows[0] === undefined){
                response.status(404).send('Not in stock');
            } else {
                next();
            };
        });
    };
};

// check if in cart
const checkIfNotInCart = (request, response, next) => {
    const {product_id} = request.body;
    const username = request.params.username;
    const text = 'SELECT id FROM cart WHERE product_id = $1 AND customer_username = $2';

    pool.query(text, [product_id, username], (error, results) => {
        if(error){
            throw error;
        } else if (results.rows[0] === undefined){
            next();
        } else {
            response.status(400).send('Item Already In Cart');
        };
    });
};

// add cart log to database
const newCartLog = (request, response) => {
    const text = "INSERT INTO cart (id, product_id, quantity, size, customer_username) VALUES (setval('cart_sequence', (SELECT MAX(id) FROM cart)+1), $1, $2, $3, $4)";
    const {product_id, quantity, size} = request.body;
    const username = request.params.username;

    pool.query(text, [product_id, quantity, size, username], (error, results) => {
        if(error){
            throw error;
        } else {
            response.status(201).send('Cart Item Added');
        };
    });
};


// GET CART ITEMS BY CUSTOMER

// check if customer has items in cart
const checkIfCartExists = (request, response, next) => {
    const username = request.params.username;
    const text = 'SELECT id FROM cart WHERE customer_username = $1';

    pool.query(text, [username], (error, results) => {
        if(error){
            throw error;
        } else if (results.rows[0] === undefined){
            response.status(404).send('No Cart Items For Customer');
        } else {
            next();
        };
    });
};

// get cart items and calculate total price [Cart ID, Product ID, Quantity, Size, Product Title, Manufacturer, Product Color, Product Unit Price and Product Thumbnail URL - per product]
const getCustomerCart = (request, response) => {
    const username = request.params.username;
    const text = "SELECT cart.id AS cart_id, cart.product_id, cart.quantity, cart.size, product.title AS product_title, manufacturer.title AS manufacturer, product.color, product.unit_price_eur, product.thumbnail_url FROM cart LEFT JOIN product ON cart.product_id = product.id LEFT JOIN manufacturer ON product.manufacturer_id = manufacturer.id WHERE cart.customer_username = $1";

    pool.query(text, [username], (error, results) => {
        if(error){
            throw error;
        } else {
            let products = results.rows;
            const totals_array = products.map(item => item.quantity * item.unit_price_eur);
            let total = totals_array.reduce((a, b) => a + b, 0);
            let result = {
                products,
                total
            };
            response.status(200).send(result);
        };
    });
};


// UPDATE PRODUCT QUANTITY IN CART


module.exports = {
                checkNewCartLog,
                checkIfNotInCart,
                newCartLog,
                checkIfCartExists,
                getCustomerCart};