import React, { useEffect } from 'react';
import './Products.css';
import { genderAdded, categoryIdAdded, brandIdAdded, fetchProducts } from '../../Redux/ProductsSlice';
import store from '../../Redux/Store';
import { useSelector } from 'react-redux';

import ProductsList from './ProdList/ProductsList';
import GenderHeader from './ProdHeaders/GenderHeader';
import BrandHeader from './ProdHeaders/BrandHeader';

const Products = ({ match }) => {

    const prodState = useSelector(state => state.products.status);
    const products = useSelector(state => state.products.list);
    const genderState = useSelector(state => state.products.gender);
    const category_state = useSelector(state => state.products.category_id);
    const brandState = useSelector(state => state.products.brand_id);

    const gndrUrl = `/products/${genderState}`;
    const gndrCatUrl = `/products/${genderState}/list/${category_state}/${match.params.category_title}`;
    const brndUrl = `/brands/${brandState}`;

// check params values to dispatch correct values to store and fetch products
    useEffect(() => {
        console.log(match.url);
        console.log(gndrCatUrl);
        console.log(gndrUrl)
        console.log(brndUrl)

        if((match.url.includes('women') || match.url.includes('men')) && match.path === "/products/:gender/list/:categoryid/:category_title"){
            const category = parseInt(match.params.categoryid)
            const gender = match.params.gender;
            store.dispatch(genderAdded(gender))
            store.dispatch(categoryIdAdded(category));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchProducts());
        } else if(!match.url.includes(gndrCatUrl) && match.path === "/products/:gender"){
            const gender = match.params.gender;
            store.dispatch(genderAdded(gender));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchProducts());
        } else if(!match.url.includes(gndrCatUrl) && match.path === "/brands/:brand_id/:title"){
            const brand = parseInt(match.params.brand_id);
            store.dispatch(genderAdded(''));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(brand));
            store.dispatch(fetchProducts());
        };
    }, [match.url]);

    let head;
    let body;

// Render header for products list based on params 
    if(prodState === 'loading'){
        head = null;
        body = null;
    } else if (prodState === 'succeeded' && match.path === "/products/:gender"){
        const gender = match.params.gender;
        const data = {
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} url={match.url} />
    } else if (prodState === 'succeeded' && match.path === "/products/:gender/list/:categoryid/:category_title"){
        const category_title = match.params.category_title;
        const gender = match.params.gender;
        const data = {
            category_title,
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} url={match.url} />
    } else if (prodState === 'succeeded' && match.path === "/brands/:brand_id/:title") {
        head = <BrandHeader data={products.manufacturer} />
        body = <ProductsList products={products.products} url={match.url} />
    };

    return(
        <div className='products' >
            {head}
            {body}
        </div>
    );
};
/*
BEFORE
(prodState === 'idle' || prodState === 'succeeded') && (match.params.categoryid !== undefined && match.params.gender !== undefined && match.params.brand_id === undefined)

(prodState === 'idle' || prodState === 'succeeded') && (match.params.categoryid === undefined && match.params.gender !== undefined && match.params.brand_id === undefined)

(prodState === 'idle' || prodState === 'succeeded') && (match.params.categoryid === undefined && match.params.gender === undefined && match.params.brand_id !== undefined)

------------

prodState === 'succeeded' && match.params.categoryid === undefined && match.params.gender !== undefined && match.params.brand_id === undefined

prodState === 'succeeded' && match.params.categoryid !== undefined && match.params.gender !== undefined && match.params.brand_id === undefined

prodState === 'succeeded' && match.params.categoryid === undefined && match.params.gender === undefined && match.params.brand_id !== undefined

-----------------------------
AFTER
(prodState === 'idle' || !match.url.includes(gndrCatUrl)) && match.path === "/products/:gender/list/:categoryid/:category_title"

(prodState === 'idle' || !match.url.includes(gndrUrl)) && match.path === "/products/:gender"

(prodState === 'idle' || !match.url.includes(brndUrl)) && match.path === "/brands/:brand_id/:title"
*/ 

export default Products;