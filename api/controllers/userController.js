'use strict';
var mongoose = require('mongoose'),
  User = mongoose.model('Users'),
  jwt = require('jsonwebtoken'),
  error = require('../utils/error');
  /*apn = require('apn'),
  options = {
    token: {
      key: "path/to/APNsAuthKey_XXXXXXXXXX.p8",
      keyId: "key-id",
      teamId: "developer-team-id"
    },
    production: false
  },
  apnProvider = new apn.Provider(options);
  */

exports.update_password = function(req, res, next){
  User.findById(req.params.userId, function(err, user) {
    if (err)
      return error.error(err.message,res);
    //user.email = req.body.email;
    user.password = req.body.password;
    User.save(user, function(err){
      if (err)
        return error.error(err.message,res);
      res.json("Settings Updated\n");
    });
    
  });
}

exports.poke = function (req,res,next){
  User.findById(req.params.userId, function(err, sender) {
    if (err)
      return error.error(err.message,res);
    if (!sender.validPair)
      return error.error("Need to be paired");
    User.findById(sender.userPaired, function(err, receiver) {
      if (err)
        return error.error(err.message,res);
       /*
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = {'messageFrom': 'John Appleseed'};
        note.topic = "<your-app-bundle-id>";

        apnProvider.send(note, deviceToken).then( (result) => {
          // see documentation for an explanation of result
        });*/

      res.json("Request Sent\n");
    });
  });
};

exports.pair = function (req,res,next){
  User.findById(req.params.senderId, function(err, sender) {
    if (err)
      return error.error(err.message,res);
    User.findById(req.body.receiverId, function(err, receiver) {
      if (err)
        return error.error(err.message,res);
      if (!receiver || (receiver.userPaired && receiver.userPaired != req.params.senderId))
        return error.error("The user is already paired",res);
      /*
        var note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 3;
        note.sound = "ping.aiff";
        note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
        note.payload = {'messageFrom': 'John Appleseed'};
        note.topic = "<your-app-bundle-id>";

        apnProvider.send(note, deviceToken).then( (result) => {
          // see documentation for an explanation of result
        });*/

      sender.userPaired = req.body.receiverId;
      sender.save(sender, function(err){
        if (err)
          return error.error(err.message,res);
        res.json("Request Sent\n");
      });
    });
  });
};

exports.ack_pair = function (req,res,next){
  User.findById(req.params.receiverId, function(err, receiver) {
    if (err)
      return error.error(err.message,res);
    User.findById(req.body.senderId, function(err, sender) {
      if (err)
        return error.error(err.message,res);
      if (!sender || (sender.userPaired && sender.userPaired != req.params.receiverId))
        return error.error("The user is no longer available",res);
      
      sender.userPaired = req.params.receiverId;
      sender.validPair = true;
      receiver.userPaired = req.body.senderId;
      receiver.userPaired = true;

      sender.save(sender, function(err){
        if (err)
          return error.error(err.message,res);
        receiver.save(receiver, function(err){
          if (err)
            return error.error(err.message,res);
          res.json("Paired\n");
        });
      });
    });
  });
};

exports.delet_pair = function (req,res,next){
  User.findById(req.params.userId, function(err, user) {
    if (err)
      return error.error(err.message,res);
    user.userPaired = null;
    user.validPair = false;
    user.save(user, function(err){
      if (err)
        return error.error(err.message,res);
      res.json("Deleted\n");
    });
  });
};

exports.search = function (req,res,next){
  User.find({
    'email' : { '$regex' : req.body.email, '$options' : 'i' }
  }, function(err, users) {
    if (err)
      return error.error(err.message,res);
    res.json(users);
  });
};

exports.get_user = function(req, res, next) {
    User.findById(req.params.userId, function(err, user) {
    if (err)
      return error.error(err.message,res);
    res.json(user);
  });
};

exports.delete_user = function(req, res, next) {
    User.remove({
    _id: req.params.userId
  }, function(err, user) {
    if (err)
      return error.error(err.message,res);
    res.json({ message: 'User successfully deleted' });
  });
};