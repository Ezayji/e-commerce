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
describe('Customers', () => {
    // REGISTER CUSTOMER
    describe('POST /api/register', () => {
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
    describe('POST /api/login', () => {
    
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

        it('Logs the user in and returns username if correct username and password is supplied', () => {
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
    describe('GET /api/logout', () => {
        it('Logs out the user and returns 200', () => {
            return server
                .get('/api/logout')
                .expect(200)
        });
    });


    // GET CUSTOMER BY ID
    describe('GET api/customer/:id', () => {
        
        it('Returns a cutomer object', () => {
            return request(app)
                .get('/api/customer/1')
                .expect(200)
                .then((response) => {
                    const user = response.body;
                    expect(user).to.be.an.instanceOf(Object);
                    expect(user).to.not.be.an.instanceOf(Array);
                });
        });

        it('Returns a customer object without password and address', () => {
            return request(app)
                .get('/api/customer/1')
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

        it('Returns 404 if customer does not exist', () => {
            return request(app)
                .get('/api/customer/1000000')
                .expect(404);
        });

        it('Returns 400 if called with non-numeric value', () => {
            return request(app)
                .get('/api/customer/notID')
                .expect(400)
        });

    });

    // GET CUSTOMER BY USERNAME
    describe('GET /api/customer_un/:username', ()=> {

        it('Returns 400 if customer is not logged in', () => {
            return server
                .get('/api/customer_un/Revarz')
                .expect(400);
        })

        describe('Authenticated requests', () => {
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

            it('Returns 400 if asked for info about other user', () => {
                return server
                    .get('/api/customer_un/Ezayji')
                    .expect(400);
            });

            describe('getCustomerByUsername', () => {

                it('Returns 404 if customer does not exist', () => {
                    const req = httpMocks.createRequest({
                        params: {username: 'icantexist@666'}
                    });
                    const res = httpMocks.createResponse();

                    getCustomerByUsername(req, res);
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
        });
    });

});