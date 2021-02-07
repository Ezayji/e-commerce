// Initialize Postgres pool
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'e-commerce',
    password: 'postgres',
    port: 5432,
});

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
                manufacturer = results.rows[0].manufacturer;
                products = results.rows;
                const result = {
                    manufacturer,
                    products
                };
                response.status(200).send(result);
            };
        });
    };
};

module.exports = {getProductsByGenderAndCategory, getProductsByManufacturerId};