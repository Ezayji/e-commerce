import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render as rtlRender, fireEvent, screen } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import customerReducer from '../../../Redux/CustomerSlice';

import Account from '../Account';
import AdrUpdateForm from '../Address/AdrUpdateForm';
import UpdateForm from '../Profile/UpdateForm';
import UpdatePw from '../UpdatePw/UpdatePw';

import { fullUser, noAddressUser, anonymous, emptyUser } from './utils/user';

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
    
    describe('Logged in Customer with Profile and Address in Redux state', () => {

        it('Renders without crashing', () => {
            render(
                <Router>  
                    <Account />
                </Router> 
                , { initialState: fullUser }
            );
            // profile info
            expect(screen.getByText('Revarz')).toBeInTheDocument();
            expect(screen.getByText('Selna')).toBeInTheDocument();
            expect(screen.getByText('Kaszk')).toBeInTheDocument();
            expect(screen.getByText('selnaknewemail@testapi.com')).toBeInTheDocument();
            expect(screen.getByText('+372 99999999')).toBeInTheDocument();

            // address info
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('somestreet')).toBeInTheDocument();
            expect(screen.getByText('somecity')).toBeInTheDocument();
            expect(screen.getByText('someprovince')).toBeInTheDocument();
            expect(screen.getByText('75607')).toBeInTheDocument();
            expect(screen.getByText('highrise')).toBeInTheDocument();

        });

        it('Renders <AdrDisplay /> and <Display /> (profile info display)', () => {
            render(
                <Router>
                    <Account />
                </Router>
                , { initialState: fullUser }
            );

            const profile = screen.getByTestId('profile-display');
            const address = screen.getByTestId('address-display');

            expect(profile).toBeInTheDocument();
            expect(address).toBeInTheDocument();
            
        });

        it('Renders <UpdateForm/> (profile update) if "CHNGE" button is clicked and <Display /> if "CNCL" button is clicked', () => {
            const { getByTestId } = render(
                <Router>
                    <Account />
                </Router>
                , { initialState: fullUser }
            );
            
            //const profile = getByTestId('profile-display');
            expect(getByTestId('profile-display')).toBeInTheDocument();
            const chngeButton = getByTestId('profile-edit');
            fireEvent.click(chngeButton);

            //const profileUpdateForm = getByTestId('profile-edit-form');
            expect(getByTestId('profile-edit-form')).toBeInTheDocument();
            const cnclButton = getByTestId('profile-edit-cancel');
            fireEvent.click(cnclButton);
            expect(getByTestId('profile-display')).toBeInTheDocument();
        });

        it('Renders <AdrUpdateForm /> if "CHNGE" button is clicked and <AdrDisplay /> if "CNCL" button is clicked', () => {
            const { getByTestId } = render(
                <Router>
                    <Account />
                </Router>
                , { initialState: fullUser }
            );

            expect(getByTestId('address-display')).toBeInTheDocument();
            const chngeButton = getByTestId('address-edit');
            fireEvent.click(chngeButton);

            expect(getByTestId('address-edit-form')).toBeInTheDocument();
            const cnclButton = getByTestId('address-edit-cancel');
            fireEvent.click(cnclButton);
            expect(getByTestId('address-display')).toBeInTheDocument();
        });

        it('Redirects to "/account/:username/password" if "UPDT PW" is clicked', () => {
            const { getByTestId, container } = render(
                <Router>
                    <Account />
                    <Route path='/account/:username/password' exact >Password Change</Route>
                </Router>
                , { initialState: fullUser }
            );

            const changePw = getByTestId('profile-password-change');
            fireEvent.click(changePw);

            expect(container).toHaveTextContent('Password Change');

        });

    });
    
    describe('Logged in Customer without Saved Address', () => {
        it('Renders <Display /> (profile info display) and <AdrUpdateForm />', () => {
            const { getByTestId } = render(
                <Router>
                    <Account />
                </Router>
                , { initialState: noAddressUser }
            );

            expect(getByTestId('profile-display')).toBeInTheDocument();
            expect(getByTestId('address-edit-form')).toBeInTheDocument();

            const cnclButton = getByTestId('address-edit-cancel');
            fireEvent.click(cnclButton);

            expect(getByTestId('address-edit-form')).toBeInTheDocument();

        });

        it('Does not render <AdrDisplay /> if "CNCL" is clicked', () => {
            const { getByTestId } = render(
                <Router>
                    <Account />
                </Router>
                , { initialState: noAddressUser }
            );

            expect(getByTestId('address-edit-form')).toBeInTheDocument();

            const cnclButton = getByTestId('address-edit-cancel');
            fireEvent.click(cnclButton);

            expect(getByTestId('address-edit-form')).toBeInTheDocument();

        });

        it('Renders <UpdateForm /> (profile update form) if "CHNGE" button is clicked and <Display /> (profile display) if "CNCL" is clicked', () => {
            const { getByTestId } = render(
                <Router>
                    <Account />
                </Router>
                , { initialState: noAddressUser }
            );
            
            //const profile = getByTestId('profile-display');
            expect(getByTestId('profile-display')).toBeInTheDocument();
            const chngeButton = getByTestId('profile-edit');
            fireEvent.click(chngeButton);

            //const profileUpdateForm = getByTestId('profile-edit-form');
            expect(getByTestId('profile-edit-form')).toBeInTheDocument();
            const cnclButton = getByTestId('profile-edit-cancel');
            fireEvent.click(cnclButton);
            expect(getByTestId('profile-display')).toBeInTheDocument();
        });

        it('Redirects to "/account/:username/password" if "UPDT PW" is clicked', () => {
            const { getByTestId, container } = render(
                <Router>
                    <Account />
                    <Route path='/account/:username/password' exact >Password Change</Route>
                </Router>
                , { initialState: noAddressUser }
            );

            const changePw = getByTestId('profile-password-change');
            fireEvent.click(changePw);

            expect(container).toHaveTextContent('Password Change');

        });

    });
    
    describe('Customer not logged in', () => {
        it('Redirects to "/"', () => {
            const {container} = render(
                <Router>
                    <Account />
                    <Route path='/'>Main Page</Route>
                </Router>
                , { initialState: anonymous }
            );
        
            expect(container).toHaveTextContent('Main Page');
        });
    });

});

describe('<UpdateForm /> (profile update form) ', () => {

});

describe('<AdrUpdateForm />', () => {

});