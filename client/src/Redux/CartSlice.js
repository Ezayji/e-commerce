import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart } from '../Services/Api/cart';

const initialState = {
    products: null,
    total: 0,
    status: 'idle',
    error: null
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState }) => {
    const username = getState().customer.user.username;
    await getCart(username);
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
        },
        cartAdded(state, action){
            state.products = action.payload.products;
            state.total = action.payload.total;
            state.status = 'succeeded'
        },
        statusAdded(state, action){
            state.status = action.payload;
        },
    },
    extraReducers:{
        [fetchCart.pending]: (state) => {
            state.status = 'loading';
        },
        [fetchCart.fulfilled]: (state, action) => {
            state.status = 'succeeded'
        },
        [fetchCart.rejected]: (state, action) => {
            state.status = 'failed'
            state.error = action.error.message;
        },
    }
});

export const { resetCart, cartAdded, statusAdded } = cartSlice.actions;
export default cartSlice.reducer;