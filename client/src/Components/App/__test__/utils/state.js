export const user = {
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
        auth_status: 'idle',
        cus_status: 'succeeded',
        adr_status: 'succeeded',
        error: null
    },
    products: {
        list: [],
        status: 'idle',
        error: null,
        gender: '',
        category_id: 0,
        brand_id: 0
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
    products: {
        list: [],
        status: 'idle',
        error: null,
        gender: '',
        category_id: 0,
        brand_id: 0
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

export const product = {
    images: [{
        url: 'url1'
    }, {
        url: 'url2'
    }],
    product: {
        category_id: 3,
        color: 'Color',
        description: 'Description',
        gender: 'men',
        id: 1,
        title: 'Product',
        manufacturer: 'Brand',
        unit_price_eur: 22,
        material: 'Material'
    },
    sizes: [
        {
            quantity: 1,
            size: 'L'
        }, {
            quantity: 1,
            size: 'XL'
        }
    ]
};

export const categoryRes = [
    {
        id: 1,
        category_id: 1,
        title: 'Product',
        unit_price_eur: 10,
        thumbnail_url: 'url',
        manufacturer: 'Brand'
    },
    {
        id: 2,
        category_id: 1,
        title: 'Product2',
        unit_price_eur: 20,
        thumbnail_url: 'url2',
        manufacturer: 'Brand2' 
    }
];

export const genderRes = [
    {
        id: 3,
        category_id: 3,
        title: 'Product3',
        unit_price_eur: 30,
        thumbnail_url: 'url3',
        manufacturer: 'Brand3'
    },
    {
        id: 4,
        category_id: 4,
        title: 'Product4',
        unit_price_eur: 40,
        thumbnail_url: 'url4',
        manufacturer: 'Brand4' 
    }
];

export const brandRes = {
    manufacturer: {
        id: 1,
        title: 'Brand',
        description: 'Brand Description',
        logo_url: 'Logo.Url'
    },
    products: [
        {
            id: 5,
            category_id: 1,
            title: 'Product5',
            unit_price_eur: 50,
            thumbnail_url: 'url5',
            manufacturer: 'Brand'
        },
        {
            id: 6,
            category_id: 2,
            title: 'Product6',
            unit_price_eur: 60,
            thumbnail_url: 'url6',
            manufacturer: 'Brand'
        }
    ]
};

export const orderRes = [{
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
}];

export const itemOrderRes = {  
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