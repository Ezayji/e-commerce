import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { render as rtlRender, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import customerReducer from '../../../Redux/CustomerSlice';
import ordersReducer from '../../../Redux/OrdersSlice';

import Orders from '../Orders';
import SingleOrder from '../SingleOrder/SingleOrder';
import SingleProductLine from '../SingleOrder/SingleProductLine';
import OrderPreview from '../OrderPreview/OrderPreview';

import { oneItemOrder, twoItemOrder, orderPreview, orderPreviewFalse, ordersResponse, emptyUserState, fetchedUserState1, fetchedUserState2, anonymous } from './utils/state';

jest.mock('../../../Redux/Store');

    // store mock
function setUpStore(initialState){
    return createStore(
        combineReducers({ 
            customer: customerReducer,
            orders: ordersReducer,
        }),
        initialState,
        applyMiddleware(thunk)
    );
};

describe('* <Orders /> *', () => {
    
    it('Fetches Orders, dispatches them to Redux state and Renders them', async () => {
        const store = setUpStore( emptyUserState );

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz')
            .reply(200, ordersResponse);

        rtlRender(
            <Provider store={store} >
                <Router>
                    <Orders />
                </Router>
            </Provider>
        );

        await waitFor(() => {
           expect(screen.getByText('1001')).toBeInTheDocument(); 
        });

        expect(screen.getByText('1002')).toBeInTheDocument(); 
        const orderState = store.getState().orders.orders;
        expect(orderState).toEqual(ordersResponse);

    });

    it("Renders 'You Haven't Ordered Anything Yet' if server responds with 404", async () => {
        const store = setUpStore( emptyUserState );
        const history = createMemoryHistory();

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz')
            .replyWithError(404);

        rtlRender(
            <Provider store={store} >
                <Router>
                    <Orders history={history} />
                </Router>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText("You Haven't Ordered Anything Yet")).toBeInTheDocument();
        });

    });

    it('Redirects to "/" if user is not logged in', async () => {
        const store = setUpStore( anonymous );
        const history = createMemoryHistory();

        rtlRender(
            <Provider store={store} >
                <Router>
                    <Orders history={history} />
                </Router>
            </Provider>
        );

        await waitFor(() => {
            expect(history.location.pathname).toBe('/');
        });
    });

});

describe('* <OrderPreview /> *', () => {

    it('Renders without crashing and displays order details', () => {

        rtlRender(
            <Router>
                <OrderPreview username='Revarz' order={orderPreview} />
            </Router>
        )

        expect(screen.getByText('1001')).toBeInTheDocument();
        //expect(screen.getByText('3/10/2021')).toBeInTheDocument();
        expect(screen.getByText('€330')).toBeInTheDocument();
        expect(screen.getByText('Successful')).toBeInTheDocument();
    });

    it('Order date is formated DD/MM/YYYY', () => {

        rtlRender(
            <Router>
                <OrderPreview username='Revarz' order={orderPreview} />
            </Router>
        );

        expect(screen.getByTestId('date')).toHaveTextContent('3/10/2021');
    });

    it('Renders "Not Processed" if Order Payment is false', () => {
        rtlRender(
            <Router>
                <OrderPreview username='Revarz' order={orderPreviewFalse} />
            </Router>
        );

        expect(screen.getByText('Not Processed')).toBeInTheDocument();
    });

});

describe('* <SingleOrder /> (Order Page) *', () => {

    it('Fetches and Renders Order Address and 1 Item without crashing', async () => {
        const store = setUpStore( emptyUserState );

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz/1001')
            .reply(200, oneItemOrder);

        rtlRender(
            <Provider store={store} >
                <Router>
                    <SingleOrder match={{params: {username: 'Revarz', order_id: 1001}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1001'}} />
                </Router>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Harjumaa')).toBeInTheDocument();
        });

        expect(screen.getByText('strt 33')).toBeInTheDocument();
        expect(screen.getByText('cty')).toBeInTheDocument();
        expect(screen.getByText('76605')).toBeInTheDocument();
        expect(screen.getByText('Estonia')).toBeInTheDocument();
        expect(screen.getByText('Stüzzy and Nike Insulated Pullover Jacket (White / Green) x1')).toBeInTheDocument();

    });

    it('Fetches and Renders Order Address and 2 items without crashing', async () => {
        const store = setUpStore( emptyUserState );

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz/1002')
            .reply(200, twoItemOrder);

        rtlRender(
            <Provider store={store} >
                <Router>
                    <SingleOrder match={{params: {username: 'Revarz', order_id: 1002}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1002'}} />
                </Router>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Harjumaa')).toBeInTheDocument();
        });

        expect(screen.getByText('strt 33')).toBeInTheDocument();
        expect(screen.getByText('cty')).toBeInTheDocument();
        expect(screen.getByText('76605')).toBeInTheDocument();
        expect(screen.getByText('Estonia')).toBeInTheDocument();
        expect(screen.getByText('Stüzzy and Nike Insulated Pullover Jacket (White / Green) x1')).toBeInTheDocument();
        expect(screen.getByText('Lord Nermal Socks (Tie Dye) x2')).toBeInTheDocument();
    });

    it('Redirects to "/orders/:username" if Order Fetch Fails', async () => {
        const history = createMemoryHistory();
        const store = setUpStore( emptyUserState );

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz/1002')
            .replyWithError(400);

        rtlRender(
            <Provider store={store} >
                <Router>
                    <SingleOrder history={history} match={{params: {username: 'Revarz', order_id: 1002}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1002'}} />
                </Router>
            </Provider>
        );

        await waitFor(() => {
            expect(history.location.pathname).toBe('/orders/Revarz');
        });
    });

    it('Redirects to "/" if user is not logged in', async () => {
        const history = createMemoryHistory();
        const store = setUpStore( anonymous );

        rtlRender(
            <Provider store={store} >
                <Router>
                    <SingleOrder history={history} match={{params: {username: 'Revarz', order_id: 1002}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1002'}} />
                </Router>
            </Provider>
        );

        expect(history.location.pathname).toBe('/');

    });

    describe('-- <SingleProductLine /> --', () => {
        it('Renders product info', () => {

            rtlRender(
                <SingleProductLine prod={{
                    product_id: 12,
                    quantity: 1,
                    size: "L",
                    unit_price_eur: 330,
                    product_title: "Stüzzy and Nike Insulated Pullover Jacket",
                    manufacturer: "Stüssy",
                    color: "White / Green",
                }} />
            );

            expect(screen.getByText('Stüzzy and Nike Insulated Pullover Jacket (White / Green) x1')).toBeInTheDocument();
            expect(screen.getByText('Stüssy')).toBeInTheDocument();
            expect(screen.getByText('Size: L'))
            expect(screen.getByText('€330')).toBeInTheDocument();

        });
    });

});
