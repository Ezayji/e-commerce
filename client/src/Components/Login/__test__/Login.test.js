import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '../../../testHelper';

import nock from 'nock';

import Login from '../Login';

import { anonymous, loggedIn } from './utils/state';

describe('* <Login /> *', () => {
    
    it('Renders without crashing ,displays empty username and password fields and a link to Registering page', () => {
        
        render(
            <Login />,
            { initialState: anonymous }
        );

        expect(screen.getByTestId('login-username').value).toBe('');
        expect(screen.getByTestId('login-pw').value).toBe('');
        expect(screen.getByDisplayValue('SIGN IN')).toBeInTheDocument();
        expect(screen.getByText('CREATE ACCOUNT')).toBeInTheDocument();
    });

    it('Redirects to "/" if user is already logged in', () => {
        
        render(
            <Login />,
            { initialState: loggedIn }
        );

        expect(screen.getByText('Main Page')).toBeInTheDocument();
    });

    it('Fetches a login request with input data and redirects to "/" on success + adds username to Redux state', async () => {

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
        
        const [ screen, store ] = render(
            <Login />,
            { initialState: anonymous }
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
        
        window.alert = jest.fn();

        const scope = nock('http://localhost')
            .post('/api/login', {
                username: 'Revarz',
                password: 'testpassword'
            })
            .reply(400);
        
        render(
            <Login />,
            { initialState: anonymous }
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