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