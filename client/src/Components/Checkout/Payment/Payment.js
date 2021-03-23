import './Payment.css';

import countries from 'i18n-iso-countries';

import React, { useState } from 'react';

import { stripePaymentHandler, stripe3DPaymentHandler, checkoutSuccess } from '../../../Services/Api/cart';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Payment = ({ total, profile, address, cart, onPrev, history, onPayment }) => {
    const [processing, setProcessing] = useState(false);
    const [filling, setFilling] = useState(true);

    countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
    
    const stripe = useStripe();
    const elements = useElements();

    // handle stripe js result
    const handleStripeJsResult = async (result) => {
        if(result.error){
            alert(result.error.message);
            onPayment(false);
            setProcessing(false);
        } else {
            const confirmResult = await stripe3DPaymentHandler(result, profile.username, address);
            handleServerResponse(confirmResult);
        }
    };

    // handle server response
    const handleServerResponse = (response) => {
        if(response.error){
            alert(response.error);
            onPayment(false);
            setProcessing(false);
        } else if (response.requires_action){
            // Proceed to 3D authentication if neccessary
            stripe.handleCardAction(
                response.payment_intent_client_secret
            ).then(handleStripeJsResult);
        } else if(response === 'Something Went Wrong, Please Refresh The Page'){
            alert(response);
        } else if(response.success) {
            // Create orders items based on returned new shippment id and redirect to success page
            checkoutSuccess(profile.username, response.shippment)
                .then((result) => {
                    if(result === true){
                        history.push(`/checkout/success/${profile.username}/${response.shippment}`)
                    } else {
                        alert('Something Went Wrong While Creating Order Items');
                    };
                });
        };
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if(!stripe || !elements){
            return;
        } else {
            onPayment(true);
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
            handleServerResponse(serverResult);
        };
    };

    const items = cart.map((item, i) => (
        <div className='payment-item-div' key={i} >
            <p>{item.product_title}({item.color}) {item.size} x {item.quantity}</p>
            <p className='payment-item-price'>€{item.quantity * item.unit_price_eur}</p>
        </div>
    ));
    return(
        <form className='checkout-payment' onSubmit={onSubmit} >
            <div className='payment-items' >
                <h2>ITEMS</h2>
                {items}
                <p className='payment-total' >TOTAL: €{total}</p>
            </div>  
            <div>
                <h2>PAYMENT</h2>
                <div className='card-element-div' >
                    <CardElement
                        onChange={async (e) => e.complete === true ? setFilling(false) : setFilling(true)}
                    />
                </div>
            </div>
            <button className='submit-payment' disabled={processing || filling} type='submit' >CONFIRM</button>
            <div>
                <button className='previous' disabled={processing} type='button' onClick={onPrev} >CHANGE ADDRESS</button>
            </div>
        </form>
    );
};

export default Payment;