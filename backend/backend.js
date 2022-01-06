require('dotenv').config();

if (typeof process.env.GUBIQ_SERVER_ADDRESS === 'undefined') throw new Error('GUBIQ_SERVER_ADDRESS is undefined in env.')

const web3 = require('./web3');
const debug = require('debug')('nft-alerts');
const Redis = require('ioredis');
const redis = new Redis(
    `redis://${process.env.GUBIQ_SERVER_ADDRESS}:6379`
);


const TG = require('./token.gallery.js');




    // debug(`connecting to gubiq at ${web3.currentProvider.url} ...`);

    // web3.currentProvider.on('data', (data) => {
    //     console.log(`websocket connection data. ${data}`);
    // })
    // web3.currentProvider.on('connect', (websocketConnection) => {
    //     console.log(`websocket connection connect.`);
    // })
    // web3.currentProvider.on('error', (errorDescription) => {
    //     console.log(`websocket connection error. ${errorDescription}`);
    // })
    // web3.currentProvider.on('close', (idk) => {
    //     console.log(`websocket connection close. ${idk}`);
    // })
    // web3.currentProvider.on('disconnect', (idk) => {
    //     console.log(`websocket connection disconnect. ${idk}`);
    // })


const discoverTokens = async () => {
    // * get the entire list of tokens on Token.gallery
    // * store them in redis
    debug('[i] Discovering Tokens')
    const tg = new TG();

    // get the first page of latest tokens.
    // If the most latest token is known to nft-alerts, we abort.
    let tokies = await tg.getLatestTokens(1, 1);
    if (tokies.length < 1) {
        debug(`[-] aborting token discovery because there were no tokens received from Token Gallery /latest endpoing`);
        debug(tokies)
    }
    const firstToken = tokies[0]
    debug(firstToken)
    const isFirstTokenKnown = await redis.sismember('tokenSet', firstToken.nftId);
    debug(`[~] The first token ${(isFirstTokenKnown) ? 'is' : 'is not'} known`);
    if (isFirstTokenKnown) {
        debug('[-] Aborting token discovery because the newest token on Token Gallery is already known.')
        return;
    }


    // fetch tokies beyond the first page
    tokies = await tg.getLatestTokens(2);
    // go through each Token Gallery token object and add it to redis
    let tokenCounter = 0;
    for (const token of tokies) {
        debug(`[*] Adding token "${token.metadata.name}" to redis`);

        tokenCounter++;
        await redis
            .pipeline([
                ["sadd", 'tokenSet', token.nftId],
                ["hmset", `token:${token.nftId}:metadata`, 'store', token.store, 'metaId', token.metaId, 'inserted', token.inserted, 'preview', token.metadata.preview, 'name', token.metadata.name ],
            ])
            .exec((err, results) => {
                console.log(results[0]);
                console.log(results[1]);
            });

    }
    debug(`[+] token import complete with ${tokenCounter} tokens`)
}

const getTokenStores = async (tokenSet) => {

    let tokenStores = [];
    for (const tokenId of tokenSet) {
        const store = await redis.hget(`token:${tokenId}:metadata`, 'store');
        debug(`[*] ${tokenId} -> ${store}`)
        tokenStores.push(store);
    };
    return tokenStores;
}

// greets https://medium.com/coinmonks/monitoring-an-ethereum-address-with-web3-js-970c0a3cf96d
async function checkBlocks(start, end, arrayOfTxHashes, tokenSet) {
    for (let i = start; i < end; i ++) {
        let block = await web3.eth.getBlock(i);
        debug(`[*] searching block [${i}/${end}] for token sales`);
        if (block && block.transactions) {
            for (let txHash of block.transactions) {
                let tx = await web3.eth.getTransaction(txHash);
                const txMatchIndex = arrayOfTxHashes.indexOf(tx.to);
                debug(`[*] checking ${tx.to}`)
                if (txMatchIndex > -1) {
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+][+][+][+][+][+][+][+][+][+][+]`);
                    debug(`[+] Transaction found on block ${ i }`);
                    debug({
                        address: tx.from,
                        value: web3.utils.fromWei(tx.value, 'ether'),
                        timestamp: new Date()
                    })
                    await redis.zadd(`token:${tokenSet[txMatchIndex]}:sales`, block.timestamp, arrayOfTxHashes[txMatchIndex]);
                }
            }
        }
    }
    await redis.set(`blockCounter`, i); // set the blockCounter
}

const getBlockStart = async () => {
    // I *think* 1644462 is first known UBQ block with a Token Gallery tx
    const firstBlockWithToken = 1644462;

    try {
        const blockStart = await redis.get('blockCounter');
        if (!blockStart) return firstBlockWithToken;
        return blockStart
    } catch (e) {
        console.error(`Error while fetching blockCounter in redis.`);
        console.error(e);
    }
}

const main = (async () => {

    await discoverTokens();
    const blockTarget = await web3.eth.getBlockNumber();
    const tokenSet = await redis.smembers('tokenSet');
    const tokenStores = await getTokenStores(tokenSet);
    debug('[+] tokenstore fetch is complet')
    const blockStart = await getBlockStart();

    debug(`[s] Time to CheckBlocks blockStart:${blockStart}, blockTarget:${blockTarget}, storelength:${tokenStores.length}, setlength:${tokenSet.length}`)
    await checkBlocks(blockStart, blockTarget, tokenStores, tokenSet);
    debug(`[+] main() is complete`);

})();






