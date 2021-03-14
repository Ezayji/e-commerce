import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '../../../testHelper';

import nock from 'nock';

import Products from '../Products';

import BrandHeader from '../ProdHeaders/BrandHeader';
import GenderHeader from '../ProdHeaders/GenderHeader';

import ProductsList from '../ProdList/ProductsList';
import ProductPreview from '../ProdList/ProductPreview';

import ProdPage from '../ProdPage/ProdPage';
import Product from '../ProdPage/Product';

import { anonymous, loggedIn, product, categoryRes, genderRes, brandRes } from './utils/state';

describe('* <Products /> *', () => {

    it('Fetches products to Redux and renders "${CATEGORY} FR ${GNDR}" + Products if match.path is "/products/:gender/list/:categoryid/:category_title"', async () => {

        const scope = nock('http://localhost')
            .get('/api/products?gender=men&categoryid=1')
            .reply(200, categoryRes);
        
        const [ screen, store ] = render(
            <Products match={{params: { gender: 'men', categoryid: 1, category_title: 'HTS' }, isExact: true, path: '/products/:gender/list/:categoryid/:category_title', url: '/products/men/list/1/HTS'}} />,
            { initialState: anonymous }
        );

        await waitFor(() => {
            expect(screen.getByText('HTS FR MN')).toBeInTheDocument();
        });
        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.getByText('Product2')).toBeInTheDocument();
        const reduxState = store.getState().products;
        expect(reduxState).toEqual({
            list: categoryRes,
            status: 'category',
            error: null,
            gender: 'men',
            category_id: 1,
            brand_id: 0
        });
    });

    it('Fetches products to Redux and renders "PRDCTS FR ${GNDR}" + Products if match.path is "/products/:gender"', async () => {

        const scope = nock('http://localhost')
            .get('/api/products?gender=women')
            .reply(200, genderRes);
        
        const [ screen, store ] = render(
            <Products match={{params: { gender: 'women' }, isExact: true, path: '/products/:gender', url: '/products/women'}} />,
            { initialState: anonymous }
        );

        await waitFor(() => {
            expect(screen.getByText('PRDCTS FR WMN')).toBeInTheDocument();
        });
        expect(screen.getByText('Product3')).toBeInTheDocument();
        expect(screen.getByText('Product4')).toBeInTheDocument();
        const reduxState = store.getState().products;
        expect(reduxState).toEqual({
            list: genderRes,
            status: 'gender',
            error: null,
            gender: 'women',
            category_id: 0,
            brand_id: 0
        });
    });

    it('Fetches products to Redux and renders Brand description and an Logo image + Products if match.path is "/brands/:brand_id/:title"', async () => {

        const scope = nock('http://localhost')
            .get('/api/manufacturer/1')
            .reply(200, brandRes);
        
        const [ screen, store ] = render(
            <Products match={{params: { brand_id: 1, title: 'Brand' }, isExact: true, path: '/brands/:brand_id/:title', url: '/brands/1/Brand'}} />,
            { initialState: anonymous }
        );

        await waitFor(() => {
            expect(screen.getByText('Brand Description')).toBeInTheDocument();
        });
        const img = screen.getByAltText('Brand');
        expect(img.src).toContain('Logo.Url');
        expect(screen.getByText('Product5')).toBeInTheDocument();
        expect(screen.getByText('Product6')).toBeInTheDocument();
        const reduxState = store.getState().products;
        expect(reduxState).toEqual({
            list: brandRes,
            status: 'brand',
            error: null,
            gender: '',
            category_id: 0,
            brand_id: 1
        });
    });

    describe('-- <BrandHeader /> --', () => {
        it('Renders a description and an Logo image', () => {
            
            render(
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
            
            render(
                <GenderHeader data={{
                    gender: 'men'
                }} /> 
            );

            expect(screen.getByText('PRDCTS FR MN')).toBeInTheDocument();
        });

        it('Renders "${CATEGORY} FR MN" if "men" and category is passed in props', () => {
            
            render(
                <GenderHeader data={{
                    gender: 'men',
                    category_title: 'JCKTS'
                }} />
            );

            expect(screen.getByText('JCKTS FR MN')).toBeInTheDocument();
        });
        
        it('Renders "PRDCTS FR WMN" if only "women" is passed in props', () => {
            
            render(
                <GenderHeader data={{
                    gender: 'women'
                }} />
            );

            expect(screen.getByText('PRDCTS FR WMN')).toBeInTheDocument();
        });

        it('Renders "${CATEGORY} FR WMN" if "women" and category is passed in props', () => {
            
            render(
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
            
            render(
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
            );

            expect(screen.getByText('Product')).toBeInTheDocument();
            expect(screen.getByText('Product2')).toBeInTheDocument();
        });
    
        describe('--* <ProductPreview /> *--', () => {
            it('Renders product Details, Image and a Link to product page', () => {
                
                render(
                    <ProductPreview product={{
                        id: 1,
                        title: 'Product',
                        manufacturer: 'Brand',
                        unit_price_eur: 22,
                        thumbnail_url: 'url'
                    }} url='/products/women' />
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

        const scope = nock('http://localhost')
            .get('/api/products/1')
            .reply(200, product)
        
        render(
            <ProdPage match={{params: { gender: 'men', productid: 1, product_title: 'Product' }, isExact: true, path: '/products/:gender/:productid/:product_title', url: '/products/men/1/Product'}} />,
            { initialState: loggedIn }
        );

        await waitFor(() => {
            expect(screen.getByText('Product')).toBeInTheDocument();
        });

    });

    describe('-- <Product /> --', () => {
        
        it('Renders Product details, First Image and Maps sizes to options', () => {
            
            render(
                <Product prod={product} />,
                { initialState: loggedIn }
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
            
            render(
                <Product prod={product} />,
                { initialState: loggedIn }
            );

            expect(screen.getByText('ADD TO CART')).toBeInTheDocument();
        });

        it('Renders "LOG IN OR REGISTER" if user is not logged in', () => {
            
            render(
                <Product prod={product} />,
                { initialState: anonymous }
            );

            expect(screen.getByText('LOG IN OR REGISTER')).toBeInTheDocument();
        });

        it('Renders the second image if "Right Arrow" is clicked and the first image if "Left Arrow" is then clicked', () => {
            
            render(
                <Product prod={product} />,
                { initialState: anonymous }
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
            
            render(
                <Product prod={product} />,
                { initialState: anonymous }
            );

            const right = screen.getByAltText('navigate right');
            fireEvent.click(right);
            fireEvent.click(right);
            const img = screen.getByAltText('Product');
            expect(img.src).toContain('url1');
        });

        it('Renders last image if "Left Arrow" is clicked while viewing the first image', () => {
            
            render(
                <Product prod={product} />,
                { initialState: anonymous }
            );

            const img = screen.getByAltText('Product');
            const left = screen.getByAltText('navigate left');
            fireEvent.click(left);
            expect(img.src).toContain('url2');
        });

        it('Fetches a post request if a size is added to cart and Dispatches updated cart to Redux state', async () => {

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
            
            const [ screen, store ] = render(
                <Product prod={product} />,
                { initialState: loggedIn }
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
            
            window.alert = jest.fn();
            
            render(
                <Product prod={product} />,
                { initialState: loggedIn }
            );

            const add = screen.getByText('ADD TO CART');
            fireEvent.click(add);

            expect(window.alert).toHaveBeenCalled();
        });

    });

});
