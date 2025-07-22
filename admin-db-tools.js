const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

var db_credential  = require('./db_credential');
const connectobj   = db_credential.myconnectobj();
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

  download_student_table_func: function(req,res) {
          async function connectAndRead() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE reservation (ID SERIAL PRIMARY KEY, STUDENTID INTEGER, FIRSTNAME VARCHAR(255), LASTNAME VARCHAR(255), LOCATION VARCHAR(255), MONTH INTEGER, DAY INTEGER, YEAR INTEGER, HOUR INTEGER, MINUTE INTEGER, CONSTRAINT myreservationtablefkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
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

          
          //connectAndRead();
  }//download_student_table_func

}; //module.exports
