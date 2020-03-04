const functions = require('firebase-functions');
const admin = require('firebase-admin')
<<<<<<< HEAD
const firebase = require('firebase')
const express = require('express');
const app = express()
require('dotenv').config()

admin.initializeApp();

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,    
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID, 
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
}



firebase.initializeApp(config)
=======

admin.initializeApp();

const express = require('express');
const app = express()

>>>>>>> parent of d1c5ac7... user authentification added

app.get('/screams', (req, res) => {
    admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
        .then(data => {
            let screams =[];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    ...doc.data()
                });
            })
            return res.json(screams)
        })
        .catch(err => console.error(err))
})

app.post('/scream', (req, res) => {
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };
    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc => {
            res.json({message: `document ${doc.id} created successfully`})
        })
        .catch(err => {
            res.status(500).json({ error: 'something went wrong!'})
            console.error('New scream error',err)
        });
});

exports.api = functions.https.onRequest(app);