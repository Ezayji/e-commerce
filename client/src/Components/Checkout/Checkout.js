import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './Checkout.css';

import { fetchAddress, fetchCustomer } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';

import Billing from './Billing/Billing';
import Payment from './Payment/Payment';

const Checkout = ({ total, onCancel, cart, history }) => {
    
    const [step, setStep] = useState(1);
    const [adr, setAdr] = useState(null);
    const [proccessing, setProcessing] = useState(false);

    const profile = useSelector(state => state.customer.profile);
    const address = useSelector(state => state.customer.address);
    const adrStatus = useSelector(state => state.customer.adr_status);

    // fetch profile + address if not in Redux state
    useEffect(() => {

        if(profile === null){
            store.dispatch(fetchCustomer());
        };

        if(address === null){
            store.dispatch(fetchAddress());
        };

        // SET LOCAL STATE ADDRESS DEPENDING ON DB INFORMATION
        if(adrStatus === 'succeeded' && address !== null){
            setAdr(address);
            setStep(1);
        } else if (adrStatus === 'succeeded' && address === null){
            setAdr('');
            setStep(1);
        };
    }, [adrStatus]);

    const onNext = (data) => {
        setAdr(data);
        setStep(2);
    };

    const onPrev = () => {
        setStep(1);
    };

    const onPayment = (boolean) => {
        setProcessing(boolean)
    };

    let form;

    if(step === 1 && adr !== null){
        form = <Billing onNext={onNext} address={adr} />
    } else if (step === 2){
        form = <Payment total={total} onPrev={onPrev} onPayment={onPayment} profile={profile} address={adr} cart={cart} history={history} />
    } else {
        form = null;
    };

    return(
        <div className='checkout' >
            {form}
            <button disabled={proccessing} className='cancel-checkout' type='button' onClick={onCancel} >Cancel Checkout</button>
        </div>
    );
};

export default Checkout;