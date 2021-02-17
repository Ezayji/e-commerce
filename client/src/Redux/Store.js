import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './ProductsSlice';
import customerReducer from './CustomerSlice';
import cartReducer from './CartSlice';
import ordersReducer from './OrdersSlice';

export default configureStore({
    reducer: {
        customer: customerReducer,
        products: productsReducer,
        cart: cartReducer,
        orders: ordersReducer,
    },
});