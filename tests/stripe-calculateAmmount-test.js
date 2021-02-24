const {assert, expect} = require('chai');
const { calculateAmmount } = require('../server_ops/stripe-config');

describe('Final Payment Ammount Calculation For Checkout', () => {
    describe('calculateAmmount(cart)', () => {
        it('Returns correct total ammount in cents', () => {
            const cart = [
                {quantity: 1, unit_price_eur: 40},
                {quantity: 1, unit_price_eur: 330},
                {quantity: 2, unit_price_eur: 12}
            ];

            const total = calculateAmmount(cart);
            const expected = 39400;

            expect(total).to.eql(expected);
        });
    });
});