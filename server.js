var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});




//----------------Connect with (dev environment)---------------------------
const http = require('http');
const request = require("request");
const fs = require('fs');
const parseJSON = require('./helpers.js');

let baseUrl;

if(process.env.NODE_ENV !== 'PROD') {
  const config = require('./config.js')();
  baseUrl = config.firebase.url; 
} else {
  baseUrl = process.env.FIREBASE_URL;
}

const url = baseUrl + 'students/.json'

function getDataAndParse() {//Retrieve data from Firebase & parse
  var stream = request(url).pipe(fs.createWriteStream('./studentsRaw.json'));
  stream.on('finish', function () {//after stream complete send to parse fn
    parseJSON(function(data) {//cb to write data to a file after it is parsed
      fs.writeFile('./studentsParsed.json', data, function(err) {
        if(err) console.log(err);
        else console.log('>>>>>>>>>>Write complete')
      });
    });
  });
}


// (function () { //IIFE that keeps pulling data from FB, parses, and saves every 5s
//   let calledTimes = 0;
//   setInterval(function () {
//     getDataAndParse();
//     calledTimes++;
//     console.log(`\n The function has been called ${calledTimes} times.`)
//   }, 5000);
// })(); 



//------------------------ Salesforce ---------------------------------------//
var commonSalesforce = require('common-salesforce');
var Connection = commonSalesforce.Connection;
var Student = commonSalesforce.Student;
var Promise = require('bluebird');
var async = require('async');

var sfCred = require('./config.js')().salesforce;

var testStudents = {
  "4lynx":{"FirstName":"Ivan","LastName":"O'Neill","GitHub__c":"4lynx","Email":"ipoguard-github@yahoo.com","Fulcrum_Start_Date__c":"2015-12-16","Fulcrum_End_Date__c":"2016-03-16","Fulcrum_Student_Progress__c":"Module 6 - Object Oriented Patterns","accountId":"0011a00000IAZb0AAH","Id":"003R0000017XHp4IAG"},
  "a-faraz":{"FirstName":"Anjum","LastName":"Faraz","GitHub__c":"a-faraz","Email":"anjumfaraz10@gmail.com","Fulcrum_Start_Date__c":"2016-03-26","Fulcrum_End_Date__c":"2016-06-26","Fulcrum_Student_Progress__c":"Module 4 - Recursion in JavaScript","accountId":"0011a00000IAZb0AAH","Id":"003R0000017XHozIAG"},
  "aakdhe":{"FirstName":"Aakash","LastName":"Dheer","GitHub__c":"aakdhe","Email":"aakashdheer@gmail.com","Fulcrum_Start_Date__c":"2015-11-12","Fulcrum_End_Date__c":"2016-06-12","Fulcrum_Student_Progress__c":"Sprint - Underbar Part 1","accountId":"0011a00000IAZb0AAH","Id":"003R0000017XHp9IAG"},
  "abiymelaku":{"FirstName":"Abiy","LastName":"Melaku","GitHub__c":"abiymelaku","Email":"agirma08@gmail.com","Fulcrum_Start_Date__c":"2016-01-11","Fulcrum_End_Date__c":"2016-11-15","Fulcrum_Student_Progress__c":"Sprint - Underbar Part 2","accountId":"0011a00000IAZb0AAH","Id":"003R0000017XHouIAG"}
};

//Create new connection to salesforce
var connection = new Connection(sfCred.SALESFORCE_URL, sfCred.SALESFORCE_USER, sfCred.SALESFORCE_PASS, sfCred.SALESFORCE_TOKEN)
  .then(function(conn) {
    connection = conn;
    console.log('SalesForce connected');

    //loop over students, check existance in salesforce, update 
    async.each(testStudents, function(githubId, callback) {
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


//------------------------------------------Completed Steps
  // 1. Download Firebase data
  // 2. Parse Firebase data
  // 3. Deploy as a service on Heroku
  // 4. Run script once per day | currently running every few seconds 
  // 5. Connect with salesforce using the inhouse module
  // 6. Run a for loop on the parsed data
  // 7. Fix parsedData to pull all required keys to save a contact
  // 8. Match parsedData keys to be same as fields in salesforce
  // 9. Create Student Properties for each student  
  // 10. Write script to update 


//-------------------------------------------Pending Steps
  // 11. Replace dummy data with real data
  // 12. Set environment to "Production"
  // 13. Clean up and if necessary modularize code
  // 14. Free hreoku app goes to sleep, wake app by pinging or twice per day
  // 15. Figure out the account name for fulcrum students in salesforce 
  // 16. Figure out if/and what to filter by all the students from firebase
  // 17. 


//------------------------------------------Salesforce flow
 // check if student exists
  // if student exists
      // update End Date
      //Update Fulcrum Student Progress
  // else 
    //add new record with all the fields