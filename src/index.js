import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore/lite";
import reportWebVitals from "./reportWebVitals";

// const firebaseConfig = {
//   apiKey: "AIzaSyB7KER_GtqTVyhFnRveFNzU088RyK38wTI",
//   authDomain: "wagemanager-d9d38.firebaseapp.com",
//   projectId: "wagemanager-d9d38",
//   storageBucket: "wagemanager-d9d38.appspot.com",
//   messagingSenderId: "197692424711",
//   appId: "1:197692424711:web:b501f6b14d7b02b7eb20a2",
//   measurementId: "G-YFZ72SR02D",
// };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
