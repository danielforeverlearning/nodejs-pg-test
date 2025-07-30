const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

var db_credential   = require('./db_credential');
const connectobj    = db_credential.myconnectobj();


function hashHmacJs(algo, data, key, raw_output = false) {
    const hmac = crypto.createHmac(algo, key);
    hmac.update(data);
    const digest = hmac.digest(raw_output ? 'binary' : 'hex');
    return digest;
}//hashHmacJs

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
                          result = 'Error connecting or creating account_student table = ' + err;
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
                          result = 'Error connecting or dropping account_student table = ' + err;
                      } finally {
                          await client.end();
                          res.send(result);
                      }
          }
          connectAndDrop();
  }, //studentacctdropfunc

  
  adminacctcreatefunc: function(req,res) {
          async function connectAndCreate() {
                      var result;
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE account_admin (ID SERIAL PRIMARY KEY, PASSWORDHASH VARCHAR(255), LOGIN VARCHAR(255));'
                          );
                          result = 'createRes = ' + JSON.stringify(createRes);
                      } catch (err) {
                          result = 'Error connecting or creating account_admin table = ' + err;
                      } finally {
                          await client.end();
                          res.send(result);
                      }
          }
          connectAndCreate();
  }, //adminacctcreatefunc

  adminacctdropfunc: function(req,res) {
          var result;
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
              
                          // Example: drop table
                          const dropRes = await client.query(
                              'DROP TABLE account_admin;'
                          );
                          result = 'dropRes = ' + JSON.stringify(dropRes);
                      } catch (err) {
                          result = 'Error connecting or dropping account_admin table = ' + err;
                      } finally {
                          await client.end();
                          res.send(result);
                      }
          }
          connectAndDrop();
  }, //adminacctdropfunc

  
  

  
  admininsertstudacctsubmitfunc: function(req, res)  {
      var password;
      var confirm;
      var studentID;
      var passwordhash;
      var resultstr;
      async function connectAndInsert() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          var insertstmt = "INSERT INTO account_student (STUDENTID, PASSWORDHASH) VALUES (" + studentID + ", '" + passwordhash + "');";
                          console.log(insertstmt);
                          const insertRes = await client.query(insertstmt);
                          resultstr = 'admininsertstudacctsubmitfunc insertRes = ' + JSON.stringify(insertRes);
                        } catch (err) {
                            resultstr = 'admininsertstudacctsubmitfunc INSERT INTO account_student ERROR = ' + err;
                        } finally {
                            await client.end();
                            res.render('admin_pages/adminresult', {myresults: resultstr} );
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("admininsertstudacctsubmitfunc form.parse ERROR = " + err);
             return;
          }
          else
          { //good
             console.log("fields = " + JSON.stringify(fields));
             console.log("files = " + JSON.stringify(files));
              
             password = fields.password_name[0];
             confirm = fields.confirm_name[0];
             studentID = fields.studentID_name[0];
             console.log("typeof password = " + typeof password);
             console.log("typeof confirm = " + typeof confirm);
             console.log("typeof studentID = " + typeof studentID);
             console.log('password="' + password + '" confirm="' + confirm + '" studentID=' + studentID);
             
             //validation checking
             if (password === confirm)
             {
                  passwordhash = hashHmacJs('sha256', password, 'nodejs-pg-test');
                  console.log("passwordhash = " + passwordhash);
                  connectAndInsert();
             }
             else
             {
                  var badstr = 'Sorry password and confirm must be exactly the same: ' + 'password="' + password + '" confirm="' + confirm + '"';
                  res.render('admin_pages/adminresult', {myresults: badstr} );
                  return;
             }
          }//good
      })//form.parse
  } //admininsertstudacctsubmitfunc
  
  
}; //module.exports
