import './SuccessPage.css';

import { resetCart } from '../../../Redux/CartSlice';
import store from '../../../Redux/Store';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

const SuccessPage = ({ match }) => {
    
    const user = useSelector(state => state.customer.user);
    const cart = useSelector(state => state.cart.products);

    useEffect(() => {
        if(cart !== null){
            store.dispatch(resetCart());
        };
    }, []);

    let message;
    let redirect;

    if(user !== null){
        message = (
            <div>
                <p>Thank you for your purchase!</p>
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
        <div>
            {message}
            {redirect}
        </div>
    );
};

export default SuccessPage;