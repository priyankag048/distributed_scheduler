class JobProcess{
    
    constructor(redisClient){
        this._redisClient = redisClient;
    }

/* add value to the redis set => array with unique values*/
    addToSet(queue, val){
         this._redisClient.sadd(queue, val);
    }

/* Remove value from redis set*/
    removeFromSet(queue, val){
        this._redisClient.srem(queue, val);
    }

/* get number of members available in redis set*/
    getCount(queue, cb){
        this._redisClient.scard(queue, cb);
    }

/* add to redis hash(object) => a key value pair */
    addToHash(queue, key, val){
        this._redisClient.hset(queue, key, val);
    }

/* check number of job available in the channel */
    checkJobCount(queue,cb){
        this.getMembers(queue,cb);
    }
/* get members from redis set */
    getMembers(queue, cb){
        this._redisClient.smembers(queue, cb);
    }

/* get from redis hash(object) */
    getHashMember(queue,key, cb){
        this._redisClient.hget(queue, key, cb);
    }

/* get all hash members */
    getAllHashMembers(queue,cb){
         this._redisClient.hgetall(queue,cb);
    }

/**pop job from job queue */
    popFromSet(queue,cb){
        this._redisClient.spop(queue,cb);
    }

}

module.exports = JobProcess;




