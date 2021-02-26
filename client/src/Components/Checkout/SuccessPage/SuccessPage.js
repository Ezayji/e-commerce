import './SuccessPage.css';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { checkoutSuccess } from '../../../Services/Api/cart';

const SuccessPage = ({ match }) => {
    const [order, setOrder] = useState(null);

    const user = useSelector(state => state.customer.user);

    useEffect(() => {
        if(user !== null && !isNaN(match.params.order_id)){
            const id = parseInt(match.params.order_id);
            checkoutSuccess(user.username, id);
        }
    }, []);

    let message;
    let redirect;

    if(user !== null){
        message = <p>Succesfully created order for {user.username}</p>
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