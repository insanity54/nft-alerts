
require('dotenv').config();
const Web3 = require('web3');
const GUBIQ_SERVER_ADDRESS = process.env.GUBIQ_SERVER_ADDRESS;
const net = require('net');
const wsOpts = {
    timeout: 3000, // ms
    reconnect: {
        auto: true,
        delay: 3000, // ms
        maxAttempts: 5,
        onTimeout: true
    }
}

const addr = '0x798a99ee5079c7d0f99fa15f5f1d903c14247309';

let web3;

if (process.env.NODE_ENV === 'development') {
    const provider = new Web3.providers.WebsocketProvider(`ws://${GUBIQ_SERVER_ADDRESS}:8546`, wsOpts);
    web3 = new Web3();
    web3.setProvider(provider);
} else if (process.env.NODE_ENV === 'production') {
    web3 = new Web3(new Web3.providers.IpcProvider('/srv/ubq/gubiq.ipc', net));
} else {
    throw new Error('NODE_ENV is not defined. It must be one of development or production')
}

module.exports = web3;
