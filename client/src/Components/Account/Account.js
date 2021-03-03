import './Account.css';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { fetchCustomer, fetchAddress } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';

import { updateProfile, updateAddress } from '../../Services/Api/customer';

import Display from './Profile/Display';
import UpdateForm from './Profile/UpdateForm';
import AdrDisplay from './Address/AdrDisplay';
import AdrUpdateForm from './Address/AdrUpdateForm';

const Account = () => {

    // STATES

// local state to determine if user wants to edit info
    const [prof, setProf] = useState('Display');
    const [adr, setAdr] = useState('Display');

// local state for profile update form
    const [fn, setfn] = useState('');
    const [ln, setLn] = useState('');
    const [email, setEmail] = useState('');
    const [phne, setPhne] = useState('');

// local state for address update form
    const [ap, setAp] = useState('');
    const [strt, setStrt] = useState('');
    const [cty, setCty] = useState('');
    const [prvnc, setPrvnc] = useState('');
    const [zp, setZp] = useState('');
    const [cntry, setCntry] = useState('');

// redux state for determining render info
    const user = useSelector(state => state.customer.user);
    const customer = useSelector(state => state.customer.profile);
    const address = useSelector(state => state.customer.address);
    const cus_status = useSelector(state => state.customer.cus_status);
    const adr_status = useSelector(state => state.customer.adr_status);

// fetch profile and address on render
    useEffect(() => {
        if(user !== null && customer === null){
            store.dispatch(fetchCustomer());
        }

        if(user !== null && address === null){
            store.dispatch(fetchAddress());
        }

    }, []);

// cancel editing actions
const onCancelProfChange = () => {
    setfn('');
    setLn('');
    setEmail('');
    setPhne('');
    setProf('Display');
};

const onCancelAdrChange = () => {
    if(address.appartment_nr === null){
        return;
    } else {
        setAp('');
        setStrt('');
        setCty('');
        setPrvnc('');
        setZp('');
        setCntry('');
        setAdr('Display');
    }
};

    let profile;
    let addressDiv;
    let redirect;


    // PROFILE

// updating user profile info
const onProfChngeClick = () => {
    setfn(customer.first_name);
    setLn(customer.last_name);
    setEmail(customer.email);
    setPhne(customer.phone);
    setProf('Edit');
    if(adr === 'Edit' && adr_status === 'succeeded'){
        onCancelAdrChange();
    };
};

const onProfSubmit = async (e) => {
    e.preventDefault();
    const data = {
        username: user.username,
        fn: fn,
        ln: ln,
        email: email,
        phne: phne
    };
    if(fn !== customer.first_name || ln !== customer.last_name || email !== customer.email || phne !== customer.phone){
        const response = await updateProfile(data);
        if(response !== true){
            alert(response);
        } else if (response === true){
            onCancelProfChange();
        };
    } else {
        return;
    };
};

// user profile info rendering   
    if(user === null){
        profile = null;
        addressDiv = null;
        redirect = <Redirect to='/' />
    } else if(cus_status === 'succeeded' && prof === 'Display') {
        redirect = null;
        profile = <Display customer={customer} onClick={onProfChngeClick} />
    } else if (cus_status === 'succeeded' && prof === 'Edit'){
        redirect = null;
        profile = <UpdateForm 
                    username={customer.username} 
                    fn={fn}
                    ln={ln}
                    email={email}
                    phne={phne}
                    onCancel={onCancelProfChange}
                    onSubmit={onProfSubmit}
                    setfn={setfn}
                    setLn={setLn}
                    setEmail={setEmail}
                    setPhne={setPhne} />
    };


    // ADDRESS

// updating user address info
const onAdrChangeClick = () => {
    setAdr('Edit');
    if(address.appartment_nr !== null){
        setAp(address.appartment_nr);
        setStrt(address.street);
        setCty(address.city);
        setPrvnc(address.province);
        setZp(address.zip);
        setCntry(address.country);
    };

    if(prof === 'Edit'){
        onCancelProfChange();
    };
};

const onAdrSubmit = async (e) => {
    e.preventDefault();
    const data = {
        username: user.username,
        ap: ap,
        strt: strt,
        cty: cty,
        prvnc: prvnc,
        zp: zp,
        cntry: cntry
    };
    if(ap !== address.appartment_nr || strt !== address.street || cty !== address.city || prvnc !== address.province || zp !== address.zip || cntry !== address.country){
        const response = await updateAddress(data);
        if(response === false){
            alert('Something Went Wrong, Please Try Again');
        } else if(response === true){
            onCancelAdrChange();
        };
    } else {
        return;
    };    
};

// user address info rendering
    if(adr_status === 'succeeded' && adr === 'Display' && address.appartment_nr !== null){
        addressDiv = <AdrDisplay address={address} onClick={onAdrChangeClick} />
    } else if(adr_status === 'failed'){
        addressDiv = <p>Error While Getting Address</p>
    } else if((adr_status === 'succeeded' && adr === 'Edit') || (adr_status === 'succeeded' && address.appartment_nr === null)){
        addressDiv = <AdrUpdateForm 
                        ap={ap}
                        strt={strt}
                        cty={cty}
                        prvnc={prvnc}
                        zp={zp}
                        cntry={cntry}
                        onCancel={onCancelAdrChange}
                        onSubmit={onAdrSubmit}
                        setAp={setAp}
                        setStrt={setStrt}
                        setCty={setCty}
                        setPrvnc={setPrvnc}
                        setZp={setZp}
                        setCntry={setCntry} />
    } else {
        addressDiv = null;
    };


    // RENDER

// returned render    
    return(
        <div className='account-page' >
            {profile}
            {addressDiv}
            {redirect}
        </div>
    );
};

export default Account;