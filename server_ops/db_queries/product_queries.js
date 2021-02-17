const pool = require('./postgres_pool');

// GET ALL MANUFACTURERS
const getManufacturers = (request, response) => {
    const text = 'SELECT id, title FROM manufacturer ORDER BY id ASC';

    pool.query(text, (error, results) => {
        if(error){
            throw error;
        } else {
            response.status(200).send(results.rows);
        };
    });
};
 
// GET ALL CATEGORIES
const getCategories = (request, response) => {
    const text = 'SELECT * FROM category ORDER BY id ASC'

    pool.query(text, (error, results) => {
        if(error){
            throw error;
        } else {
            response.status(200).send(results.rows);
        };
    });
};


// GET ALL PRODUCTS by GENDER or GENDER AND CATEGORY

const getProductsByGenderAndCategory = (request, response) => {
    const text = "SELECT product.id, product.category_id, product.title, product.unit_price_eur, product.thumbnail_url, manufacturer.title AS manufacturer FROM product LEFT JOIN manufacturer ON product.manufacturer_id = manufacturer.id WHERE gender = 'uni' or gender = $1 ORDER BY product.id DESC";
    const gender = request.query.gender;

    const text2 = "SELECT product.id, product.category_id, product.title, product.unit_price_eur, product.thumbnail_url, manufacturer.title AS manufacturer FROM product LEFT JOIN manufacturer ON product.manufacturer_id = manufacturer.id WHERE (gender = 'uni' AND category_id = $2) OR (gender = $1 AND category_id = $2) ORDER BY product.id DESC";
    
    if((gender === 'men' || gender === 'women') && request.query.categoryid === undefined){
        pool.query(text, [gender], (error, results) => {
            if(error){
                throw error;
            } else {
                response.status(200).send(results.rows);
            };
        });
    } else if ((gender === 'men' || gender === 'women') && !isNaN(request.query.categoryid)) {
        const category = parseInt(request.query.categoryid);
        pool.query(text2, [gender, category], (error, results) => {
            if(error){
                throw error;
            } else if(results.rows[0] === undefined){
                response.status(404).send('No matching category');
            } else {
                response.status(200).send(results.rows);
            };
        });
    } else {
        response.status(400).send('Faulty request');
    };   
};


// GET ALL PRODUCTS BY MANUFACTURER ID

const getProductsByManufacturerId = (request, response) => {
    const text = "SELECT product.id, product.category_id, product.title, product.unit_price_eur, product.thumbnail_url, manufacturer.title AS manufacturer FROM product LEFT JOIN manufacturer ON product.manufacturer_id = manufacturer.id WHERE manufacturer_id = $1 ORDER BY product.id DESC";
    const man_id = request.params.manufacturer_id;
    if(isNaN(man_id)){
        response.status(400).send('Faulty manufacturer ID');
    } else {
        pool.query(text, [man_id], (error, results) => {
            if (results.rows[0] === undefined){
                response.status(404).send('No manufacturer found');
            } else {
                let products = results.rows;
                const text = 'SELECT * FROM manufacturer WHERE id = $1';
                pool.query(text, [man_id], (error, results) => {
                    if(error){
                        throw error;
                    } else {
                        let manufacturer = results.rows[0];
                        const result = {
                            manufacturer,
                            products
                        };
                        response.status(200).send(result);
                    };
                });
            };
        });
    };
};


// GET PRODUCT by ID with PICTURES and SIZES

//get product by id
const getProductById = (request, response, next) => {
    const text = 'SELECT product.id, product.category_id, product.title, product.description, product.color, product.unit_price_eur, product.gender, product.material, manufacturer.title AS manufacturer FROM product LEFT JOIN manufacturer ON product.manufacturer_id = manufacturer.id WHERE product.id = $1'
    const product_id = request.params.product_id;

    if(isNaN(product_id)){
        response.status(400).send('Request must be called with a number');
    } else {
        pool.query(text, [product_id], (error, results) => {
            if(results.rows[0] === undefined){
                response.status(404).send('No product with called ID');
            } else if (error) {
                throw error;
            } else {
                response.locals.product = results.rows[0];
                next();
            };
        });
    };
};

//get product images by id
const getProductImages = (request, response, next) => {
    const text = 'SELECT url FROM picture WHERE product_id = $1';
    const product_id = request.params.product_id;

    pool.query(text, [product_id], (error, results) => {
        if(error){
            throw error;
        } else {
            response.locals.images = results.rows;
            next();
        };
    });
};

//get product sizes by id and return object with product object, images array and sizes array
const getProductSizes = (request, response) => {
    const text = 'SELECT size, quantity FROM size WHERE product_id = $1';
    const product_id = request.params.product_id;

    pool.query(text, [product_id], (error, results) => {
        if(error){
            throw error;
        } else {
            let product = response.locals.product;
            let images = response.locals.images;
            let sizes = results.rows;
            const result = {
                product,
                images,
                sizes
            };
            response.status(200).send(result);
        };
    });
};

module.exports = {getProductsByGenderAndCategory, 
                getProductsByManufacturerId, 
                getProductById, 
                getProductImages, 
                getProductSizes,
                getManufacturers,
                getCategories};