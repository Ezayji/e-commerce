import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomer, getAddress } from '../Services/Api/customer';

const initialState = {
    user: null,
    profile: null,
    address: null,
    auth_status: 'idle',
    cus_status: 'idle',
    adr_status: 'idle',
    error: null
};

export const fetchCustomer = createAsyncThunk('customer/fetchCustomer', async (_, { getState }) => {
    const username = getState().customer.user.username;
    await getCustomer(username);
});

export const fetchAddress = createAsyncThunk('customer/fetchAddress', async (_, { getState }) => {
    const username = getState().customer.user.username;
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
            state.cus_status = initialState.cus_status;
            state.adr_status = initialState.adr_status;
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
        },
        [fetchAddress.rejected]: (state, action) => {
            state.adr_status = 'failed';
            state.error = action.error.message
        }
    }
});


export const { userAdded, resetCustomer, profileAdded, addressAdded } = customerSlice.actions;
export default customerSlice.reducer;