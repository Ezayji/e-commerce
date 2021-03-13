import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render as rtlRender, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import cartReducer from '../../../Redux/CartSlice';
import customerReducer from '../../../Redux/CustomerSlice';
import ordersReducer from '../../../Redux/OrdersSlice';

import Header from '../Header';
import MobileHeader from '../Views/MobileHeader';
import DesktopHeader from '../Views/DesktopHeader';

import { notLoggedIn, fullUser } from './utils/state';

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

function resizeWindow(x, y){
    window.innerWidth = x;
    window.innerHeight = y;
    window.dispatchEvent(new Event('resize'));
};

describe('* <Header /> *', () => {
    describe('-- Desktop --', () => {
        it('It Renders without crashing, displays <DesktopHeader />, fetches Brands to local state and Fetches successful Authentication check that adds Username to Redux state', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                });

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
            
            expect(screen.getByTestId('desktop-header')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            expect(screen.getByText('Edwin')).toBeInTheDocument();
            expect(screen.getByText('RIPNDIP')).toBeInTheDocument();
            expect(screen.getByText('Stüssy')).toBeInTheDocument();

            const user = store.getState().customer.user;
            expect(user.username).toBe('Revarz');
            
        });

        it('Renders user actions for logged in customer', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                });

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
            
            expect(screen.getByTestId('desktop-header')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText('ACNT')).toBeInTheDocument();
            });
            
            expect(screen.getByText('CART')).toBeInTheDocument();
            expect(screen.getByText('ORDRS')).toBeInTheDocument();
            expect(screen.getByText('EXIT')).toBeInTheDocument();
        });

        it('Fetches log out request and Resets customer, cart and orders state if "EXIT" is clicked', async () => {
            const store = setUpStore( fullUser );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                })
                .get('/api/logout')
                .reply(200);

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
            
            expect(screen.getByTestId('desktop-header')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });

            const logout = screen.getByText('EXIT');
            fireEvent.click(logout);

            await waitFor(() => {
                expect(screen.getByText('LOGIN')).toBeInTheDocument();
            });

            const customer = store.getState().customer;
            expect(customer).toEqual(notLoggedIn.customer);
            const cart = store.getState().cart;
            expect(cart).toEqual(notLoggedIn.cart);
            const orders = store.getState().orders;
            expect(orders).toEqual(notLoggedIn.orders);

        });

        it('Displays login button if browser is Not Authenticated', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .replyWithError(400, 'Not Authenticated');

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
            
            expect(screen.getByTestId('desktop-header')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });

            expect(screen.getByText('LOGIN')).toBeInTheDocument();
        });

    });

    describe('-- Mobile --', () => {
        it('It Renders without crashing, displays <MobileHeader />, fetches Brands to local state and Fetches successful Authentication check that adds Username to Redux state', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                });
            
            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
                
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });

            act(() => resizeWindow(760, 480) );

            expect(screen.getByTestId('mobile-header')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByTestId('user-letter')).toBeInTheDocument();
            });

            const user = store.getState().customer.user;
            expect(user.username).toBe('Revarz');

        });

        it('Renders Category selection items if clicked on "MN" or "WMN" and Brands selection if clicked on "BRNDS"', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                });
            
            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
            /*    
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            */
            act(() => resizeWindow(760, 480) );

            expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
            const mn = screen.getByText('MN');
            fireEvent.click(mn);
            expect(screen.getByTestId('men-selection')).toBeInTheDocument();
            const wmn = screen.getByText('WMN');
            fireEvent.click(wmn);
            expect(screen.getByTestId('women-selection')).toBeInTheDocument();
            const brnds = screen.getByText('BRNDS');
            fireEvent.click(brnds);
            expect(screen.getByTestId('brands-selection')).toBeInTheDocument();
        });

        it('Renders First Letter of Username that opens user actions menu if clicked', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                });
            
            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
                
            /*    
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            */

            act(() => resizeWindow(760, 480) );

            expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
            await waitFor(() => {
                expect(screen.getByTestId('user-letter')).toBeInTheDocument();
            });
            fireEvent.click(screen.getByTestId('user-letter'));
            expect(screen.getByText('ACNT')).toBeInTheDocument();
            expect(screen.getByText('CART')).toBeInTheDocument();
            expect(screen.getByText('ORDRS')).toBeInTheDocument();
            expect(screen.getByText('EXIT')).toBeInTheDocument();

        });

        it('Shop Items Selection gets ".active" class if "Burger image" is clicked and the class removed if clicked again', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                });
            
            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
                
            /*    
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            */

            act(() => resizeWindow(760, 480) );
            expect(screen.getByTestId('mobile-header')).toBeInTheDocument();

            const burger = screen.getByTestId('burger-icon');
            const navActions = screen.getByTestId('mobile-selection');

            fireEvent.click(burger);
            expect(navActions).toHaveClass('active');

            fireEvent.click(burger);
            expect(navActions).not.toHaveClass('active');
        });

        it('".active" class is removed from Shop Items Selection if a category is selected', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                });
            
            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                        <Route path='/products/:gender/list/:categoryid/:category_title' exact >HATS PAGE</Route>
                    </Router>
                </Provider>
            );
                
            /*    
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            */

            act(() => resizeWindow(760, 480) );
            expect(screen.getByTestId('mobile-header')).toBeInTheDocument();

            const burger = screen.getByTestId('burger-icon');
            const navActions = screen.getByTestId('mobile-selection');

            fireEvent.click(burger);

            fireEvent.click(screen.getByText('WMN'));
            fireEvent.click(screen.getByText('HTS'));

            expect(screen.getByText('HATS PAGE')).toBeInTheDocument();
            expect(navActions).not.toHaveClass('active');
        });

        it('Fetches log out request and Resets customer, cart and orders state if "EXIT" is clicked', async () => {
            const store = setUpStore( fullUser );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .reply(200, {
                    user: {
                        username: 'Revarz'
                    }
                })
                .get('/api/logout')
                .reply(200);

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
            /*    
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            */

            act(() => resizeWindow(760, 480) );

            expect(screen.getByTestId('mobile-header')).toBeInTheDocument();

            fireEvent.click(screen.getByTestId('user-letter'));
            fireEvent.click(screen.getByText('EXIT'));

            await waitFor(() => {
                expect(screen.getByText('LOGIN')).toBeInTheDocument();
            });

            const customer = store.getState().customer;
            expect(customer).toEqual(notLoggedIn.customer);
            const cart = store.getState().cart;
            expect(cart).toEqual(notLoggedIn.cart);
            const orders = store.getState().orders;
            expect(orders).toEqual(notLoggedIn.orders);
        });

        it('Renders login button if browser is Not Authenticated', async () => {
            const store = setUpStore( notLoggedIn );

            const scope = nock('http://localhost')
                .get('/api/manufacturers')
                .reply(200, [
                    {
                        id: 1,
                        title: 'Carhartt WIP'
                    },
                    {
                        id: 2,
                        title: 'Edwin'
                    },
                    {
                        id: 3,
                        title: 'RIPNDIP'
                    },
                    {
                        id: 4,
                        title: 'Stüssy'
                    }
                ])
                .get('/api/auth')
                .replyWithError(400, 'Not Authenticated');

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Header />
                    </Router>
                </Provider>
            );
            /*    
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            */

            act(() => resizeWindow(760, 480) );

            expect(screen.getByTestId('mobile-header')).toBeInTheDocument();
            expect(screen.getByText('LOGIN')).toBeInTheDocument();
        });

    });

});

xdescribe('* <MobileHeader /> *', () => {

});