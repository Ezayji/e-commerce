import e from 'cors';
import React, { useState, useEffect } from 'react';
import { registerCustomer } from '../../Services/Api/customer';

import './Register.css';

const onSubmit = (e) => {
    e.preventDefault();
};

const Register = () => {
    return(
        <div className="register_div" >
            <form>
                <input className="register_cred" type='text' placeholder="USERNAME" required />
                <input className="register_cred" type='text' placeholder="FIRST NAME" required />
                <input className="register_cred" type='text' placeholder="LAST NAME" required />
                <input className="register_cred" type='text' placeholder="EMAIL" required />
                <input className="register_cred" type='text' placeholder="PHONE" required />
                <input className="register_cred" type='password' placeholder="PASSWORD" required />
                <input className="register_cred" type='password' placeholder="PASSWORD AGAIN" required />
                <input className="register_sub" type="submit" value="CREATE" required />
            </form>
            <p>Register To Start Shopping For Some Fine Goods</p>
        </div>
    );
}

export default Register;