import './SingleOrder.css';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getSingleOrder } from '../../../Services/Api/orders';

const SingleOrder = ({ match, history }) => {
    
    const [order, setOrder] = useState('');
    const user = useSelector(state => state.customer.user);

    useEffect(() => {

        async function getOrder(){
            const response = await getSingleOrder(user.username, match.params.order_id);
            if(response !== false){
                setOrder(response);
            } else {
                history.push(`/orders/${user.username}`);
            };
        };

        if(user !== null){
            getOrder();
        } else {
            history.push('/');
        };

    }, []);

    return(
        <div>

        </div>
    );
};

export default SingleOrder;