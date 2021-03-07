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

import Checkout from '../Checkout';
import Billing from '../Billing/Billing';
import Payment from '../Payment/Payment';

import { noAddressUser, savedAddressUser, notFetchedProfile } from './utils/customers';

jest.mock('../../../Redux/Store');

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

xdescribe('* <Checkout /> (parent) *', () => {
    describe('-- Customer With Saved Address --', () => {

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

xdescribe('* <Payment /> (child) *', () => {

});