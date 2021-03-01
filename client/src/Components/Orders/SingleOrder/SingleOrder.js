import './SingleOrder.css';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { getSingleOrder } from '../../../Services/Api/orders';

import SingleProductLine from './SingleProductLine';

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

    let heading = null;
    let products = null;
    let content = null;
    let total = null;

    if(order !== ''){
        heading = <h2>ORDER DETAILS</h2>
        products = (
            order.products.map((item, i) => (
                <SingleProductLine prod={item} key={i} />
            ))
        );
        content = (
            <div className='order-contents' >
                <h3>ADDRESS</h3>
                <div className='order-address' >
                    <p>{order.to_street} {order.to_appartment}</p>
                    <p>{order.to_city}</p>
                    <p>{order.to_zip}</p>
                    <p>{order.to_province}</p>
                    <p>{order.to_country}</p>
                </div>
                <h3>PRODUCTS</h3>
                <div className='order-items' >
                    {products}
                </div>
            </div>
        );
        total = <p>TOTAL: €{order.total_eur}</p>
    };

    return(
        <div className='single-order' >
            {heading}
            {content}
            {total}
        </div>
    );
};

export default SingleOrder;