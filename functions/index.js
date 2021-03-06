const functions = require('firebase-functions');
const app = require('express')();
require('dotenv').config()

const FBAuth = require('./util/fbAuth')

const { getAllScreams, postOneScream } = require('./handlers/screams')

const { signup, login, uploadImage } = require('./handlers/users')


//Scream routes
app.get('/screams', getAllScreams)
//Post one scream
app.post('/scream', FBAuth, postOneScream);

//users routes
app.post('/signup', signup)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)



exports.api = functions.https.onRequest(app); 