import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Checkout.css';

import { fetchAddress, fetchCustomer } from '../../Redux/CustomerSlice';

import Billing from './Billing/Billing';
import Payment from './Payment/Payment';

import Loader from '../Loader/Loader';

const Checkout = ({ total, onCancel, cart, history }) => {
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);
    const [adr, setAdr] = useState(null);
    const [proccessing, setProcessing] = useState(false);

    const profile = useSelector(state => state.customer.profile);
    const address = useSelector(state => state.customer.address);
    const adrStatus = useSelector(state => state.customer.adr_status);

    // fetch profile + address if not in Redux state
    useEffect(() => {

        if(profile === null){
            dispatch(fetchCustomer());
        };

        if(address === null){
            dispatch(fetchAddress());
        };

        // SET LOCAL STATE ADDRESS DEPENDING ON DB INFORMATION
        if(adrStatus === 'succeeded' && address.appartment_nr !== null){
            setAdr(address);
            setStep(1);
        } else if (adrStatus === 'succeeded' && address.appartment_nr === null){
            setAdr('');
            setStep(1);
        };
    }, [address]);

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
        <div data-testid='checkout-div' className='checkout' >
            {form}
            <button disabled={proccessing} className='cancel-checkout' type='button' onClick={onCancel} >Cancel Checkout</button>
            {proccessing && <Loader />}
        </div>
    );
};

export default Checkout;