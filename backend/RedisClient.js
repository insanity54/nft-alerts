
require('dotenv').config();


redisClientOptions = {
  url: `redis://${process.env.GUBIQ_SERVER_ADDRESS}:6379`
}

class RedisClient {

  constructor () {
    
  }

  async makeClient () {
    const client = createClient(redisClientOptions);
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    return client;
  }
}


module.exports = RedisClient;
