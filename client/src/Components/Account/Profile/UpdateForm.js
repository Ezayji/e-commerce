import './Profile.css';

import React, { useState } from 'react';

const UpdateForm = ({ username, 
                    onFnChange, 
                    onLnChange, 
                    onEmailChange, 
                    onPhneChange,
                    fn,
                    ln,
                    email,
                    phne,
                    onCancel,
                    onSubmit
}) => {
/*    
    const [fn, setfn] = useState(customer.first_name);
    const [ln, setLn] = useState(customer.last_name);
    const [email, setEmail] = useState(customer.email);
    const [phne, setPhne] = useState(customer.phone);

    const onFnChange = (e) => {
        setfn(e.target.value);
    };
    const onLnChange = (e) => {
        setLn(e.target.value);
    };
    const onEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const onPhneChange = (e) => {
        setPhne(e.target.value);
    };
*/
    return(
        <form onSubmit={onSubmit} className='profile' >
            <h2>MY ACCNT</h2>
            <div className='account-value'>
                <p>USRNM: </p>
                <p>{username}</p>
            </div>
            <div className='account-value'>
                <p>FRST NM: </p>
                <input type='text' value={fn} placeholder='FIRST NAME' onChange={onFnChange} required />
            </div>
            <div className='account-value'>
                <p>LST NM: </p>
                <input type='text' value={ln} placeholder='LAST NAME' onChange={onLnChange} required />
            </div>
            <div className='account-value'>
                <p>EML: </p>
                <input type='text' value={email} placeholder='EMAIL' onChange={onEmailChange} required />
            </div>
            <div className='account-value'>
                <p>PHN: </p>
                <input type='text' value={phne} placeholder='PHONE' onChange={onPhneChange} required />
            </div>
            <div className='info-buttons' >
                <input className='info-submit' type='submit' value='SBMT' />
                <button onClick={onCancel} >CNCL</button>
            </div>
        </form>
    );
};

export default UpdateForm;