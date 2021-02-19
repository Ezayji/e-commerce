import React, { useEffect } from 'react';
import './Products.css';
import { genderAdded, categoryIdAdded, brandIdAdded, fetchGender, fetchCategory, fetchBrnds } from '../../Redux/ProductsSlice';
import store from '../../Redux/Store';
import { useSelector } from 'react-redux';

import ProductsList from './ProdList/ProductsList';
import GenderHeader from './ProdHeaders/GenderHeader';
import BrandHeader from './ProdHeaders/BrandHeader';

const Products = ({ match }) => {

    const prodState = useSelector(state => state.products.status);
    const products = useSelector(state => state.products.list);

// check Path and prodState to dispatch correct values and fetch products
    useEffect(() => {
        if(match.path === "/products/:gender/list/:categoryid/:category_title" && prodState !== 'category'){
            const category = parseInt(match.params.categoryid)
            const gender = match.params.gender;
            store.dispatch(genderAdded(gender))
            store.dispatch(categoryIdAdded(category));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchCategory());
            
        } else if(match.path === "/products/:gender" && prodState !== 'gender'){
            const gender = match.params.gender;
            store.dispatch(genderAdded(gender));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(0));
            store.dispatch(fetchGender());
        } else if(match.path === "/brands/:brand_id/:title" && prodState !== 'brand'){
            const brand = parseInt(match.params.brand_id);
            store.dispatch(genderAdded(''));
            store.dispatch(categoryIdAdded(0));
            store.dispatch(brandIdAdded(brand));
            store.dispatch(fetchBrnds());
        };
    }, [match.url]);

    let head;
    let body;

// Render header for products list based on prodState and Path
    if(prodState === 'loading'){
        head = null;
        body = null;
    } else if (prodState === 'gender' && match.path === "/products/:gender"){
        const gender = match.params.gender;
        const data = {
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} url={match.url} />
    } else if (prodState === 'category' && match.path === "/products/:gender/list/:categoryid/:category_title"){
        const category_title = match.params.category_title;
        const gender = match.params.gender;
        const data = {
            category_title,
            gender
        };
        head = <GenderHeader data={data} />
        body = <ProductsList products={products} url={match.url} />
    } else if (prodState === 'brand' && match.path === "/brands/:brand_id/:title") {
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

export default Products;