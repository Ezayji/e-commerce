const {assert, expect} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const httpMocks = require('node-mocks-http');

const app = require('../server');
const { response } = require('express');

const server = request.agent(app);

describe('API', () => {
    it('Sends OK status', async () => {
        const response = await request(app).get('/api/')

        assert.equal(response.status, 200);
    })
})

// Customers
describe('CUSTOMERS', () => {
    // REGISTER CUSTOMER
    describe('POST CUSTOMER /api/register', () => {
        // log customer in and out for checking the database
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

        // log customer in and out for test
        it('Does not let authenticated customer to register', () => {
            let newCustomer = {
                username: 'Kaztan',
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'selnakkaztan123@testapi.com',
                phone: '+372 00000000',
                password: 'selnapw',
                registered: new Date()
            };
            
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
                })
                .then(() => {
                    return server
                        .post('/api/register')
                        .send(newCustomer)
                        .expect(400);
                })
                .then(() => {
                    return server
                        .get('/api/logout')
                        .expect(200);
                });
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

        it('Returns 400 if customer is already authenticated', () => {
            let user = {
                username: 'Revarz',
                password: 'selnapw'
            };

            return server
                .post('/api/login')
                .send(user)
                .expect(400);
        });
    
    });

    // CHECK USER AUTHENTICATION
    describe('GET SESSION CHECK /api/auth', () => {
        it('Returns Customer Username if Session is valid', () => {
            return server
                .get('/api/auth')
                .expect(200, {
                    user: {
                        username: 'Revarz'
                    }
                });
        })
        
        // log customer out and back in
        it('Returns 400 if Session is Not Valid', () => {
            let user = {
                username: 'Revarz',
                password: 'selnapw'
            };

            return server
                .get('/api/logout')
                .expect(200)
                .then(() => {
                    return server
                        .get('/api/auth')
                        .expect(400);
                })
                .then(() => {
                    return server
                        .post('/api/login')
                        .send(user)
                        .expect(200);
                });
        })
    });

    // LOGOUT
    describe('GET LOGOUT /api/logout', () => {
        it('Logs out the customer and returns 200', () => {
            return server
                .get('/api/logout')
                .expect(200)
        });
/*
        it('It returns 400 if customer is not authenticated', () => {
            return server
                .get('/api/logout')
                .expect(400);
        });
*/
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
   
        });
    });

    // UPDATE CUSTOMER PROFILE
    describe('PUT CUSTOMER /api/customer_un/:username', () => {
        // Log customer out in the beggining
        it('Returns 400 if customer is not logged in', () => {
            const updatedUser = {
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'selnaknewemail@testapi.com',
                phone: '+372 99999999',
            }
            //password: 'karnaz123'
            
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

        // Log customer in at the beggining
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
                }
                //password: 'karnaz123'

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
                    });
                    /*
                    .then(() => {
                        return server
                        .get('/api/logout')
                        .expect(200)
                    });
                    */
            });
