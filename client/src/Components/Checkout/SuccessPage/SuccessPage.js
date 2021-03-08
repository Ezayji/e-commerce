import './SuccessPage.css';

import { resetCart } from '../../../Redux/CartSlice';
import { fetchOrders } from '../../../Redux/OrdersSlice';
//import store from '../../../Redux/Store';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

const SuccessPage = ({ match, store }) => {
    
    const user = useSelector(state => state.customer.user);
    const cart = useSelector(state => state.cart.products);

    useEffect(() => {
        if(cart !== null && user !== null){
            store.dispatch(resetCart());
            store.dispatch(fetchOrders());
        };
    }, []);

    let message;
    let redirect;

    if(user !== null){
        message = (
            <div className="success-message" >
                <h2>Thank you for your purchase!</h2>
                <p>Succesfully created order #{match.params.order_id} for {user.username}</p>
                <p>Find your new order details <Link to={`/orders/${user.username}/order/${match.params.order_id}`} >here.</Link></p>
            </div>
        )
        redirect = null;
    } else {
        message = null;
        redirect = <Redirect to='/' />
    };

    return(
        <div className="success-page" >
            {message}
            {redirect}
        </div>
    );
};

export default SuccessPage;