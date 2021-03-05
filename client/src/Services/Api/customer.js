import axios from 'axios';
import { getConfig, sendConfig } from '../config';
import { userAdded, resetCustomer, profileAdded, addressAdded } from '../../Redux/CustomerSlice';
//import { resetCart } from '../../Redux/CartSlice';
import store from '../../Redux/Store';

// get customer profile and add to redux state
export async function getCustomer(username) {
    const url = `/api/customer_un/${username}`;
    try{
        const response = await axios.get(url, getConfig);
        /*
        store.dispatch(profileAdded(response.data));
        */
        return response.data;
    } catch(error) {
        return null;
        //return error;
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
        const response = await axios.put(url, updatedInfo, sendConfig);
        if (response.data) {
            /*
            store.dispatch(profileAdded(response.data));
            return true;
            */
            return response.data;
        };
    } catch (error) {
        if(error.response.data === 'Not unique phone' || error.response.data === 'Not unique email'){
            return { error: error.response.data };
        } else {
            return {error: 'Something Went Wrong, Please Try Again'};
        };
    };
};

// get customer address and add to redux state
export async function getAddress(username){
    const url = `/api/customer_address/${username}`;
    try{
        const response = await axios.get(url, getConfig);
        return response.data;
        //store.dispatch(addressAdded(response.data));
    } catch(error) {
        return null;
        //return error;
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
        const response = await axios.put(url, updatedInfo, sendConfig);
        if (response.data) {
        /*    
            store.dispatch(addressAdded(response.data));
            return true;
        */
            return response.data;
        };
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
            password: data.password,
            registered: new Date()
        }, sendConfig);
        return true;
    } catch(error) {
        if(error.response.data){
            return {
                error: error.response.data
            };
        } else {
            return {
                error: 'Something Went Wrong, Please Try Again'
            };
        };
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
       // store.dispatch(resetCart());
        store.dispatch(resetCustomer());
        return true
    } catch (error) {
        return false;
    }

};

// reset password
export async function resetPw(data){
    const url = `/api/customer_un/${data.username}/password`;
    const updatedInfo = {
        password: data.pw,
        new_password: data.new_pw
    };
    try{
        await axios.put(url, updatedInfo, sendConfig);
        return true;
    } catch(error) {
        if(error.response.data === 'Wrong Password Provided'){
            return error.response.data;
        } else {
            return 'Something Went Wrong, Please Try Again';
        };
    };
};

// check if browser is authenticated and add username to redux state
export async function checkAuth(){
    const url = '/api/auth';
    try{
        const response = await axios.get(url, getConfig);
        store.dispatch(userAdded(response.data.user));
    } catch(error) {
        store.dispatch(resetCustomer());
        return false;
    }
};

