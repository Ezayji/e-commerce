import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render as rtlRender, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import nock from 'nock';

import customerReducer from '../../../Redux/CustomerSlice';

import Login from '../Login';

import { anonymous, loggedIn } from './utils/state';

jest.mock('../../../Redux/Store');

    // store mock
function setUpStore(initialState){
    return createStore(
        combineReducers({ 
            customer: customerReducer,
        }),
        initialState,
        applyMiddleware(thunk)
    );
};

describe('* <Login /> *', () => {
    
    it('Renders without crashing ,displays empty username and password fields and a link to Registering page', () => {
        const store = setUpStore( anonymous );

        rtlRender(
            <Provider store={store} >
                <Router>
                    <Login />
                </Router>
            </Provider>
        );

        expect(screen.getByTestId('login-username').value).toBe('');
        expect(screen.getByTestId('login-pw').value).toBe('');
        expect(screen.getByDisplayValue('SIGN IN')).toBeInTheDocument();
        expect(screen.getByText('CREATE ACCOUNT')).toBeInTheDocument();
    });

    it('Redirects to "/" if user is already logged in', () => {
        const store = setUpStore( loggedIn );

        rtlRender(
            <Provider store={store} >
                <Router>
                    <Login />
                    <Route path="/" exact >Main Page</Route>
                </Router>
            </Provider>
        );

        expect(screen.getByText('Main Page')).toBeInTheDocument();
    });

    it('Fetches a login request with input data and redirects to "/" on success + adds username to Redux state', async () => {
        const store = setUpStore( anonymous );

        const scope = nock('http://localhost')
            .post('/api/login', {
                username: 'Revarz',
                password: 'testpassword'
            })
            .reply(200, {
                user: {
                    username: 'Revarz'
                }
            });

        rtlRender(
            <Provider store={store} >
                <Router>
                    <Login />
                    <Route path="/" exact >Main Page</Route>
                </Router>
            </Provider>
        );

        const username = screen.getByTestId('login-username');
        fireEvent.change(username, { target: { value: 'Revarz' } })
        const pw = screen.getByTestId('login-pw');
        fireEvent.change(pw, { target: { value: 'testpassword' } })
        const signIn = screen.getByDisplayValue('SIGN IN');
        fireEvent.click(signIn);

        await waitFor(() => {
            expect(screen.getByText('Main Page')).toBeInTheDocument();
        });
            // timeout for redux to finish actions
        await new Promise((r) => setTimeout(r, 100));
        expect(store.getState().customer.user.username).toBe('Revarz');
    });

    it('Throws an alert and clears password field after a bad login request', async () => {
        const store = setUpStore( anonymous );
        window.alert = jest.fn();

        const scope = nock('http://localhost')
            .post('/api/login', {
                username: 'Revarz',
                password: 'testpassword'
            })
            .replyWithError(400);

        rtlRender(
            <Provider store={store} >
                <Router>
                    <Login />
                </Router>
            </Provider>
        );

        const username = screen.getByTestId('login-username');
        fireEvent.change(username, { target: { value: 'Revarz' } })
        const pw = screen.getByTestId('login-pw');
        fireEvent.change(pw, { target: { value: 'testpassword' } })
        const signIn = screen.getByDisplayValue('SIGN IN');
        fireEvent.click(signIn);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalled();
        });

        expect(screen.getByTestId('login-pw').value).toBe('');
    });

});