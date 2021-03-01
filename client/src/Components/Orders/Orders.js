import './Orders.css';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { fetchOrders } from '../../Redux/OrdersSlice';
import store from '../../Redux/Store';

import OrderPreview from './OrderPreview/OrderPreview';

const Orders = ({ history }) => {

    const user = useSelector(state => state.customer.user);
    const orders = useSelector(state => state.orders.orders);
    const orderStatus = useSelector(state => state.orders.status);

    useEffect(() => {
        if(user === null){
            history.push('/');
        } else if(orders === null && user !== null){
            store.dispatch(fetchOrders());
        };
    }, []);

    let ordersBody;
    let orderHead;

    if(orderStatus === 'loading'){
        ordersBody = null;
        orderHead = null;
    } else if (orderStatus === 'succeeded'){
        orderHead = (
            <div className='orders-head' >
                <p>ORDR NR</p>
                <p>DATE</p>
                <p>TOTAL</p>
                <p>PAYMENT</p>
            </div>
        )
        ordersBody = (
            orders.map((item, i) => (
                <OrderPreview username={user.username} order={item} key={i} />
            ))
        );
    } else if (orderStatus === 'failed'){
        orderHead = null;
        ordersBody = <p>You Haven't Ordered Anything Yet</p>
    };
    
    return(
        <div className='orders-div' >
            <h2>ORDERS</h2>
            {orderHead}
            {ordersBody}
        </div>
    );
};

export default Orders;