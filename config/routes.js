'use strict';

module.exports.routes = {

  '/templates/*': {
    controller:'TemplatesController',
    action:'render'
  },

  '/cordova.js':{
    controller:'TemplatesController',
    action:'cordovajs'
  }

};
