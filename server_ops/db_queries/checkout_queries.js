const pool = require('./postgres_pool');

// POST ORDER ITEMS

// check if shippment exists
const checkShippment = (request, response, next) => {
    const username = request.params.username;
    const shippment = request.body.shippment_id;
    const text = 'SELECT total_eur FROM shippment WHERE id = $1 AND customer_username = $2';

    if(shippment === undefined || shippment === ''){
        response.status(400).send('No Shippment ID included');
    } else if (isNaN(shippment)) {
        response.status(400).send('Shippment ID must be a number');
    } else {
        pool.query(text, [shippment, username], (error, results) => {
            if(error){
                response.status(400).send();
            } else if(results.rows[0] === undefined){
                response.status(404).send('No shippment for user with the requested ID');
            } else {
                next();
            };
        });
    };
};

// get customer cart 
const getCheckoutCart = (request, response, next) => {
    const username = request.params.username;
    const text = "SELECT cart.id, cart.product_id, cart.quantity, cart.size, product.unit_price_eur FROM cart LEFT JOIN product ON cart.product_id = product.id WHERE customer_username = $1";

    pool.query(text, [username], (error, results) => {
        if(error){
            response.status(400).send();
        } else {
            response.locals.cart = results.rows;
            next();
        };
    });
};

// insert items into order items and delete from cart
const createOrderItems = (request, response) => {
    const username = request.params.username;
    const shippment = request.body.shippment_id;
    const cart = response.locals.cart;
    const text = "INSERT INTO order_item VALUES (setval('order_item_sequence', (SELECT MAX(id) FROM order_item)+1), $1, $2, $3, $4, $5)";
    const text2 = 'DELETE FROM cart WHERE id = $1 AND customer_username = $2';

    cart.forEach((item) => {
        const {id, product_id, quantity, size, unit_price_eur} = item;
        pool.query(text, [shippment, product_id, quantity, size, unit_price_eur], (error, results) => {
            if(error){
                response.status(400).send();
            } else {
                pool.query(text2, [id, username], (error, results) => {
                    if(error){
                        response.status(400).send();
                    }
                });
            };
        });
    });

    response.status(201).send();
};

module.exports = {
    checkShippment,
    getCheckoutCart,
    createOrderItems
};