var commonSalesforce = require('common-salesforce');
var Connection = commonSalesforce.Connection;
var Student = commonSalesforce.Student;
var Promise = require('bluebird');
var async = require('async');

var sfCred = require('./config.js')().salesforce; //credentials

//Create new connection to salesforce
function updateSalesforce(data) {
  var connection = new Connection(sfCred.SALESFORCE_URL, sfCred.SALESFORCE_USER, sfCred.SALESFORCE_PASS, sfCred.SALESFORCE_TOKEN)
    .then(function(conn) {
      connection = conn;
      console.log('SalesForce connected');

      //loop over students, check existance in salesforce, update 
      async.each(data, function(githubId, callback) {
        var contactId =  githubId.Id || null;
        console.log('contactID >>>>>>>>>>>>', contactId);

        var fieldsToUpdate = {};

        if (githubId.Fulcrum_End_Date__c === "NA") { //if date is missing only update the progress
          fieldsToUpdate.Fulcrum_Student_Progress__c = githubId.Fulcrum_Student_Progress__c;
        } else {
          fieldsToUpdate.Fulcrum_End_Date__c = githubId.Fulcrum_End_Date__c; 
          fieldsToUpdate.Fulcrum_Student_Progress__c = githubId.Fulcrum_Student_Progress__c;
        }
        
        // Perform operation on students here
        // Create new student instance
        var student = new Student(connection, contactId, githubId)
          .then(function(student) {
            // Do work with student
            console.log('HELLO STUDENT>>>>>>>>', student);
            student.update(fieldsToUpdate)
            .then(function (response) {
              console.log('\n\nStudent updated? ', response.success);
            })
          })
      }, function(err) {
          if( err ) {
            // If one of the iterations produced an error all processing will stop
            console.log('A record failed to process');
          } else {
            console.log('All records have been processed successfully');
          }
      });
    })
    .error(function(e) {
        console.log('SalesForce login failed');
        reject(e);
    });  
}

module.exports = updateSalesforce;