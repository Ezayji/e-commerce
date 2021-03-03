import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render as rtlRender, fireEvent, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import customerReducer from '../../../Redux/CustomerSlice';

import Account from '../Account';

import { fullUser, anonymous, emptyUser } from './utils/user';

function render(
    ui,
    {
        initialState,
        store = createStore(customerReducer, initialState),
        ...renderOptions
    } = {}
){
    function Wrapper({ children }){
        return <Provider store={store} >{children}</Provider>
    };
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

describe('<Account />', () => {
    
    it('Renders without crashing if an user is logged in and has Address + Profile info in state', () => {
        render(
            <Router>  
                <Account />
            </Router> 
            , { initialState: fullUser }
        );
        
        expect(screen.getByText('Revarz')).toBeInTheDocument();
        expect(screen.getByText('highrise')).toBeInTheDocument();
    });

    it('Redirects to "/" if user is not logged in', () => {
        const {container} = render(
            <Router>
                <Account />
                <Route path='/'>Main Page</Route>
            </Router>
            , { initialState: anonymous }
        );
        
        expect(container).toHaveTextContent('Main Page');
    });

    it('Dispatches call to fetch Address and Profile info if not in Redux state', async () => {
        
    });

});