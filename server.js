var express = require('express');
var app = express();
//------------------------------------------------
var getDataAndParse = require('./retrieveParseFirebaseData');
var updateSalesforce = require('./updateSalesforce');
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
  getDataAndParse(updateSalesforce); //retrieve data from Firebase, parse data, update Salesforce
  response.end('<h1>Your request to update has been submitted</h1>');  
})

app.listen(app.get('port'), function() {
  console.log(`Node app is running on port', ${app.get('port')} in ${process.env.NODE_ENV} mode`);
});
