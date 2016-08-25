//----------------Connect with (firebase dev environment)---------------------------
const http = require('http');
const request = require("request");
const fs = require('fs');
const parseJSON = require('./helpers.js');
const testStudents = require('./testStudents'); //dummy students
const token = require('./firebaseToken');

let baseUrl;

if(process.env.NODE_ENV !== 'production') {
  const config = require('./config.js')();
  baseUrl = config.firebase.FIREBASE_URL; 
} else {
  baseUrl = process.env.FIREBASE_URL;
}

const url = baseUrl + 'students/.json' + "?auth=" + token;
console.log(`>>>> Node Env: ${process.env.NODE_ENV} \nurl : ${baseUrl}`);

function getDataAndParse(cb) {//Retrieve data from Firebase & parse
  var stream = request(url).pipe(fs.createWriteStream('./studentsRaw.json'));

  stream.on('finish', function () {//after stream complete call function parseJSON
    parseJSON(function(parsedJSON) {//parses 'studentsRaw.json'
      fs.writeFile('./studentsParsed.json', parsedJSON, function(err) {//parsed data is written to file
        if(err) console.log(err);
        else {
          console.log('\nWrite to file "studentsParsed.json" complete. \nUpdating Salesforce next!\n')
          cb(testStudents); //do something to data in the parsed file
        }
      });//fs.writeFile
    });//parseJSON
  });//stream.on(finish)
}//getDataAndParse

module.exports = getDataAndParse;

//-----------------------------------------------------------------------Notes
/*
This module: 
  - retrieves firebase token from the firebaseToken module
  - connects with firebase depending on dev/production env
  - writes all the student data from firebase to 'studentsRaw.json'
  - upon completion of the write to studentsRaw, calls parseJSON
    - parseJSON parses the file, passes the parsed data to fs.writeFile
    - fs.writeFile writes data to studentsParsed.json
  - upon completion of write to studentsParsed.json, calls updateSalesforce
    - updateSalesforce updates the parsed students based on contactId in salesforce (updates end date & progress)
    
*/