require('dotenv').config();
import express from 'express';
import path from 'path';
import chalk from 'chalk';
import routes from './routes';
import oauthroutes from './routes/oath';
import { configurationRoutes } from './routes/configuration';
import firebase from 'firebase/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAbxaEk-eim7Y7jR8Cuv1mt_qk_v8Jg-O8',
    authDomain: 'integration-database-5dfe7.firebaseapp.com',
    databaseURL: 'https://integration-database-5dfe7-default-rtdb.firebaseio.com',
    projectId: 'integration-database-5dfe7',
    storageBucket: 'integration-database-5dfe7.appspot.com',
    messagingSenderId: '1001945617105',
    appId: '1:1001945617105:web:b32f8885a9d9e5224febf0',
    measurementId: 'G-VDBF663K1R',
};
firebase.initializeApp(firebaseConfig);

import webhooks from './routes/webhooks';

// constants
const PORT = process.env.PORT || 8000;

// configure
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// dynamic routes
app.use(routes);
app.use(oauthroutes);
app.use(configurationRoutes);
app.use(webhooks);

// static routes
app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
app.get('*', (_, res) => {
    res.redirect('/');
});

// launch
app.listen(PORT, () =>
    console.log(chalk.bold('SaaSquatch-HubSpot') + ' integration listening on port ' + chalk.blue.bold(PORT)),
);
