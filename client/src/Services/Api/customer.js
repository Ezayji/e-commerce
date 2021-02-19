import axios from 'axios';
import { getConfig, sendConfig } from '../config';
import { userAdded, resetCustomer } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';
import { useSelector } from 'react-redux';

export async function getCustomer(username) {
    const url = `/api/customer_un/${username}`;
    const response = await axios.get(url, getConfig);
    return response;
};

export async function registerCustomer(data){
    const url = '/api/register';
    const response = await axios.post(url, {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password
    }, sendConfig);
    return response;
};

export async function login(data){
    const url = '/api/login';
    try{
        const response = await axios.post(url, {
            username: data.username,
            password: data.password
        }, getConfig);
        store.dispatch(userAdded(response.data.user));
        return true;
    } catch (error) {
        return false;
    }
};

export async function logout(){
    const url = '/api/logout';

    try{
        const response = await axios.get(url, getConfig);
        console.log(response);
        store.dispatch(resetCustomer());
        return true
    } catch (error) {
        return false;
    }

};

export async function checkAuth(){
    const url = '/api/auth';

    try{
        const response = await axios.get(url, getConfig);
        store.dispatch(userAdded(response.data.user));
        return true;
    } catch(error) {
        store.dispatch(resetCustomer());
        return;
    }
};
