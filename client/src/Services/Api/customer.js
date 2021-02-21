import axios from 'axios';
import { getConfig, sendConfig } from '../config';
import { userAdded, resetCustomer, profileAdded, addressAdded } from '../../Redux/CustomerSlice';
import store from '../../Redux/Store';

// get customer profile and add to redux state
export async function getCustomer(username) {
    const url = `/api/customer_un/${username}`;
    try{
        const response = await axios.get(url, getConfig);
        store.dispatch(profileAdded(response.data));
        //return true;
    } catch(error) {
        return error;
    }
    
};

// update customer profile and add updated profile to redux state
export async function updateProfile(data){
    const url = `/api/customer_un/${data.username}`;
    const updatedInfo = {
        first_name: data.fn,
        last_name: data.ln,
        email: data.email,
        phone: data.phne
    };
    try{
        const response = axios.put(url, updatedInfo, sendConfig);
        store.dispatch(profileAdded(response.data));
        return true;
    } catch (error) {
        return false;
    }
};

// get customer address and add to redux state
export async function getAddress(username){
    const url = `/api/customer_address/${username}`;
    try{
        const response = await axios.get(url, getConfig);
        store.dispatch(addressAdded(response.data));
        //return true;
    } catch(error) {
        return error;
    };
};

// update customer address and add to redux state
export async function updateAddress(data){
    const url = `/api/customer_address/${data.username}`;
    const updatedInfo = {
        appartment_nr: data.ap,
        street: data.strt,
        city: data.cty,
        province: data.prvnc,
        zip: data.zp,
        country: data.cntry
    };
    try{
        const response = axios.put(url, updatedInfo, sendConfig);
        store.dispatch(addressAdded(response.data));
        return true;
    } catch(error) {
        return false;
    };
};

// register new customer 
export async function registerCustomer(data){
    const url = '/api/register';
    try{
        await axios.post(url, {
            username: data.username,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            password: data.password
        }, sendConfig);
        return true;
    } catch(error) {
        console.log(error.message);
        return false;
    };    
};

// log customer in and add username to store
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

// log customer out and reset redux customer state
export async function logout(){
    const url = '/api/logout';

    try{
        const response = await axios.get(url, getConfig);
        store.dispatch(resetCustomer());
        return true
    } catch (error) {
        return false;
    }

};

// check if browser is authenticated and add username to redux state
export async function checkAuth(){
    const url = '/api/auth';
    try{
        const response = await axios.get(url, getConfig);
        store.dispatch(userAdded(response.data.user));
        //return true;
    } catch(error) {
        store.dispatch(resetCustomer());
        return false;
    }
};

