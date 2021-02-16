import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: {},
    profile: {},
    address: {},
    status: 'idle',
    error: null
};

export const fetchCustomer = createAsyncThunk('customer/fetchCustomer', async (_, { getState }) => {
    const username = getState().user.username;
    const url = `/api/customer_un/${username}`;
    const response = await axios.get(url)
    return response;
});

export const fetchAddress = createAsyncThunk('customer/fetchAddress', async (_, { getState }) => {
    const username = getState().user.username;
    const url = `/api/customer_address/${username}`;
    const response = await axios.get(url);
    return response;
});

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        userAdded(state, action) {
            state.user = action.payload;
        }
    },
    extraReducers: {
        [fetchCustomer.pending]: (state, action) => {
            state.status = 'loading customer';
        },
        [fetchCustomer.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.profile = action.payload;
        },
        [fetchCustomer.rejected]: (state, action) => {
            state.status = 'failed loading user';
            state.error = action.error.message;
        },
        [fetchAddress.pending]: (state, action) => {
            state.status = 'loading address';
        },
        [fetchAddress.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.address = action.payload;
        },
        [fetchAddress.rejected]: (state, action) => {
            state.status = 'failed loading address';
            state.error = action.error.message
        }
    }
});

export const { userAdded } = customerSlice.actions;
export default customerSlice.reducer;