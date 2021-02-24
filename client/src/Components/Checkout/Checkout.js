import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Checkout.css';

import { fetchAddress, fetchCustomer } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';

import { postPaymentIntent } from '../../Services/Api/cart';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Checkout = ({ total, username, onCancel }) => {
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    const profile = useSelector(state => state.customer.profile);
    const address = useSelector(state => state.customer.address);
    
    const stripe = useStripe();
    const elements = useElements();
    
    // create payment intent and fetch profile + address if not in state
    useEffect(() => {
        (async () => {
            const response = await postPaymentIntent(username);
            if (response !== false){
                setClientSecret(response);
            } else {
                alert('Something went wrong!');
            };
        });

        if(profile === null){
            store.dispatch(fetchCustomer());
        };

        if(address === null){
            store.dispatch(fetchAddress());
        };

    }, []);

    let adrInfoSelect

    return(
        <div className='checkout' >
            <form>
                <p>BILLING</p>
                <div>
                    <input type='text' placeholder='FIRST NAME' />
                    <input type='text' placeholder='LAST NAME' />
                </div>
                
                <input type='text' placeholder='EMAIL' />
                
                <div>
                    <input type='text' placeholder='STREET' />
                    <input type='text' placeholder='APPARTMENT' />
                </div>

                <div>
                    <input type='text' placeholder='CITY' />
                    <input type='text' placeholder='ZIP' />
                </div>

                <div>
                    <input type='text' placeholder='PROVINCE' />
                    <input type='text' placeholder='COUNTRY' />
                </div>
                {adrInfoSelect}
                
                <p>PAYMENT</p>
                <CardElement />

                <div>
                    <p>TOTAL: {total}</p>
                    <button>CONFIRM</button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;