/*
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
*/
            it('Returns 400 if updated email already exists in the database', () => {
                const updatedCustomer = {
                    first_name: 'Selna',
                    last_name: 'Kaszk',
                    email: 'selnaknewemail@testapi.com',
                    phone: '+372 77777777',
                }
                //password: 'karnaz123'

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
                };
                //password: 'karnaz123'

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
                };
                //password: 'karnaz123'

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
                };
                //password: 'karnaz123'

                return server
                    .put('/api/customer_un/Ezayji')
                    .send(updatedCustomer)
                    .expect(400);
            });

        });
    });

    //CUSTOMER PASSWORD
    describe('Customer Password Change', () => {
        describe('* Unauthenticated requests *', () => {
            // log customer out in the beggining
            it('Not authenticated customer can not update password', () => {
                const updatedPw = {
                    username: 'Revarz',
                    password: 'selnapw',
                    new_password: 'karnaz123'
                };
                
                return server
                    .get('/api/logout')
                    .expect(200)
                    .then(() => {
                        return server
                            .put('/api/customer_un/Revarz/password')
                            .send(updatedPw)
                            .expect(400);
                    });
            });
        });

        describe('* Authenticated requests *', () => {
            describe('PUT /api/customer_un/:username/password', () => {
                // log customer in and out
                it('Customer can update their password if all fields are correct', () => {
                    const user = {
                        username: 'Revarz',
                        password: 'selnapw'
                    };
                
                    const updatedPw = {
                        password: 'selnapw',
                        new_password: 'karnaz123'
                    };

                    return server
                        .post('/api/login')
                        .send(user)
                        .expect(200, {
                            user: {
                                username: 'Revarz'
                            }
                        })
                        .then(() => {
                            return server
                                .put('/api/customer_un/Revarz/password')
                                .send(updatedPw)
                                .expect(200);
                        })
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });

                });

                // log customer in
                it('Customer can login with the new password', () => {
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

                it('Returns 400 if the supplied old password is incorrect', () => {
                    const updatedPw = {
                        password: 'selnapw',
                        new_password: 'timomees'
                    };

                    return server
                        .put('/api/customer_un/Revarz/password')
                        .send(updatedPw)
                        .expect(400);
                });

                it('Return 404 if old password is not present', () => {
                    const updatedPw = {
                        new_password: 'timomees'
                    };

                    return server
                        .put('/api/customer_un/Revarz/password')
                        .send(updatedPw)
                        .expect(404);
                });

                it('Returns 404 if new password is not present', () => {
                    const updatedPw = {
                        password: 'karnaz123'
                    };

                    return server
                        .put('/api/customer_un/Revarz/password')
                        .send(updatedPw)
                        .expect(404);
                });

                it('Return 404 if old password field is empty', () => {
                    const updatedPw = {
                        password: '',
                        new_password: 'timomees'
                    };

                    return server
                        .put('/api/customer_un/Revarz/password')
                        .send(updatedPw)
                        .expect(404);
                });

                it('Returns 404 if new password field is empty', () => {
                    const updatedPw = {
                        password: 'karnaz123',
                        new_password: ''
                    };

                    return server
                        .put('/api/customer_un/Revarz/password')
                        .send(updatedPw)
                        .expect(404);
                });

                it('Customer can not update other customer password', () => {
                    const updatedPw = {
                        password: 'doesntmatter',
                        new_password: 'mypassword'
                    };

                    return server
                        .put('/api/customer_un/Ezayji/password')
                        .send(updatedPw)
                        .expect(400);
                });

            });
        });    
    });

    // CUSTOMER ADDRESS
    describe('Customer Address', () => {
        describe('* Unauthenticated request *', () => {

            // Log customer out in the beggining
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

            // Log customer in at the end for next tests
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

                // Log customer out in the end
                it('Customer can not recieve other customer address', () => {
                    return server
                        .get('/api/customer_address/Ezayji')
                        .expect(400)
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });
                });
            });
        });
    });

});


