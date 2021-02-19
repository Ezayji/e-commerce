import React, { useState } from 'react';
import './Login.css';
import {Link, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';

import { login } from '../../Services/Api/customer';
import { userAdded } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';


const Login = () => {
    const [un, setUn] = useState('');
    const [pw, setPw] = useState('');

    const user = useSelector(state => state.customer.user);
    
    let redirect;
    let error;

    const onSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: un,
            password: pw
        };
        
        console.log(user);
        const response = await login(user);
        console.log(response);
        if (response === false) {
            error = <p>Wrong username or password</p>
            setPw('');
        }

    };
    
    const handleNameChange = (e) => {
        setUn(e.target.value);
    };

    const handlePwChange = (e) => {
        setPw(e.target.value);
    };

    if(user !== null){
        redirect = <Redirect to='/' />
    } else {
        redirect = null;
    }

    return(
        <div className="login_div" >
            <form onSubmit={onSubmit} >
                <input className="login_cred" type="text" placeholder="USERNAME" value={un} onChange={handleNameChange} required />
                <input className="login_cred" type="password" placeholder="PASSWORD" value={pw} onChange={handlePwChange} required />
                <input className="sign_in" type="submit" value="SIGN IN" />
            </form>
            <p><Link to={'/register'}>CREATE ACCOUNT</Link></p>
            {error}
            {redirect}
        </div>
    );
}
//value={pw} onChange={handlePwChange}
export default Login;