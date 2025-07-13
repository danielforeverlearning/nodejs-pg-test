
const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

const connectobj   = {
                                    user: 'garagedb_i5vo_user', // e.g., 'postgres'
                                    host: 'dpg-d1p3n83ipnbc73fk1qk0-a',
                                    database: 'garagedb_i5vo', // The database you created
                                    password: 'TTMNPyqcxBv2Gf3WwmBhAlnsLx3M40ek',
                                    port: 5432,
                     };


module.exports = {

  studenttablecreatefunc: function(req, res) {
          async function connectAndCreate() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE student (ID SERIAL PRIMARY KEY, FIRSTNAME VARCHAR(255), LASTNAME VARCHAR(255), EMAIL VARCHAR(255), PHONEAREACODE INT, PHONENUMBER INT);'
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

  studenttabledropfunc: function(req, res) {
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: drop table
                          const dropRes = await client.query(
                              'DROP TABLE student;'
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
  }
}; //module.exports

