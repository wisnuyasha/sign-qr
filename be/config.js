const firebase = require('firebase/compat/app');
require('firebase/compat/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAqtYkrPj213tnJgcPJWI9WRfgqiL3P5QA",
    authDomain: "qr-sign-b05ab.firebaseapp.com",
    projectId: "qr-sign-b05ab",
    storageBucket: "qr-sign-b05ab.appspot.com",
    messagingSenderId: "820043819852",
    appId: "1:820043819852:web:2e04928f9b7db9290cfde9"
  };
  
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();

  module.exports = { firebaseApp, db };