// PRODUCTS 
describe('PRODUCTS', () => {
    describe('GET /api/products', () => {
        describe('* GET ALL PRODUCTS BY gender *', () => {
            describe('GET /api/products?gender={gender}', () => {
                it('Unauthenticated customer can access products', () => {
                    return request(app)
                        .get('/api/products?gender=men')
                        .expect(200)
                        .then(() => {
                            return request(app)
                                .get('/api/products?gender=women')
                                .expect(200);
                        });
                
                });

                // Log customer in and out
                it('Authenticated customer can access products', () => {
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
                        })
                        .then(() => {
                            return server
                                .get('/api/products?gender=men')
                                .expect(200);
                        })
                        .then(() => {
                            return server
                                .get('/api/products?gender=women')
                                .expect(200);
                        })
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });
                });

                it('Returns an array of products', () => {
                    return request(app)
                        .get('/api/products?gender=men')
                        .expect(200)
                        .then((response) => {
                            let products = response.body;
                            expect(products).to.be.an.instanceOf(Array);
                        })
                        .then(() => {
                            return request(app)
                                .get('/api/products?gender=women')
                                .expect(200)
                                .then((response) => {
                                    let products = response.body;
                                    expect(products).to.be.an.instanceOf(Array);
                                });
                        });
                });

                it('Returns Product ID, Category ID, Title, Price, Thumbnail URL and Manufacturer per Product', () => {
                    return request(app)
                        .get('/api/products?gender=women')
                        .expect(200)
                        .then((response) => {
                            let product_1 = response.body[0];
                            expect(product_1).to.have.ownProperty('id');
                            expect(product_1).to.have.ownProperty('category_id');
                            expect(product_1).to.have.ownProperty('title');
                            expect(product_1).to.have.ownProperty('unit_price_eur');
                            expect(product_1).to.have.ownProperty('thumbnail_url');
                            expect(product_1).to.have.ownProperty('manufacturer');
                        });
                });

                it('Returns 400 if called with invalid gender', () => {
                    return request(app)
                        .get('/api/products?gender=notgender')
                        .expect(400);
                });

            });
        });

        describe('* GET ALL PRODUCTS BY gender and category *', () => {
            describe('GET /api/products?gender={gender}&categoryid={categoryid}', () => {
                it('Unauthenticated customer can access products', () => {
                    return request(app)
                        .get('/api/products?gender=men&categoryid=3')
                        .expect(200)
                        .then(() => {
                            return request(app)
                                .get('/api/products?gender=women&categoryid=1')
                                .expect(200);
                        });
                    
                });

                // Log customer in and out
                it('Authenticated customer can access products', () => {
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
                        })
                        .then(() => {
                            return server
                                .get('/api/products?gender=men&categoryid=3')
                                .expect(200);
                        })
                        .then(() => {
                            return server
                                .get('/api/products?gender=women&categoryid=1')
                                .expect(200);
                        })
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });
                });

                it('Returns an array of products', () => {
                    return request(app)
                        .get('/api/products?gender=men&categoryid=1')
                        .expect(200)
                        .then((response) => {
                            let products = response.body;
                            expect(products).to.be.an.instanceOf(Array);
                        })
                        .then(() => {
                            return request(app)
                                .get('/api/products?gender=women&categoryid=3')
                                .expect(200)
                                .then((response) => {
                                    let products = response.body;
                                    expect(products).to.be.an.instanceOf(Array);
                                });
                        });
                });

                it('Returns Product ID, Category ID, Title, Price, Thumbnail URL and Manufacturer per Product', () => {
                    return request(app)
                        .get('/api/products?gender=women&categoryid=4')
                        .expect(200)
                        .then((response) => {
                            let product_1 = response.body[0];
                            expect(product_1).to.have.ownProperty('id');
                            expect(product_1).to.have.ownProperty('category_id');
                            expect(product_1).to.have.ownProperty('title');
                            expect(product_1).to.have.ownProperty('unit_price_eur');
                            expect(product_1).to.have.ownProperty('thumbnail_url');
                            expect(product_1).to.have.ownProperty('manufacturer');
                        });
                });

                it('Return 400 if category id is not numeric', () => {
                    return request(app)
                        .get('/api/products?gender=men&categoryid=hats')
                        .expect(400);
                });

                it('Returns 404 if category does not exist', () => {
                    return request(app)
                        .get('/api/products?gender=women&categoryid=200')
                        .expect(404);
                });

                it('Returns 400 if called with only category', () => {
                    return request(app)
                        .get('/api/products?categoryid=2')
                        .expect(400);
                });

            });
        });
    });
    
    describe('* GET ALL PRODUCTS BY MANUFACTURER *', () => {
        describe('GET /api/manufacturer/:manufacturer_id', () => {
            it('Unauthenticated customer can access products', () => {
                return request(app)
                    .get('/api/manufacturer/2')
                    .expect(200);
            });

            // log customer in and out
            it('Authenticated customer can access products', () => {
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
                    })
                    .then(() => {
                        return server
                            .get('/api/manufacturer/2')
                            .expect(200);
                    })
                    .then(() => {
                        return server
                            .get('/api/logout')
                            .expect(200);
                    });
            });

            it('Returns an object with the Manufacturer Object[ID, Title, Description and Logo url] and an array of products', () => {
                return request(app)
                    .get('/api/manufacturer/3')
                    .expect(200)
                    .then((response) => {
                        let result = response.body;
                        let products = response.body.products;
                        let manufacturer = response.body.manufacturer;
                        expect(result).to.be.an.instanceOf(Object);
                        expect(result).to.have.ownProperty('manufacturer');
                        expect(result).to.have.ownProperty('products');
                        expect(products).to.be.an.instanceOf(Array);
                        expect(manufacturer).to.be.an.instanceOf(Object);
                        expect(manufacturer).to.have.ownProperty('id');
                        expect(manufacturer).to.have.ownProperty('title');
                        expect(manufacturer).to.have.ownProperty('description');
                        expect(manufacturer).to.have.ownProperty('logo_url');
                    });
            });

            it('Returns Product ID, Category ID, Title, Price, Thumbnail URL and Manufacturer per Product', () => {
                return request(app)
                    .get('/api/manufacturer/4')
                    .expect(200)
                    .then((response) => {
                        let product_1 = response.body.products[0];
                        expect(product_1).to.have.ownProperty('id');
                        expect(product_1).to.have.ownProperty('category_id');
                        expect(product_1).to.have.ownProperty('title');
                        expect(product_1).to.have.ownProperty('unit_price_eur');
                        expect(product_1).to.have.ownProperty('thumbnail_url');
                        expect(product_1).to.have.ownProperty('manufacturer');
                    });
            });

            it('Returns 400 if called with non-numeric ID', () => {
                return request(app)
                    .get('/api/manufacturer/notID')
                    .expect(400);
            });

            it('Returns 404 if no manufacturer exists with selected ID', () => {
                return request(app)
                    .get('/api/manufacturer/100000')
                    .expect(404);
            });
        });
    });
    
    describe('* GET PRODUCT BY ID WITH PICTURES AND SIZES *', () => {
        describe('GET /api/products/:product_id', () => {
            it('Unauthenticated customer can access product', () => {
                return request(app)
                    .get('/api/products/11')
                    .expect(200);
            });

            // log customer in and out
            it('Authenticated customer can access product', () => {
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
                    })
                    .then(() => {
                        return server
                            .get('/api/products/11')
                            .expect(200);
                    })
                    .then(() => {
                        return server
                            .get('/api/logout')
                            .expect(200);
                    });
            });

            it('Returns an object with product object, image url array and sizes array', () => {
                return request(app)
                    .get('/api/products/12')
                    .expect(200)
                    .then((response) => {
                        let result = response.body;
                        let images = response.body.images;
                        let product = response.body.product;
                        let sizes = response.body.sizes;
                        expect(result).to.be.an.instanceOf(Object);
                        expect(result).to.have.ownProperty('product');
                        expect(result).to.have.ownProperty('images');
                        expect(result).to.have.ownProperty('sizes');
                        expect(images).to.be.an.instanceOf(Array);
                        expect(sizes).to.be.an.instanceOf(Array);
                        expect(product).to.be.an.instanceOf(Object);
                    });
            });

            it('Returned product object includes Product ID, Category ID, Title, Description, Color, Price, Gender, Material and Manufacturer', () => {
                return request(app)
                    .get('/api/products/12')
                    .expect(200)
                    .then((response) => {
                        let product = response.body.product;
                        expect(product).to.have.ownProperty('id');
                        expect(product).to.have.ownProperty('category_id');
                        expect(product).to.have.ownProperty('title');
                        expect(product).to.have.ownProperty('description');
                        expect(product).to.have.ownProperty('color');
                        expect(product).to.have.ownProperty('unit_price_eur');
                        expect(product).to.have.ownProperty('gender');
                        expect(product).to.have.ownProperty('material');
                        expect(product).to.have.ownProperty('manufacturer');
                    });
            });

            it('Returns 400 if called with non-numeric value', () => {
                return request(app)
                    .get('/api/products/notID')
                    .expect(400);
            });

            it('Returns 404 if the product does not exist', () => {
                return request(app)
                    .get('/api/products/1000000')
                    .expect(404);
            });
        });
    });

    describe('* GET ALL MANUFACTURERS *', () => {
        describe('GET /api/manufacturers', () => {
            it('Unauthenticated customer can access manufacturers', () => {
                return request(app)
                    .get('/api/manufacturers')
                    .expect(200);
            });

            // log customer in and out
            it('Authenticated customer can access manufacturers', () => {
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
                    })
                    .then(() => {
                        return server
                            .get('/api/manufacturers')
                            .expect(200);
                    })
                    .then(() => {
                        return server
                            .get('/api/logout')
                            .expect(200);
                    });
            });
            
            it('Returns an array of manufacturers', () => {
                return request(app)
                    .get('/api/manufacturers')
                    .expect(200)
                    .then((response) => {
                        let result = response.body;
                        expect(result).to.be.an.instanceOf(Array);
                    });
            });

            it('Returned manufacturers have ID, Title', () => {
                return request(app)
                .get('/api/manufacturers')
                .expect(200)
                .then((response) => {
                    let man_1 = response.body[0];
                    expect(man_1).to.have.ownProperty('id');
                    expect(man_1).to.have.ownProperty('title');
                });
            });

        });
    });

    describe('* GET ALL CATEGORIES *', () => {
        describe('GET /api/categories', () => {
            it('Unauthenticated customer can access categories', () => {
                return request(app)
                    .get('/api/categories')
                    .expect(200);
            });

            // log customer in and out
            it('Authenticated customer can access categories', () => {
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
                    })
                    .then(() => {
                        return server
                            .get('/api/categories')
                            .expect(200);
                    })
                    .then(() => {
                        return server
                            .get('/api/logout')
                            .expect(200);
                    });
            });
            
            it('Returns an array of categories', () => {
                return request(app)
                    .get('/api/categories')
                    .expect(200)
                    .then((response) => {
                        let result = response.body;
                        expect(result).to.be.an.instanceOf(Array);
                    });
            });

            it('Returned categories have ID and Title', () => {
                return request(app)
                    .get('/api/categories')
                    .expect(200)
                    .then((response) => {
                        let cat_1 = response.body[0];
                        expect(cat_1).to.have.ownProperty('id');
                        expect(cat_1).to.have.ownProperty('title');
                    });
            });

        });
    });

});

