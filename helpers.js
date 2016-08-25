var moment = require('moment');
var async = require('async');


//Parse the raw json file and return new object with only the selected key/values
function parseJSON(cb) {
  const students = require('./studentsRaw.json');

  let parsedData = {}; //this holds the selected key/value pairs
  let studentCount = 0; //keeps count of students parsed

  async.each(students, function(student) {

    let 
      FirstName = "NA";
      LastName = "NA";
      GitHub__c = "NA";
      Email = "NA";

      startDate = "NA",
      endDate = "NA",
      progress = "NA",
      accountId = "NA",
      contactId = "NA";

    if(student.salesforce && student.salesforce.contactId) {//needs to have contactId to match record in sf

      if(student.info) {
        FirstName =  student.info.first ?  student.info.first : "NA";
        LastName = student.info.last ? student.info.last : "NA";
        GitHub__c = student.info.github ? student.info.github : "NA";
        Email = student.info.email ?  student.info.email : "NA";

        startDate = student.info.startDate ? moment(student.info.startDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : "NA";
        endDate = student.info.endDate ? moment(student.info.endDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : "NA";
      }  

      if(student.modules) {
        var progressNum = student.progress;
        var len = student.modules.length;
        var lastModule = student.modules[progressNum];
        progress = lastModule ? lastModule.name : "NA"; //captures the name of the last completed checkpoint   
        console.log(`Student: ${FirstName} ${LastName} Progress#: ${progressNum} lastModule:`, progress);
      }  

      if(student.salesforce) {
        accountId = student.salesforce.accountId ? student.salesforce.accountId : "NA";
        contactId = student.salesforce.contactId ? student.salesforce.contactId : "NA";      
      }

      parsedData[GitHub__c] = {// add new student object to parsedData, keys should match salesforce fields
        FirstName: FirstName,
        LastName:  LastName,
        GitHub__c: GitHub__c,
        Email: Email,

        Fulcrum_Start_Date__c: startDate,
        Fulcrum_End_Date__c: endDate,
        Fulcrum_Student_Progress__c: progress,
        accountId: accountId,
        Id: contactId
      };
      
      studentCount++;

    }   
  }, function(err) {
      if( err ) {
        // If one of the iterations produced an error all processing will stop
        console.log('A record failed to process');
      } else {
        console.log('All records have been processed successfully');
      }
  });

  console.log(`\n\nParse process is complete for ${studentCount} of students.\nFields retrieved: startDate, endDate, progress, accountId, contactId.`
  );

  cb(JSON.stringify(parsedData)); //Do whatever needed to the data 

};//parseJSON

module.exports = parseJSON;

//------------------------------------------------------------------------NOTES

/*
This module: 
  - loops over each student in the studentsRaw.json
  - stores key/values in an object for the students with a contactId
  - passes the object to a callback, which writes the data to studentsParsed.json 
*/

//--------------------------------------------------------------------
/* 
Structure of data, in the studentsRaw.json, under the students node
<unique Github id>
  help
  info
    startDate 
    endDate   <<--------------- This needs to be added to Salesforce
  progress  // <<----------------- This # corresponds to index of last "completed" item in modules array (see below)
  salesforce
    accountId
    contactId
  salesforce-dev
    accountId
    contactId  
  modules   <<--------------- Last "completed" item from this array needs to be added to Salesforce
  .
  . 
  . 
*/

