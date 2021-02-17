import axios from 'axios';
import { getConfig, sendConfig } from '../config';
import { userAdded } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';

export async function getCustomer(username) {
    const url = `/api/customer_un/${username}`;
    const response = await axios.get(url, getConfig);
    return response;
};

async function registerCustomer(data){
    const url = '/api/register';
    const response = await axios.post(url, {
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password
    })
    return response;
};

async function login(data){
    const url = '/api/login';
    try{
        const response = await axios.post(url, {
            username: data.username,
            password: data.password
        }, getConfig);
        const username = response.user.username;
        store.dispatch(userAdded(username));
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
};
