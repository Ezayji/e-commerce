import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { render as rtlRender, fireEvent, screen, waitFor } from '@testing-library/react';
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

describe('* <Account /> (Parent Comp) *', () => {
    
    describe('-- Logged in Customer with Profile and Address in Redux state --', () => {

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
    
    describe('-- Logged in Customer without Saved Address --', () => {
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
    
    describe('-- Customer not logged in --', () => {
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

describe('* <UpdateForm /> (profile update form) *', () => {
    describe('-- Logged in user with data in state --', () => {
        it('Renders without crashing and displays profile info in fields', () => {
            rtlRender(<UpdateForm
                username={'Revarz'}
                fn={'Selna'}
                ln={'Kaszk'}
                email={'selnaknewemail@testapi.com'}
                phne={'+372 99999999'} />
            );

            expect(screen.getByText('Revarz')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Selna')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Kaszk')).toBeInTheDocument();
            expect(screen.getByDisplayValue('selnaknewemail@testapi.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('+372 99999999')).toBeInTheDocument();
        });

        it('setState functions from props are called on input value change', () => {
            const setfn = jest.fn();
            const setLn = jest.fn();
            const setEmail = jest.fn();
            const setPhne = jest.fn();
            
            const { getByTestId } = rtlRender(<UpdateForm
                username={'Revarz'}
                fn={'Selna'}
                ln={'Kaszk'}
                email={'selnaknewemail@testapi.com'}
                phne={'+372 99999999'}
                setfn={setfn}
                setLn={setLn}
                setEmail={setEmail}
                setPhne={setPhne} />
            );

            const fnField = getByTestId('fn-field');
            fireEvent.change(fnField, { target: { value: 'Sigma' } });
            expect(setfn).toHaveBeenLastCalledWith('Sigma');

            const lnField = getByTestId('ln-field');
            fireEvent.change(lnField, { target: { value: 'LIMA' } });
            expect(setLn).toHaveBeenLastCalledWith('LIMA');

            const emailField = getByTestId('email-field');
            fireEvent.change(emailField, { target: { value: 'lima@gmail.com' } });
            expect(setEmail).toHaveBeenLastCalledWith('lima@gmail.com');

            const phneField = getByTestId('phne-field');
            fireEvent.change(phneField, { target: { value: '66666666' } });
            expect(setPhne).toHaveBeenLastCalledWith('66666666');

        });

        it('onSubmit from props is called if all fields are changed and "SBMT" is clicked', async () => {
            const setfn = jest.fn();
            const setLn = jest.fn();
            const setEmail = jest.fn();
            const setPhne = jest.fn();
            const onSubmit = jest.fn();
            onSubmit.mockImplementation((e) => {
                e.preventDefault();
            })
            
            const { getByTestId } = rtlRender(<UpdateForm
                username={'Revarz'}
                fn={'Selna'}
                ln={'Kaszk'}
                email={'selnaknewemail@testapi.com'}
                phne={'+372 99999999'}
                setfn={setfn}
                setLn={setLn}
                setEmail={setEmail}
                setPhne={setPhne}
                onSubmit={onSubmit} />
            );

            const fnField = getByTestId('fn-field');
            fireEvent.change(fnField, { target: { value: 'Sigma' } });
            expect(setfn).toHaveBeenLastCalledWith('Sigma');

            const lnField = getByTestId('ln-field');
            fireEvent.change(lnField, { target: { value: 'LIMA' } });
            expect(setLn).toHaveBeenLastCalledWith('LIMA');

            const emailField = getByTestId('email-field');
            fireEvent.change(emailField, { target: { value: 'lima@gmail.com' } });
            expect(setEmail).toHaveBeenLastCalledWith('lima@gmail.com');

            const phneField = getByTestId('phne-field');
            fireEvent.change(phneField, { target: { value: '66666666' } });
            expect(setPhne).toHaveBeenLastCalledWith('66666666');

            const submit = getByTestId('profile-edit-submit')
            fireEvent.click(submit);
            await waitFor(() => expect(onSubmit).toHaveBeenCalled());
        });

        it('onCancel from props is called if "CNCL" is clicked', () => {
            
            const onCancel = jest.fn();
            
            const { getByTestId } = rtlRender(<UpdateForm
                username={'Revarz'}
                fn={'Selna'}
                ln={'Kaszk'}
                email={'selnaknewemail@testapi.com'}
                phne={'+372 99999999'}
                onCancel={onCancel} />
            );

            const cancel = getByTestId('profile-edit-cancel');
            fireEvent.click(cancel);
            expect(onCancel).toHaveBeenCalled();
        });

    });
});

describe('<AdrUpdateForm />', () => {
    describe('-- Logged in user with saved address --', () => {
        it('Renders without crashing and Displays current address in fields', () => {
            rtlRender(<AdrUpdateForm
                ap={5}
                strt={'somestreet'}
                cty={'somecity'}
                prvnc={'someprovince'}
                zp={75607}
                cntry={'highrize'} />
            );

            expect(screen.getByDisplayValue('5')).toBeInTheDocument();
            expect(screen.getByDisplayValue('somestreet')).toBeInTheDocument();
            expect(screen.getByDisplayValue('somecity')).toBeInTheDocument();
            expect(screen.getByDisplayValue('someprovince')).toBeInTheDocument();
            expect(screen.getByDisplayValue('75607')).toBeInTheDocument();
            expect(screen.getByDisplayValue('highrize')).toBeInTheDocument();
        });

        it('setState functions from props are called on input value change', () => {

            const setAp = jest.fn();
            const setStrt = jest.fn();
            const setCty = jest.fn();
            const setPrvnc = jest.fn();
            const setZp = jest.fn();
            const setCntry = jest.fn();

            const { getByTestId } = rtlRender(<AdrUpdateForm
                ap={5}
                strt={'somestreet'}
                cty={'somecity'}
                prvnc={'someprovince'}
                zp={75607}
                cntry={'highrize'}
                setAp={setAp}
                setStrt={setStrt}
                setCty={setCty}
                setPrvnc={setPrvnc}
                setZp={setZp}
                setCntry={setCntry} />
            );

            const apField = getByTestId('appartment-field');
            fireEvent.change(apField, { target: { value: '22' } });
            expect(setAp).toHaveBeenLastCalledWith('22');

            const strtField = getByTestId('street-field');
            fireEvent.change(strtField, { target: { value: 'street' } });
            expect(setStrt).toHaveBeenLastCalledWith('street');

            const ctyField = getByTestId('city-field');
            fireEvent.change(ctyField, { target: { value: 'city' } });
            expect(setCty).toHaveBeenLastCalledWith('city');

            const prvncField = getByTestId('province-field');
            fireEvent.change(prvncField, { target: { value: 'province' } });
            expect(setPrvnc).toHaveBeenLastCalledWith('province');

            const zpField = getByTestId('zip-field');
            fireEvent.change(zpField, { target: { value: 76607 } });
            expect(setZp).toHaveBeenLastCalledWith('76607');

            const cntryField = getByTestId('country-field');
            fireEvent.change(cntryField, { target: { value: 'country' } });
            expect(setCntry).toHaveBeenLastCalledWith('country');
        });

        it('onSubmit from props is called if "SBMT" is clicked', async () => {

            const setAp = jest.fn();
            const setStrt = jest.fn();
            const setCty = jest.fn();
            const setPrvnc = jest.fn();
            const setZp = jest.fn();
            const setCntry = jest.fn();
            const onSubmit = jest.fn();
            onSubmit.mockImplementation((e) => {
                e.preventDefault();
            });

            const { getByTestId } = rtlRender(<AdrUpdateForm
                ap={5}
                strt={'somestreet'}
                cty={'somecity'}
                prvnc={'someprovince'}
                zp={75607}
                cntry={'highrize'}
                setAp={setAp}
                setStrt={setStrt}
                setCty={setCty}
                setPrvnc={setPrvnc}
                setZp={setZp}
                setCntry={setCntry}
                onSubmit={onSubmit} />
            );

            const apField = getByTestId('appartment-field');
            fireEvent.change(apField, { target: { value: '22' } });
            expect(setAp).toHaveBeenLastCalledWith('22');

            const strtField = getByTestId('street-field');
            fireEvent.change(strtField, { target: { value: 'street' } });
            expect(setStrt).toHaveBeenLastCalledWith('street');

            const ctyField = getByTestId('city-field');
            fireEvent.change(ctyField, { target: { value: 'city' } });
            expect(setCty).toHaveBeenLastCalledWith('city');

            const prvncField = getByTestId('province-field');
            fireEvent.change(prvncField, { target: { value: 'province' } });
            expect(setPrvnc).toHaveBeenLastCalledWith('province');

            const zpField = getByTestId('zip-field');
            fireEvent.change(zpField, { target: { value: 76607 } });
            expect(setZp).toHaveBeenLastCalledWith('76607');

            const cntryField = getByTestId('country-field');
            fireEvent.change(cntryField, { target: { value: 'country' } });
            expect(setCntry).toHaveBeenLastCalledWith('country');

            const submit = getByTestId('address-edit-submit');
            fireEvent.click(submit);
            await waitFor(() => expect(onSubmit).toHaveBeenCalled());

        });

        it('onCancel from props is called if "CNCL" is clicked', () => {
            const onCancel = jest.fn();

            const {getByTestId} = rtlRender(<AdrUpdateForm
                ap={5}
                strt={'somestreet'}
                cty={'somecity'}
                prvnc={'someprovince'}
                zp={75607}
                cntry={'highrize'}
                onCancel={onCancel} />
            );

            const cancel = getByTestId('address-edit-cancel');
            fireEvent.click(cancel);
            expect(onCancel).toHaveBeenCalled();
        });

    });

    describe('-- Logged in user without saved address --', () => {
        it('Renders empty input fields without crashing and displays "* No Address Added *"', () => {
            rtlRender(<AdrUpdateForm
                ap={''}
                strt={''}
                cty={''}
                prvnc={''}
                zp={''}
                cntry={''} />
            );

            expect(screen.getByText('* No Address Added *')).toBeInTheDocument();
            expect(screen.getByTestId('appartment-field')).toHaveTextContent('');
            expect(screen.getByTestId('street-field')).toHaveTextContent('');
            expect(screen.getByTestId('city-field')).toHaveTextContent('');
            expect(screen.getByTestId('province-field')).toHaveTextContent('');
            expect(screen.getByTestId('zip-field')).toHaveTextContent('');
            expect(screen.getByTestId('country-field')).toHaveTextContent('');

        });

        it('onCancel from props is not called if "CNCL" is clicked', () => {
            const onCancel = jest.fn();

            const {getByTestId} = rtlRender(<AdrUpdateForm
                ap={''}
                strt={''}
                cty={''}
                prvnc={''}
                zp={''}
                cntry={''}
                onCancel={onCancel} />
            );

            const cancel = getByTestId('address-edit-cancel');
            fireEvent.click(cancel);
            expect(onCancel).toHaveBeenCalledTimes(0);
        });

        it('setState functions from props are called on input value change', () => {

            const setAp = jest.fn();
            const setStrt = jest.fn();
            const setCty = jest.fn();
            const setPrvnc = jest.fn();
            const setZp = jest.fn();
            const setCntry = jest.fn();

            const { getByTestId } = rtlRender(<AdrUpdateForm
                ap={''}
                strt={''}
                cty={''}
                prvnc={''}
                zp={''}
                cntry={''}
                setAp={setAp}
                setStrt={setStrt}
                setCty={setCty}
                setPrvnc={setPrvnc}
                setZp={setZp}
                setCntry={setCntry} />
            );

            const apField = getByTestId('appartment-field');
            fireEvent.change(apField, { target: { value: '22' } });
            expect(setAp).toHaveBeenLastCalledWith('22');

            const strtField = getByTestId('street-field');
            fireEvent.change(strtField, { target: { value: 'street' } });
            expect(setStrt).toHaveBeenLastCalledWith('street');

            const ctyField = getByTestId('city-field');
            fireEvent.change(ctyField, { target: { value: 'city' } });
            expect(setCty).toHaveBeenLastCalledWith('city');

            const prvncField = getByTestId('province-field');
            fireEvent.change(prvncField, { target: { value: 'province' } });
            expect(setPrvnc).toHaveBeenLastCalledWith('province');

            const zpField = getByTestId('zip-field');
            fireEvent.change(zpField, { target: { value: 76607 } });
            expect(setZp).toHaveBeenLastCalledWith('76607');

            const cntryField = getByTestId('country-field');
            fireEvent.change(cntryField, { target: { value: 'country' } });
            expect(setCntry).toHaveBeenLastCalledWith('country');
        });

        it('onSubmit from props is called if "SBMT" is clicked', async () => {

            const setAp = jest.fn();
            const setStrt = jest.fn();
            const setCty = jest.fn();
            const setPrvnc = jest.fn();
            const setZp = jest.fn();
            const setCntry = jest.fn();
            const onSubmit = jest.fn();
            onSubmit.mockImplementation((e) => {
                e.preventDefault();
            });

            const { getByTestId } = rtlRender(<AdrUpdateForm
                ap={''}
                strt={''}
                cty={''}
                prvnc={''}
                zp={''}
                cntry={''}
                setAp={setAp}
                setStrt={setStrt}
                setCty={setCty}
                setPrvnc={setPrvnc}
                setZp={setZp}
                setCntry={setCntry}
                onSubmit={onSubmit} />
            );

            const apField = getByTestId('appartment-field');
            fireEvent.change(apField, { target: { value: '22' } });
            expect(setAp).toHaveBeenLastCalledWith('22');

            const strtField = getByTestId('street-field');
            fireEvent.change(strtField, { target: { value: 'street' } });
            expect(setStrt).toHaveBeenLastCalledWith('street');

            const ctyField = getByTestId('city-field');
            fireEvent.change(ctyField, { target: { value: 'city' } });
            expect(setCty).toHaveBeenLastCalledWith('city');

            const prvncField = getByTestId('province-field');
            fireEvent.change(prvncField, { target: { value: 'province' } });
            expect(setPrvnc).toHaveBeenLastCalledWith('province');

            const zpField = getByTestId('zip-field');
            fireEvent.change(zpField, { target: { value: 76607 } });
            expect(setZp).toHaveBeenLastCalledWith('76607');

            const cntryField = getByTestId('country-field');
            fireEvent.change(cntryField, { target: { value: 'country' } });
            expect(setCntry).toHaveBeenLastCalledWith('country');

            const submit = getByTestId('address-edit-submit');
            fireEvent.click(submit);
            await waitFor(() => expect(onSubmit).toHaveBeenCalled());
        });

    });
});