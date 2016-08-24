//----------------Connect with (firebase dev environment)---------------------------
const http = require('http');
const request = require("request");
const fs = require('fs');
const parseJSON = require('./helpers.js');
var testStudents = require('./testStudents'); //dummy students


let baseUrl;

if(process.env.NODE_ENV !== 'PROD') {
  const config = require('./config.js')();
  baseUrl = config.firebase.url; 
} else {
  baseUrl = process.env.FIREBASE_URL;
}

const url = baseUrl + 'students/.json'

function getDataAndParse(cb) {//Retrieve data from Firebase & parse
  var stream = request(url).pipe(fs.createWriteStream('./studentsRaw.json'));
  stream.on('finish', function () {//after stream complete send to parse fn
    parseJSON(function(data) {//cb to write data to a file after it is parsed
      fs.writeFile('./studentsParsed.json', data, function(err) {
        if(err) console.log(err);
        else {
          console.log('\nWrite complete. Updating Salesforce next!')
          cb(testStudents); //do something to the parsed file/data
        }
      });
    });
  });
}

module.exports = getDataAndParse;