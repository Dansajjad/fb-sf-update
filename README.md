# Getting-started

Fulcrum app to connect with Firebase and update Salesforce fields.
App updates Fulcrum end date and Fulcrum progress. 


## Running Locally

```sh
$ git clone the repo # or clone your own fork
$ cd into the cloned directory
$ npm install
```

Before you can start your app: 
You will need to create a config file named `config.js` in the root directory to provide environment variables for development/testing. 

You will also need to create a file named `testStudents.json` in the root directory to test the application. 

```sh 
$ npm start
```


Your app should now be running on [localhost:3000](http://localhost:3000/).

## Initiating Salesforce Update
Visiting the link below will start the update process. You can keep track of the progress in your console. 

To update visit link [update](http://localhost:3000/update)
