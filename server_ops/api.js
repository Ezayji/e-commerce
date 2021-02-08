const express = require('express');
const apiRouter = express.Router();
const passport = require('passport');
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
       updateCustomer,
       checkUpdatedInfo,
       updateCustomerAddress,
       getCustomerAddress,
       checkUpdatedAddress} = require('./customer_queries');

const {getProductsByGenderAndCategory,
       getProductsByManufacturerId,
       getProductById,
       getProductImages,
       getProductSizes,
       getCategories,
       getManufacturers} = require('./product_queries');

const {newCartLog,
       checkIfNotInCart,
       checkNewCartLog,
       checkIfCartExists,
       getCustomerCart} = require('./cart-queries');

const initializePassport = require('./passport-config');
initializePassport(passport);


// test get req
apiRouter.get('/', (req, res, next) => {
    res.status(200).send();
})


// PRODUCTS

// get products by gender or gender and category
apiRouter.get('/products', getProductsByGenderAndCategory);

// get single product with images and sizes
apiRouter.get('/products/:product_id', getProductById, getProductImages, getProductSizes);

// get products by manufacturer id
apiRouter.get('/manufacturer/:manufacturer_id', getProductsByManufacturerId);

// get all manufacturers
apiRouter.get('/manufacturers', getManufacturers);

// get all categories
apiRouter.get('/categories', getCategories);


// CUSTOMERS

// register a new customer
apiRouter.post('/register', checkNotAuthenticated, checkNewCustomerInfo, checkIfUniqueEmail, checkIfUniqueUsername, checkIfUniquePhone, addNewCustomer);

// get customer by USERNAME
apiRouter.get('/customer_un/:username', checkAuthenticated, getCustomerByUsername);

// update customer profile info
apiRouter.put('/customer_un/:username', checkAuthenticated, checkUpdatedInfo, checkIfUniqueEmail, checkIfUniquePhone, updateCustomer, getCustomerByUsername);

// get customer address
apiRouter.get('/customer_address/:username', checkAuthenticated, getCustomerAddress);

//update customer address
apiRouter.put('/customer_address/:username', checkAuthenticated, checkUpdatedAddress, updateCustomerAddress, getCustomerAddress);

// post login
apiRouter.post('/login', checkNotAuthenticated, checkUserName, checkUserPw, passport.authenticate('local'), (req, res) => {
    res.status(200).send({user: req.user});
});

// logout
apiRouter.get('/logout', (req, res) => {
    req.logout();
    res.status(200).send();
});


// CART

// add new cart log to customer
apiRouter.post('/cart/:username', checkAuthenticated, checkNewCartLog, checkIfNotInCart, newCartLog);

// get customer cart with total price
apiRouter.get('/cart/:username', checkAuthenticated, checkIfCartExists, getCustomerCart);



module.exports = apiRouter;