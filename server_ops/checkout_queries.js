const { response } = require('express');
const pool = require('./postgres_pool');

// POST ORDER ITEMS

// check if shippment exists
const checkShippment = (request, response, next) => {
    const username = request.params.username;
    const shippment_id = request.body.shippment_id;

    
};

// get customer cart 
const getCheckoutCart = (request, response, next) => {
    const username = request.params.username;
    const text = "SELECT product_id, quantity, size FROM cart WHERE customer_username = $1";

    pool.query(text, [username], (error, results) => {
        if(error){
            throw error;
        } else {
            response.locals.cart = results.rows;
            next();
        };
    });
};

// insert items into order items
const createOrderItems = (request, response, next) => {
    const shippment_id = request.body.shippment_id;


};