// CART 

describe('CARTS', () => {
    describe('POST NEW CART ITEM', () => {

        describe('* Unauthenticated requests *', () => {
            it('Not auhtenticated customer can not post cart items', () => {
                const newCartItem = {
                    product_id: 1,
                    quantity: 1,
                    size: 'S/M'
                };

                return request(app)
                    .post('/api/cart/Revarz')
                    .send(newCartItem)
                    .expect(400);
            });
        });

        describe('* Authenticated requests *', () => {
            describe('POST CART ITEM /api/cart/:username', () => {
                // Log customer in
                it('Customer can add new cart items to the database if all the fields are correct', () => {
                    const newCartItem = {
                        product_id: 1,
                        quantity: 1,
                        size: 'S/M'
                    };

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
                        })
                        .then(() => {
                            return server
                                .post('/api/cart/Revarz')
                                .send(newCartItem)
                                .expect(201);
                        });
                        
                });

                it('Returns 400 if requested to add already existing item to cart', () => {
                    const newCartItem = {
                        product_id: 1,
                        quantity: 1,
                        size: 'S/M'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(400);
                });

                it('Returns 400 if too many fields are sent', () => {
                    const newCartItem = {
                        id: 2,
                        product_id: 1,
                        quantity: 1,
                        size: 'S/M',
                        customer_username: 'Revarz'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(400);
                });

                it('Returns 400 if requested Product ID is less than 1', () => {
                    const newCartItem = {
                        product_id: -1,
                        quantity: 1,
                        size: 'Universal'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(400);
                });

                it('Returns 400 if requested Product ID is not numeric', () => {
                    const newCartItem = {
                        product_id: 'four',
                        quantity: 1,
                        size: 'Universal'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(400);
                });

                it('Returns 400 if requested Quantity is less than 1', () => {
                    const newCartItem = {
                        product_id: 4,
                        quantity: -1,
                        size: 'Universal'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(400);
                });

                it('Returns 400 if requested Quantity is not numeric', () => {
                    const newCartItem = {
                        product_id: 4,
                        quantity: 'one',
                        size: 'Universal'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(400);
                });

                it('Returns 404 if any field is empty', () => {
                    const newCartItem = {
                        product_id: 1,
                        quantity: '',
                        size: 'S/M'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(404);
                });

                it('Returns 404 if any field is not present', () => {
                    const newCartItem = {
                        product_id: 1,
                        quantity: 1
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(404);
                });

                it('Returns 404 if the requested product does not exist', () => {
                    const newCartItem = {
                        product_id: 1000000,
                        quantity: 1,
                        size: 'S/M'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(404);
                });

                it('Returns 404 if the selected product size is not in stock', () => {
                    const newCartItem = {
                        product_id: 11,
                        quantity: 1,
                        size: 'XXXL'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(404);
                });

                it('Returns 404 if there is not enough products of the selected size in stock', () => {
                    const newCartItem = {
                        product_id: 1,
                        quantity: 10000,
                        size: 'S/M'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(404);
                });

                // log customer out in the end
                it('Customer can not add cart items to other customers', () => {
                    const newCartItem = {
                        product_id: 4,
                        quantity: 1,
                        size: 'Universal'
                    };

                    return server
                        .post('/api/cart/Ezayji')
                        .send(newCartItem)
                        .expect(400)
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });
                });
            });
        });

    });

    describe('GET ALL CART ITEMS FOR CUSTOMER', () => {
        describe('* Unauthenticated requests *', () => {
            it('Not auhtenticated customer can not access cart items', () => {
                return request(app)
                    .get('/api/cart/Revarz')
                    .expect(400);
            });
        });

        describe('* Authenticated requests *', () => {
            describe('GET CART ITEMS /api/cart/:username', () => {
                // log customer in
                it('Customer can access their cart items', () => {
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
                        })
                        .then(() => {
                            return server
                                .get('/api/cart/Revarz')
                                .expect(200);
                        });
                });

                it('Returns a Cart object with Products array[Cart ID, Product ID, Quantity, Size, Product Title, Manufacturer, Product Color, Product Unit Price and Product Thumbnail URL - per Product] and Total price', () => {
                    const newCartItem = {
                        product_id: 18,
                        quantity: 2,
                        size: 'Universal'
                    };

                    return server
                        .post('/api/cart/Revarz')
                        .send(newCartItem)
                        .expect(201)
                        .then(() => {
                            return server
                                .get('/api/cart/Revarz')
                                .expect(200)
                                .then((response) => {
                                    let result = response.body;
                                    let products = response.body.products;
                                    let product_1 = response.body.products[0];
                                    expect(result).to.have.ownProperty('products');
                                    expect(result).to.have.ownProperty('total');
                                    expect(result).to.be.an.instanceOf(Object);
                                    expect(products).to.be.an.instanceOf(Array);
                                    expect(product_1).to.be.an.instanceOf(Object);
                                    expect(product_1).to.have.ownProperty('cart_id');
                                    expect(product_1).to.have.ownProperty('product_id');
                                    expect(product_1).to.have.ownProperty('quantity');
                                    expect(product_1).to.have.ownProperty('size');
                                    expect(product_1).to.have.ownProperty('product_title');
                                    expect(product_1).to.have.ownProperty('manufacturer');
                                    expect(product_1).to.have.ownProperty('color');
                                    expect(product_1).to.have.ownProperty('unit_price_eur');
                                    expect(product_1).to.have.ownProperty('thumbnail_url');
                                });
                        });
                });

                // log customer out in the end
                it('Customer can not access other customer cart', () => {
                    return server
                        .get('/api/cart/Ezayji')
                        .expect(400)
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });
                });

            });    
        });
    });

    describe('UPDATE CART ITEM QUANTITY FOR USER', () => {
        describe('* Unauthenticated requests *', () => {
            it('Unauthenticated customer can not update cart log', () => {
                const updatedQty = {
                    product_id: 18,
                    quantity: 3,
                    size: 'Universal'
                };

                return request(app)
                    .put('/api/cart/Revarz')
                    .send(updatedQty)
                    .expect(400);
            });
        });

        describe('* Authenticated requests *', () => {
            describe('PUT CART LOG /api/cart/:username', () => {
                //log customer in
                it('Updates item quantity if all information is correct and returns updated cart object', () => {
                    const updatedQty = {
                        product_id: 18,
                        quantity: 1,
                        size: 'Universal'
                    };

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
                        })
                        .then(() => {
                            return server
                                .put('/api/cart/Revarz')
                                .send(updatedQty)
                                .expect(200)
                                .then((response) => {
                                    const result = response.body
                                    const qty = response.body.products[1].quantity;
                                    expect(result).to.be.an.instanceOf(Object);
                                    expect(qty).to.eql(updatedQty.quantity);
                                });
                        });
                });

                it('Returns 404 if item does not exist in cart', () => {
                    const updatedQty = {
                        product_id: 20,
                        quantity: 1,
                        size: 'Universal'
                    };

                    return server
                        .put('/api/cart/Revarz')
                        .send(updatedQty)
                        .expect(404);
                });

                it('Returns 404 if any field is not present', () => {
                    const updatedQty = {
                        product_id: 18
                    };

                    return server
                        .put('/api/cart/Revarz')
                        .send(updatedQty)
                        .expect(404);
                });

                it('Returns 404 if any field is empty', () => {
                    const updatedQty = {
                        product_id: '',
                        quantity: 1
                    };

                    return server
                        .put('/api/cart/Revarz')
                        .send(updatedQty)
                        .expect(404);
                });

                it('Returns 404 if the selected quantity is not in stock', () => {
                    const updatedQty = {
                        product_id: 18,
                        quantity: 1000,
                        size: 'Universal'
                    };

                    return server
                        .put('/api/cart/Revarz')
                        .send(updatedQty)
                        .expect(404);
                });

                it('Returns 400 if too many fields are sent', () => {
                    const updatedQty = {
                        id: 3,
                        product_id: 18,
                        quantity: 1,
                        size: 'Universal',
                        customer_username: 'Revarz'
                    };

                    return server
                        .put('/api/cart/Revarz')
                        .send(updatedQty)
                        .expect(400);
                });

                it('Returns 400 if Product ID is non-numeric', () => {
                    const updatedQty = {
                        product_id: 'eightteen',
                        quantity: 2,
                        size: 'Universal'
                    };

                    return server
                        .put('/api/cart/Revarz')
                        .send(updatedQty)
                        .expect(400);
                });

                it('Returns 400 if Quantity is non-numeric', () => {
                    const updatedQty = {
                        product_id: 18,
                        quantity: 'two',
                        size: 'Universal'
                    };

                    return server
                        .put('/api/cart/Revarz')
                        .send(updatedQty)
                        .expect(400);
                });

                // log customer out in the end
                it('Customer can not update other customer cart', () => {
                    const updatedQty = {
                        product_id: 1,
                        quantity: 2,
                        size: 'S/M'
                    };

                    return server
                        .put('/api/cart/Ezayji')
                        .send(updatedQty)
                        .expect(400)
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });
                });

            });
        });
    });

    describe('DELETE CUSTOMER CART ITEM', () => {
        describe('* Unauthenticated requests *', () => {
            it('Unauthenticated customer can not delete cart items', () => {
                
                return request(app)
                    .delete('/api/cart/Revarz?product_id=18&size=Universal')
                    .expect(400);

            });
        });

        describe('* Authenticated requests *', () => {
            describe('DELETE CART LOG /api/cart/:username?product_id={product_id}&size={size}', () => {
                // log customer in
                it('Authenticated customer can delete an item from their cart', () => {
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
                        })
                        .then(() => {
                            return server
                                .delete('/api/cart/Revarz?product_id=18&size=Universal')
                                .expect(204)
                        })
                        .then(() => {
                            return server
                                .get('/api/cart/Revarz')
                                .expect(200)
                                .then((response) => {
                                    const result = response.body.products;
                                    expect(result.length).to.eql(1);
                                });
                        });
                });

                it('Returns 400 if Product ID is not sent', () => {
                    return server
                        .delete('/api/cart/Revarz?size=S_M')
                        .expect(400);
                });

                it('Returns 400 if Size is not sent', () => {
                    return server
                        .delete('/api/cart/Revarz?product_id=1')
                        .expect(400);
                });

                it('Returns 400 if no Request Query is sent', () => {
                    return server
                        .delete('/api/cart/Revarz')
                        .expect(400);
                });

                it('Returns 400 if called with non-numeric Product ID', () => {
                    return server
                        .delete('/api/cart/Revarz?product_id=one&size=S_M')
                        .expect(400);
                });

                it('Returns 404 if requested item is not in cart', () => {
                    return server
                        .delete('/api/cart/Revarz?product_id=20&size=Universal')
                        .expect(404);
                });

                it('Customer can not delete other customer log', () => {
                    return server
                        .delete('/api/cart/Ezayji?product_id=1&size=S_M')
                        .expect(400); 
                });

                // log customer out in the end
                it('Deletes item from cart if Size includes "/" and is replaced with "_" in query', () => {
                    return server
                        .delete('/api/cart/Revarz?product_id=1&size=S_M')
                        .expect(204)
                        .then(() => {
                            return server
                                .get('/api/cart/Revarz')
                                .expect(404);
                        })
                        .then(() => {
                            return server
                                .get('/api/logout')
                                .expect(200);
                        });
                });
            });
        });
    });

});


