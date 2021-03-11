import React, { useEffect } from 'react';
import './Products.css';
import { genderAdded, categoryIdAdded, brandIdAdded, fetchGender, fetchCategory, fetchBrnds } from '../../Redux/ProductsSlice';
import { useSelector, useDispatch } from 'react-redux';

import ProductsList from './ProdList/ProductsList';
import GenderHeader from './ProdHeaders/GenderHeader';
import BrandHeader from './ProdHeaders/BrandHeader';

const Products = ({ match }) => {
    const dispatch = useDispatch();

    const prodState = useSelector(state => state.products.status);
    const products = useSelector(state => state.products.list);
    const genderState = useSelector(state => state.products.gender);
    const brndState = useSelector(state => state.products.brand_id);
    const categoryState = useSelector(state => state.products.category_id);

    const genderParams = match.params.gender;
    const brndParams = match.params.brand_id;
    const categoryParams = match.params.categoryid;

    const categoryPath = '/products/:gender/list/:categoryid/:category_title';
    const genderPath = '/products/:gender';
    const brndsPath = '/brands/:brand_id/:title'

// Check Path and prodState and Params to dispatch correct values and fetch products
    useEffect(() => {
        if((match.path === categoryPath && prodState !== 'category') || (match.path === categoryPath && prodState === 'category' && (genderParams !== genderState || parseInt(categoryParams) !== categoryState))){
            const category = parseInt(match.params.categoryid)
            const gender = match.params.gender;
            dispatch(genderAdded(gender))
            dispatch(categoryIdAdded(category));
            dispatch(brandIdAdded(0));
            dispatch(fetchCategory());
            
        } else if((match.path === genderPath && prodState !== 'gender') || (match.path === genderPath && prodState === 'gender' && genderParams !== genderState)){
            const gender = match.params.gender;
            dispatch(genderAdded(gender));
            dispatch(categoryIdAdded(0));
            dispatch(brandIdAdded(0));
            dispatch(fetchGender());
        } else if((match.path === brndsPath && prodState !== 'brand') || (match.path === brndsPath && prodState === 'brand' && brndState !== brndParams)){
            const brand = parseInt(match.params.brand_id);
            dispatch(genderAdded(''));
            dispatch(categoryIdAdded(0));
            dispatch(brandIdAdded(brand));
            dispatch(fetchBrnds());
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