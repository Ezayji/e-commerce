import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { render as rtlRender, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import cartReducer from '../../../Redux/CartSlice';
import customerReducer from '../../../Redux/CustomerSlice';

import Cart from '../Cart';
import CartItem from '../CartItem';

import { oneItemUser, twoItemUser, emptyState, noItemsUser, fullTwoItemUser} from './utils/cartState';

jest.mock('../../../Redux/Store');

    // render helper function
function render(
    ui,
    {
        initialState,
        store = createStore(
            combineReducers({
                customer: customerReducer,
                cart: cartReducer
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
                    <Route path='/'>Main Page</Route>
                </Router>
            </Provider>
        )
    };
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

    // <CartItem /> props state
const item = {
    color: 'White / Green',
    manufacturer: 'Stuzzy',
    product_title: 'Stuzzy and Nike Insulated Pullover',
    quantity: 1,
    size: 'L',
    thumbnail_url: 'linktoimage',
    unit_price_eur: 330
};

describe('* <Cart /> (parent) * ', () => {
    describe('-- Logged in customer --', () => {

        it('Renders 1 Cart Item and Total without crashing', () => {
            render(
                <Cart />,
                { initialState: oneItemUser }
            );
            expect(screen.getByText('White / Green')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('€330')).toBeInTheDocument();
            expect(screen.getByText('TOTAL: €330')).toBeInTheDocument();

        });

        it('Renders 2 Cart Items and Total without crashing', () => {
            
            render(
                <Cart />,
                { initialState: twoItemUser }
            );

            expect(screen.getByText('White / Green')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('€330')).toBeInTheDocument();
            
            expect(screen.getByText('Tie Dye')).toBeInTheDocument();
            expect(screen.getByText('RIPNDIP')).toBeInTheDocument();
            expect(screen.getByText('Lord Nermal Socks')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('€12')).toBeInTheDocument();
            
            expect(screen.getByText('TOTAL: €354')).toBeInTheDocument();
        });

        it('Renders "No Items In Cart" if server responds with 404 "No Cart Items For Customer"', async () => {
        
            render(
                <Cart />,
                { initialState: noItemsUser }
            );
            
            const scope = nock('http://localhost')
                .get('/api/cart/Revarz')
                .reply(404, 'No Cart Items For Customer');
            
            await waitFor(() => {
                expect(screen.getByText('No Items In Cart')).toBeInTheDocument();
            });

        });

        it('Fetches Delete request to server and dispatches Redux Fetch for remaining Cart items if "REMOVE ITEM" is clicked for an Item', async () => {
            
            render(
                <Cart />,
                { initialState: twoItemUser }
            );
            
            const scope = nock('http://localhost')
                .delete('/api/cart/Revarz?product_id=19&size=Universal')
                .reply(204)
                .get('/api/cart/Revarz')
                .reply(200, {
                    products: [{
                        cart_id: 2,
                        product_id: 12,
                        color: 'White / Green',
                        manufacturer: 'Stuzzy',
                        product_title: 'Stuzzy and Nike Insulated Pullover',
                        quantity: 1,
                        size: 'L',
                        thumbnail_url: 'linktoimage',
                        unit_price_eur: 330
                    }],
                    total: 330
                });
            
            // remove second item from cart
            const remove = screen.getByTestId('remove-1');
            fireEvent.click(remove);

            await waitForElementToBeRemoved(() => screen.queryByText('Tie Dye'));

            await waitFor(() => {
                expect(screen.getByText('White / Green')).toBeInTheDocument();
            });

            expect(screen.getByText('Stuzzy')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('€330')).toBeInTheDocument();
            
            expect(screen.getByText('TOTAL: €330')).toBeInTheDocument();
        });

        it('Fetches item quantity update and Dispatches results to Redux if "+" is clicked', async () => {
            
            render(
                <Cart />,
                { initialState: twoItemUser }
            );

            const scope = nock('http://localhost')
                .put('/api/cart/Revarz', {
                    username: 'Revarz',
                    product_id: 19,
                    quantity: 3,
                    size: 'Universal'
                })
                .reply(200, {
                    products: [{
                        cart_id: 2,
                        product_id: 12,
                        color: 'White / Green',
                        manufacturer: 'Stuzzy',
                        product_title: 'Stuzzy and Nike Insulated Pullover',
                        quantity: 1,
                        size: 'L',
                        thumbnail_url: 'linktoimage',
                        unit_price_eur: 330
                    },
                    {
                        cart_id: 3,
                        product_id: 19,
                        quantity: 3,
                        size: 'Universal',
                        product_title: 'Lord Nermal Socks',
                        manufacturer: 'RIPNDIP',
                        color: 'Tie Dye',
                        unit_price_eur: 12,
                        thumbnail_url: 'linktoimage'
                    }],
                    total: 366
                });

            const increment = screen.getByTestId('increment-1');
            fireEvent.click(increment);

            await waitForElementToBeRemoved(() => screen.queryByText('2'));

            await waitFor(() => {
                expect(screen.getByText('3')).toBeInTheDocument();
            });
            
            expect(screen.getByText('White / Green')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('€330')).toBeInTheDocument();
            
            expect(screen.getByText('Tie Dye')).toBeInTheDocument();
            expect(screen.getByText('RIPNDIP')).toBeInTheDocument();
            expect(screen.getByText('Lord Nermal Socks')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('€12')).toBeInTheDocument();
            
            expect(screen.getByText('TOTAL: €366')).toBeInTheDocument();
        });

        it('Fetches item quantity update and Dispatches results to Redux if "-" is clicked', async () => {
            
            render(
                <Cart />,
                { initialState: twoItemUser }
            );

            const scope = nock('http://localhost')
                .put('/api/cart/Revarz', {
                    username: 'Revarz',
                    product_id: 19,
                    quantity: 1,
                    size: 'Universal'
                })
                .reply(200, {
                    products: [{
                        cart_id: 2,
                        product_id: 12,
                        color: 'White / Green',
                        manufacturer: 'Stuzzy',
                        product_title: 'Stuzzy and Nike Insulated Pullover',
                        quantity: 1,
                        size: 'L',
                        thumbnail_url: 'linktoimage',
                        unit_price_eur: 330
                    },
                    {
                        cart_id: 3,
                        product_id: 19,
                        quantity: 1,
                        size: 'Universal',
                        product_title: 'Lord Nermal Socks',
                        manufacturer: 'RIPNDIP',
                        color: 'Tie Dye',
                        unit_price_eur: 12,
                        thumbnail_url: 'linktoimage'
                    }],
                    total: 342
                });

            const decrement = screen.getByTestId('decrement-1');
            fireEvent.click(decrement);

            await waitForElementToBeRemoved(() => screen.queryByText('2'));

            await waitFor(() => {
                expect(screen.getByText('Lord Nermal Socks')).toBeInTheDocument();
            });
            
            expect(screen.getByText('White / Green')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
            expect(screen.getByText('€330')).toBeInTheDocument();
            
            expect(screen.getByText('Tie Dye')).toBeInTheDocument();
            expect(screen.getByText('RIPNDIP')).toBeInTheDocument();
            expect(screen.getByText('Lord Nermal Socks')).toBeInTheDocument();
            expect(screen.getByText('€12')).toBeInTheDocument();
            
            expect(screen.getByText('TOTAL: €342')).toBeInTheDocument();
        });

        it('Fetches customer Cart Items on render if Redux Cart is empty and displays them', async () => {
            
            render(
                <Cart />,
                { initialState: noItemsUser }
            );

            const scope = nock('http://localhost')
                .get('/api/cart/Revarz')
                .reply(200, {
                    products: [{
                        cart_id: 2,
                        product_id: 12,
                        color: 'White / Green',
                        manufacturer: 'Stuzzy',
                        product_title: 'Stuzzy and Nike Insulated Pullover',
                        quantity: 1,
                        size: 'L',
                        thumbnail_url: 'linktoimage',
                        unit_price_eur: 330
                    }],
                    total: 330
            }); 

            await waitFor(() => {
                expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
            });

            expect(screen.getByText('White / Green')).toBeInTheDocument();
            expect(screen.getByText('Stuzzy')).toBeInTheDocument();
            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('€330')).toBeInTheDocument();
            expect(screen.getByText('TOTAL: €330')).toBeInTheDocument();

        });

        it('Renders Checkout div if "CHECKOUT" is clicked and removes it if "Cancel Checkout" is clicked', async () => {
            const history = createMemoryHistory();
            
            render(
                <Cart history={history} />,
                { initialState: fullTwoItemUser }
            );

            const toCheckout = screen.getByText('CHECKOUT');
            fireEvent.click(toCheckout);

            await waitFor(() => {
                expect(screen.getByTestId('checkout-div')).toBeInTheDocument();
            });

            const cancel = screen.getByText('Cancel Checkout');
            fireEvent.click(cancel);

            expect(() =>  screen.getByText('Cancel Checkout')).toThrow();
        });

    });

    describe('-- Not Logged in Customer --', () => {
        it('Redirects to "/"', () => {
            
            render(
                <Cart />,
                { initialState: emptyState }
            );

            expect(screen.getByText('Main Page')).toBeInTheDocument();

        });
    });

});

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
