import './Payment.css';

import countries from 'i18n-iso-countries';


import React, { useState, useEffect } from 'react';

import { postPaymentIntent, stripePaymentHandler, stripe3DPaymentHandler } from '../../../Services/Api/cart';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Payment = ({ total, profile, address, cart, onPrev, history }) => {
    const [processing, setProcessing] = useState(false);

    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));

    const stripe = useStripe();
    const elements = useElements();

    // handle stripe js result
    const handleStripeJsResult = async (result) => {
        if(result.error){
            alert(result.error);
        } else {
            const confirmResult = await stripe3DPaymentHandler(result, profile.username, address);
            handleServerResponse(confirmResult);
        }
    };

    // handle server response
    const handleServerResponse = (response) => {
        if(response.error){
            alert(response.error);
            setProcessing(false);
        } else if (response.requires_action){
            stripe.handleCardAction(
                response.payment_intent_client_secret
            ).then(handleStripeJsResult);
        } else if(response === 'Something Went Wrong'){
            alert(response);
        } else if(response.success) {
            history.push(`/checkout/success/${profile.username}/${response.shippment}`)
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if(!stripe || !elements){
            return;
        } else {
            setProcessing(true);
            const name = `${profile.first_name} ${profile.last_name}`;
            const line1 = `${address.street} ${address.appartment_nr}`;
            const country = countries.getAlpha2Code(`${address.country}`, 'en').toLowerCase();
            const result = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
                billing_details: {
                    name: name,
                    email: profile.email,
                    phone: profile.phone,
                    address: {
                        line1: line1,
                        city: address.city,
                        state: address.province,
                        postal_code: address.zip,
                        country: country
                    }
                }
            });
            const serverResult = await stripePaymentHandler(result, profile.username, address);
            console.log(serverResult);
            handleServerResponse(serverResult);
        };
    };

    const items = cart.map((item, i) => (
        <div key={i} >
            <p>{item.product_title}({item.color}) x{item.quantity}</p>
            <p>€{item.quantity * item.unit_price_eur}</p>
        </div>
    ));
    
    return(
        <form onSubmit={onSubmit} >
            <div>
                <h2>ITEMS</h2>
                {items}
                <p>TOTAL: €{total}</p>
            </div>  
            <div>
                <h2>PAYMENT</h2>
                <CardElement />
            </div>
            <button disabled={processing} type='submit' >CONFIRM</button>
            <div>
                <button disabled={processing} type='button' onClick={onPrev} >CHANGE ADDRESS</button>
            </div>
        </form>
    );
};
/*
    STRIPE integration without server side confirmation
    ------------------------------------------------
        const [clientSecret, setClientSecret] = useState('');
        const [succeeded, setSucceeded] = useState(false);
        const [processing, setProcessing] = useState('');
        const [error, setError] = useState(null);
        const [disabled, setDisabled] = useState(true);

    -------------------------------------------------------
    useEffect(() => {
        const intent = async () => {
            const response = await postPaymentIntent(username);
            if (response !== false){
                setClientSecret(response);
            } else {
                alert('Something went wrong!');
            };
        };
        intent();
    }, []);
    ------------------------------------------------
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
*/ 

export default Payment;