'use strict';

var url = require('url');
var _ = require('lodash');

module.exports = function(req, res, next){
  var path = url.parse(req.url).pathname;
  var reg = /[0-9a-fA-F]{24}/;
  var urls = ['/', '/register', '/login', '/items'];

  if(_.contains(urls, path)){
    next();
  }else if(path.slice(0,7) === '/items/' && reg.test(path)){
    next();
  }else{
    if(req.session.userId){
      next();
    }else{
      res.redirect('/');
    }
  }
};
