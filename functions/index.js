const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express');
const app = express()

admin.initializeApp();


const config = {
    apiKey: "AIzaSyAg3a5CzmoEmLNWCq8a1Ak_kGaBV56Hyd4",
    authDomain: "socialape-c71ad.firebaseapp.com",
    databaseURL: "https://socialape-c71ad.firebaseio.com",
    projectId: "socialape-c71ad",
    storageBucket: "socialape-c71ad.appspot.com",
    messagingSenderId: "755815002638",
    appId: "1:755815002638:web:d7203169786ba46a1c425f",
    measurementId: "G-4JCLSC8ZHM"
}


const firebase = require('firebase')
firebase.initializeApp(config)

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

// signup route
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }
    //validate data
 firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(data => {
        return res.status(201).json({ message: `user ${data.user.uid} signed up successfully!`})
    })
    .catch(err => {
        console.error(err)
        return res.status(500).json({ error: err.code })
    })
})

exports.api = functions.https.onRequest(app);