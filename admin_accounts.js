const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')
const crypto       = require('crypto');

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
                              'CREATE TABLE account_student (STUDENTID INTEGER PRIMARY KEY, PASSWORDHASH VARCHAR(255), FAILCOUNT INTEGER, LOCKOUT BOOLEAN, CONSTRAINT myaccountstudentfkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
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

  
  
  
  adminoverwritestudacctsubmitfunc: function(req, res)  {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          if (err)
          {
              res.render('admin_pages/adminresult', {myresults: "adminoverwritestudacctsubmitfunc form.parse ERROR = " + err} );
              return;
          }
          else
          { //good
             console.log("fields = " + JSON.stringify(fields));
             console.log("files = " + JSON.stringify(files));
             var studentID = fields.studentID_name[0];
             var firstname = fields.firstname_name[0];
             var lastname  = fields.lastname_name[0];
             var submit    = fields.submit_name[0];
             var adminbool = false;
             if (fields.adminbool_name[0] === "true")
                  adminbool = true;

             if (submit === "YES")
                  res.render('admin_pages/studentacctinsert', { studentID:studentID, firstname:firstname, lastname:lastname, adminbool:adminbool });
             else {
                  if (adminbool)
                      res.render('admin_pages/adminhome');
                  else
                      res.render('pages/student_home', {studentID: studentID, firstname: firstname, lastname: lastname} );
             }
          }//good
      })//form.parse
  }, //adminoverwritestudacctsubmitfunc
  
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
                          var stmts  = "DELETE FROM account_student WHERE STUDENTID=" + studentID + ";";
                              stmts += "INSERT INTO account_student (STUDENTID, PASSWORDHASH, FAILCOUNT, LOCKOUT) VALUES (" + studentID + ", '" + passwordhash + "', 0, FALSE);";
                          console.log(stmts);
                          const Res = await client.query(stmts);
                          resultstr = 'admininsertstudacctsubmitfunc Res = ' + JSON.stringify(Res);
                        } catch (err) {
                            resultstr = 'admininsertstudacctsubmitfunc ERROR = ' + err;
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
                  passwordhash = db_credential.hashHmacJs('sha256', password, 'nodejs-pg-test');
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
