import './Cart.css';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCart, statusAdded } from '../../Redux/CartSlice';
import store from '../../Redux/Store';
import { updateItemQty, deleteFromCart, getCart } from '../../Services/Api/cart';

import { Redirect, Link } from 'react-router-dom';

import CartItem from './CartItem';

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
        /*
            store.dispatch(statusAdded('loading'));
            const response = await getCart(user.username);
            if(response !== 'No Cart Items For Customer' && response !== true){
                alert(response);
            } else if(response === true){
                store.dispatch(statusAdded('succeeded'));
            };
        */
        };
        
    };
    
    let cartItems;
    let checkoutButton;

    if(products !== null && cartStatus === 'succeeded'){
        cartItems = products.map((item, i) => (
            <CartItem key={i} item={item} onIncrement={onIncrement} onDecrement={onDecrement} onDelete={onDelete} />
        ));
        checkoutButton = (
        <div className='cart-checkout' >
            <p>TOTAL: €{total}</p>
            <Link to={`/cart/${user.username}/checkout`} >CHECKOUT</Link>
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
            {redirect}
        </div>
    );
};

export default Cart;