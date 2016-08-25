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

app.get('/update', function(request, response) {
  console.log(`Receiving a get reqeuest for the route: ${request.path}`);
  getDataAndParse(updateSalesforce); //retrieve data from FB, parse data, update SF
  response.end('<h1>Your request to update has been submitted</h1>');  
})

app.listen(app.get('port'), function() {
  console.log(`Node app is running on port', ${app.get('port')} in ${process.env.NODE_ENV} mode`);
});


// (function () { //IIFE that keeps pulling data from FB, parses, and saves every 5s
//   let calledTimes = 0;
//   setInterval(function () {
//     async.series([getDataAndParse, updateSalesforce]); 

//     // getDataAndParse();
//     calledTimes++;
//     console.log(`\n The function has been called ${calledTimes} times.`)
//   }, 5000);
// })(); 


// updateSalesforce();

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