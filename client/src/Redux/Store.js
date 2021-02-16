import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './ProductsSlice';
import customerReducer from './CustomerSlice';

export default configureStore({
    reducer: {
        customer: customerReducer,
        products: productsReducer,
    },
});