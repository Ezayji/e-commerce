const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../server')

describe('test', () => {
    it('Sends OK status', async () => {
        const response = await request(app).get('/')

        assert.equal(response.status, 200);
    })
})