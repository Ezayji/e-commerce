import { render as rtlRender } from '@testing-library/react';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import customerReducer from './Redux/CustomerSlice';
import productsReducer from './Redux/ProductsSlice';
import cartReducer from './Redux/CartSlice';
import ordersReducer from './Redux/OrdersSlice';

    // render helper function, returns screen and store
export function render(
    ui,
    {
        initialState,
        store = createStore(
            combineReducers({
                customer: customerReducer,
                products: productsReducer,
                cart: cartReducer,
                orders: ordersReducer
            }),
            initialState,
            applyMiddleware(thunk)
        ),
        ...renderOptions
    } = {}
){
    function Wrapper({ children }){
        return (
            <Provider store={store} >
                <Router>
                    {children}
                    <Route path='/' exact >Main Page</Route>
                    <Route path='/account/:username/password' exact >Password Change</Route>
                    <Route path='/products/:gender/list/:categoryid/:category_title' exact >HATS PAGE</Route>
                </Router>
            </Provider>
        )
    };
    return [
        rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
        store
    ]
};