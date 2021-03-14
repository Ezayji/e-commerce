import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import customerReducer from './src/Redux/CustomerSlice';
import productsReducer from './src/Redux/ProductsSlice';
import cartReducer from './src/Redux/CartSlice';
import ordersReducer from './src/Redux/OrdersSlice';

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