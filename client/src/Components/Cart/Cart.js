import './Cart.css';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fetchCart } from '../../Redux/CartSlice';
import store from '../../Redux/Store';
import { updateItemQty, deleteFromCart } from '../../Services/Api/cart';

import { Redirect, Link } from 'react-router-dom';

import CartItem from './CartItem';
import Checkout from '../Checkout/Checkout';

// * STRIPE.js *
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
const promise = loadStripe('pk_test_51IItmKB1uegguB7b2ReRKVdoa1Bojw5VxlWF9uuCwiYdY1Z3C8wpwI8kDau5SQ8qQN2nQdJXOvwvhODgssLH5RFn00LH75oIZw');


const Cart = () => {
    const user = useSelector(state => state.customer.user);
    const products = useSelector(state => state.cart.products);
    const total = useSelector(state => state.cart.total);
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

    const onIncrement = async (item) => {
        const quantity = item.quantity + 1
        const updatedItem = {
            username: user.username,
            id: item.product_id,
            qty: quantity,
            size: item.size
        };
            
        const response = await updateItemQty(updatedItem);

        if(response !== true){
            alert(response);
        };
    };

    const onDecrement = async (item) => {
        if(item.quantity === 1){
            return;
        } else {
            const quantity = item.quantity - 1
            const updatedItem = {
                username: user.username,
                id: item.product_id,
                qty: quantity,
                size: item.size
            };
            
            const response = await updateItemQty(updatedItem);

            if(response !== true){
                alert(response);
            };            
        };
    };

    const onDelete = async (item) => {
        let size;
        if(item.size.includes('/')){
            size = item.size.replaceAll('/', '_');
        } else {
            size = item.size;
        };
        
        const data = {
            username: user.username,
            id: item.product_id,
            size: size
        };

        const response = await deleteFromCart(data);
        
        if(response !== true){
            alert(response);
        } else {
            store.dispatch(fetchCart());
        };
        
    };
    
    let cartItems;
    let checkoutButton;
    let checkout = null;

    const onCancel = () => {
        checkout = null;
    };

    const onCheckout = () => {
        checkout = (
            <Elements stripe={promise} >
                <Checkout total={total} username={user.username} onCancel={onCancel} />
            </Elements>
        );
    };

    if(products !== null && cartStatus === 'succeeded'){
        cartItems = products.map((item, i) => (
            <CartItem key={i} item={item} onIncrement={onIncrement} onDecrement={onDecrement} onDelete={onDelete} />
        ));
        checkoutButton = (
        <div className='cart-checkout' >
            <p>TOTAL: €{total}</p>
            <button type='button' onClick={onCheckout} className='to-checkout' >CHECKOUT</button>
        </div>
        );
    } else if(cartStatus === 'loading'){
        cartItems = null;
    } else {
        cartItems = <p>No Items In Cart</p>
    };

    return(
        <div className='cart' >
            <h2>CART</h2>
            {cartItems}
            {checkoutButton}
            {checkout}
            {redirect}
        </div>
    );
};

// <Link to={`/cart/${user.username}/checkout`} >CHECKOUT</Link>

export default Cart;