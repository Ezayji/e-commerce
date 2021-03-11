import './Profile.css';

import React from 'react';

const UpdateForm = ({ username, 
                    fn,
                    ln,
                    email,
                    phne,
                    onCancel,
                    onSubmit,
                    setfn,
                    setLn,
                    setEmail,
                    setPhne
}) => {
    return(
        <form data-testid='profile-edit-form' onSubmit={onSubmit} className='profile' >
            <h2>MY ACCNT</h2>
            <div className='account-value'>
                <p>USRNM: </p>
                <p>{username}</p>
            </div>
            <div className='account-value'>
                <p>FRST NM: </p>
                <input data-testid='fn-field' type='text' min='2' max='20' value={fn} placeholder='FIRST NAME' onChange={(e) => setfn(e.target.value)} required />
            </div>
            <div className='account-value'>
                <p>LST NM: </p>
                <input data-testid='ln-field' type='text' min='2' max='20' value={ln} placeholder='LAST NAME' onChange={(e) => setLn(e.target.value)} required />
            </div>
            <div className='account-value'>
                <p>EML: </p>
                <input data-testid='email-field' type='email' min='10' max='31' value={email} placeholder='EMAIL' onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='account-value'>
                <p>PHN: </p>
                <input data-testid='phne-field' type='tel' value={phne} placeholder='PHONE' onChange={(e) => setPhne(e.target.value)} required />
            </div>
            <div className='info-buttons' >
                <input data-testid='profile-edit-submit' className='info-submit' type='submit' value='SBMT' />
                <button data-testid='profile-edit-cancel' onClick={onCancel} >CNCL</button>
            </div>
        </form>
    );
};

export default UpdateForm;