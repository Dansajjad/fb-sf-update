var commonSalesforce = require('common-salesforce');
var Connection = commonSalesforce.Connection;
var Student = commonSalesforce.Student;
var timeout = 10000;
var async = require('async');
//---------------------------------------------------------------
let
  sfUrl,
  sfUser,
  sfPass,
  sfToken;

if (process.env.NODE_ENV !== 'production') {
  const sfCred = require('./config.js')().salesforce; //credentials

  sfUrl = sfCred.SALESFORCE_URL;
  sfUser = sfCred.SALESFORCE_USER;
  sfPass = sfCred.SALESFORCE_PASS;
  sfToken = sfCred.SALESFORCE_TOKEN;
} else {
  sfUrl = process.env.SALESFORCE_URL;
  sfUser = process.env.SALESFORCE_USER;
  sfPass = process.env.SALESFORCE_PASS;
  sfToken = process.env.SALESFORCE_TOKEN;
}

//---------------------------------------------------------------
function updateSalesforce(data) {
  var connection = new Connection(sfUrl, sfUser, sfPass, sfToken)
    .then(function(jsforceConnection) {
      conn = jsforceConnection;
      updateStudent(data, conn);
    })
    .error(function(e) {
      console.log('SalesForce login failed');
      reject(e);
    })
}//updateSalesforce

function updateStudent(parsedData, cnxn) {
  async.each(parsedData, function(githubId, callback) {
    var contactId = githubId.Id || null;
    // console.log(`Student:  ${githubId.FirstName} ${githubId.LastName}`);

    var fieldsToUpdate = {}; //this will hold the updates to be made in salesforce

    if (githubId.Fulcrum_End_Date__c === "NA") { //if date is missing only update the progress
      fieldsToUpdate.Fulcrum_Student_Progress__c = githubId.Fulcrum_Student_Progress__c;
    } else {
      fieldsToUpdate.Fulcrum_End_Date__c = githubId.Fulcrum_End_Date__c;
      fieldsToUpdate.Fulcrum_Student_Progress__c = githubId.Fulcrum_Student_Progress__c;
    }

    // Perform operation on students here
    // Create new student instance
    new Student(cnxn, contactId, githubId)
      .then(function(student) {
        // Do work with student
        student.update(fieldsToUpdate)
          .then(function(response) {
            // console.log(response);

            // console.log(`\n\n${student.FirstName} ${student.LastName} updated? ${response.success}`);
          })
      })
  }, function(err) {
    if (err) {
      console.log('A record failed to process');
    } else {
      console.log('All records have been processed successfully');
    }
  })
}//updateStudent


module.exports = updateSalesforce;