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

  for(var githubID in students) {//loop over all the raw student objects
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

    
    parsedData[githubID] = {// add new student object to parsedData
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

  cb(JSON.stringify(parsedData)); //Do whatever needed to the data 

};//parseJSON

module.exports = parseJSON;