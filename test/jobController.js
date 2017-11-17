const JobController = require("../lib/dbConnections/jobController");
const queryString = require("./constants/queryString");
const jobController = new JobController(queryString);
const chai = require("chai");
const expect = chai.expect;
const query = require("./constants/query");
var startTimeStamp, startdate, job;

describe("job controller : add, update, read and delete from database", () => {

    beforeEach((done) => {
        startTimeStamp = new Date();
        startdate = `${startTimeStamp.getDate()}-${startTimeStamp.getMonth()}-${startTimeStamp.getFullYear()}  ${startTimeStamp.getHours()}:${startTimeStamp.getMinutes()}:${startTimeStamp.getSeconds()}`;
        job = {
            id : 1,
            name: "job1",
            description: "job1",
            frequency: 5,
            startdate: startdate,
            script: "var a = 5;",
            repeat: true
        };
        query("BEGIN", "", done);
    });


    it("should add to job test table", (done) => {
        query(queryString.delete_all_rows, "", (err, res) => {
            jobController.createJob(job.name, job.description, job.frequency, job.script, job.repeat)
                .then(result => {
                    query(queryString.get_all_rows, "", (err, rows) => {
                        expect(result.status).to.equal(201);
                        expect(result.message).to.equal(`Record has been successfully created with id ${rows[0].id}`);
                        expect(rows.length).to.equal(1);
                        done();
                    });
                });
        });
    });

    it("should get job based on id", (done) => {
        query(queryString.delete_all_rows, "", (err, res) => {
            query(queryString.create_row, [job.name, job.description, job.frequency, job.startdate, job.script, job.repeat], (err, result) => {
                var id = result[0].id;
                jobController.getJob(id)
                    .then(result => {
                        expect(result.data.id).to.equal(id);
                        expect(result.message).to.equal(`Found job with id ${id}`);
                        expect(result.status).to.equal(200);
                        done();
                    });
            });
        });
    });

    it("should get all jobs", (done) => {
        query(queryString.delete_all_rows, "", (err, res) => {
            query(queryString.create_row, [job.name, job.description, job.frequency, job.startdate, job.script, job.repeat], (err, result) => {
                jobController.getAllJobs()
                    .then(result => {
                        let jobName = result.data[0].name;
                        jobName = jobName.trim();
                        expect(result.message).to.equal("Found jobs");
                        expect(result.status).to.equal(200);
                        expect(jobName).to.equal(job.name);
                        done();
                    });
            });
        });
    });

});