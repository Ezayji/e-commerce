import axios from 'axios';

import { getConfig } from '../config';

export async function getSingleOrder(username, id){
    const url = `/api/orders/${username}/${id}`;
    try{
        const response = await axios.get(url, getConfig);
        return response.data;
    } catch (e) {
        return false;
    };
};