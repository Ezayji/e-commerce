import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { render as rtlRender, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import cartReducer from '../../../Redux/CartSlice';
import customerReducer from '../../../Redux/CustomerSlice';
import ordersReducer from '../../../Redux/OrdersSlice';

import Checkout from '../Checkout';
import Billing from '../Billing/Billing';
import Payment from '../Payment/Payment';
import SuccessPage from '../SuccessPage/SuccessPage';

const promise = loadStripe('pk_test_51IItmKB1uegguB7b2ReRKVdoa1Bojw5VxlWF9uuCwiYdY1Z3C8wpwI8kDau5SQ8qQN2nQdJXOvwvhODgssLH5RFn00LH75oIZw');

import { noAddressUser, savedAddressUser, notFetchedProfile, emptyCartUser, notLoggedIn, fullUserWOrders, twoItemCart, twoTotal, oneItemCart, oneTotal, profile, address } from './utils/customers';

jest.mock('../../../Redux/Store');

    // store with customer and cart states
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

    // store with customer, cart and order states
function makeStore(initialState){
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

describe('* <Checkout /> (parent) *', () => {
    describe('-- Customer With Saved Address --', () => {

        it("Renders without crashing and displays <Billing /> with Customer's saved address", async () => {
            const store = setUpStore( savedAddressUser );

            rtlRender(
                <Provider store={store} >
                    <Checkout store={store} />
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('BILLING')).toBeInTheDocument();
            });

            expect(screen.getByTestId('appartment').value).toBe('1');
            expect(screen.getByTestId('street').value).toBe('street');
            expect(screen.getByTestId('city').value).toBe('city');
            expect(screen.getByTestId('province').value).toBe('province');
            expect(screen.getByTestId('zip').value).toBe('76607');
            expect(screen.getByTestId('country').value).toBe('Estonia');
            expect(screen.getByTestId('use-existing').checked).toBe(true);
        });

        it('onCancel from props is called if "Cancel Checkout" is clicked', async () => {
            const store = setUpStore( savedAddressUser );
            const onCancel = jest.fn();

            rtlRender(
                <Provider store={store} >
                    <Checkout store={store} onCancel={onCancel} />
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('BILLING')).toBeInTheDocument();
            });

            const cancel = screen.getByText('Cancel Checkout');
            fireEvent.click(cancel);

            expect(onCancel).toHaveBeenCalled();
        });

        it('Renders <Payment /> if "NEXT" is clicked', async () => {
            const store = setUpStore( savedAddressUser );

            rtlRender(
                <Provider store={store} >
                    <Elements stripe={promise} >
                        <Checkout store={store} cart={twoItemCart} total={twoTotal} />
                    </Elements>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('BILLING')).toBeInTheDocument();
            });

            const next = screen.getByText('NEXT');
            fireEvent.click(next);

            expect(screen.getByText('ITEMS')).toBeInTheDocument();
            expect(screen.getByText('PAYMENT')).toBeInTheDocument();
        });

        it('Renders <Billing /> with selected address info if "CHANGE ADDRESS" is clicked on <Payment /> component', async () => {
            const store = setUpStore( savedAddressUser );

            rtlRender(
                <Provider store={store} >
                    <Elements stripe={promise} >
                        <Checkout store={store} cart={twoItemCart} total={twoTotal} />
                    </Elements>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('BILLING')).toBeInTheDocument();
            });

            const appartment = screen.getByTestId('appartment');
            fireEvent.change(appartment, { target: { value: '2' } });
            const street = screen.getByTestId('street');
            fireEvent.change(street, { target: { value: 'street2' } });
            const city = screen.getByTestId('city');
            fireEvent.change(city, { target: { value: 'city2' } });
            const zip = screen.getByTestId('zip');
            fireEvent.change(zip, { target: { value: '76605' } });
            const province = screen.getByTestId('province');
            fireEvent.change(province, { target: { value: 'province2' } });
            const country = screen.getByTestId('country');
            fireEvent.change(country, { target: { value: 'Ukraine' } });

            const next = screen.getByText('NEXT');
            fireEvent.click(next);

            const change = screen.getByText('CHANGE ADDRESS');
            fireEvent.click(change);

            expect(screen.getByTestId('appartment').value).toBe('2');
            expect(screen.getByTestId('street').value).toBe('street2');
            expect(screen.getByTestId('city').value).toBe('city2');
            expect(screen.getByTestId('province').value).toBe('province2');
            expect(screen.getByTestId('zip').value).toBe('76605');
            expect(screen.getByTestId('country').value).toBe('Ukraine');
            expect(screen.getByTestId('use-existing').checked).toBe(false);

        });

        it('Dispatches Profile and Address Fetch to Redux if not present', async () => {
            const store = setUpStore( notFetchedProfile );

            const reqAddress = {
                username: 'Revarz',
                appartment_nr: '1',
                street: 'street',
                city: 'city',
                province: 'province',
                zip: 76607,
                country: 'Estonia'
            };

            const scope = nock('http://localhost')
                .get('/api/customer_un/Revarz')
                .reply(200, {
                    username: 'Revarz',
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail@testapi.com',
                    phone: '+372 99999999'
                })
                .get('/api/customer_address/Revarz')
                .reply(200, {
                    username: 'Revarz',
                    appartment_nr: '1',
                    street: 'street',
                    city: 'city',
                    province: 'province',
                    zip: 76607,
                    country: 'Estonia'
            });

            rtlRender(
                <Provider store={store} >
                    <Checkout store={store} />
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('BILLING')).toBeInTheDocument();
            });

            const stateProfile = store.getState().customer.profile;
            const addressState = store.getState().customer.address;

            expect(stateProfile).toEqual(profile);
            expect(addressState).toEqual(reqAddress);

        });

        it('Renders <Billing /> with the option "Save address" and empty fields if no address was found from the database', async () => {
            const store = setUpStore( notFetchedProfile );

            const scope = nock('http://localhost')
                .get('/api/customer_un/Revarz')
                .reply(200, {
                    username: 'Revarz',
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail@testapi.com',
                    phone: '+372 99999999'
                })
                .get('/api/customer_address/Revarz')
                .reply(200, {
                    username: 'Revarz',
                    appartment_nr: null,
                    street: null,
                    city: null,
                    province: null,
                    zip: null,
                    country: null
                });

            rtlRender(
                <Provider store={store} >
                    <Checkout store={store} />
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('BILLING')).toBeInTheDocument();
            });

            expect(screen.getByTestId('appartment').value).toBe('');
            expect(screen.getByTestId('street').value).toBe('');
            expect(screen.getByTestId('city').value).toBe('');
            expect(screen.getByTestId('province').value).toBe('');
            expect(screen.getByTestId('zip').value).toBe('');
            expect(screen.getByTestId('country').value).toBe('');

            expect(screen.getByText('Save address')).toBeInTheDocument();
        });

    });
});

