import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './ProdPage.css';

import { addCartItem } from '../../../Services/Api/cart';

const Product = ({ prod }) => {
    const [size, setSize] = useState('');

    const user = useSelector(state => state.customer.user);

    const sizes = prod.sizes.map((item, i) => (
        <option key={i} value={item.size} >{item.size}</option>
    ));

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: user.username,
            id: prod.product.id,
            size: size
        };
        if(size !== ''){
            const response = await addCartItem(data);
            if(response === true){
                alert(`${prod.product.title} Size ${size} Added To Cart`);
                setSize('');
            } else {
                alert(response);
            }
        } else {
            alert('Please Select a Size');
        };
    };

    let button;

    if(user !== null){
        button = <button className='submit-size' type='submit' >ADD TO CART</button>
    } else {
        button = <Link to='/login' >LOG IN OR REGISTER</Link>;
    };
    
    return(
        <div className='product' >
            <img src={prod.images[0].url} alt={prod.product.title} />
            <div className='prod-info' >
                <h2>{prod.product.title}</h2>
                <p className='prod-manu' >{prod.product.manufacturer}</p>
                <p className='prod-price' >€{prod.product.unit_price_eur}</p>
                <p className='prod-color' >{prod.product.color}</p>
                <form onSubmit={onSubmit} >
                    <select value={size} onChange={(e) => {setSize(e.target.value)}} >
                        <option value='' >Select Size</option>
                        {sizes}
                    </select>
                    {button}
                </form>
                <p className='prod-desc' >{prod.product.description}</p>
                <p className='prod-material' >• Material: {prod.product.material}</p> 
            </div>
        </div>
    );
};

export default Product;