import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
    list: [],
    status: 'idle',
    error: null,
    gender: '',
    category_id: 0,
    brand_id: 0
}; 

export const fetchGender = createAsyncThunk('products/fetchGender', async (_, { getState }) => {
    const gender = getState().products.gender;
    const url = `/api/products?gender=${gender}`;
    const response = await axios.get(url);
    return response.data;    
});

export const fetchCategory = createAsyncThunk('products/fetchCategory', async (_, { getState }) => {
    const gender = getState().products.gender;
    const category = getState().products.category_id;
    const url = `/api/products?gender=${gender}&categoryid=${category}`
    const response = await axios.get(url);
    return response.data;
});

export const fetchBrnds = createAsyncThunk('products/fetchBrnds', async (_, { getState }) => {
    const brand = getState().products.brand_id;
    const url = `/api/manufacturer/${brand}`;
    const response = await axios.get(url);
    return response.data;
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        genderAdded(state, action) {
            state.gender = action.payload;
        },
        categoryIdAdded(state, action) {
            state.category_id = action.payload;
        },
        brandIdAdded(state, action) {
            state.brand_id = action.payload;
        }
    },
    extraReducers: {
        [fetchGender.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchGender.fulfilled]: (state, action) => {
            state.status = 'gender';
            state.list = action.payload;
        },
        [fetchGender.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [fetchCategory.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchCategory.fulfilled]: (state, action) => {
            state.status = 'category';
            state.list = action.payload;
        },
        [fetchCategory.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [fetchBrnds.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchBrnds.fulfilled]: (state, action) => {
            state.status = 'brand';
            state.list = action.payload;
        },
        [fetchBrnds.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});

export const { genderAdded, categoryIdAdded, brandIdAdded } = productsSlice.actions;
export default productsSlice.reducer;