describe('* <Billing /> (child) *', () => {
    it('Renders without crashing if Saved Address is supplied and provides checkbox option "Use existing address"', async () => {
        const store = setUpStore( savedAddressUser );
        
        const address = {
            appartment_nr: '1',
            street: 'street',
            city: 'city',
            province: 'province',
            zip: '76607',
            country: 'Estonia',
        };
        
        rtlRender(
            <Provider store={store} >
                <Billing address={address} />
            </Provider>
        );
        
        await waitFor(() => {
            expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();
        });
        expect(screen.getByDisplayValue('1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('street')).toBeInTheDocument();
        expect(screen.getByDisplayValue('city')).toBeInTheDocument();
        expect(screen.getByDisplayValue('province')).toBeInTheDocument();
        expect(screen.getByDisplayValue('76607')).toBeInTheDocument();
       
        expect(screen.getByText('Use existing address')).toBeInTheDocument();
    });

    it('Renders without crashing if no address is supplied and provides checkbox option "Save address"', () => {
        const store = setUpStore( noAddressUser );
        
        const address = '';
        
        rtlRender(
            <Provider store={store} >
                <Billing address={address} />
            </Provider>
        );

        expect(screen.getByTestId('appartment').value).toBe('');
        expect(screen.getByTestId('street').value).toBe('');
        expect(screen.getByTestId('city').value).toBe('');
        expect(screen.getByTestId('province').value).toBe('');
        expect(screen.getByTestId('zip').value).toBe('');
        expect(screen.getByTestId('country').value).toBe('');
        expect(screen.getByText('Save address')).toBeInTheDocument();
    });

    it('Clears fields if first render with Saved Address and "Use existing address" is then unchecked', async () => {
        const store = setUpStore( savedAddressUser );
        
        const address = {
            appartment_nr: '1',
            street: 'street',
            city: 'city',
            province: 'province',
            zip: '76607',
            country: 'Estonia',
        };
        
        rtlRender(
            <Provider store={store} >
                <Billing address={address} />
            </Provider>
        );
        
        await waitFor(() => {
            expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();
        });

        const check = screen.getByTestId('use-existing');
        fireEvent.click(check);

        expect(screen.getByTestId('appartment').value).toBe('');
        expect(screen.getByTestId('street').value).toBe('');
        expect(screen.getByTestId('city').value).toBe('');
        expect(screen.getByTestId('province').value).toBe('');
        expect(screen.getByTestId('zip').value).toBe('');
        expect(screen.getByTestId('country').value).toBe('');

        expect(screen.getByText('Use existing address')).toBeInTheDocument();
    });

    it('Clears fields if first render with Saved Address and any field is changed', async () => {
        const store = setUpStore( savedAddressUser );
        
        const address = {
            appartment_nr: '1',
            street: 'street',
            city: 'city',
            province: 'province',
            zip: '76607',
            country: 'Estonia',
        };
        
        rtlRender(
            <Provider store={store} >
                <Billing address={address} />
            </Provider>
        );
        
        await waitFor(() => {
            expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();
        });

        const appartment = screen.getByTestId('appartment');
        fireEvent.change(appartment, { target: { value: '2' } });

        expect(screen.getByTestId('appartment').value).toBe('2');
        expect(screen.getByTestId('street').value).toBe('');
        expect(screen.getByTestId('city').value).toBe('');
        expect(screen.getByTestId('province').value).toBe('');
        expect(screen.getByTestId('zip').value).toBe('');
        expect(screen.getByTestId('country').value).toBe('');

    });

    it('Does not change input values if No Supplied Address, fields are then filled and "Save address" is then unchecked', () => {
        const store = setUpStore( noAddressUser );
        
        const address = '';
        
        rtlRender(
            <Provider store={store} >
                <Billing address={address} />
            </Provider>
        );

        const appartment = screen.getByTestId('appartment');
        fireEvent.change(appartment, { target: { value: '1' } });
        const street = screen.getByTestId('street');
        fireEvent.change(street, { target: { value: 'street' } });
        const city = screen.getByTestId('city');
        fireEvent.change(city, { target: { value: 'city' } });
        const zip = screen.getByTestId('zip');
        fireEvent.change(zip, { target: { value: '76607' } });
        const province = screen.getByTestId('province');
        fireEvent.change(province, { target: { value: 'province' } });
        const country = screen.getByTestId('country');
        fireEvent.change(country, { target: { value: 'Estonia' } });

        const check = screen.getByTestId('save-address');
        fireEvent.click(check);
        
        expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();    
        expect(screen.getByDisplayValue('1')).toBeInTheDocument();
        expect(screen.getByDisplayValue('street')).toBeInTheDocument();
        expect(screen.getByDisplayValue('city')).toBeInTheDocument();
        expect(screen.getByDisplayValue('province')).toBeInTheDocument();
        expect(screen.getByDisplayValue('76607')).toBeInTheDocument();
    });

    it('onNext from props is called with selected address info if "NEXT" is clicked', async () => {
        const store = setUpStore( savedAddressUser );
        const onNext = jest.fn();

        const address = {
            appartment_nr: '1',
            street: 'street',
            city: 'city',
            province: 'province',
            zip: '76607',
            country: 'Estonia',
        };
        
        rtlRender(
            <Provider store={store} >
                <Billing address={address} onNext={onNext} />
            </Provider>
        );
        
        await waitFor(() => {
            expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();
        });

        const next = screen.getByText('NEXT');
        fireEvent.click(next);

        expect(onNext).toHaveBeenCalledWith({
            appartment_nr: '1',
            street: 'street',
            city: 'city',
            province: 'province',
            zip: '76607',
            country: 'Estonia',
            status: 'Existing',
            check: true
        });
        
    });

    describe('-- Second render with address in Parent state --', () => {
    
        it('Can switch between Custom Address info and Saved address if "Use existing address" is checked and unchecked (renders with *Unchecked* and has custom in fields)', async () => {
            const store = setUpStore( savedAddressUser );
        
            const address = {
                appartment_nr: '2',
                street: 'street2',
                city: 'city2',
                province: 'province2',
                zip: '76605',
                country: 'England',
                status: 'Existing',
                check: false
            };
        
            rtlRender(
                <Provider store={store} >
                    <Billing address={address} />
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByDisplayValue('England')).toBeInTheDocument();
            });   
            expect(screen.getByDisplayValue('2')).toBeInTheDocument();
            expect(screen.getByDisplayValue('street2')).toBeInTheDocument();
            expect(screen.getByDisplayValue('city2')).toBeInTheDocument();
            expect(screen.getByDisplayValue('province2')).toBeInTheDocument();
            expect(screen.getByDisplayValue('76605')).toBeInTheDocument();
            expect(screen.getByTestId('use-existing').checked).toBe(false);

            const check = screen.getByTestId('use-existing');
            fireEvent.click(check);

            expect(screen.getByTestId('appartment').value).toBe('1');
            expect(screen.getByTestId('street').value).toBe('street');
            expect(screen.getByTestId('city').value).toBe('city');
            expect(screen.getByTestId('province').value).toBe('province');
            expect(screen.getByTestId('zip').value).toBe('76607');
            expect(screen.getByTestId('country').value).toBe('Estonia');
            expect(screen.getByTestId('use-existing').checked).toBe(true);

            fireEvent.click(check);

            expect(screen.getByTestId('appartment').value).toBe('2');
            expect(screen.getByTestId('street').value).toBe('street2');
            expect(screen.getByTestId('city').value).toBe('city2');
            expect(screen.getByTestId('province').value).toBe('province2');
            expect(screen.getByTestId('zip').value).toBe('76605');
            expect(screen.getByTestId('country').value).toBe('England');
            expect(screen.getByTestId('use-existing').checked).toBe(false);

        });

        it('Customer with saved address has saved info in fields and "Use existing address" *Checked*', async () => {
            const store = setUpStore( savedAddressUser );
        
            const address = {
                appartment_nr: '1',
                street: 'street',
                city: 'city',
                province: 'province',
                zip: '76607',
                country: 'Estonia',
                status: 'Existing',
                check: true
            };
            
            rtlRender(
                <Provider store={store} >
                    <Billing address={address} />
                </Provider>
            );
            
            await waitFor(() => {
                expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();
            });
            
            expect(screen.getByTestId('appartment').value).toBe('1');
            expect(screen.getByTestId('street').value).toBe('street');
            expect(screen.getByTestId('city').value).toBe('city');
            expect(screen.getByTestId('province').value).toBe('province');
            expect(screen.getByTestId('zip').value).toBe('76607');
            expect(screen.getByTestId('country').value).toBe('Estonia');

            expect(screen.getByTestId('use-existing').checked).toBe(true);
        });

        it('Customer without saved address has custom address in fields and "Save address" remains *Unchecked*', async () => {
            const store = setUpStore( noAddressUser );
        
            const address = {
                appartment_nr: '1',
                street: 'street',
                city: 'city',
                province: 'province',
                zip: '76607',
                country: 'Estonia',
                status: 'New',
                check: false
            };
        
            rtlRender(
                <Provider store={store} >
                    <Billing address={address} />
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();
            });

            expect(screen.getByTestId('appartment').value).toBe('1');
            expect(screen.getByTestId('street').value).toBe('street');
            expect(screen.getByTestId('city').value).toBe('city');
            expect(screen.getByTestId('province').value).toBe('province');
            expect(screen.getByTestId('zip').value).toBe('76607');
            expect(screen.getByTestId('country').value).toBe('Estonia');

            expect(screen.getByTestId('save-address').checked).toBe(false);
        });

        it('Customer without saved address has custom address in fields and "Save address" remains *Checked*', async () => {
            const store = setUpStore( noAddressUser );
        
            const address = {
                appartment_nr: '1',
                street: 'street',
                city: 'city',
                province: 'province',
                zip: '76607',
                country: 'Estonia',
                status: 'New',
                check: true
            };
        
            rtlRender(
                <Provider store={store} >
                    <Billing address={address} />
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByDisplayValue('Estonia')).toBeInTheDocument();
            });

            expect(screen.getByTestId('appartment').value).toBe('1');
            expect(screen.getByTestId('street').value).toBe('street');
            expect(screen.getByTestId('city').value).toBe('city');
            expect(screen.getByTestId('province').value).toBe('province');
            expect(screen.getByTestId('zip').value).toBe('76607');
            expect(screen.getByTestId('country').value).toBe('Estonia');

            expect(screen.getByTestId('save-address').checked).toBe(true);
        });
    });

});

