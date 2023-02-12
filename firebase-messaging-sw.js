import firebase from "firebase";

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyA_fUr0kLrUN_WIQRFd98SfnoKXxN5zotM",
    authDomain: "memosh-81256.firebaseapp.com",
    databaseURL: "https://memosh-81256-default-rtdb.firebaseio.com",
    projectId: "memosh-81256",
    storageBucket: "memosh-81256.appspot.com",
    messagingSenderId: "692838001332",
    appId: "1:692838001332:web:ed77ec564c72ae513b85e1",
    measurementId: "G-LMS0QMKHEL"
});

const messaging = firebase.messaging();