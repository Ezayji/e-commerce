import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render as rtlRender, fireEvent, screen, waitFor } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import cartReducer from '../../../Redux/CartSlice';
import customerReducer from '../../../Redux/CustomerSlice';
import ordersReducer from '../../../Redux/OrdersSlice';

import Header from '../Header';
import MobileHeader from '../MobileHeader';

jest.mock('../../../Redux/Store');

    // store mock
function setUpStore(initialState){
    return createStore(
        combineReducers({ 
            customer: customerReducer,
            cart: cartReducer,
            orders: ordersReducer
        }),
        initialState,
        applyMiddleware(thunk)
    );
};

xdescribe('* <Header /> *', () => {
    describe('It Renders without crashing and Fetches Brands to Redux State', () => {

    });
});

xdescribe('* <MobileHeader /> *', () => {

});