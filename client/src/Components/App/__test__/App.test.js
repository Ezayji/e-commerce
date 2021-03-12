import React from 'react';
/*
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
*/
import { render as rtlRender, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import productsReducer from '../../../Redux/ProductsSlice';
import customerReducer from '../../../Redux/CustomerSlice';
import cartReducer from '../../../Redux/CartSlice';
import ordersReducer from '../../../Redux/OrdersSlice';

import App from '../App';

const reactRouterDom = require('react-router-dom');
reactRouterDom.BrowserRouter = ({ children }) => <div>{children}</div>

import { MemoryRouter } from 'react-router-dom';

import { anonymous, product, categoryRes, genderRes, brandRes, user, orderRes, itemOrderRes } from './utils/state';

jest.mock('../../../Redux/Store');

    // store mock
function setUpStore(initialState){
    return createStore(
        combineReducers({
            customer: customerReducer,
            products: productsReducer,
            cart: cartReducer,
            orders: ordersReducer
        }),
        initialState,
        applyMiddleware(thunk)
    );
};
    // helper for rendering
function render(
    ui,
    {
        initialState,
        path,
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
        return <Provider store={store} ><MemoryRouter initialEntries={[path]} initialIndex={0} >{children}</MemoryRouter></Provider>
    };
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('* <App /> *', () => {
    beforeAll(() => {
        const scope = nock('http://localhost')
            .persist()
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
            .persist()
            .get('/api/auth')
            .reply(200, {
                user: {
                    username: 'Revarz'
                }
            })
            .persist()
            .get('/api/products/1')
            .reply(200, product)
            .persist()
            .get('/api/products?gender=women')
            .reply(200, genderRes)
            .persist()
            .get('/api/products?gender=men&categoryid=1')
            .reply(200, categoryRes)
            .persist()
            .get('/api/orders/Revarz/1001')
            .reply(200, itemOrderRes)
            .persist()
            .get('/api/manufacturer/1')
            .reply(200, brandRes)
            .persist()
            .get('/api/orders/Revarz')
            .reply(200, orderRes)
        
    });

    afterAll(() => {
        nock.cleanAll()
    });

    it('Renders <Home /> and <Header /> if path is "/"', () => {

        const {container} = render(
            <App />,
            { path: '/' }
        );

        expect(container.querySelector('header')).toBeInTheDocument();
        expect(screen.getByTestId('home')).toBeInTheDocument();

    });

    it('Renders <Login /> and <Header /> if path is "/login"', () => {

        const {container} = render(
            <App />,
            { path: '/login' }
        );

        expect(container.querySelector('header')).toBeInTheDocument();
        expect(screen.getByDisplayValue('SIGN IN')).toBeInTheDocument();
    });

    it('Renders <Register /> and <Header /> if path is "/register"', () => {

        const {container} = render(
            <App />,
            { path: '/register' }
        );

        expect(container.querySelector('header')).toBeInTheDocument();
        expect(screen.getByDisplayValue('CREATE')).toBeInTheDocument();
    });

    describe('-- PRODUCTS --', () => {
        it('Renders <ProdPage /> and <Header /> if path is "/products/:gender/:productid/:product_title"', async () => {
            render(
                <App />,
                {   
                    initialState: anonymous,
                    path: '/products/men/1/Product' 
                }
            );
        
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(screen.getByText('Product')).toBeInTheDocument();
            });
        });

        it('Renders <Products /> and <Header /> if path is "/products/:gender"', async () => {
            render(
                <App />,
                {   
                    initialState: anonymous,
                    path: '/products/women' 
                }
            );
        
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(screen.getByText('Product3')).toBeInTheDocument();
            });
            expect(screen.getByText('Product4')).toBeInTheDocument();
        });

        it('Renders <ProdPage /> and <Header /> if path is "/products/:gender/list/:categoryid/:category_title/:productid/:product_title"', async () => {
        
            render(
                <App />,
                {   
                    initialState: anonymous,
                    path: '/products/men/list/1/HTS/1/Product' 
                }
            );
        
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(screen.getByText('Product')).toBeInTheDocument();
            });

        });

        it('Renders <Products /> and <Header /> if path is "/products/:gender/list/:categoryid/:category_title"', async () => {
            render(
                <App />,
                {   
                    initialState: anonymous,
                    path: '/products/men/list/1/HTS' 
                }
            );
        
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(screen.getByText('Product')).toBeInTheDocument();
            });
            expect(screen.getByText('Product2')).toBeInTheDocument();
        });

        it('Renders <ProdPage /> and <Header /> if path is "/brands/:brand_id/:title/:productid/:product_title"', async () => {
            render(
                <App />,
                {   
                    initialState: anonymous,
                    path: '/brands/1/Brand/1/Product' 
                }
            );
        
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(screen.getByText('Product')).toBeInTheDocument();
            });
        });

        it('Renders <Products /> and <Header /> if path is "/brands/:brand_id/:title"', async () => {
            render(
                <App />,
                {   
                    initialState: anonymous,
                    path: '/brands/1/Brand' 
                }
            );
        
            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            })
            await waitFor(() => {
                expect(screen.getByText('Product5')).toBeInTheDocument();
            });
            expect(screen.getByText('Product6')).toBeInTheDocument();
            expect(screen.getByAltText('Brand').src).toContain('Logo.Url');
        });

    });

    describe('-- CUSTOMER --', () => {

        it('Renders <Account /> and <Header /> if path is "/account/:username"', async () => {
            render(
                <App />,
                {   
                    initialState: user,
                    path: '/account/Revarz' 
                }
            );

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });

            expect(screen.getByText('MY ACCNT')).toBeInTheDocument();
            expect(screen.getByText('ADDRSS')).toBeInTheDocument();

        });

        it('Renders <UpdatePw /> if path is "/account/:username/password"', async () => {
            render(
                <App />,
                {   
                    initialState: user,
                    path: '/account/Revarz/password' 
                }
            );

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            expect(screen.getByText('CHANGE PASSWORD')).toBeInTheDocument();
        });

        it('Renders <Cart /> and <Header /> if path is "/cart/:username"', async () => {
            render(
                <App />,
                {   
                    initialState: user,
                    path: '/cart/Revarz' 
                }
            );

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            expect(screen.getByText('Stuzzy and Nike Insulated Pullover')).toBeInTheDocument();
            expect(screen.getByText('Lord Nermal Socks')).toBeInTheDocument();
        });

        it('Renders <Orders /> and <Header /> if path is "/orders/:username"', async () => {
            render(
                <App />,
                {   
                    initialState: user,
                    path: '/orders/Revarz' 
                }
            );

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            expect(screen.getByText('1001')).toBeInTheDocument();
            expect(screen.getByText('1002')).toBeInTheDocument();
        });

        it('Renders <SingleOrder /> if path is "/orders/:username/order/:order_id"', async () => {
            render(
                <App />,
                {   
                    initialState: user,
                    path: '/orders/Revarz/order/1001' 
                }
            );

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });
            await waitFor(() => {
                expect(screen.getByText('Stüzzy and Nike Insulated Pullover Jacket (White / Green) x1')).toBeInTheDocument();
            })
        });

        it('Renders <SuccessPage /> and <Header /> if path is "/checkout/success/:username/:order_id"', async () => {
            render(
                <App />,
                {   
                    initialState: user,
                    path: '/checkout/success/Revarz/1001' 
                }
            );

            await waitFor(() => {
                expect(screen.getByText('Carhartt WIP')).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(screen.getByText('Succesfully created order #1001 for Revarz')).toBeInTheDocument();
            });
        });
    
    });

});