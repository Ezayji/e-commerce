import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    products: [],
    total: 0,
    status: 'idle',
    error: null
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
    const username = getState().user.username;
    const url = `/api/cart/${username}`;
    const response = await axios.get(url);
    return response;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        resetCart(state) {
            state.products = initialState.products;
            state.total = initialState.total;
            state.status = initialState.status;
            state.error = initialState.error;
        }
    },
    extraReducers:{
        [fetchCart.pending]: (state) => {
            state.status = 'loading';
        },
        [fetchCart.fulfilled]: (state, action) => {
            state.status = 'succeeded'
            state.products = action.payload.products;
            state.total = action.payload.total;
        },
        [fetchCart.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
        }
    }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;