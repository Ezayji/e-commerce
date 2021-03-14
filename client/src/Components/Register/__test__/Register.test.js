import React from 'react';
import { createMemoryHistory } from 'history';

import { render as rtlRender, fireEvent, screen, waitFor } from '@testing-library/react';

import nock from 'nock';

import Register from '../Register';

describe('* <Register /> *', () => {

    it('Renders without crashing and displays empty fields', () => {
        rtlRender(
            <Register />
        );

        expect(screen.getByPlaceholderText('USERNAME').value).toBe('');
        expect(screen.getByPlaceholderText('FIRST NAME').value).toBe('');
        expect(screen.getByPlaceholderText('LAST NAME').value).toBe('');
        expect(screen.getByPlaceholderText('EMAIL').value).toBe('');
        expect(screen.getByPlaceholderText('PHONE').value).toBe('');
        expect(screen.getByPlaceholderText('PASSWORD').value).toBe('');
        expect(screen.getByPlaceholderText('PASSWORD AGAIN').value).toBe('');
        expect(screen.getByText('Register To Start Shopping For Some Fine Goods')).toBeInTheDocument();

    });

    it('Throws an Alert if Password and Password Again do not match', () => {
        window.alert = jest.fn();

        rtlRender(
            <Register />
        );

        fireEvent.change(screen.getByPlaceholderText('USERNAME'), { target: { value: 'username' } });
        fireEvent.change(screen.getByPlaceholderText('FIRST NAME'), { target: { value: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('LAST NAME'), { target: { value: 'surname' } });
        fireEvent.change(screen.getByPlaceholderText('EMAIL'), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('PHONE'), { target: { value: '+372 55555555' } });
        fireEvent.change(screen.getByPlaceholderText('PASSWORD'), { target: { value: 'password' } });
        fireEvent.change(screen.getByPlaceholderText('PASSWORD AGAIN'), { target: { value: 'password1' } });
        fireEvent.click(screen.getByDisplayValue('CREATE'));

        expect(window.alert).toHaveBeenCalledWith("Passwords Don't Match");

    });

    it('Send a Post request to server with data if filled with correct information, alerts success and redirects to "/login"', async () => {
        window.alert = jest.fn();
        const history = createMemoryHistory();

        jest
            .spyOn(global, 'Date')
            .mockImplementationOnce(() => new Date())

        const scope = nock('http://localhost')
            .post('/api/register', {
                username: 'username',
                first_name: 'name',
                last_name: 'surname',
                email: 'test@gmail.com',
                phone: '+372 55555555',
                password: 'testpassword',
                registered: {}
            })
            .reply(201);

        rtlRender(
            <Register history={history} />
        );

        fireEvent.change(screen.getByPlaceholderText('USERNAME'), { target: { value: 'username' } });
        fireEvent.change(screen.getByPlaceholderText('FIRST NAME'), { target: { value: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('LAST NAME'), { target: { value: 'surname' } });
        fireEvent.change(screen.getByPlaceholderText('EMAIL'), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('PHONE'), { target: { value: '+372 55555555' } });
        fireEvent.change(screen.getByPlaceholderText('PASSWORD'), { target: { value: 'testpassword' } });
        fireEvent.change(screen.getByPlaceholderText('PASSWORD AGAIN'), { target: { value: 'testpassword' } });
        fireEvent.click(screen.getByDisplayValue('CREATE'));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Successfully Registered, Please Login With Your New Account!");
        })
        expect(history.location.pathname).toBe('/login');
    });

    it('Alert error message if Post request was not successful and resets password fields', async () => {
        window.alert = jest.fn();

        const scope = nock('http://localhost')
            .post('/api/register')
            .reply(400, 'Not Unique Username')

        rtlRender(
            <Register />
        );
    
        fireEvent.change(screen.getByPlaceholderText('USERNAME'), { target: { value: 'username' } });
        fireEvent.change(screen.getByPlaceholderText('FIRST NAME'), { target: { value: 'name' } });
        fireEvent.change(screen.getByPlaceholderText('LAST NAME'), { target: { value: 'surname' } });
        fireEvent.change(screen.getByPlaceholderText('EMAIL'), { target: { value: 'test@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('PHONE'), { target: { value: '+372 55555555' } });
        fireEvent.change(screen.getByPlaceholderText('PASSWORD'), { target: { value: 'testpassword' } });
        fireEvent.change(screen.getByPlaceholderText('PASSWORD AGAIN'), { target: { value: 'testpassword' } });
        fireEvent.click(screen.getByDisplayValue('CREATE'));
    
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith("Not Unique Username");
        });

        expect(screen.getByPlaceholderText('USERNAME').value).toBe('username');
        expect(screen.getByPlaceholderText('FIRST NAME').value).toBe('name');
        expect(screen.getByPlaceholderText('LAST NAME').value).toBe('surname');
        expect(screen.getByPlaceholderText('EMAIL').value).toBe('test@gmail.com');
        expect(screen.getByPlaceholderText('PHONE').value).toBe('+372 55555555');
        expect(screen.getByPlaceholderText('PASSWORD').value).toBe('');
        expect(screen.getByPlaceholderText('PASSWORD AGAIN').value).toBe('');

    });

});