var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

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
const config = require('./config.js')();

var baseUrL = config.firebase.url || process.env.FIREBASE_URL;
const url = baseUrl + 'students/.json'


function getDataAndParse() {
  var stream = request(url).pipe(fs.createWriteStream('./studentsRaw.json'));
  stream.on('finish', function () {
    parseJSON(function(data) {
      fs.writeFile('./studentsParsed.json', data, function(err) {
        if(err) console.log(err);
        else console.log('>>>>>>>>>>Write complete')
      });
    });
  });
}


(function () {
  let calledTimes = 0;
  setInterval(function () {
    getDataAndParse();
    calledTimes++;
    console.log(`\n The function has been called ${calledTimes} times.`)
  }, 5000);
})(); 

