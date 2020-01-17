// import the credential values to connect with providers
const keys = require('./keys');
// import redis library
const redis = require('redis');


// connection to redis DB
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

// create a subscription helper to RedisDB
const sub = redisClient.duplicate();

// worker heart function
function fib(index){
    if(index < 2) return 1;
    return fib(index-1) + fib(index-2);
}

// listen on message event on Redis DB
sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
});

// confirm the subscription to Redis Insert event
sub.subscribe('insert');