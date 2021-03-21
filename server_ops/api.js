// * EXPRESS.js *
const express = require('express');
const apiRouter = express.Router();

// * PASSPORT.js *
const passport = require('passport');
const initializePassport = require('./passport-config');
initializePassport(passport);

// * STRIPE.js *
const {
       getFinalCart,
       createIntent } = require('./stripe-config');

// * DB QUERIES *
const {getCustomerByUsername,
       addNewCustomer,
       checkNewCustomerInfo,
       checkIfUniqueEmail,
       checkIfUniqueUsername,
       checkIfUniquePhone,
       checkUserName,
       checkUserPw,
       checkAuthenticated,
       checkNotAuthenticated,
       verifyAuth,
       updateCustomer,
       checkOldPw,
       updatePw,
       checkUpdatedInfo,
       updateCustomerAddress,
       getCustomerAddress,
       checkUpdatedAddress,
       checkUpdatedEmail,
       checkUpdatedPhone} = require('./db_queries/customer_queries');

const {getProductsByGenderAndCategory,
       getProductsByManufacturerId,
       getProductById,
       getProductImages,
       getProductSizes,
       getCategories,
       getManufacturers} = require('./db_queries/product_queries');

const {newCartLog,
       checkIfNotInCart,
       checkCartLog,
       checkIfCartExists,
       getCustomerCart,
       checkIfInCart,
       updateCartLogQty,
       checkQueryItem,
       deleteFromCart} = require('./db_queries/cart-queries');

const {checkShippment,
       getCheckoutCart,
       createOrderItems} = require('./db_queries/checkout_queries');

const {getUserOrders,
       getUserOrder,
       getSingleOrderItems} = require('./db_queries/order_queries');
// getOrderItems,

// * ROUTES *

// test get req
apiRouter.get('/', (req, res, next) => {
    res.status(200).send('Api Is Running');
});


// ----- PRODUCTS -----

// get products by gender or gender and category
apiRouter.get('/products', getProductsByGenderAndCategory);

// get single product by ID with images and sizes 
apiRouter.get('/products/:product_id', getProductById, getProductImages, getProductSizes);

// get products by manufacturer id
apiRouter.get('/manufacturer/:manufacturer_id', getProductsByManufacturerId);

// get all manufacturers
apiRouter.get('/manufacturers', getManufacturers);

// get all categories
apiRouter.get('/categories', getCategories);


// ----- CUSTOMERS -----

// register a new customer
apiRouter.post('/register', checkNotAuthenticated, checkNewCustomerInfo, checkIfUniqueEmail, checkIfUniqueUsername, checkIfUniquePhone, addNewCustomer);

// get customer by USERNAME
apiRouter.get('/customer_un/:username', checkAuthenticated, getCustomerByUsername);

// update customer profile info
apiRouter.put('/customer_un/:username', checkAuthenticated, checkUpdatedInfo, checkUpdatedEmail, checkUpdatedPhone, updateCustomer, getCustomerByUsername);

// update customer password
apiRouter.put('/customer_un/:username/password', checkAuthenticated, checkOldPw, updatePw);

// get customer address
apiRouter.get('/customer_address/:username', checkAuthenticated, getCustomerAddress);

//update customer address
apiRouter.put('/customer_address/:username', checkAuthenticated, checkUpdatedAddress, updateCustomerAddress, getCustomerAddress); 

// post login
apiRouter.post('/login', checkNotAuthenticated, checkUserName, checkUserPw, passport.authenticate('local'), (req, res) => {
    res.status(200).send({user: req.user});
});

// auth check
apiRouter.get('/auth', verifyAuth);

// logout
apiRouter.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send();
});


// ----- CART -----

// add new cart log to customer
apiRouter.post('/cart/:username', checkAuthenticated, checkCartLog, checkIfNotInCart, newCartLog);

// get customer cart with total price
apiRouter.get('/cart/:username', checkAuthenticated, checkIfCartExists, getCustomerCart);

// update quantity in cart log and return updated customer cart
apiRouter.put('/cart/:username', checkAuthenticated, checkCartLog, checkIfInCart, updateCartLogQty, getCustomerCart);

// delete item from cart
apiRouter.delete('/cart/:username', checkAuthenticated, checkQueryItem, deleteFromCart);


// ----- CHECKOUT -----

//     -- WITH SERVER SIDE CONFIRMATION --

// request a payment and create a shippment in db after a successful transaction
apiRouter.post('/payment/:username', checkAuthenticated, getFinalCart, createIntent);
       // ^^ * it should also remove items from stock after a succesful payment in real production version. ^^ //

// convert cart items into order items if a shippment was successfully created
apiRouter.post('/cart/:username/checkout', checkAuthenticated, checkShippment, checkIfCartExists, getCheckoutCart, createOrderItems);


// ----- ORDERS -----

// get all customer orders
apiRouter.get('/orders/:username', checkAuthenticated, getUserOrders);
// getOrderItems

// get single customer order by id with details
apiRouter.get('/orders/:username/:order_id', checkAuthenticated, getUserOrder, getSingleOrderItems);


module.exports = apiRouter;