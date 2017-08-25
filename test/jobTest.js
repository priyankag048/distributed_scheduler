process.env.NODE_ENV = "test";
/* eslint-disable */
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../lib/index");
const should = chai.should();

chai.use(chaiHttp);

describe("Jobs",()=>{
    describe("Create Job",()=>{
        it("it should POST a job",(done)=>{
            let job = {
                id : 320,
                description : "New Job",
                frequency : 14,
                script : "let a = 3"
            }

            chai.request(server)
            .post('/scheduler/create')
            .send(job)
            .end((err,res)=>{
                res.should.have.status(201);
                res.body.should.be.a("object");
                res.body.should.have.property("info");
                res.body.should.have.property("info").eql("Record has been successfully created with id 320");
            });
        })
    })
})