const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

var db_credential   = require('./db_credential');
const connectobj    = db_credential.myconnectobj();


module.exports = {

  

  studentacctcreatefunc: function(req,res) {
          async function connectAndCreate() {
                      var result;
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE account_student (STUDENTID INTEGER PRIMARY KEY, PASSWORDHASH VARCHAR(255), CONSTRAINT myaccountstudentfkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
                          );
                          result = 'createRes = ' + JSON.stringify(createRes);
                      } catch (err) {
                          result = 'Error connecting or creating table = ' + err;
                      } finally {
                          await client.end();
                          res.send(result);
                      }
          }
          connectAndCreate();
  }, //studentacctcreatefunc

  studentacctdropfunc: function(req,res) {
          var result;
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
              
                          // Example: drop table
                          const dropRes = await client.query(
                              'DROP TABLE account_student;'
                          );
                          result = 'dropRes = ' + JSON.stringify(dropRes);
                      } catch (err) {
                          result = 'Error connecting or dropping table security = ' + err;
                      } finally {
                          await client.end();
                          res.send(result);
                      }
          }
          connectAndDrop();
  }//studentacctdropfunc
  
}; //module.exports
