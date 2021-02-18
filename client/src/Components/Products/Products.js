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

// check params values to dispatch correct values to store and fetch products
    useEffect(() => {
        if((prodState === 'idle' || prodState === 'succeeded') && (match.params.categoryid !== undefined && match.params.gender !== undefined && match.params.brand_id === undefined)){
            const category = parseInt(match.params.categoryid)
            const gender = match.params.gender;
            store.dispatch(genderAdded(gender))
            store.dispatch(categoryIdAdded(category));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchProducts());
        } else if((prodState === 'idle' || prodState === 'succeeded') && (match.params.categoryid === undefined && match.params.gender !== undefined && match.params.brand_id === undefined)){
            const gender = match.params.gender;
            store.dispatch(genderAdded(gender));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchProducts());
        } else if((prodState === 'idle' || prodState === 'succeeded') && (match.params.categoryid === undefined && match.params.gender === undefined && match.params.brand_id !== undefined)){
            const brand = parseInt(match.params.brand_id);
            store.dispatch(genderAdded(''));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(brand));
            store.dispatch(fetchProducts());
        };
    }, [match.params.categoryid, match.params.gender, match.params.brand_id]);

    let head;
    let body;

// Render header for products list based on params 
    if(prodState === 'loading'){
        head = null;
        body = null;
    } else if (prodState === 'succeeded' && match.params.categoryid === undefined && match.params.gender !== undefined && match.params.brand_id === undefined){
        const gender = match.params.gender;
        const data = {
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} url={match.url} />
    } else if (prodState === 'succeeded' && match.params.categoryid !== undefined && match.params.gender !== undefined && match.params.brand_id === undefined){
        const category_title = match.params.category_title;
        const gender = match.params.gender;
        const data = {
            category_title,
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} url={match.url} />
    } else if (prodState === 'succeeded' && match.params.categoryid === undefined && match.params.gender === undefined && match.params.brand_id !== undefined) {
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
prodState === 'idle'
prodState === 'succeeded'
products instanceof Array && 
products instanceof Object && 
&& (products === undefined || products instanceof Array)
*/ 

export default Products;