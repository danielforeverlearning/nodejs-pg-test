
const express      = require('express');
const path         = require('path');
var   https        = require('https');
const formidable   = require('formidable');

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

var db_credential   = require('./db_credential');
const connectobj    = db_credential.myconnectobj();

module.exports = {

  studentviewfunc: function(req,res,sortorder)  {
            async function connectAndRead() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();

                          var selectstmt = 'SELECT * FROM student';
                          if (sortorder == 100)
                               selectstmt += ' ORDER BY ID ASC';
                          else if (sortorder == 200)
                               selectstmt += ' ORDER BY ID DESC';
                          else if (sortorder == 10)
                               selectstmt += ' ORDER BY FIRSTNAME ASC';
                          else if (sortorder == 20)
                               selectstmt += ' ORDER BY FIRSTNAME DESC';
                          else if (sortorder == 1)
                               selectstmt += ' ORDER BY LASTNAME ASC';
                          else if (sortorder == 2)
                               selectstmt += ' ORDER BY LASTNAME DESC';
                          
                          const result = await client.query(selectstmt);
                          //console.log(" result = " + JSON.stringify(result));
                          res.render('admin_pages/studentview', {results: result.rows, sortorder: sortorder} );
                        } catch (err) {
                            var errormsg = " err = " + err;
                            //console.log(errormsg);
                            res.render('pages/result', {myresults: errormsg} );
                        } finally {
                            await client.end();
                        }
            }
            connectAndRead(); 
  },

  deletefunc: function(req, res, studentID) {
      async function connectAndDelete() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const deleteRes = await client.query("DELETE FROM subscription WHERE STUDENTID = " + studentID + "; DELETE FROM student WHERE ID = " + studentID + ";");
                          var resultstr = 'student subscription deletefunc = ' + JSON.stringify(deleteRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'student subscription deletefunc, ERROR = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                        }
      }
      connectAndDelete(); 
  },

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

