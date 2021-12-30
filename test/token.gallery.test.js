

const TG = require('../src/token.gallery.js');
const { expect } = require('chai');

describe('token.gallery', function () {
    describe('getLatestTokens', function () {
        it('should return an array of tokens', async function () {
            this.timeout(1000*60*3)
            const tg = new TG();
            let tokens = await tg.getLatestTokens(50);
            console.log(tokens)
            expect(tokens[0]).to.have.property('nftId');
        })
    })

})