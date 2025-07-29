const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable');

const PORT         = process.env.PORT || 5000;

const { Client }   = require('pg');

var db_credential = require('./db_credential');
const connectobj    = db_credential.myconnectobj();

module.exports = {
  
  securitytableinsertfunc: function(req, res)  {
      
  } //securitytableinsertfunc

  
};
