const {assert, expect} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const httpMocks = require('node-mocks-http');

const app = require('../server');
const { response } = require('express');

const server = request.agent(app);

const {getCustomerByUsername} = require('../server_ops/queries');

describe('API', () => {
    it('Sends OK status', async () => {
        const response = await request(app).get('/api/')

        assert.equal(response.status, 200);
    })
})

// Customers
describe('Customer Routes', () => {
    // REGISTER CUSTOMER
    describe('POST CUSTOMER /api/register', () => {
        it('Adds new cutomer to the database if supplied information is correct', () => {
            let newCustomer = {
                username: 'Revarz',
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'selnakxd@testapi.com',
                phone: '+372 11111111',
                password: 'selnapw',
                registered: new Date()
            }
            return request(app)
                .post('/api/register')
                .send(newCustomer)
                .expect(201)
                .then(() => {
                    return server
                        .post('/api/login')
                        .send({username: newCustomer.username, password: newCustomer.password})
                        .expect(200, {
                            user: {
                                username: 'Revarz'
                            }
                        });
                })
                .then(() => {
                    return server
                        .get('/api/customer_un/Revarz')
                        .expect(200)
                        .then((response) => {
                            const user = response.body;
                            expect(user).to.be.an.instanceOf(Object);
                            expect(user).to.not.be.an.instanceOf(Array);
                        });
                })
                .then(() => {
                    return server
                        .get('/api/logout')
                        .expect(200)
                });
        });
    
        it('Returns 400 if customer with username already exists', () => {
            let newCustomer = {
                username: 'Revarz',
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'selna@testapi.com',
                phone: '+372 22222222',
                password: 'selnapw',
                registered: new Date()
            }
            return request(app)
                .post('/api/register')
                .send(newCustomer)
                .expect(400);
        });
    
        it('Returns 400 if customer with email already exists', () => {
            let newCustomer = {
                username: 'DAMNZ',
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'selnakxd@testapi.com',
                phone: '+372 22222222',
                password: 'selnapw',
                registered: new Date()
            }
            return request(app)
                .post('/api/register')
                .send(newCustomer)
                .expect(400);
        });
    
        it('Returns 400 if customer with phone already exists', () => {
            let newCustomer = {
                username: 'NAZZMHR',
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'tester@testapi.com',
                phone: '+372 11111111',
                password: 'selnapw',
                registered: new Date()
            }
            return request(app)
                .post('/api/register')
                .send(newCustomer)
                .expect(400);
        });
    
        it('Returns 400 if some field is empty', () => {
            let newCustomer = {
                username: 'UNUNUN',
                first_name: '',
                last_name: 'Kaszk',
                email: 'ddddddd@testapi.com',
                phone: '+372 55555555',
                password: 'selnapw',
                registered: new Date()
            }
            return request(app)
                .post('/api/register')
                .send(newCustomer)
                .expect(400);
        });
            
        it('Returns 400 if some field is not represented in the body', () => {
            let newCustomer = {
                username: 'NEBETGAA',
                first_name: '',
                last_name: 'Kaszk',
                phone: '+372 99999999',
                password: 'selnapw',
                registered: new Date()
            }
    
            return request(app)
                .post('/api/register')
                .send(newCustomer)
                .expect(400);
        });
    });
    
    // LOGIN 
    describe('POST LOGIN /api/login', () => {
    
        it('Returns 404 if username is not registered', () => {
            let user = {
                username: 'minapolekasutaja666',
                password: 'selnapw'
            }
            return request(app)
                .post('/api/login')
                .send(user)
                .expect(404);
        });
    
        it('Returns 400 if username exists but supplied password is incorrect', () => {
            let user = {
                username: 'Revarz',
                password: 'notherpassword'
            };
            return request(app)
                .post('/api/login')
                .send(user)
                .expect(400);
        });

        it('Logs the customer in and returns username if correct username and password is supplied', () => {
            let user = {
                username: 'Revarz',
                password: 'selnapw'
            };
            return server
                .post('/api/login')
                .send(user)
                .expect(200, {
                    user: {
                        username: 'Revarz'
                    }
                });
        });
    
    });

    // LOGOUT
    describe('GET LOGOUT /api/logout', () => {
        it('Logs out the customer and returns 200', () => {
            return server
                .get('/api/logout')
                .expect(200)
        });
    });


    // GET CUSTOMER BY USERNAME
    describe('GET CUSTOMER /api/customer_un/:username', ()=> {

        it('Returns 400 if customer is not logged in', () => {
            return server
                .get('/api/customer_un/Revarz')
                .expect(400);
        })

        describe('* Authenticated requests *', () => {
            it('Log user back in', () => {
                let user = {
                    username: 'Revarz',
                    password: 'selnapw'
                };
                return server
                    .post('/api/login')
                    .send(user)
                    .expect(200, {
                        user: {
                            username: 'Revarz'
                        }
                    });
            });
            
            it('Returns a customer object', () => {
                return server
                    .get('/api/customer_un/Revarz')
                    .expect(200)
                    .then((response) => {
                        const user = response.body;
                        expect(user).to.be.an.instanceOf(Object);
                        expect(user).to.not.be.an.instanceOf(Array);
                    });
            });

            it('Returns a customer object without password and address', () => {
                return server
                    .get('/api/customer_un/Revarz')
                    .expect(200)
                    .then((response) => {
                        const user = response.body;
                        expect(user).to.have.ownProperty('id');
                        expect(user).to.have.ownProperty('username');
                        expect(user).to.have.ownProperty('first_name');
                        expect(user).to.have.ownProperty('last_name');
                        expect(user).to.have.ownProperty('email');
                        expect(user).to.have.ownProperty('phone');
                        expect(user).to.have.ownProperty('registered');
                        expect(user).to.not.have.ownProperty('password');
                        expect(user).to.not.have.ownProperty('appartment_nr');
                        expect(user).to.not.have.ownProperty('street');
                        expect(user).to.not.have.ownProperty('city');
                        expect(user).to.not.have.ownProperty('province');
                        expect(user).to.not.have.ownProperty('zip');
                        expect(user).to.not.have.ownProperty('country');
                    })    
            });

            it('Returns 400 if asked for info about other customer', () => {
                return server
                    .get('/api/customer_un/Ezayji')
                    .expect(400);
            });
/*
            describe('getCustomerByUsername', () => {

                it('Returns 404 if customer does not exist', () => {
                    const req = httpMocks.createRequest({
                        method: 'GET',
                        url: '/api/customer_un/fuckyouidontexistlolbede@',
                        params: {username: 'fuckyouidontexistlolbede@'}
                    });
                    const res = httpMocks.createResponse({
                        eventEmitter: require('events').EventEmitter
                    });

                    getCustomerByUsername(req, res);
                    console.log(res);
                    assert.equal(404, res.statusCode);

                });

                it('Returns 400 if called with numeric value', () => {
                    const req = httpMocks.createRequest({
                        params: {username: '1'}
                    });
                    const res = httpMocks.createResponse();

                    getCustomerByUsername(req, res);
                    assert.equal(400, res.statusCode);

                });
            });
*/      
        });
    });

    // UPDATE CUSTOMER PROFILE
    describe('PUT CUSTOMER /api/customer_un/:username', () => {
        it('Returns 400 if customer is not logged in', () => {
            const updatedUser = {
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'selnaknewemail@testapi.com',
                phone: '+372 99999999',
                password: 'selnapw'
            }
            
            return server
                .get('/api/logout')
                .expect(200)
                .then(() => {
                    return server
                        .put('/api/customer_un/Revarz')
                        .send(updatedUser)
                        .expect(400);
                });
                
        });

        describe('* Authenticated updates *', () => {
            it('Updates the customer if all supplied information is correct and returns the updated object with all properties except address and password', () => {
                const customerLogin = {
                    username: 'Revarz',
                    password: 'selnapw'
                }
                
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail@testapi.com',
                    phone: '+372 99999999',
                    password: 'karnaz123'
                }

                return server
                    .post('/api/login')
                    .send(customerLogin)
                    .expect(200, {
                        user: {
                            username: 'Revarz'
                        }
                    })
                    .then(() => {
                        return server
                            .put('/api/customer_un/Revarz')
                            .send(updatedCustomer)
                            .expect(200)
                            .then((response) => {
                                const user = response.body
                                expect(user).to.be.an.instanceOf(Object);
                                expect(user).to.not.be.an.instanceOf(Array);
                                expect(user).to.have.ownProperty('id');
                                expect(user).to.have.ownProperty('username');
                                expect(user).to.have.ownProperty('first_name');
                                expect(user).to.have.ownProperty('last_name');
                                expect(user).to.have.ownProperty('email');
                                expect(user).to.have.ownProperty('phone');
                                expect(user).to.have.ownProperty('registered');
                                expect(user).to.not.have.ownProperty('password');
                                expect(user).to.not.have.ownProperty('appartment_nr');
                                expect(user).to.not.have.ownProperty('street');
                                expect(user).to.not.have.ownProperty('city');
                                expect(user).to.not.have.ownProperty('province');
                                expect(user).to.not.have.ownProperty('zip');
                                expect(user).to.not.have.ownProperty('country');
                                expect(user.first_name).to.eql(updatedCustomer.first_name);
                                expect(user.last_name).to.eql(updatedCustomer.last_name);
                                expect(user.email).to.eql(updatedCustomer.email);
                                expect(user.phone).to.eql(updatedCustomer.phone);
                            });
                    })
                    .then(() => {
                        return server
                        .get('/api/logout')
                        .expect(200)
                    });
            });

            it('User can log in with the new hashed password', () => {
                const user = {
                    username: 'Revarz',
                    password: 'karnaz123'
                };

                return server
                    .post('/api/login')
                    .send(user)
                    .expect(200, {
                        user: {
                            username: 'Revarz'
                        }
                    });
            });

            it('Returns 400 if updated email already exists in the database', () => {
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail@testapi.com',
                    phone: '+372 77777777',
                    password: 'karnaz123'
                }

                return server
                    .put('/api/customer_un/Revarz')
                    .send(updatedCustomer)
                    .expect(400);
            });

            it('Returns 400 if updated phone already exists in the database', () => {
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail2@testapi.com',
                    phone: '+372 99999999',
                    password: 'karnaz123'
                };

                return server
                    .put('/api/customer_un/Revarz')
                    .send(updatedCustomer)
                    .expect(400);
            });

            it('Returns 400 if unnecessary fields are sent', () => {
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail2@testapi.com',
                    phone: '+372 77777777',
                    password: 'karnaz123',
                    registered: new Date(),
                    appartment_nr: '22',
                    street: 'somestreet',
                    city: 'somecity'
                };

                return server
                    .put('/api/customer_un/Revarz')
                    .send(updatedCustomer)
                    .expect(400);
            });

            it('Returns 404 if some fields are empty', () => {
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: '',
                    phone: '',
                    password: 'karnaz123'
                };

                return server
                    .put('/api/customer_un/Revarz')
                    .send(updatedCustomer)
                    .expect(404);
            });

            it('Returns 404 if any field is not present', () => {
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    phone: '+372 99999999',
                };

                return server
                    .put('/api/customer_un/Revarz')
                    .send(updatedCustomer)
                    .expect(404);
            });

            it('Customer can not update other customer info', () => {
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail@testapi.com',
                    phone: '+372 99999999',
                    password: 'karnaz123'
                };


                return server
                    .put('/api/customer_un/Ezayji')
                    .send(updatedCustomer)
                    .expect(400);
            });

        });
    });

    // CUSTOMER ADDRESS
    describe('Customer Address', () => {
        describe('* Unauthenticated request *', () => {

            it('To update customer address fails', () => {
                const address = {
                    appartment_nr: 1,
                    street: 'somestreet',
                    city: 'somecity',
                    province: 'someprovince',
                    zip: 75607,
                    country: 'highrise'
                };
                
                return server
                    .get('/api/logout')
                    .expect(200)
                    .then(() => {
                        return server
                            .put('/api/customer_address/Revarz')
                            .send(address)
                            .expect(400);
                    });
            
            });

            it('To recieve cutomer address fails', () => {
                const user = {
                    username: 'Revarz',
                    password: 'karnaz123'
                };
                
                return server
                    .get('/api/customer_address/Revarz')
                    .expect(400)
                    .then(() => {
                        return server
                            .post('/api/login')
                            .send(user)
                            .expect(200, {
                                user: {
                                    username: 'Revarz'
                                }
                            });
                    });
            });
        });
        describe('* Authenticated Requests *', () => {
            // UPDATE CUSTOMER ADDRESS
            describe('PUT ADDRESS /api/customer_address/:username', () => {
                it('Updates the customer in database if all fields are present and returns the new address', () => {
                    const address = {
                        appartment_nr: 1,
                        street: 'somestreet',
                        city: 'somecity',
                        province: 'someprovince',
                        zip: 75607,
                        country: 'highrise'
                    };

                    return server
                        .put('/api/customer_address/Revarz')
                        .send(address)
                        .expect(200)
                        .then((response) => {
                            const address = response.body
                            expect(address).to.be.an.instanceOf(Object);
                            expect(address).to.not.be.an.instanceOf(Array);
                            expect(address).to.not.have.ownProperty('id');
                            expect(address).to.have.ownProperty('username');
                            expect(address).to.not.have.ownProperty('first_name');
                            expect(address).to.not.have.ownProperty('last_name');
                            expect(address).to.not.have.ownProperty('email');
                            expect(address).to.not.have.ownProperty('phone');
                            expect(address).to.not.have.ownProperty('registered');
                            expect(address).to.not.have.ownProperty('password');
                            expect(address).to.have.ownProperty('appartment_nr');
                            expect(address).to.have.ownProperty('street');
                            expect(address).to.have.ownProperty('city');
                            expect(address).to.have.ownProperty('province');
                            expect(address).to.have.ownProperty('zip');
                            expect(address).to.have.ownProperty('country');
                        });
                });

                it('Customer can not update other customer address', () => {
                    const address = {
                        appartment_nr: 2,
                        street: 'somestreet',
                        city: 'somecity',
                        province: 'someprovince',
                        zip: 75607,
                        country: 'lowrise'
                    };

                    return server
                        .put('/api/customer_address/Ezayji')
                        .send(address)
                        .expect(400);
                });

                it('Returns 404 if some field is not present', () => {
                    const address = {
                        appartment_nr: 2,
                        street: 'somestreet',
                        city: 'somecity',
                        province: 'someprovince',
                    };

                    return server
                        .put('/api/customer_address/Revarz')
                        .send(address)
                        .expect(404);
                });

                it('Returns 404 if some field is empty', () => {
                    const address = {
                        appartment_nr: 2,
                        street: 'somestreet',
                        city: '',
                        province: 'someprovince',
                        zip: 75607,
                        country: ''
                    };

                    return server
                        .put('/api/customer_address/Revarz')
                        .send(address)
                        .expect(404);
                });

                it('Returns 400 if unnecessary fields are sent', () => {
                    const address = {
                        first_name: 'cant',
                        last_name: 'send',
                        phone: 'send',
                        password: 'this',
                        appartment_nr: 2,
                        street: 'somestreet',
                        city: 'somecity',
                        province: 'someprovince',
                        zip: 75607,
                        country: 'lowrise'
                    };

                    return server
                        .put('/api/customer_address/Revarz')
                        .send(address)
                        .expect(400);
                });

                it('Returns 400 if ZIP is not a number', () => {
                    const address = {
                        appartment_nr: 2,
                        street: 'somestreet',
                        city: 'somecity',
                        province: 'someprovince',
                        zip: 'zipcode',
                        country: 'lowrise'
                    };

                    return server
                        .put('/api/customer_address/Revarz')
                        .send(address)
                        .expect(400);
                });

            });

            // RECIEVE CUSTOMER ADDRESS
            describe('GET ADDRESS /api/customer_address/:username', () => {
                it('Returns only the customers address and username as an object', () => {
                    return server
                        .get('/api/customer_address/Revarz')
                        .expect(200)
                        .then((response) => {
                            const address = response.body
                            expect(address).to.be.an.instanceOf(Object);
                            expect(address).to.not.be.an.instanceOf(Array);
                            expect(address).to.not.have.ownProperty('id');
                            expect(address).to.have.ownProperty('username');
                            expect(address).to.not.have.ownProperty('first_name');
                            expect(address).to.not.have.ownProperty('last_name');
                            expect(address).to.not.have.ownProperty('email');
                            expect(address).to.not.have.ownProperty('phone');
                            expect(address).to.not.have.ownProperty('registered');
                            expect(address).to.not.have.ownProperty('password');
                            expect(address).to.have.ownProperty('appartment_nr');
                            expect(address).to.have.ownProperty('street');
                            expect(address).to.have.ownProperty('city');
                            expect(address).to.have.ownProperty('province');
                            expect(address).to.have.ownProperty('zip');
                            expect(address).to.have.ownProperty('country');
                        });
                });

                it('Customer can not recieve other customer address', () => {
                    return server
                        .get('/api/customer_address/Ezayji')
                        .expect(400);
                });
            });
        });
    });

});