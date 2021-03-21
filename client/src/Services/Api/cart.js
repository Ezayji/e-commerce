import axios from 'axios';
import { getConfig, sendConfig } from '../config';

export async function getCart(username){
    const url = `/api/cart/${username}`;
    try{
        const response = await axios.get(url, getConfig);
        if(response.data.products && response.data.total){
            return response.data;
        };
    } catch(error) {
        if(error.response.data === 'No Cart Items For Customer'){
            const data ={
                products: null,
                total: 0
            }
            return data;
        } else {
            return 'Something Went wrong';
        };
    };
};

export async function addCartItem(data){
    const url = `/api/cart/${data.username}`;
    const newItem = {
        product_id: data.id,
        quantity: 1,
        size: data.size
    };
    try{
        const response = await axios.post(url, newItem, sendConfig);
        if(response.data.products && response.data.total){
            return response.data;
        };
    } catch(error){
        if(error.response.data === 'Not in stock' || error.response.data === 'Item Already In Cart'){
            return { error: error.response.data };
        } else {
            return { error: 'Something Went wrong, check you connection and please try again' };
        };
    };
};

export async function updateItemQty(data){
    const url = `/api/cart/${data.username}`;
    const updatedItem = {
        username: data.username,
        product_id: data.id,
        quantity: data.qty,
        size: data.size
    };
    try{
        const response = await axios.put(url, updatedItem, sendConfig);
        if(response.data.products && response.data.total){
            return response.data;
        };
    } catch(error) {
        if(error.response.data === 'Not in stock'){
            return { error: error.response.data };
        } else {
            return { error: 'Something Went Wrong' };
        };
    };
};

export async function deleteFromCart(item){
    const url = `/api/cart/${item.username}?product_id=${item.id}&size=${item.size}`;
    try{
        await axios.delete(url, sendConfig);
        return true;
    } catch(error) {
        return 'Something Went Wrong';
    };
};


// STRIPE CHECKOUT REQUESTS

// -- Server Side Confirmation --

// send payment request to server
export async function stripePaymentHandler(result, username, address){
    const url = `/api/payment/${username}`;
    if(result.error){
        return 'Something Went Wrong';
    } else {
        const body = {
            payment_method_id: result.paymentMethod.id,
            address: address,
        };
        const response = await axios.post(url, body, sendConfig);
        return response.data;
    };
};

// send 3d secure auth payment request to server
export async function stripe3DPaymentHandler(result, username, address){
    const url = `/api/payment/${username}`;
    if(result.error){
        return 'Something Went Wrong';
    } else {
        const body = {
            payment_intent_id: result.paymentIntent.id,
            address: address,
        };
        const response = await axios.post(url, body, sendConfig);
        return response.data;
    };
};

// post successful checkout
export async function checkoutSuccess(username, shippment){
    const url = `/api/cart/${username}/checkout`;
    const data = {
        shippment_id: shippment
    };
    try{
        await axios.post(url, data, sendConfig);
        return true;
    } catch (e) {
        return false;
    }
};