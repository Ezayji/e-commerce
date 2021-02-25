import './Payment.css';

import React, { useState } from 'react';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Payment = ({ clientSecret, total, email, cart }) => {
    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState('');
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    
    const stripe = useStripe();
    const elements = useElements();

    const onSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            receipt_email: email,
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        };
    };

    const items = cart.map((item) => (
        <div>
            <p>{item.product_title}({item.color}) x{item.quantity}</p>
            <p>{item.quantity * item.unit_price_eur}</p>
        </div>
    ));
    
    return(
        <form>
            <div>
                <h2>ITEMS</h2>
                {items}
                <p>TOTAL: €{total}</p>
            </div>  
            <div>
                <h2>PAYMENT</h2>
                <CardElement />
            </div>
            <button type='submit' >CONFIRM</button>
        </form>
    );
};

export default Payment;