const {assert, expect} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../server');
const { response } = require('express');

describe('API', () => {
    it('Sends OK status', async () => {
        const response = await request(app).get('/api/')

        assert.equal(response.status, 200);
    })
})

// Users
describe('Customers', () => {
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
/*
    describe('POST /api/customer', () => {
        it('Adds the new cutomer to the database if supplied information is present and correct', () => {
            let newCustomer = {
                id: nextval('customer_sequence'),
                username: 'Revarz',
                first_name: 'Selna',
                last_name: 'Kaszk',
                email: 'selnakxd@testapi.com',
                phone: '+372 11111111',
                password: crypt('selnapassword', gen_salt('bf')),
                registered: current_timestamp
            }


        })
    })
*/
});