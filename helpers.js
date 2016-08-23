var moment = require('moment');
/* 
Structure of data under the students node that have to be targeted
<unique Github id>
  help
  info
    startDate 
    endDate
  progress  //some students have this some don't [is a number]
  salesforce
    accountId
    contactId
  salesforce-dev
    accountId
    contactId  
*/

//Parse the raw json file and return new object with only the selected key/values
function parseJSON(cb) {
  const students = require('./studentsRaw.json');

  let parsedData = {}; //this holds the selected key/value pairs
  let studentCount = 0; //keeps count of students parsed

  let studentsWithMissingData = {

  }

  for(var githubID in students) {//loop over all the raw student objects
    const student = students[githubID];

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
      
    if(!student.info) {studentsWithMissingData[student] === true};

    if(student.info) {
      FirstName =  student.info.first ?  student.info.first : "NA";
      LastName = student.info.last ? student.info.last : "NA";
      GitHub__c = student.info.github ? student.info.github : "NA";
      Email = student.info.email ?  student.info.email : "NA";

      startDate = student.info.startDate ? moment(student.info.startDate).format('YYYY-MM-DD') : "NA";
      endDate = student.info.endDate ? moment(student.info.endDate).format('YYYY-MM-DD') : "NA";
    }  

    if(student.modules) {
      var progressNum = student.progress;
      var len = student.modules.length;
      var lastModule = student.modules[progressNum];
      console.log(lastModule);
      progress = lastModule ? lastModule.name : "NA";      
    }  

    if(student.salesforce) {
      accountId = student.salesforce.accountId ? student.salesforce.accountId : "NA";
      contactId = student.salesforce.contactId ? student.salesforce.contactId : "NA";      
    }

    console.log('STUDENT>>>>>>>>>', student);
    parsedData[githubID] = {// add new student object to parsedData
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
  }//for-loop

  console.log(parsedData);
  console.log('Students missing data: ', studentsWithMissingData);


  console.log(`\n\nParse process is complete for ${studentCount} of students.\nFields retrieved: startDate, endDate, progress, accountId, contactId.`
  );

  cb(JSON.stringify(parsedData)); //Do whatever needed to the data 

};//parseJSON

module.exports = parseJSON;