describe('* <Payment /> (child) *', () => {

    it('Renders without crashing and displays 1 cart item', () => {
        const history = createMemoryHistory();
        
        rtlRender(
            <Router>
                <Elements stripe={promise} >
                    <Payment history={history} total={oneTotal} cart={oneItemCart} />
                </Elements>
            </Router>
        );

        expect(screen.getByText('ITEMS')).toBeInTheDocument();
        expect(screen.getByText('Stuzzy and Nike Insulated Pullover(White / Green) x1')).toBeInTheDocument();
        expect(screen.getByText('€330')).toBeInTheDocument();
        expect(screen.getByText('TOTAL: €330')).toBeInTheDocument();
        expect(screen.getByText('PAYMENT')).toBeInTheDocument();

    });

    it('Renders without crashing and displays 2 cart items', () => {
        const history = createMemoryHistory();
        
        rtlRender(
            <Router>
                <Elements stripe={promise} >
                    <Payment history={history} total={twoTotal} cart={twoItemCart} />
                </Elements>
            </Router>
        );

        expect(screen.getByText('ITEMS')).toBeInTheDocument();
        expect(screen.getByText('Stuzzy and Nike Insulated Pullover(White / Green) x1')).toBeInTheDocument();
        expect(screen.getByText('€330')).toBeInTheDocument();
        expect(screen.getByText('Lord Nermal Socks(Tie Dye) x2')).toBeInTheDocument();
        expect(screen.getByText('€24')).toBeInTheDocument();
        expect(screen.getByText('TOTAL: €354')).toBeInTheDocument();
        expect(screen.getByText('PAYMENT')).toBeInTheDocument();

    });

    it('onPrev from props is called if "CHANGE ADDRESS" is clicked', () => {
        const history = createMemoryHistory();
        const onPrev = jest.fn()

        rtlRender(
            <Router>
                <Elements stripe={promise} >
                    <Payment history={history} total={oneTotal} cart={oneItemCart} onPrev={onPrev} />
                </Elements>
            </Router>
        );

        const changeAddress = screen.getByText('CHANGE ADDRESS');
        fireEvent.click(changeAddress);
        expect(onPrev).toHaveBeenCalled();

    });

});

