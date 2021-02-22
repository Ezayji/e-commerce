import './UpdatePw.css';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { resetPw } from '../../../Services/Api/customer';
import {Link} from 'react-router-dom';

const UpdatePw = ({ history }) => {
    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [rePw, setRePw] = useState('');
    
    let redirect = null;

    const user = useSelector(state => state.customer.user);

    const resetFields = () => {
        setOldPw('');
        setNewPw('');
        setRePw('');
    };

    const onOldPWChange = (e) => {
        setOldPw(e.target.value);
    };

    const onNewPwChange = (e) => {
        setNewPw(e.target.value);
    };

    const onRePwChange = (e) => {
        setRePw(e.target.value);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username: user.username,
            pw: oldPw,
            new_pw: newPw
        };
        if(newPw !== rePw){
            resetFields();
            alert('New Password And Repeated Password Do Not Match');
        } else if (oldPw === newPw || oldPw === rePw){
            resetFields();
            alert('New Password Can Not Match The Old Password');
        } else {
            const response = await resetPw(data);
            if(response === true){
                resetFields();
                alert('Password Changed Successfully');
                history.push(`/account/${user.username}`);
            } else {
                resetFields();
                alert(response);
            };
        };
    };

    const onCancel = () => {
        history.push(`/account/${user.username}`);
    };

    if(user === null){
        redirect = <Redirect to='/' />
    }

    return(
    <div className='pw-change' >
        <form onSubmit={onSubmit} >
            <h2>CHANGE PASSWORD</h2>
            <div className='change-pw-div' >
                <input className='chng-pw-field' type='password' value={oldPw} placeholder='OLD PASSWORD' onChange={onOldPWChange} required />
                <input className='chng-pw-field' type='password' value={newPw} placeholder='NEW PASSWORD' onChange={onNewPwChange} required />
                <input className='chng-pw-field' type='password' value={rePw} placeholder='REPEAT NEW PASSWORD' onChange={onRePwChange} required />
            </div>
            <div className='new-pw-actions' >
                <input className='sbm-new-pw' type='submit' value='SUBMIT' />
                <button type='button' onClick={onCancel} >CNCL</button>
            </div>
            {redirect}
        </form>
    </div>
    );
};

export default UpdatePw;