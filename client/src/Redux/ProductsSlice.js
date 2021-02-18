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

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { getState }) => {
    const gender = getState().products.gender;
    const category = getState().products.category_id;
    const brand = getState().products.brand_id;

    if(gender !== '' && category === 0 && brand === 0){
        const url = `/api/products?gender=${gender}`;
        const response = await axios.get(url);
        return response.data;    
    } else if(gender !== '' && category !== 0 && brand === 0) {
        const url = `/api/products?gender=${gender}&categoryid=${category}`
        const response = await axios.get(url);
        return response.data;
    } else if(gender === '' && category === 0 && brand !== 0) {
        const url = `/api/manufacturer/${brand}`;
        const response = await axios.get(url);
        return response.data;
    };

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
        },
        statusReset(state, action){
            state.status = 'idle';
        }
    },
    extraReducers: {
        [fetchProducts.pending]: (state, action) => {
            state.status = 'loading';
        },
        [fetchProducts.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.list = action.payload;
        },
        [fetchProducts.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});

export const { genderAdded, categoryIdAdded, brandIdAdded, statusReset } = productsSlice.actions;
export default productsSlice.reducer;