// CHECKOUT

// fucntions for interacting with postgres for the tests to work
const {insertOrder, deleteItems, deleteOrder} = require('./test-support/sup_queries');

describe('CHECKOUT (ASSUMING ACCEPTED PAYMENT AND UPDATED STOCK QUANTITY)', () => {
    describe('* Unauthenticated requests *', () => {
        // also post a shippment item for next test
        it('Unauthenticated user can not post checkout', async () => {
            const shippment = {
                shippment_id: 1000000
            };

            await insertOrder();

            return request(app)
                .post('/api/cart/Revarz/checkout')
                .send(shippment)
                .expect(400);
        });
    });

    describe('* Authenticated requests *', () => {
        describe('POST CHECKOUT /api/cart/:username/checkout', () => {
            // log user in and add two items to cart
            it('Authenticated user succesfully calls checkout', () => {
                const shippment = {
                    shippment_id: 1000000
                };

                const user = {
                    username: 'Revarz',
                    password: 'karnaz123'
                };

                const item1 = {
                    product_id: 12,
                    size: 'L',
                    quantity: 1
                };

                const item2 = {
                    product_id: 14,
                    size: 'XL',
                    quantity: 1
                };

                return server
                    .post('/api/login')
                    .send(user)
                    .expect(200, {
                        user: {
                            username: 'Revarz'
                        }
                    })
                    .then(() => {
                        return server
                            .post('/api/cart/Revarz')
                            .send(item1)
                            .expect(201)
                            .then(() => {
                                return server
                                    .post('/api/cart/Revarz')
                                    .send(item2)
                                    .expect(201);
                            });
                    })
                    .then(() => {
                        return server
                            .post('/api/cart/Revarz/checkout')
                            .send(shippment)
                            .expect(201)
                    });
            });

            it('Customer cart is empty after checkout', () => {
                return server
                    .get('/api/cart/Revarz')
                    .expect(404);
            });

            it('Returns 404 if shippment does not exist for user', () => {
                const shippment = {
                    shippment_id: 1000
                };

                return server
                    .post('/api/cart/Revarz/checkout')
                    .send(shippment)
                    .expect(404);
            });

            it('Returns 400 if requested Shippment ID is non-numeric', () => {
                const shippment = {
                    shippment_id: 'million'
                };

                return server
                    .post('/api/cart/Revarz/checkout')
                    .send(shippment)
                    .expect(400);
            });

            it('Returns 400 if Shippment ID is missing from the request', () => {
                const shippment = {};
                
                return server
                    .post('/api/cart/Revarz/checkout')
                    .send(shippment)
                    .expect(400);
            });

            // log customer out in the end            
            it('Returns 400 if shippment id field is empty', () => {
                const shippment = {
                    shippment_id: ''
                };

                return server
                    .post('/api/cart/Revarz/checkout')
                    .send(shippment)
                    .expect(400)
                    .then(() => {
                        return server
                            .get('/api/logout')
                            .expect(200);
                    });
            });

        });
    });
});


