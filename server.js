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




//----------------Connect with (dev environment)
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
// var SFConnect = require('./salesforceConnect');
// var salesforce = require('./salesforce');
var Promise = require('bluebird');

var sfCred = require('./config.js')().salesforce;
// var connection;
// var student;

var studentProperties = {
  FirstName: 'Cowboy',
  LastName: 'Texas',
  Phone: 8008675309,
  GitHub__c: 'cowboy123',
  Email: 'cowboy@gmail.com',
};

var studentProperties2 = {
    FirstName: 'Fulcrum',
    LastName: 'Test',
    Email: 'fulcrum.mentors@reactorcore.com',
    GitHub__c: 'fulcrumtest',
};

var studentProperties2 = {
    FirstName: 'Fulcrum',
    LastName: 'Test',
    Email: 'fulcrum.mentors@reactorcore.com',
    GitHub__c: 'fulcrumtest',
    AccountId: 456
};



//  var requiredKeys: [
//    'FirstName',
//    'LastName',
//    'GitHub__c',
//    'Email',
//    'Earliest_Start_Date__c'
// ];

//Create new connection to salesforce
connection = new Connection(sfCred.SALESFORCE_URL, sfCred.SALESFORCE_USER, sfCred.SALESFORCE_PASS, sfCred.SALESFORCE_TOKEN)
  .then(function(conn) {
      connection = conn;
      student = new Student(connection);
      console.log('SalesForce connected');

      //Create a new student
      var student = new Student(connection, null, studentProperties2)
      .then(function(student) {
        // Do work with student
        console.log(student);
      })

      // student.update({FirstName: 'Joe'})
      // .then(function(response) {
      //   console.log(res.success); // true or false
      //   // Response will also include the student properties
      // });

//------------------------------------------Completed Steps
  // 1. Download Firebase data
  // 2. Parse Firebase data
  // 3. Deploy as a service on Heroku
  // 4. Run script once per day | currently running every few seconds 
  // 5. Connect with salesforce using the inhouse module


//-------------------------------------------Pending Steps
  // 6. Run a for loop on the parsed data
  // 7. Fix parsedData to pull all required keys to save a contact
  // 8. Create Student Properties for each student  
  // 9. Write script to update 
  // 10. 

 // check if student exists
  // if student exists
    //check if Fulcrum End Date exits in SalesForce
    //if exists 
      //do nothing
    // else 
      // if endDate === "NA" 
        // endDate = startDate + 3 months
      // update End Date
    //Update Fulcrum Student Progress
  // else 
    //add new record with all the fields



  })
  .error(function(e) {
      console.log('SalesForce login failed');
      reject(e);
  }); 




// //Create a new student
// var student = new Student(connection, null, studentProperties)
// .then(function(student) {
//   // Do work with student
//   console.log(student);
// })

// student.update({FirstName: 'Joe'})
// .then(function(response) {
//   console.log(res.success); // true or false
//   // Response will also include the student properties
// });



//--------------------------------------

// var Student = SFConnect.getStudent();
// console.log('STUDENT <<<<<<<<<<<<<<', Student);
 

// var validString = "Your typeform Fulcrum Checkout has a new response:  First name Fulcrum  Last name Test  Email fulcrum.mentors@reactorcore.com  Github fulcrumtest  DISCOUNT  I agree to the Terms and Conditions Yes  promotion   utm_campaign   utm_content   utm_medium   utm_source   utm_term     === FIRST:Fulcrum/FIRST LAST:Test/LAST EMAIL:fulcrum.mentors@reactorcore.com/EMAIL GITHUB:fulcrumtest/GITHUB PHONE:5555555555/PHONE ===";

// salesforce.addStudent(validString)
// .then(function(salesforceData) {
//   console.log('salesforceData>>>>>>>>', salesforceData);
//   done();
// });

