export const notLoggedIn = {
    customer: {
        user: null,
        profile: null,
        address: null,
        auth_status: 'idle',
        cus_status: 'idle',
        adr_status: 'idle',
        error: null
    },
    cart: {
        products: null,
        total: 0,
        status: 'idle',
        error: null
    },
    orders: {
        orders: null,
        status: 'idle',
        error: null
    }
};

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
            username: 'Revarz',
            appartment_nr: '1',
            street: 'street',
            city: 'city',
            province: 'province',
            zip: '76607',
            country: 'Estonia'
        },
        cus_status: 'succeeded',
        adr_status: 'succeeded'
    },
    cart: {
        products: [{
            cart_id: 2,
            product_id: 12,
            color: 'White / Green',
            manufacturer: 'Stuzzy',
            product_title: 'Stuzzy and Nike Insulated Pullover',
            quantity: 1,
            size: 'L',
            thumbnail_url: 'linktoimage',
            unit_price_eur: 330
        }],
        total: 330,
        status: 'succeeded',
        error: null
    },
    orders: {
        orders: [{
            id: 1001,
            date_utc: "2021-03-08T11:22:09.184Z",
            total_eur: 330,
            payment: true
        }],
        status: 'succeeded',
        error: null
    }
};