describe('* <SuccessPage /> *', () => {
    describe('-- Logged in customer redirected after succesful purchase --', () => {

        it('Renders without crashing, displays Order ID and username ', async () => {

            const store = setUpStore( emptyCartUser );
            rtlRender(
                <Provider store={store} >
                    <Router >
                        <SuccessPage store={store} match={{params: {username: 'Revarz', order_id: 1000000}, isExact: true, path: '/checkout/success/:username/:order_id', url: '/checkout/success/Revarz/1000000'}} />
                    </Router>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('Thank you for your purchase!')).toBeInTheDocument();
            });

            expect(screen.getByText('Succesfully created order #1000000 for Revarz')).toBeInTheDocument();
            //expect(screen.getByText('Find your new order details here.')).toBeInTheDocument();
        });

        it('Renders a link to order details page', async () => {
            const store = setUpStore( emptyCartUser );
            rtlRender(
                <Provider store={store} >
                    <Router >
                        <SuccessPage store={store} match={{params: {username: 'Revarz', order_id: 1000000}, isExact: true, path: '/checkout/success/:username/:order_id', url: '/checkout/success/Revarz/1000000'}} />
                    </Router>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('Thank you for your purchase!')).toBeInTheDocument();
            });

            expect(screen.getByRole('link')).toHaveAttribute('href', '/orders/Revarz/order/1000000');
        });

        it('Resets Redux Cart state and fetches Orders on render', async () => {
            const store = makeStore( fullUserWOrders );
            const order = [{
                id: 1001,
                date_utc: "2021-03-08T11:22:09.184Z",
                total_eur: 330,
                payment: true
            }];

            const emptyCart = {
                products: null,
                total: 0,
                status: 'idle',
                error: null
            };

            const scope = nock('http://localhost')
                .get('/api/orders/Revarz')
                .reply(200, order);

            rtlRender(
                <Provider store={store} >
                    <Router >
                        <SuccessPage store={store} match={{params: {username: 'Revarz', order_id: 1000000}, isExact: true, path: '/checkout/success/:username/:order_id', url: '/checkout/success/Revarz/1000000'}} />
                    </Router>
                </Provider>
            );
                // timeout for redux to finish actions
            await new Promise((r) => setTimeout(r, 1000));

            const stateOrders = store.getState().orders.orders;
            expect(stateOrders).toEqual(order);
            const stateCart = store.getState().cart;
            expect(stateCart).toEqual(emptyCart);

        });

    });

    describe('-- Not logged in customer trying to access via Url --', () => {
        
        it('Redirects to "/"', async () => {
            const store = setUpStore( notLoggedIn );
            rtlRender(
                <Provider store={store} >
                    <Router>
                        <SuccessPage store={store} match={{params: {username: 'Revarz', order_id: 1000000}, isExact: true, path: '/checkout/success/:username/:order_id', url: '/checkout/success/Revarz/1000000'}} />
                        <Route path="/" >Main Page</Route>
                    </Router>
                </Provider>
            );

            await waitFor(() => {
                expect(screen.getByText('Main Page')).toBeInTheDocument();
            });

        });

    });

});