import './Cart.css';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCart } from '../../Redux/CartSlice';
import store from '../../Redux/Store';
import { updateItemQty, deleteFromCart } from '../../Services/Api/cart';

import { Redirect } from 'react-router-dom';

import CartItem from './CartItem';

const Cart = () => {
    const user = useSelector(state => state.customer.user);
    const products = useSelector(state => state.cart.products);
    const cartStatus = useSelector(state => state.cart.status);

    let redirect = null;
    if(user === null){
        redirect = <Redirect to='/' />
    };
    
    useEffect(() => {
        if(products === null && user !== null){
            store.dispatch(fetchCart());
        };
    }, []);
    
    let cartItems = null;

    if(products !== null && cartStatus === 'succeeded'){
        cartItems = products.map((item) => (
            <CartItem item={item} />
        ))
    } else if(cartStatus === 'loading'){
        cartItems = null;
    } else {
        cartItems = <p>No Items In Cart</p>
    };

    return(
        <div>
            <h2>CART</h2>
            {cartItems}
            {redirect}
        </div>
    );
};

export default Cart;