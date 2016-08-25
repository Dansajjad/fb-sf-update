const Firebase = require('firebase');
const FirebaseTokenGenerator = require('firebase-token-generator');

let firebaseUrl;
let firebaseSecret;

if(process.env.NODE_ENV !== 'production') {
  const config = require('./config.js')();
  firebaseUrl = config.firebase.FIREBASE_URL;
  firebaseSecret = config.firebase.FIREBASE_SECRET;
} else {
  firebaseUrl = process.env.FIREBASE_URL;
  firebaseSecret = process.env.FIREBASE_SECRET;  
}



var firebase = new Firebase(firebaseUrl);
var tokenGenerator = new FirebaseTokenGenerator(firebaseSecret);
var token = tokenGenerator.createToken({ uid: 'admin' });

module.exports = token;