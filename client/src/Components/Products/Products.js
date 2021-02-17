import React, { useEffect } from 'react';
import './Products.css';
import { genderAdded, categoryIdAdded, brandIdAdded, fetchProducts } from '../../Redux/ProductsSlice';
import store from '../../Redux/Store';
import { useSelector } from 'react-redux';

import ProductsList from './ProdList/ProductsList';
import GenderHeader from './ProdHeaders/GenderHeader';
import BrandHeader from './ProdHeaders/BrandHeader';

const Products = ({ match }) => {
    let brand
    if(match.params.brand_id){
        brand = parseInt(match.params.brand_id);
    } else {
        brand = null;
    };
    let gender;
    if(match.params.gender){
        gender = match.params.gender;
    } else {
        gender = null;
    };
    let category;
    if(match.params.category){
        category = parseInt(match.params.categoryid);
    } else {
        category = null;
    };

    const prodState = useSelector(state => state.products.status);
    const products = useSelector(state => state.products.list);

    useEffect(() => {
        if(category !== null && gender !== null && brand === null){
            store.dispatch(genderAdded(gender))
            store.dispatch(categoryIdAdded(category));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchProducts());
        } else if(category === null && gender !== null && brand === null){
            store.dispatch(genderAdded(gender));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchProducts());
        } else if(category === null && gender === null && brand !== null){
            store.dispatch(genderAdded(''));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(brand));
            store.dispatch(fetchProducts());
        };
    }, [category, gender, brand]);

    let head;
    let body;

    if(prodState === 'loading'){
        head = null;
        body = null;
    } else if(prodState === 'succeeded' && category === null && gender !== null && brand === null){
        const data = {
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} />
    } else if (prodState === 'succeeded' && category !== null && gender !== null && brand === null){
        const data = {
            category,
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} />
    } else {
        head = <BrandHeader data={products.manufacturer} />
        body = <ProductsList products={products.products} />
    };

    return(
        <div>
            {head}
            {body}
        </div>
    );
};

export default Products;