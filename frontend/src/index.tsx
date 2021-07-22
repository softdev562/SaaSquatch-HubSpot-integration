import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';
import history from "./types/history";
import {PenpalContextProvider} from '@saasquatch/integration-boilerplate-react';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbxaEk-eim7Y7jR8Cuv1mt_qk_v8Jg-O8",
  authDomain: "integration-database-5dfe7.firebaseapp.com",
  databaseURL: "https://integration-database-5dfe7-default-rtdb.firebaseio.com",
  projectId: "integration-database-5dfe7",
  storageBucket: "integration-database-5dfe7.appspot.com",
  messagingSenderId: "1001945617105",
  appId: "1:1001945617105:web:b32f8885a9d9e5224febf0",
  measurementId: "G-VDBF663K1R"
};
firebase.initializeApp(firebaseConfig);
ReactDOM.render(
	<Router history={history}>
    <PenpalContextProvider 
      loading={
        <p>Loading state</p>
      }
      fallback={
        <p>Fallback state</p>
      }>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PenpalContextProvider>
  	</Router>,
	document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
