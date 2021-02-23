import axios from 'axios';
import { getConfig, sendConfig } from '../config';
import { cartAdded } from '../../Redux/CartSlice';
import store from '../../Redux/Store';

export async function getCart(username){
    const url = `/api/cart/${username}`;
    try{
        const response = await axios.get(url, getConfig);
        if(response.data.products && response.data.total){
            store.dispatch(cartAdded(response.data));
            return true;
        };
    } catch(error) {
        if(error.response.data === 'No Cart Items For Customer'){
            const data ={
                products: null,
                total: 0
            }
            store.dispatch(cartAdded(data));
            return error.response.data;
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
            store.dispatch(cartAdded(response.data));
            return true;
        };
    } catch(error){
        if(error.response.data === 'Not in stock' || error.response.data === 'Item Already In Cart'){
            return error.response.data;
        } else {
            return 'Something Went wrong';
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
            store.dispatch(cartAdded(response.data));
            return true;
        };
    } catch(error) {
        if(error.response.data === 'Not in stock'){
            return error.response.data;
        } else {
            console.log(error.response);
            return 'Something Went Wrong';
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