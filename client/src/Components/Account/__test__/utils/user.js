export const fullUser = { 
    customer: {
        user: {
            username: 'Revarz'
        },
        profile: {
            username: 'Revarz',
            first_name: 'Selna',
            last_name: 'Kaszk',
            email: 'selnaknewemail@testapi.com',
            phone: '+372 99999999'
        },
        address: {
            appartment_nr: '5',
            street: 'somestreet',
            city: 'somecity',
            province: 'someprovince',
            zip: '75607',
            country: 'highrise'
        },
        cus_status: 'succeeded',
        adr_status: 'succeeded'
    }
};

export const noAddressUser = {
    customer: {
        user: {
            username: 'Revarz'
        },
        profile: {
            username: 'Revarz',
            first_name: 'Selna',
            last_name: 'Kaszk',
            email: 'selnaknewemail@testapi.com',
            phone: '+372 99999999'
        },
        address: {
            username: 'Revarz',
            appartment_nr: null,
            street: null,
            city: null,
            province: null,
            zip: null,
            country: null
        },
        cus_status: 'succeeded',
        adr_status: 'succeeded'
    }
};

export const anonymous = {
    customer: {
        user: null,
        profile: null,
        address: null,
        cus_status: 'idle',
        adr_status: 'idle'
    }
};

export const emptyUser = {
    customer: {
        user: {
            username: 'Revarz'
        },
        profile: null,
        address: null,
        auth_status: 'idle',
        cus_status: 'idle',
        adr_status: 'idle',
        error: null
    }
};