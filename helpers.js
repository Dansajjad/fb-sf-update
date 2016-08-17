

//function to parse out end date

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

function parseJSON(cb) {
  const students = require('./studentsRaw.json');

  let parsedData = {};
  let studentCount = 0;

  for(var githubID in students) {
    const student = students[githubID];

    let 
      startDate = "NA",
      endDate = "NA",
      progress = "NA",
      accountId = "NA",
      contactId = "NA";

   
    if(student.info) {
      startDate = student.info.startDate ? student.info.startDate : "NA";
      endDate = student.info.endDate ? student.info.endDate : "NA";
    }  

    if(student.progress) {
      progress = student.progress ? student.progress : "NA";      
    }  

    if(student.salesforce) {
      accountId = student.salesforce.accountId ? student.salesforce.accountId : "NA";
      contactId = student.salesforce.contactId ? student.salesforce.contactId : "NA";      
    }

    
    parsedData[githubID] = {
      startDate: startDate,
      endDate: endDate,
      progress: progress,
      accountId: accountId,
      contactId:contactId
    };
    
    studentCount++;
  }//for-loop

  console.log(parsedData);

  console.log(`\n\nParse process is complete for ${studentCount} of students.\nFields retrieved: startDate, endDate, progress, accountId, contactId.`
  );

  cb(JSON.stringify(parsedData));

};//parseJSON

module.exports = parseJSON;