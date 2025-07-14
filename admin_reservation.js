const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

var db_credential  = require('./db_credential');
const connectobj   = db_credential.connectobj;
/*****
const connectobj   = {
                                    user: , // e.g., 'postgres'
                                    host: ,
                                    database: , // The database you created
                                    password: ,
                                    port: 5432,
                     };
*****/

module.exports = {  

  reservationtablecreatefunc: function(req,res) {
          async function connectAndCreate() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE reservation (ID INTEGER PRIMARY KEY, STUDENTID INTEGER, LOCATION VARCHAR(255), MONTH INTEGER, DAY INTEGER, YEAR INTEGER, HOUR INTEGER, MINUTE INTEGER, CONSTRAINT myreservationtablefkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
                          );
                          var result = 'createRes = ' + JSON.stringify(createRes);
                          res.send(result);
                      } catch (err) {
                          var result = 'Error connecting or creating table = ' + err;
                          res.send(result);
                      } finally {
                          await client.end();
                          console.log('Disconnected from PostgreSQL.');
                      }
          }
          connectAndCreate();
  },

  reservationtabledropfunc: function(req,res) {
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: drop table
                          const dropRes = await client.query(
                              'DROP TABLE reservation;'
                          );
                          var result = 'dropRes = ' + JSON.stringify(dropRes);
                          res.send(result);
                      } catch (err) {
                          var result = 'Error connecting or dropping table = ' + err;
                          res.send(result);
                      } finally {
                          await client.end();
                          console.log('Disconnected from PostgreSQL.');
                      }
          }
          connectAndDrop();
  }//subscriptiontabledropfunc
  
}; //module.exports
