const expect = require("chai").expect;
const nock = require('nock');
//-------------------------------------------------
const getData = require('../functions').getFirebaseData;
const parseJSON = require('../functions').parseJSON;
const rawDataset3 = require('./rawDataset3');
//-------------------------------------------------
var commonSalesforce = require('common-salesforce');
var Connection = commonSalesforce.Connection;
var Student = commonSalesforce.Student;
var updateSalesforce = require('../updateSalesforce');
var timeout = 10000;
//-------------------------------------------------
let
  sfUrl,
  sfUser,
  sfPass,
  sfToken;

if (process.env.NODE_ENV !== 'production') {
  const sfCred = require('../config.js')().salesforce; //credentials

  sfUrl = sfCred.SALESFORCE_URL;
  sfUser = sfCred.SALESFORCE_USER;
  sfPass = sfCred.SALESFORCE_PASS;
  sfToken = sfCred.SALESFORCE_TOKEN;
} else {
  sfUrl = process.env.SALESFORCE_URL;
  sfUser = process.env.SALESFORCE_USER;
  sfPass = process.env.SALESFORCE_PASS;
  sfToken = process.env.SALESFORCE_TOKEN;;
}
//------------------------------------------------- TESTS

describe('Updating a student\'s end date and progress', function() {

  var _student;
  var contactId;
  var conn;

  before(function(done) {
    var connection = new Connection(sfUrl, sfUser, sfPass, sfToken)
      .then(function(jsforceConnection) {
        expect(jsforceConnection.accessToken.length).to.be.gt(0);
        conn = jsforceConnection;
        done();
      });
  });

  describe('constructor', function() {
    it('is a function', function() {
      expect(Student).to.be.a('function');
    });
  });

  it('looks up a student when given a ContactID', function(done) {
    contactId = "003R0000017XHozIAG";
    this.timeout(timeout);
    new Student(conn, contactId)
      .then(function(student) {
        expect(student.Id.length).to.be.gt(0);
        _student = student;
        done();
      });
  });

/*
  Manually modify a given student record so that we can 
  compare with a later update when updateSalesforce is called
*/
  
  describe('change values to be updated later', function() {
    it('should update a student', function(done) {
      this.timeout(timeout);
      _student.update({
        'Fulcrum_End_Date__c': '2016-05-12',
        "Fulcrum_Student_Progress__c": "Sprint - Twittler"
      })
        .then(function(res) {
          expect(res.success).to.be.true;
          done()
        });
    });

    it('should have modified end date and progress', function(done) {
      contactId = "003R0000017XHozIAG";
      this.timeout(timeout);
      new Student(conn, contactId)
        .then(function(student) {
          expect(student['Fulcrum_End_Date__c']).to.equal("2016-05-12");
          expect(student["Fulcrum_Student_Progress__c"]).to.equal("Sprint - Twittler");          
          console.log('End date & progress before update'.underline.red, student['Fulcrum_End_Date__c'], '|', student['Fulcrum_Student_Progress__c']);
          _student = student;
          done();
        });
    });
  });

/*
  Update records using updateSalesforce. Expect the previous record to update with new data.
*/
 

  describe('update salesforce record by calling updateSalesforce', function() {
    before(function(done) {
      this.timeout(20000);

      var firebaseAPI = nock('https://api.firebase.com');
      firebaseAPI.get('/students').reply(200, rawDataset3);
      var url = 'https://api.firebase.com/students'

      getData(url)
        .then(parseJSON)
        .then(updateSalesforce)
      setTimeout(done, 15000);
    });

    it('should update end date and progress when called', function(done) {
      contactId = "003R0000017XHozIAG";
      new Student(conn, contactId)
        .then(function(student) {
          // console.log('<<<<<<<<<<'.red, student);
          expect(student['Fulcrum_End_Date__c']).to.equal("2016-06-26");
          expect(student["Fulcrum_Student_Progress__c"]).to.equal("Module 4 - Recursion in JavaScript");
          console.log('End date & progress after update'.underline.red, student['Fulcrum_End_Date__c'], '|', student['Fulcrum_Student_Progress__c']);
          _student = student;          
          done();
        })
    });

    after(function() {
      nock.cleanAll();
      nock.restore();
    });
  });
});