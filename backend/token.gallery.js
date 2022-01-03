// https://token.gallery/api/nfts/latest?&owner=0x1A9A0B97CE419891f67468F81C91BC82497956E8&page=1&showunverified=true


const fetch = require('node-fetch');
const debug = require('debug')('nft-alerts');

class TG {

    constructor (opts = {}) {
        this.throttleTimeout = opts.throttleTimeout || 250;
    }




    // const page7 = await tg.latestTokensPage(7);
    async latestTokensPage (pageNumber = 1) {
        debug(`latestTokensPage pageNumber=${pageNumber}`);
        const res = await fetch(`https://token.gallery/api/nfts/latest?page=${pageNumber}`);
        return res.json();
    }


    async getLatestTokens (pageLimit = 1000000) {
        let pageCounter = 1;
        let allTokensList = [];

        for (let pageCounter = 1; pageCounter < pageLimit; pageCounter++) {
            let tokensList = await this.latestTokensPage(pageCounter);
            if (tokensList.length < 1) {
                break;
            } else {
                allTokensList = allTokensList.concat(tokensList);
                debug(`${allTokensList.length} tokies`);
            }
            debug(`${this.throttleTimeout}ms courtesy sleep`);
            await new Promise((resolve, reject) => { setTimeout(resolve, this.throttleTimeout)})
        }
        
        return allTokensList;
    }
}



module.exports = TG;