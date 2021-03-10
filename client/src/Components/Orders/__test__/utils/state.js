export const oneItemOrder = {  
    id: 1001,
    date_utc: "2021-03-10T09:06:53.732Z",
    total_eur: 330,
    payment: true,
    to_appartment: "33",
    to_street: "strt",
    to_city: "cty",
    to_province: "Harjumaa",
    to_zip: 76605,
    to_country: "Estonia",
    products: [{
        product_id: 12,
        quantity: 1,
        size: "L",
        unit_price_eur: 330,
        product_title: "Stüzzy and Nike Insulated Pullover Jacket",
        manufacturer: "Stüssy",
        color: "White / Green",
    }]
};

export const twoItemOrder = {
    id: 1002,
    date_utc: "2021-03-10T09:07:53.732Z",
    total_eur: 354,
    payment: true,
    to_appartment: "33",
    to_street: "strt",
    to_city: "cty",
    to_province: "Harjumaa",
    to_zip: 76605,
    to_country: "Estonia",
    products: [{
        product_id: 12,
        quantity: 1,
        size: "L",
        unit_price_eur: 330,
        product_title: "Stüzzy and Nike Insulated Pullover Jacket",
        manufacturer: "Stüssy",
        color: "White / Green",
    },
    {
        product_id: 19,
        quantity: 2,
        size: 'Universal',
        unit_price_eur: 12,
        product_title: 'Lord Nermal Socks',
        manufacturer: 'RIPNDIP',
        color: 'Tie Dye',
    }]
};

export const ordersResponse = [
    {
        id: 1001,
        date_utc: "2021-03-10T09:07:53.732Z",
        total_eur: 330,
        payment: true
    },
    {
        id: 1002,
        date_utc: "2021-03-10T09:06:53.732Z",
        total_eur: 354,
        payment: true
    }
];

export const orderPreview = {    
    id: 1001,
    date_utc: "2021-03-10T09:07:53.732Z",
    total_eur: 330,
    payment: true
};

export const orderPreviewFalse = {
    id: 1001,
    date_utc: "2021-03-10T09:07:53.732Z",
    total_eur: 330,
    payment: false
}

export const emptyUserState = {
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
    orders: {
        orders: null,
        status: 'idle',
        error: null
    }
};

export const fetchedUserState1 = {
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

export const fetchedUserState2 = {
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
    orders: {
        orders: [{
            id: 1001,
            date_utc: "2021-03-10T09:06:53.732Z",
            total_eur: 330,
            payment: true
        },
        {
            id: 1002,
            date_utc: "2021-03-10T09:07:53.732Z",
            total_eur: 354,
            payment: true 
        }],
        status: 'succeeded',
        error: null
    }
};

export const anonymous = {
    customer: {
        user: null,
        profile: null,
        address: null,
        auth_status: 'idle',
        cus_status: 'idle',
        adr_status: 'idle',
        error: null
    },
    orders: {
        orders: null,
        status: 'idle',
        error: null
    }
};