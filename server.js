var express = require('express');
var app = express();
//------------------------------------------------
const getData = require('./functions').getFirebaseData;
const parseJSON = require('./functions').parseJSON;
const updateSalesforce = require('./updateSalesforce');
//------------------------------------------------

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  console.log(`Receiving a get reqeuest for the route: ${request.path}`);
  response.render('pages/index');
});

app.get('/update', function(request, response) {//hitting this route sets everything in motion
  console.log(`Receiving a get reqeuest for the route: ${request.path}`);
  
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

  //retrieve data from Firebase, parse data, update Salesforce
  getData(url)
  .then(parseJSON)
  .then(console.log)
  // .then(updateSalesforce)  //uncomment for production
  .catch(function (e) {
    console.log(e);
  }) 

  response.end('<h1>Your request to update has been submitted</h1>');  
})

app.listen(app.get('port'), function() {
  console.log(`Node app is running on port ${app.get('port')} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
