const functions = require('firebase-functions');
const admin = require('firebase-admin')
const firebase = require('firebase')
const app = require('express')();
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

const db = admin.firestore()

app.get('/screams', (req, res) => {
   db
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
      db
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

app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }
    //validate data
let token, userId;     
db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
        if(doc.exists) {
            return res.status(400).json({ handle: 'this handle is already taken' })
        } else {
            return firebase.auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then(data => {
        userId = data.user.uid
        return data.user.getIdToken()
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        }
    db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
        return res.status(201).json({ token })
    })
    .catch(err => {
        console.error(err);
        if(err.code === 'auth/email-already-in-use') {
            return res.status(400).json({ email: 'email is already in use' })
        } else {
            return res.status(500).json({ error: err.code })
        }
    })
})

exports.api = functions.https.onRequest(app);