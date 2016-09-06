const Promise = require('bluebird');
const colors = require('colors');
const _ = require('underscore');
const moment = require('moment');
const async = require('async');
const request = require("request");
//-----------------------------------------Get Firebase data

function getFirebaseData(url) {
  return new Promise(function(resolve, reject) {
    let options = {
      url: url,
      headers: {
        'User-Agent': 'request'
      }
    };

    request(options, function(err, response, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
} //getData

function parseJSON(rawData) {
  return new Promise(function(resolve, reject) {
    const students = JSON.parse(rawData);
    let parsedData = {};
    let studentCount = 0;


    async.each(students, function(student) {
      processStudent(student, parsedData);
      studentCount++;
    }, function(err) {
      if (err) {
        console.log('Process failed'.orange);
        reject(err);
      }
    });
    resolve(parsedData);
  })
} //parseJSON

function processStudent(student, recordObj) {
  let
    FirstName = "NA",
    LastName = "NA",
    GitHub__c = "NA",
    Email = "NA",
    startDate = "NA",
    endDate = "NA",
    progress = "NA",
    accountId = "NA",
    contactId = "NA";

  if (student.salesforce && student.salesforce.contactId) { //needs to have contactId to match record in sf

    if (student.info) {
      FirstName = student.info.first ? student.info.first : "NA";
      LastName = student.info.last ? student.info.last : "NA";
      GitHub__c = student.info.github ? student.info.github : "NA";
      Email = student.info.email ? student.info.email : "NA";

      startDate = student.info.startDate ? moment(student.info.startDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : "NA";
      endDate = student.info.endDate ? moment(student.info.endDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : "NA";
    }

    if (student.modules) {
      var progressNum = student.progress;
      var len = student.modules.length;
      var lastModule = student.modules[progressNum];
      progress = lastModule ? lastModule.name : "NA"; //captures the name of the last completed checkpoint   
      // console.log(`Student: ${FirstName} ${LastName} Progress#: ${progressNum} lastModule: , ${progress}, endDate: ${endDate}`);
    }

    if (student.salesforce) {
      accountId = student.salesforce.accountId ? student.salesforce.accountId : "NA";
      contactId = student.salesforce.contactId ? student.salesforce.contactId : "NA";
    }

    recordObj[GitHub__c] = { // add new student object to parsedData, keys should match salesforce fields
      FirstName: FirstName,
      LastName: LastName,
      GitHub__c: GitHub__c,
      Email: Email,

      Fulcrum_Start_Date__c: startDate,
      Fulcrum_End_Date__c: endDate,
      Fulcrum_Student_Progress__c: progress,
      accountId: accountId,
      Id: contactId
    };
  }
}//processStudent

module.exports = {
  getFirebaseData: getFirebaseData,
  parseJSON: parseJSON
}