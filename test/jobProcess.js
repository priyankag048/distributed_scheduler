const JobProcess = require("../lib/scheduler/jobprocess");
const redis = require("redis");
const fakeredis = require("fakeredis");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
var redisClient;
sinon.stub(redis,"createClient").callsFake(fakeredis.createClient);
redisClient = redis.createClient();
const jobProcess = new JobProcess(redisClient);

describe("redis stores", () => {
    var setChannel, hashChannel, key, value;

    beforeEach(() => {
        setChannel = "setChannel";
        hashChannel = "hashChannel";
        key = "testKey";
        value = "testValue";
        redisClient.srem(setChannel, value);
        redisClient.hdel(hashChannel,key, value);
    });

    it("should add to set", (done) => {
        let val = "newval";
        jobProcess.addToSet(setChannel, value);
        redisClient.scard(setChannel, (err, result) => {
            expect(result).to.equal(1);
            done();
        });

    });

    it("should remove from set", (done) => {
        redisClient.sadd(setChannel, value);
        jobProcess.removeFromSet(setChannel, value);
        redisClient.scard(setChannel, (err, result) => {
            expect(result).to.equal(0);
            done();
        });
    });

    it("get count from set", (done) => {
        jobProcess.getCount(setChannel, (err, result) => {
            expect(result).to.equal(0);
            done();
        });

    });

    it("pop from set", (done) => {
        redisClient.sadd(setChannel, value);
        jobProcess.popFromSet(setChannel, (err, val) => {
            redisClient.scard(setChannel, (err, result) => {
                expect(result).to.equal(0);
                done();
            });
        });
    });

    it("should add to hash",(done)=>{
        jobProcess.addToHash(hashChannel,key, value);
        redisClient.hlen(hashChannel, (err, result)=>{
            expect(result).to.equal(1);
            done();
        });
    });

    it("should get key from hash",(done)=>{
        redisClient.hset(hashChannel,key,value);
        jobProcess.getHashMember(hashChannel,key, (err, result)=>{
            expect(result).to.equal(value);
            done();
        });
    });

    it("should get all members of hash",(done)=>{
        redisClient.hset(hashChannel,key,value);
        jobProcess.getAllHashMembers(hashChannel, (err, result)=>{
            expect(Object.keys(result).length).to.equal(1);
            done();
        });
    });

});