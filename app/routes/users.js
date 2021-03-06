'use strict';

var User = require('../models/user');
var Item = require('../models/item');

exports.auth = function(req, res){
  res.render('users/auth', {title: 'User Sign Up'});
};

exports.register = function(req, res){
  var user= new User(req.body);
  user.hashPassword(function(){
    user.addPic(req.files.pic.path, function(){
      user.insert(function(){
        if(user._id){
          user.sendRegistrationEmail(function(){
            res.redirect('/');
          });
        }else{
          res.redirect('/register');
        }
      });
    });
  });
};

exports.destroy = function(req, res){
  var userId = req.params.id;
  User.deleteById(userId, function(count){
    if(count === 1){
      Item.deleteAllByUserId(userId, function(){
        res.redirect('/');
      });
    }
  });
};
/*
exports.update = function(req, res){
  var user = new User(req.body);
  user.update(function(){
    //do we want a user profile page
    res.redirect('/');
  });
};
*/
exports.login = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id.toString();
        req.session.save(function(){
          res.send({success:true});
        });
      });
    }else{
      req.session.destroy(function(){
        res.send({success:false});
      });
    }
  });
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.show = function(req, res){
  User.findById(req.params.id, function(showUser){
    Item.findByUserId(req.params.id, function(items){
      res.render('users/show', {showUser:showUser, items:items});
    });
  });
};
