const { validateString } = require("../lib/constants/config");
const logger = require("../lib/logger/log");
const chai = require("chai");
const expect = chai.expect;

describe("validate the given value is string",()=>{
   
    it("should pass if the value is string",()=>{
        let value = "abc";
        let returned = validateString(value);
        expect(returned).to.equal("abc");
    });
});