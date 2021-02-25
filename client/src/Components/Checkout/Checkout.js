import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Checkout.css';

import { fetchAddress, fetchCustomer } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';

import { postPaymentIntent } from '../../Services/Api/cart';

import Billing from './Billing/Billing';
import Payment from './Payment/Payment';

const Checkout = ({ total, username, onCancel, cart }) => {
    
    const [clientSecret, setClientSecret] = useState('');
    const [step, setStep] = useState(1);
    const [adr, setAdr] = useState('');
    const [paid, setPaid] = useState(false);

    const profile = useSelector(state => state.customer.profile);
    const address = useSelector(state => state.customer.address);
    const cusStatus = useSelector(state => state.customer.cus_status);
    const adrStatus = useSelector(state => state.customer.adr_status);
    
    
    // create payment intent and fetch profile + address if not in Redux state
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

        if(profile === null){
            store.dispatch(fetchCustomer());
        };

        if(address === null){
            store.dispatch(fetchAddress());
        };

    }, []);

    const onNext = (data) => {
        setAdr(data);
        setStep(2);
    };

    const onPrev = () => {
        setStep(1);
    };

    let form;

    if(adrStatus === 'succeeded' && address !== null){
        setAdr(address);
    };

    if(step === 1){
        form = <Billing onNext={onNext} address={adr} />
    } else if (step === 2){
        form = <Payment total={total} clientSecret={clientSecret} onPrev={onPrev} email={profile.email} cart={cart} />
    };

    return(
        <div className='checkout' >
            {form}
            <button type='button' onClick={onCancel} >Cancel Checkout</button>
        </div>
    );
};

export default Checkout;