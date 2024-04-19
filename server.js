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

app.post('/seller', (req, res) => {
  let { name, about, address, number, tac, legit, email } = req.body;
  if(!name.length || !address.length || !about.length || number.length < 10 || !Number(number)){
      return res.json({'alert':'some inforamation(s) is/are invalid'});
  } else if(!tac || !legit){
      return res.json({'alert': 'you must agree to our terms and conditions'})
  } else{
      // update users seller status here.
      db.collection('sellers').doc(email).set(req.body)
      .then(data => {
          db.collection('users').doc(email).update({
              seller: true
          }).then(data => {
              res.json(true);
          })
      })
  }
})

// add product
app.get('/add-product', (req, res) => {
  res.sendFile(path.join(staticPath, "addProduct.html"));
})

app.get('/add-product/:id', (req, res) => {
  res.sendFile(path.join(staticPath, "addProduct.html"));
})

// get the upload link
app.get('/s3url', (req, res) => {
  generateUrl().then(url => res.json(url));
})

// add product
app.post('/add-product', (req, res) => {
  let { name, shortDes, des, images, sizes, actualPrice, discount, sellPrice, stock, tags, tac, email, draft, id } = req.body;

  // validation
  if(!draft){
    if(!name.length){
        return res.json({'alert': 'enter product name'});
    } else if(shortDes.length > 100 || shortDes.length < 10){
        return res.json({'alert': 'short description must be between 10 to 100 letters long'});
    } else if(!des.length){
        return res.json({'alert': 'enter detail description about the product'});
    } else if(!images.length){ // image link array
        return res.json({'alert': 'upload atleast one product image'})
    } else if(!sizes.length){ // size array
        return res.json({'alert': 'select at least one size'});
    } else if(!actualPrice.length || !discount.length || !sellPrice.length){
        return res.json({'alert': 'you must add pricings'});
    } else if(stock < 20){
        return res.json({'alert': 'you should have at least 20 items in stock'});
    } else if(!tags.length){
        return res.json({'alert': 'enter few tags to help ranking your product in search'});
    } else if(!tac){
        return res.json({'alert': 'you must agree to our terms and conditions'});
    } 
}

// add product
let docName = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}` : id;
db.collection('products').doc(docName).set(req.body)
.then(data => {
    res.json({'product': name});
})
.catch(err => {
    return res.json({'alert': 'some error occured. Try again'});
})
})