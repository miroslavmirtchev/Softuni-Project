// importing packages
const express = require('express');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');

// firebase admin setup
let serviceAccount = require(path.join(__dirname,"clothing-site-b85f5-firebase-adminsdk-krhrz-6e08f768f3"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();


//routes
//home route
app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
})

//signup route
app.get('/signup', (req, res) => {
  res.sendFile(path.join(staticPath, "signup.html"));
})

// login route
app.get('/login', (req, res) => {
  res.sendFile(path.join(staticPath, "login.html"));
})

app.post('/login', (req, res) => {
  let { email, password } = req.body;

  if(!email.length || !password.length){
      return res.json({'alert': 'fill all the inputs'})
  }

  db.collection('users').doc(email).get()
    .then(user => {
        if(!user.exists){ // if email does not exists
            return res.json({'alert': 'log in email does not exists'})
        } else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller,
                    })
                } else{
                    return res.json({'alert': 'password is incorrect'});
                }
            })
        }
    })
})

// seller route
app.get('/seller', (req, res) => {
  res.sendFile(path.join(staticPath, "seller.html"));
})