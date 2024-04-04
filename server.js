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