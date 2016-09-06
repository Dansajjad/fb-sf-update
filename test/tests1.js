//--------------------------------external modules
const nock = require('nock');
const expect = require('chai').expect;
const Promise = require('bluebird');
const _ = require('underscore');
//--------------------------------my modules
const getData = require('../functions').getFirebaseData;
const parseJSON = require('../functions').parseJSON;
//--------------------------------fixtures
const rawDataset1 = require('./rawDataset1');
const parsedDataset1 = require('./parsedDataset1');
const rawDataset2 = JSON.stringify(require('./rawDataset2'));
//--------------------------------tests

describe('Retrieve data from Firebase', function () {
  var firebaseAPI = nock('https://api.firebase.com');
  var url = 'https://api.firebase.com/students'

  describe('getData', function() {

    it('should exist', function () {
      expect(getData).to.be.a('function');
    });

    it('should return a promise', function() {
      firebaseAPI.get('/students').reply(200);

      expect(getData(url)).to.be.an.instanceOf(Promise);
    });

    it('should make students available in the `then` block', function(done) {
      firebaseAPI.get('/students').reply(200, rawDataset1);

      getData(url)
        .then(function(data) {
          expect(data).to.be.a('string');

          expect(JSON.parse(data)).to.deep.equal(rawDataset1);  

          const student2 = JSON.parse(data).zklinger2000;
          const firstName = student2.info.first;
          const lastName = student2.info.last;
          const sfID = student2.salesforce.accountId; 
          const endDate = student2.info.endDate; 
          const progress = student2.progress; 

          expect(firstName).to.equal('Zachary');
          expect(lastName).to.equal('Klinger');
          expect(sfID).to.equal('0011a00000IAZb0AAH');
          expect(endDate).to.equal('6/30/2016');
          expect(progress).to.equal(9);
          done();
        })
        .catch(done);
    });

    it('should make any errors available in the `catch` block', function(done) {
      firebaseAPI.get('/users/someNonExistingUser').reply();

      getData('someNonExistingUser')
        .catch(function(err) {
          expect(err.message).to.equal('Invalid URI "someNonExistingUser"');
          done();
        });
    });

  });

  describe('Parse the retrieved data', function () {
    describe('parseJSON', function() {
      it('should exist', function (done) {
        expect(parseJSON).to.be.a('function');
        done();
      });

      it('should return a promise', function(done) {
        expect(parseJSON(JSON.stringify({"test":"test"}))).to.be.an.instanceOf(Promise);
        done();
      });  

      it('should make students available in the `then` block', function(done) {
      firebaseAPI.get('/students').reply(200, rawDataset1);
        getData(url)
        .then(parseJSON)
        .then(function(parsedData) {
          expect(parsedData).to.be.a('object');
          expect(parsedData).to.deep.equal(parsedDataset1); 
          done();
        })
        .catch(done);
      });

      it('should exclude students without a Salesforce Id', function(done) {
        const studentsWithoutId = ['afung95014', 'williams-nisha', 'zklinger2000'];
        
        parseJSON(rawDataset2)      
        .then(function(parsedData) {
          const studentsWithId = Object.keys(parsedData);

          expect(_.every(studentsWithoutId, function(student) { return studentsWithId.indexOf(student) == -1; })).to.be.true;

          expect(parsedData).to.be.a('object');
          expect(parsedData["williamddong9"]).to.exist; 
          expect(parsedData["afung95014"]).to.not.exist; 
          expect(parsedData["williams-nisha"]).to.not.exist; 
          done();
        })
        .catch(done);
      });

      it('should set Fulcrum_Student_Progress__c as NA if missing', function(done) {
        const studentsWithoutProgress = ['4lynx', 'williamddong9', 'xsvfat'];
        
        parseJSON(rawDataset2)
        .then(function(parsedData) {

          expect(_.every(studentsWithoutProgress, function(student) { 
            return parsedData[student]["Fulcrum_Student_Progress__c"] === "NA"; })).to.be.true;

          expect(parsedData["a-faraz"]["Fulcrum_Student_Progress__c"]).to.equal("Module 4 - Recursion in JavaScript"); 
          expect(parsedData["4lynx"]["Fulcrum_Student_Progress__c"]).to.equal("NA"); 
          expect(parsedData["williamddong9"]["Fulcrum_Student_Progress__c"]).to.equal("NA"); 
          expect(parsedData["xsvfat"]["Fulcrum_Student_Progress__c"]).to.equal("NA"); 
          done();
        })
        .catch(done);
      });

      it('should set Fulcrum_End_Date__c as NA if missing', function(done) {
        const studentsWithoutEndDate = ['4lynx', 'abiymelaku'];
        parseJSON(rawDataset2)
        .then(function(parsedData) {

          expect(_.every(studentsWithoutEndDate, function(student) { 
            return parsedData[student]["Fulcrum_End_Date__c"] === "NA"; })).to.be.true;

          expect(parsedData["4lynx"]["Fulcrum_End_Date__c"]).to.equal("NA"); 
          expect(parsedData["a-faraz"]["Fulcrum_End_Date__c"]).to.equal("2016-06-26"); 
          expect(parsedData["aakdhe"]["Fulcrum_End_Date__c"]).to.equal("2016-05-12"); 
          expect(parsedData["abiymelaku"]["Fulcrum_End_Date__c"]).to.equal("NA"); 
          done();
        })
        .catch(done);
      });    
    });
  })

  after(function() {
    nock.cleanAll();
    nock.restore();
  });    
});





















