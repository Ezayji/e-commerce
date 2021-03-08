export const emptyState = {
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
    }
}

export const noItemsUser = {
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
    },
    cart: {
        products: null,
        total: 0,
        status: 'idle',
        error: null
    }
};

export const oneItemUser = {
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
    }
};

export const twoItemUser = {
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
        },
        {
            cart_id: 3,
            product_id: 19,
            quantity: 2,
            size: 'Universal',
            product_title: 'Lord Nermal Socks',
            manufacturer: 'RIPNDIP',
            color: 'Tie Dye',
            unit_price_eur: 12,
            thumbnail_url: 'linktoimage'
        }],
        total: 354,
        status: 'succeeded',
        error: null
    }
};

export const fullTwoItemUser = {
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
        },
        {
            cart_id: 3,
            product_id: 19,
            quantity: 2,
            size: 'Universal',
            product_title: 'Lord Nermal Socks',
            manufacturer: 'RIPNDIP',
            color: 'Tie Dye',
            unit_price_eur: 12,
            thumbnail_url: 'linktoimage'
        }],
        total: 354,
        status: 'succeeded',
        error: null
    }
}