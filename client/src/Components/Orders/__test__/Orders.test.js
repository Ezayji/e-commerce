import React from 'react';
import { createMemoryHistory } from 'history';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '../../../testHelper';

import nock from 'nock';

import Orders from '../Orders';
import SingleOrder from '../SingleOrder/SingleOrder';
import SingleProductLine from '../SingleOrder/SingleProductLine';
import OrderPreview from '../OrderPreview/OrderPreview';

import { oneItemOrder, twoItemOrder, orderPreview, orderPreviewFalse, ordersResponse, emptyUserState, fetchedUserState1, fetchedUserState2, anonymous } from './utils/state';

describe('* <Orders /> *', () => {
    
    it('Fetches Orders, dispatches them to Redux state and Renders them', async () => {

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz')
            .reply(200, ordersResponse);
        
        const [ screen, store ] = render(
            <Orders />,
            { initialState: emptyUserState }
        );

        await waitFor(() => {
           expect(screen.getByText('1001')).toBeInTheDocument(); 
        });

        expect(screen.getByText('1002')).toBeInTheDocument(); 
        const orderState = store.getState().orders.orders;
        expect(orderState).toEqual(ordersResponse);

    });

    it("Renders 'You Haven't Ordered Anything Yet' if server responds with 404", async () => {

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz')
            .reply(404);
        
        render(
            <Orders />,
            { initialState: emptyUserState }
        );

        await waitFor(() => {
            expect(screen.getByText("You Haven't Ordered Anything Yet")).toBeInTheDocument();
        });

    });

    it('Redirects to "/" if user is not logged in', async () => {
        
        const history = createMemoryHistory();
        
        render(
            <Orders history={history} />,
            { initialState: anonymous }
        );

        await waitFor(() => {
            expect(history.location.pathname).toBe('/');
        });
    });

});

describe('* <OrderPreview /> *', () => {

    it('Renders without crashing and displays order details', () => {
        
        render(
            <OrderPreview username='Revarz' order={orderPreview} />
        );

        expect(screen.getByText('1001')).toBeInTheDocument();
        //expect(screen.getByText('3/10/2021')).toBeInTheDocument();
        expect(screen.getByText('€330')).toBeInTheDocument();
        expect(screen.getByText('Successful')).toBeInTheDocument();
    });

    it('Order date is formated DD/MM/YYYY', () => {
        
        render(
            <OrderPreview username='Revarz' order={orderPreview} /> 
        );

        expect(screen.getByTestId('date')).toHaveTextContent('3/10/2021');
    });

    it('Renders "Not Processed" if Order Payment is false', () => {
        
        render(
            <OrderPreview username='Revarz' order={orderPreviewFalse} />
        );

        expect(screen.getByText('Not Processed')).toBeInTheDocument();
    });

});

describe('* <SingleOrder /> (Order Page) *', () => {

    it('Fetches and Renders Order Address and 1 Item without crashing', async () => {

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz/1001')
            .reply(200, oneItemOrder);
        
        render(
            <SingleOrder match={{params: {username: 'Revarz', order_id: 1001}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1001'}} />,
            { initialState: emptyUserState }
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

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz/1002')
            .reply(200, twoItemOrder);
        
        render(
            <SingleOrder match={{params: {username: 'Revarz', order_id: 1002}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1002'}} />,
            { initialState: emptyUserState }
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

        const scope = nock('http://localhost')
            .get('/api/orders/Revarz/1002')
            .reply(400);
        
        render(
            <SingleOrder history={history} match={{params: {username: 'Revarz', order_id: 1002}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1002'}} />,
            { initialState: emptyUserState }
        );

        await waitFor(() => {
            expect(history.location.pathname).toBe('/orders/Revarz');
        });
    });

    it('Redirects to "/" if user is not logged in', async () => {
        const history = createMemoryHistory();
        
        render(
            <SingleOrder history={history} match={{params: {username: 'Revarz', order_id: 1002}, isExact: true, path: '/orders/:username/order/:order_id', url: '/orders/Revarz/order/1002'}} />,
            { initialState: anonymous } 
        );

        expect(history.location.pathname).toBe('/');

    });

    describe('-- <SingleProductLine /> --', () => {
        it('Renders product info', () => {
            
            render(
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
