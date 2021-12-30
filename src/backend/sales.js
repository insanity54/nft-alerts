require('dotenv').config();
const RedisTimeSeries = require('redistimeseries-js');




// check base redis client for options
// https://github.com/NodeRedis/node_redis
const options = {
  host: process.env.GUBIQ_SERVER_ADDRESS,
  port: 6379
}

const rtsClient = new RedisTimeSeries(options);
const key = 'sale';

const updateSale = async () => {
  await rtsClient.add(key, Date.now(), Math.floor(Math.random()*1)).send();
}

const start = async () => {
  await rtsClient.connect();
  await rtsClient.create(key).retention(94672800).send();
  setInterval(updateSale, 1000);
}

start();



module.exports = Sale