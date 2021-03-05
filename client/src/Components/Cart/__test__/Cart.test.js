import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { render as rtlRender, fireEvent, screen, waitFor } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import cartReducer from '../../../Redux/CartSlice';
import customerReducer from '../../../Redux/CustomerSlice';

import Cart from '../Cart';
import CartItem from '../CartItem';

jest.mock('../../../Redux/Store');

    // store for renders that dont dispatch actions
function render(
    ui,
    {
        initialState,
        store = createStore(cartReducer, initialState),
        ...renderOptions
    } = {}
){
    function Wrapper({ children }){
        return <Provider store={store} >{children}</Provider>
    };
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

    // store for renders that dispatch actions
function setUpStore(initialState){
    return createStore(
        combineReducers({ 
            customer: customerReducer,
            cart: cartReducer,
        }),
        initialState,
        applyMiddleware(thunk)
    );
};

const item = {
    color: 'White / Green',
    manufacturer: 'Stuzzy',
    product_title: 'Stuzzy and Nike Insulated Pullover',
    quantity: 1,
    size: 'L',
    thumbnail_url: 'linktoimage',
    unit_price_eur: 330
};

describe('* <CartItem /> *', () => {
    it('Renders without crashing and displays item details', () => {
        rtlRender(<CartItem item={item}  />);

        expect(screen.getByText('White / Green')).toBeInTheDocument();
        expect(screen.getByText('Stuzzy')).toBeInTheDocument();
        expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('€330')).toBeInTheDocument();
    });

    it('onIncrement from props is called if "+" is clicked', () => {
        const onIncrement = jest.fn();
        rtlRender(<CartItem item={item} onIncrement={onIncrement} />);

        fireEvent.click(screen.getByText('+'));
        expect(onIncrement).toHaveBeenCalled();
    });

    it('onDecrement from props is called if "-" is clicked', () => {
        const onDecrement = jest.fn();
        rtlRender(<CartItem item={item} onDecrement={onDecrement} />);

        fireEvent.click(screen.getByText('-'));
        expect(onDecrement).toHaveBeenCalled();
    });

    it('onDelete from props is called if "REMOVE ITEM" is clicked', () => {
        const onDelete = jest.fn();
        rtlRender(<CartItem item={item} onDelete={onDelete}  />);

        fireEvent.click(screen.getByText('REMOVE ITEM'));
        expect(onDelete).toHaveBeenCalled();
    });

});
