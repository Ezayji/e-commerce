import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getCustomer, getAddress } from '../Services/Api/customer';

const initialState = {
    user: null,
    profile: null,
    address: null,
    cus_status: 'idle',
    adr_status: 'idle',
    error: null
};

export const fetchCustomer = createAsyncThunk('customer/fetchCustomer', async (_, { getState }) => {
    const username = getState().user.username;
    await getCustomer(username);
});

export const fetchAddress = createAsyncThunk('customer/fetchAddress', async (_, { getState }) => {
    const username = getState().user.username;
    await getAddress(username);
});

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        userAdded(state, action) {
            state.user = action.payload;
        },
        resetCustomer(state) {
            state.user = initialState.user;
            state.profile = initialState.profile;
            state.address = initialState.address;
            state.status = initialState.status;
            state.error = initialState.error;
        },
        profileAdded(state, action){
            state.profile = action.payload;
        },
        addressAdded(state, action){
            state.address = action.payload;
        }
    },
    extraReducers: {
        [fetchCustomer.pending]: (state) => {
            state.cus_status = 'loading';
        },
        [fetchCustomer.fulfilled]: (state, action) => {
            state.cus_status = 'succeeded';
            state.profile = action.payload;
        },
        [fetchCustomer.rejected]: (state, action) => {
            state.cus_status = 'failed';
            state.error = action.error.message;
        },
        [fetchAddress.pending]: (state) => {
            state.adr_status = 'loading';
        },
        [fetchAddress.fulfilled]: (state, action) => {
            state.adr_status = 'succeeded';
            state.address = action.payload;
        },
        [fetchAddress.rejected]: (state, action) => {
            state.adr_status = 'failed';
            state.error = action.error.message
        }
    }
});


export const { userAdded, resetCustomer, profileAdded, addressAdded } = customerSlice.actions;
export default customerSlice.reducer;