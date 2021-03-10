import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { render as rtlRender, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import productsReducer from '../../../Redux/ProductsSlice';
import customerReducer from '../../../Redux/CustomerSlice';
import cartReducer from '../../../Redux/CartSlice';

import Products from '../Products';

import BrandHeader from '../ProdHeaders/BrandHeader';
import GenderHeader from '../ProdHeaders/GenderHeader';

import ProductsList from '../ProdList/ProductsList';
import ProductPreview from '../ProdList/ProductPreview';

import ProdPage from '../ProdPage/ProdPage';
import Product from '../ProdPage/Product';

import { anonymous, loggedIn, product } from './utils/state';

jest.mock('../../../Redux/Store');

    // store mock
function setUpStore(initialState){
    return createStore(
        combineReducers({
            customer: customerReducer,
            products: productsReducer,
            cart: cartReducer
        }),
        initialState,
        applyMiddleware(thunk)
    );
};

describe('* <Products /> *', () => {

    describe('-- <BrandHeader /> --', () => {
        it('Renders a description and an Logo image', () => {
            rtlRender(
                <BrandHeader data={{
                    logo_url: 'TestUrl',
                    title: 'Test',
                    description: 'Test Description'
                }} />
            );

            expect(screen.getByText('Test Description')).toBeInTheDocument();
            const logo = screen.getByAltText('Test');
            expect(logo.src).toContain('TestUrl');
        });
    });
    
    describe('-- <GenderHeader /> --', () => {
        it('Renders "PRDCTS FR MN" if only "men" is passed in props', () => {
            rtlRender(
                <GenderHeader data={{
                    gender: 'men'
                }} />
            );

            expect(screen.getByText('PRDCTS FR MN')).toBeInTheDocument();
        });

        it('Renders "${CATEGORY} FR "MN" if "men" and category is passed in props', () => {
            rtlRender(
                <GenderHeader data={{
                    gender: 'men',
                    category_title: 'JCKTS'
                }} />
            );

            expect(screen.getByText('JCKTS FR MN')).toBeInTheDocument();
        });
        
        it('Renders "PRDCTS FR "WMN" if only "women" is passed in props', () => {
            rtlRender(
                <GenderHeader data={{
                    gender: 'women'
                }} />
            );

            expect(screen.getByText('PRDCTS FR WMN')).toBeInTheDocument();
        });

        it('Renders "${CATEGORY} FR "WMN" if "women" and category is passed in props', () => {
            rtlRender(
                <GenderHeader data={{
                    gender: 'women',
                    category_title: 'PNTS'
                }} />
            );

            expect(screen.getByText('PNTS FR WMN')).toBeInTheDocument();
        });
    });
    
    describe('-- <ProductsList /> --', () => {

        it('Renders the products that are passed in props', () => {
            rtlRender(
                <Router>
                    <ProductsList products={[{
                        id: 1,
                        title: 'Product',
                        manufacturer: 'Brand',
                        unit_price_eur: 22,
                        thumbnail_url: 'url'
                    }, {
                        id: 2,
                            title: 'Product2',
                            manufacturer: 'Brand2',
                            unit_price_eur: 44,
                            thumbnail_url: 'url'
                    }]} url='/products/women' />
                </Router>
            );

            expect(screen.getByText('Product')).toBeInTheDocument();
            expect(screen.getByText('Product2')).toBeInTheDocument();
        });
    
        describe('--* <ProductPreview /> *--', () => {
            it('Renders product Details, Image and a Link to product page', () => {
                rtlRender(
                    <Router>
                        <ProductPreview product={{
                            id: 1,
                            title: 'Product',
                            manufacturer: 'Brand',
                            unit_price_eur: 22,
                            thumbnail_url: 'url'
                        }} url='/products/women' />
                    </Router>
                );

                expect(screen.getByText('Product')).toBeInTheDocument();
                expect(screen.getByText('Brand')).toBeInTheDocument();
                expect(screen.getByText('€22')).toBeInTheDocument();
                const img = screen.getByAltText('Product');
                expect(img.src).toContain('url');
                expect(screen.getByRole('link')).toHaveAttribute('href', '/products/women/1/Product');
            });   
        });

    });

});


describe('* <ProdPage /> *', () => {

    it('Fetches a Request for product details by match params and then displays the item', async () => {
        const store = setUpStore( loggedIn );

        const scope = nock('http://localhost')
            .get('/api/products/1')
            .reply(200, product)

        rtlRender(
            <Provider store={store} >
                <Router>
                    <ProdPage match={{params: { gender: 'men', productid: 1, product_title: 'Product' }, isExact: true, path: '/products/:gender/:productid/:product_title', url: '/products/men/1/Product'}} />
                </Router>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Product')).toBeInTheDocument();
        });

    });

    describe('-- <Product /> --', () => {
        
        it('Renders Product details, First Image and Maps sizes to options', () => {
            const store = setUpStore( loggedIn );

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            expect(screen.getByText('Product')).toBeInTheDocument();
            expect(screen.getByText('Brand')).toBeInTheDocument();
            expect(screen.getByText('€22')).toBeInTheDocument();
            expect(screen.getByText('Color')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
            expect(screen.getByText('• Material: Material')).toBeInTheDocument();
            expect(screen.getByText('L')).toBeInTheDocument();
            expect(screen.getByText('XL')).toBeInTheDocument();
            const img = screen.getByAltText('Product');
            expect(img.src).toContain('url1');
        });

        it('Renders "ADD TO CART" if user is logged in', () => {
            const store = setUpStore( loggedIn );

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
        });

        it('Renders "LOG IN OR REGISTER" if user is not logged in', () => {
            const store = setUpStore( anonymous );

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            expect(screen.getByText('LOG IN OR REGISTER')).toBeInTheDocument();
        });

        it('Renders the second image if "Right Arrow" is clicked and the first image if "Left Arrow" is then clicked', () => {
            const store = setUpStore( anonymous );

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            const img = screen.getByAltText('Product');
            const right = screen.getByAltText('navigate right');
            fireEvent.click(right);
            expect(img.src).toContain('url2');
            const left = screen.getByAltText('navigate left');
            fireEvent.click(left);
            expect(img.src).toContain('url1');

        });

        it('Renders the first image if navigated to the last image and "Right Arrow" is clicked', () => {
            const store = setUpStore( anonymous );

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            const right = screen.getByAltText('navigate right');
            fireEvent.click(right);
            fireEvent.click(right);
            const img = screen.getByAltText('Product');
            expect(img.src).toContain('url1');
        });

        it('Renders last image if "Left Arrow" is clicked while viewing the first image', () => {
            const store = setUpStore( anonymous );

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            const img = screen.getByAltText('Product');
            const left = screen.getByAltText('navigate left');
            fireEvent.click(left);
            expect(img.src).toContain('url2');
        });

        it('Fetches a post request if a size is added to cart and Dispatches updated cart to Redux state', async () => {
            const store = setUpStore( loggedIn );

            const res = {
                products: [{
                    cart_id: 2,
                    product_id: 1,
                    quantity: 1,
                    size: 'L',
                    product_title: 'Product',
                    manufacturer: 'Brand',
                    color: 'Color',
                    unit_price_eur: 22,
                    thumbnail_url: 'url'
                }],
                total: 22
            };

            const scope = nock('http://localhost')
                .post('/api/cart/Revarz', {
                    product_id: 1,
                    quantity: 1,
                    size: 'L'
                })
                .reply(200, res);

            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            const select = screen.getByTestId('select-size');
            fireEvent.change(select, { target: { value: 'L' } });
            const add = screen.getByText('ADD TO CART');
            fireEvent.click(add);

            await waitFor(() => {
                expect(select.value).toBe('');
            });

            const cartState = store.getState().cart;
            expect(cartState.products).toEqual(res.products);
            expect(cartState.total).toEqual(res.total);

        });

        it('Throws an Alert if no size is selected and "ADD TO CART" is clicked', () => {
            const store = setUpStore( loggedIn );
            window.alert = jest.fn();
            rtlRender(
                <Provider store={store} >
                    <Router>
                        <Product prod={product} />
                    </Router>
                </Provider>
            );

            const add = screen.getByText('ADD TO CART');
            fireEvent.click(add);

            expect(window.alert).toHaveBeenCalled();
        });

    });

});
