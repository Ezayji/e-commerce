// * POSTGRESPOOL *
const pool = require('./db_queries/postgres_pool');

// * DOTENV *
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// * STRIPE.js *
const stripe = require('stripe')(process.env.STRIPE_SECRET);

// GET CART ITEM QUANTITIES AND UNIT PRICES
const getFinalCart = (req, res, next) => {
    const text = 'SELECT cart.quantity, product.unit_price_eur FROM cart LEFT JOIN product ON cart.product_id = product.id WHERE cart.customer_username = $1';
    const username = req.params.username;

    pool.query(text, [username], (error, results) => {
        if(error){
            throw error;
        } else if (results.rows[0] === undefined){
            res.status(404).send('No Cart Items For Customer');
        } else {
            res.locals.cart = results.rows;
            next();
        };
    });
};

// CALCULATE CART TOTAL
function calculateAmmount(cart){
    const totals_array = cart.map((item) => (
        item.quantity * item.unit_price_eur
    ));
    const total = totals_array.reduce((a, b) => a + b, 0);
    const total_cents = total * 100;
    return total_cents;
};

// CREATE PAYMENT INTENT AND RETURN CLIENT SECRET
const createPaymentIntent = async (req, res) => {
    const { cart } = res.locals;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateAmmount(cart),
        currency: "eur"
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    });
};

module.exports = {
    getFinalCart,
    createPaymentIntent,
    calculateAmmount
};