import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './ProdPage.css';

import Left from './arrow_png_left.png';
import Right from './arrow_png_right.png';

import { addCartItem } from '../../../Services/Api/cart';

const Product = ({ prod }) => {
    const [size, setSize] = useState('');
    const [currentImg, setCurrentImg] = useState(0);

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

    const onLeftNav = () => {
        if(currentImg === 0){
            setCurrentImg(prod.images.length - 1);
        } else {
            setCurrentImg(currentImg - 1);
        };
    };

    const onRightNav = () => {
        if(currentImg === prod.images.length - 1){
            setCurrentImg(0);
        } else {
            setCurrentImg(currentImg + 1);
        }
    };

    let button;

    if(user !== null){
        button = <button className='submit-size' type='submit' >ADD TO CART</button>
    } else {
        button = <Link to='/login' >LOG IN OR REGISTER</Link>;
    };
    
    return(
        <div className='product' >
            <div className='prod-image-div' >
                <img className='nav-arrow' src={Left} alt='navigate left' role='button' onClick={onLeftNav} />
                <img src={prod.images[currentImg].url} alt={prod.product.title} />
                <img className='nav-arrow' src={Right} alt='navigate right' role='button' onClick={onRightNav} />
            </div>
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