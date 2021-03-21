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

// -- WITHOUT SERVERSIDE CONFIRMATION --

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
// ------------------------------------------------------------


// *-- WITH SERVER SIDE CONFIRMATION --*

// CREATE ORDER FOR CUSTOMER ON SUCCESS
const createOrder = async (data) => {
    const text = "INSERT INTO shippment VALUES (setval('shippment_sequence', (SELECT MAX(id) FROM shippment)+1), current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
    const {total, username, address} = data;
    const payment = true;
    const {appartment_nr, street, city, province, zip, country} = address;
    const totalPayment = total / 100;

    try{
        const result = await pool.query(text, [totalPayment, payment, username, appartment_nr, street, city, province, zip, country]);
        if(result.rows[0]){
            return result.rows[0].id;
        }
    } catch (e) {
        return false;
    }
};

// INSERT NEW ADDRESS
const insertAddress = async (address, username) => {
    const text = 'UPDATE customer SET appartment_nr = $1, street = $2, city = $3, province = $4, zip = $5, country = $6 WHERE username = $7';
    const {appartment_nr, street, city, province, zip, country} = address;

    try{
        const result = await pool.query(text, [appartment_nr, street, city, province, zip, country, username]);
        if(result.rows){
            return true;
        }
    } catch (e) {
        return false;
    };
};

// GENERATE RESPONSE
const generateResponse = async (intent, data) => {
    if(
        intent.status === 'requires_action' &&
        intent.next_action.type === 'use_stripe_sdk'
    ){
        return {
            requires_action: true,
            payment_intent_client_secret: intent.client_secret
        };
    } else if (intent.status === 'succeeded'){
        // create new order in db
        const orderInsert = await createOrder(data);
        if((orderInsert !== false && data.address.status === 'Existing') || (orderInsert !== false && data.address.status === 'New' && data.address.check === false)){
            // return success and shippment id if updating address is not neccessary and order was successfully created
            return {
                success: true,
                shippment: orderInsert,
            };
        } else if(orderInsert !== false && data.address.status === 'New' && data.address.check === true){
            // insert new address if customer did not have an address in db and checked 'Save address'
            const addressInsert = await insertAddress(data.address, data.username);
            if(addressInsert === true){
                // return sucess and shippment id if insert was successful
                return {
                    success: true,
                    shippment: orderInsert,
                };
            } else {
                // return error if could not insert new address
                return {
                    error: 'Error while inserting new address'
                };
            };
        } else {
            // return error if could not create shippment
            return {
                error: 'Error while creating new shippment'
            };
        };
        
    } else {
        return {
            error: 'Invalid PaymentIntent status'
        };
    };
};

// CREATE PAYMENT INTENT OR CONFIRM PAYMENT INTENT
const createIntent = async(req, res) => {
    try{
        let intent;
        const { cart } = res.locals;
        const amount = calculateAmmount(cart)
        if(req.body.payment_method_id) {
            intent = await stripe.paymentIntents.create({
                payment_method: req.body.payment_method_id,
                amount: amount,
                currency: 'eur',
                confirmation_method: 'manual',
                confirm: true
            });
        } else if (req.body.payment_intent_id) {
            intent = await stripe.paymentIntents.confirm(
                req.body.payment_intent_id
            );
        }
        const data = {
            username: req.user,
            address: req.body.address,
            total: amount
        };
        const response = await generateResponse(intent, data);
        // send response
        res.send(response);
    } catch (e) {
        return res.send({ error: e.message });
    };
};


module.exports = {
    getFinalCart,
    calculateAmmount,
    createIntent
};