import './Account.css';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchCustomer, fetchAddress } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';

const Account = () => {
    const user = useSelector(state => state.customer.user);
    const customer = useSelector(state => state.customer.profile);
    const address = useSelector(state => state.customer.address);
    const cus_status = useSelector(state => state.customer.cus_status);
    const adr_status = useSelector(state => state.customer.adr_status);

    useEffect(() => {
        if(user !== null && customer === null){
            store.dispatch(fetchCustomer());
        }

        if(user !== null && address === null){
            store.dispatch(fetchAddress());
        }

    }, []);

    let profile;
    let addressDiv;
    let redirect;
    if(user === null){
        profile = null;
        addressDiv = null;
        redirect = <Redirect to='/' />
    } else if(cus_status === 'succeeded') {
        redirect = null;
        profile = (
            <div>
                <h2>MY ACCNT</h2>
                <p>{customer.username}</p>
            </div>
        )
    };

    if(adr_status === 'succeeded'){
        addressDiv = (
            <div>
                <h2>ADDRSS</h2>
            </div>
        )
    } else if(adr_status === 'failed'){
        addressDiv = (
            <div>
                <h2>ADDRSS</h2>
            </div>
        )
    } else {
        addressDiv = null;
    };
    
    return(
        <div>
            {profile}
            {addressDiv}
            {redirect}
        </div>
    );
};

export default Account;