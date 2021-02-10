const { response } = require('express');
const request = require('superagent');
const pool = require('./postgres_pool');

// Get all orders for customer

// check if any shippemnts and pass them to next middleware as an array
const getUserOrders = (request, response, next) => {
    const username = request.params.username;
    const text = 'SELECT id, date_utc, total_eur, payment, to_appartment, to_street, to_city, to_province, to_zip, to_country FROM shippment WHERE customer_username = $1 ORDER BY id DESC';
    
    pool.query(text, [username], (error, results) => {
        if(error){
            throw error;
        } else if (results.rows[0] === undefined){
            response.status(404).send('No Completed Orders For Customer');
        } else {
            response.locals.orders = results.rows;
            next();
        };
    });
};

// get products for every shippment [Product ID, Quantity, Size, Product Title, Manufacturer, Product Color and Product Unit Price - per product]
const getOrderItems = (request, response) => {
    const {orders} = response.locals;
    const text = 'SELECT order_item.product_id, order_item.quantity, order_item.size, order_item.unit_price_eur, product.title AS product_title, manufacturer.title AS manufacturer, product.color FROM order_item LEFT JOIN product ON order_item.product_id = product.id LEFT JOIN manufacturer ON product.manufacturer_id = manufacturer.id WHERE shippment_id = $1';

    orders.forEach((order, i) => {
        const {id} = order;
        
        pool.query(text, [id], (error, results) => {
            if(error){
                throw error;
            } else {
                console.log(results.rows);
                orders[i].products = results.rows;
            }
        });
    });
    response.status(200).send(orders);
};

module.exports = {
    getUserOrders,
    getOrderItems
};