// ORDERS
describe('ORDERS', () => {
    describe('GET ALL CUSTOMER ORDERS', () => {
        describe('* Unauthenticated requests *', () => {
            it('Unauthenticated customer can not access orders', () => {
                return request(app)
                    .get('/api/orders/Revarz')
                    .expect(400);
            });
        });

        describe('* Authenticated requests *', () => {
            describe('GET ORDERS /api/orders/:username', () => {
                // log customer in
                it('Authenticated user can request all their orders as an array of objects that also include order products', () => {
                    const user = {
                        username: 'Revarz',
                        password: 'karnaz123'
                    };

                    return server
                        .post('/api/login')
                        .send(user)
                        .expect(200)
                        .then(() => {
                            return server
                                .get('/api/orders/Revarz')
                                .expect(200)
                                .then((response) => {
                                    const result = response.body;
                                    expect(result).to.be.an.instanceOf(Array);

                                    const order_1 = result[0]
                                    expect(order_1).to.have.ownProperty('products');
                                    expect(order_1).to.have.ownProperty('id');
                                    expect(order_1).to.have.ownProperty('date_utc');
                                    expect(order_1).to.have.ownProperty('total_eur');
                                    expect(order_1).to.have.ownProperty('payment');
                                    expect(order_1).to.have.ownProperty('to_appartment');
                                    expect(order_1).to.have.ownProperty('to_street');
                                    expect(order_1).to.have.ownProperty('to_city');
                                    expect(order_1).to.have.ownProperty('to_province');
                                    expect(order_1).to.have.ownProperty('to_zip');
                                    expect(order_1).to.have.ownProperty('to_country');

                                    const product_1 = result[0].products[0];
                                    expect(product_1).to.be.an.instanceOf(Object);
                                    expect(product_1).to.have.ownProperty('product_id');
                                    expect(product_1).to.have.ownProperty('quantity');
                                    expect(product_1).to.have.ownProperty('size');
                                    expect(product_1).to.have.ownProperty('unit_price_eur');
                                    expect(product_1).to.have.ownProperty('product_title');
                                    expect(product_1).to.have.ownProperty('manufacturer');
                                    expect(product_1).to.have.ownProperty('color');
                                });
                        });
                });

                it('Customer can not access other customer orders', () => {
                    return server
                        .get('/api/orders/Ezayji')
                        .expect(400);
                });

                it('Returns 400 if requested username is a number', () => {
                    return server
                        .get('/api/orders/100000')
                        .expect(400);
                });

                // remove order items and shippment for the test to pass
                it('Return 404 if there are no confirmed orders for customer', async () => {
                    await deleteItems();
                    await deleteOrder();

                    return server   
                        .get('/api/orders/Revarz')
                        .expect(404);
                });

            });
        });
    });
});