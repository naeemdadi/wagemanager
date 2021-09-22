import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB7KER_GtqTVyhFnRveFNzU088RyK38wTI",
  authDomain: "wagemanager-d9d38.firebaseapp.com",
  projectId: "wagemanager-d9d38",
  storageBucket: "wagemanager-d9d38.appspot.com",
  messagingSenderId: "197692424711",
  appId: "1:197692424711:web:b501f6b14d7b02b7eb20a2",
  measurementId: "G-YFZ72SR02D",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
