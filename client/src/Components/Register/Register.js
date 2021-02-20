import e from 'cors';
import React, { useState, useEffect } from 'react';
import { registerCustomer } from '../../Services/Api/customer';

import './Register.css';

const Register = () => {
    const [un, setUn] = useState('');
    const [fn, setfn] = useState('');
    const [ln, setLn] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pw, setPw] = useState('');
    const [pwAgain, setPwAgain] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        if(pw !== pwAgain){
            alert("Passwords Don't Match");
            setPw('');
            setPwAgain('');
        }
    };

    const unChange = (e) => {
        setUn(e.target.value);
    };

    const fnChange = (e) => {
        setfn(e.target.value);
    };

    const lnChange = (e) => {
        setLn(e.target.value);
    };

    const emailChange = (e) => {
        setEmail(e.target.value);
    };

    const phoneChange = (e) => {
        setPhone(e.target.value);
    };

    const pwChange = (e) => {
        setPw(e.target.value);
    };

    const pwAgainChange = (e) => {
        setPwAgain(e.target.value);
    };

    return(
        <div className="register_div" >
            <form onSubmit={onSubmit} >
                <input className="register_cred" type='text' onChange={unChange} value={un} placeholder="USERNAME" required />
                <input className="register_cred" type='text' onChange={fnChange} value={fn} placeholder="FIRST NAME" required />
                <input className="register_cred" type='text' onChange={lnChange} value={ln} placeholder="LAST NAME" required />
                <input className="register_cred" type='text' onChange={emailChange} value={email} placeholder="EMAIL" required />
                <input className="register_cred" type='text' onChange={phoneChange} value={phone} placeholder="PHONE" required />
                <input className="register_cred" type='password' onChange={pwChange} value={pw} min='8' max='20' placeholder="PASSWORD" required />
                <input className="register_cred" type='password' onChange={pwAgainChange} value={pwAgain} min='8' max='20' placeholder="PASSWORD AGAIN" required />
                <input className="register_sub" type="submit" value="CREATE" required />
            </form>
            <p>Register To Start Shopping For Some Fine Goods</p>
        </div>
    );
}

export default Register;