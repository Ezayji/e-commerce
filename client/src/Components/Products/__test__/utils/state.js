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
    }
};

export const loggedIn = {
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