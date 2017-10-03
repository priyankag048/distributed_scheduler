const redisClient = require("../messageQueue/redisClient");

class JobProcess{
    
/* add value to the redis set => array with unique values*/
    addToSet(queue, val){
         redisClient.sadd(queue, val);
    }

/* Remove value from redis set*/
    removeFromSet(queue, val){
        redisClient.srem(queue, val);
    }

/* get number of members available in redis set*/
    getCount(queue, cb){
        redisClient.scard(queue, cb);
    }

/* add to redis hash(object) => a key value pair */
    addToHash(queue, key, val){
        redisClient.hset(queue, key, val);
    }

/* check number of job available in the channel */
    checkJobCount(queue,cb){
        this.getMembers(queue,cb);
    }
/* get members from redis set */
    getMembers(queue, cb){
        redisClient.smembers(queue, cb);
    }

/* get from redis hash(object) */
    getHashMember(queue,key, cb){
        redisClient.hget(queue, key, cb);
    }

/**pop job from job queue */
    popFromSet(queue,cb){
        redisClient.spop(queue,cb);
    }

}

module.exports = new JobProcess();




