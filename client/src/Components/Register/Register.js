import React, { useState } from 'react';
import { registerCustomer } from '../../Services/Api/customer';

import './Register.css';

const Register = ({ history }) => {
    const [un, setUn] = useState('');
    const [fn, setfn] = useState('');
    const [ln, setLn] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pw, setPw] = useState('');
    const [pwAgain, setPwAgain] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if(pw !== pwAgain){
            alert("Passwords Don't Match");
            resetPw();
        } else {
            const data = {
                username: un,
                first_name: fn,
                last_name: ln,
                email: email,
                phone: phone,
                password: pw
            };
            const response = await registerCustomer(data);
            if(response.error){
                resetPw();
                alert(response.error);
            } else {
                alert('Successfully Registered, Please Login With Your New Account!');
                history.push('/login');
            };
        };
    };

    const resetPw = () => {
        setPw('');
        setPwAgain('');
    };

    const resetFields = () => {
        setUn('');
        setfn('');
        setLn('');
        setEmail('');
        setPhone('');
        setPw('');
        setPwAgain('');
    };

    return(
        <div className="register_div" >
            <form onSubmit={onSubmit} >
                <input className="register_cred" type='text' onChange={(e) => {
                    setUn(e.target.value);
                }} value={un} placeholder="USERNAME" required />
                <input className="register_cred" type='text' onChange={(e) => {
                    setfn(e.target.value);
                }} value={fn} placeholder="FIRST NAME" required />
                <input className="register_cred" type='text' onChange={(e) => {
                    setLn(e.target.value);
                }} value={ln} placeholder="LAST NAME" required />
                <input className="register_cred" type='text' onChange={(e) => {
                    setEmail(e.target.value);
                }} value={email} placeholder="EMAIL" required />
                <input className="register_cred" type='text' onChange={(e) => {
                    setPhone(e.target.value);
                }} value={phone} placeholder="PHONE" required />
                <input className="register_cred" type='password' onChange={(e) => {
                    setPw(e.target.value);
                }} value={pw} min='8' max='20' placeholder="PASSWORD" required />
                <input className="register_cred" type='password' onChange={(e) => {
                    setPwAgain(e.target.value);
                }} value={pwAgain} min='8' max='20' placeholder="PASSWORD AGAIN" required />
                <input className="register_sub" type="submit" value="CREATE"/>
            </form>
            <p>Register To Start Shopping For Some Fine Goods</p>
        </div>
    );
};

export default Register;