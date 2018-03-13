'use strict';
var mongoose = require('mongoose'),
  error = require('../utils/error'),
  User = mongoose.model('Users'),
  config = require('../../config'),
  jwt = require('jsonwebtoken');


exports.create_user = function(req, res, next) {
    // confirm that user typed same password twice
    if (req.body.password !== req.body.passwordConf) 
      return error.error('Passwords do not match.',res);
    
    if (req.body.email &&
      req.body.password &&
      req.body.name &&
      req.body.passwordConf) {
      var userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
      }
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) 
          return error.error(err.message,res);
        else {
          var token = generateAuth(req.body.email,req.body.password)
          return res.json({ success: true, message: token, userid: user._id});
        }
      });
    } else 
      return error.error('Missing values',res);
};

exports.create_user_facebook = function(req, res, next) {
    // confirm that user typed same password twice
    if (req.body.email &&
      req.body.facebook &&
      req.body.name ) {
      var userData = {
        email: req.body.email,
        name: req.body.name,
        facebookToken: req.body.facebookToken
      }
      //use schema.create to insert data into the db
      User.create(userData, function (err, user) {
        if (err) 
          return error.error(err.message,res);
        else {
          var token = generateAuth(req.body.email,"None")
          return res.json({ success: true, message: token, userid: user._id});
        }
          
      });
    } else 
      return error.error('Missing values',res);
};

exports.authenticate_user = function(req, res, next) {
    if (!req.body.email || !req.body.password || req.body.password == "None"){
      return error.error('Credential are missing or invalid',res);
    }
    User.authenticate(req.body.email,req.body.password, function(err,user){

      if (!user)
        return error.error('Wrong Credential',res);
      else{
        var token = generateAuth(req.body.email,req.body.password)
        return res.json({ success: true, message: token, userid: user._id});
      }

    });
    
};

exports.authenticate_user_facebook = function(req, res, next) {
  if (!req.body.email){
    return error.error('Credential are missing',res);
  }
  User.authenticate_facebook(req.body.email, function(err,user){
    if (!user)
      return error.error('Wrong Credential',res);
    else{
      var token = generateAuth(req.body.email,"None")
      return res.json({ success: true, message: token, userid: user._id});
    }

  });
  
};

function generateAuth(email,pass){
  const payload = {
    data: email+pass
  };
  var token = jwt.sign(payload, config.secret, {
    expiresIn: "30 days"
  });
  return token
}
