const nock = require("nock");
const chai = require("chai");
const server = nock("http://localhost:4000");
const expect = chai.expect;
const router = require("../lib/api/jobRouter");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
describe("Job Creation",()=>{
    beforeEach(()=>{
        server.post("/jobs",{
                        name :"SCHED1",
                        description:"new job",
                        frequency:23,
                        script:"console.log('hello world');",
                        repeat:true
                    })
                    .reply(201,{
                        ok:true,
                        status : 201
                    });
    });


    it("should return with status 201",function(done){
        chai.request(router)
        .post("/jobs")
        .end((err,res)=>{
            res.should.have.status(201);
            done();
        })
    });
    

});