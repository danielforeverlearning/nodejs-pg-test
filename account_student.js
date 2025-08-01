const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')
const crypto       = require('crypto');

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

var db_credential  = require('./db_credential');
const connectobj   = db_credential.myconnectobj();

async function update_lockout_failcount_studacct(mynewfailcount, studentID) {
    var updatestmt;
    if (mynewfailcount==0)
         updatestmt = "UPDATE account_student SET FAILCOUNT = 0, LOCKOUT = FALSE WHERE STUDENTID = " + studentID + ";";
    else if (mynewfailcount >= 3)
         updatestmt = "UPDATE account_student SET FAILCOUNT = " + mynewfailcount + ", LOCKOUT = TRUE WHERE STUDENTID = " + studentID + ";";
    else
         updatestmt = "UPDATE account_student SET FAILCOUNT = " + mynewfailcount + ", LOCKOUT = FALSE WHERE STUDENTID = " + studentID + ";";

    const client = new Client(connectobj);
    var updateresult;
    try {
        await client.connect();
        updateresult = await client.query(updatestmt);
    }
    catch (err) {
        await client.end();
        var badstr = "FAILED TO ACCESS DATABASE, NO LOGGING IN!, ERROR=" + err;
        res.render('pages/result', {myresults: badstr} );
        return;
    }

    if (mynewfailcount==0)
         res.render('pages/result', {myresults: "good login"} );
    else if (mynewfailcount >= 3)
         res.render('pages/result', {myresults: "bad login, locked out"} );
    else
         res.render('pages/result', {myresults: "bad login, fail count = " + mynewfailcount} );
}//update_lockout_failcount_studacct


module.exports = {

  loginstudentsubmitfunc: function(req, res)  {
      var password;
      var email;
      var badstr;
      var query_result;
      var studentID;
      var goodquery;
      async function querydb() {    
                        const client       = new Client(connectobj);
                        //query student
                        try {
                              await client.connect();
                              var stmt  = "SELECT * FROM student WHERE EMAIL='" + email + "';";
                              query_result = await client.query(stmt);
                              console.log("query_result = " + JSON.stringify(query_result));
                              console.log("query_result.rows.length = " + query_result.rows.length);
                              if (query_result.rows.length == 0) {
                                   await client.end();
                                   badstr = 'Sorry there is no student with email = ' + email;
                                   res.render('pages/result', {myresults: badstr} );
                                   return;
                              } 
                              else if (query_result.rows.length > 1) {
                                   await client.end();
                                   badstr = 'wow ok, more than 1 student found with email = ' + email + ', that means i need to add validation code when creating student accounts on insert and update, need to repair code.';
                                   res.render('pages/result', {myresults: badstr} );
                                   return;
                              }
                              else
                                   studentID = query_result.rows[0].id;
                        } catch (err) {
                            await client.end();
                            badstr = 'loginstudentsubmitfunc ERROR = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                            return;
                        }

                        //query account_student
                        try {
                              var stmt  = "SELECT * FROM account_student WHERE STUDENTID=" + studentID + ";";
                              query_result = await client.query(stmt);
                              console.log("query_result = " + JSON.stringify(query_result));
                              console.log("query_result.rows.length = " + query_result.rows.length);
                              if (query_result.rows.length == 0) {
                                   badstr = 'Sorry there is no student account with STUDENTID=' + studentID;
                                   goodquery = false;
                              } 
                              else if (query_result.rows.length > 1) {
                                   badstr = 'wow ok, more than 1 student found with email = ' + email + ', that means i need to add validation code when creating student accounts on insert and update, need to repair code.';
                                   goodquery = false;
                              }
                              else if (query_result.rows[0].lockout) {
                                   badstr = 'Sorry, account for student with email=' + email + ' is locked-out due to too many failed password attempts. Please contact a sensei/professor/admin for help.';
                                   goodquery = false;
                              }
                              else
                                   goodquery = true;
                        } catch (err) {
                            goodquery = false;
                            badstr = 'loginstudentsubmitfunc ERROR = ' + err;
                        } finally {
                            await client.end();
                            if (goodquery) {
                                 var checkpasswordhash = db_credential.hashHmacJs('sha256', password, 'nodejs-pg-test');
                                 console.log("checkpasswordhash = " + checkpasswordhash);
                                 console.log("typeof checkpasswordhash = " + typeof checkpasswordhash);
                                 console.log("query_result.rows[0].passwordhash = " + query_result.rows[0].passwordhash);
                                 console.log("typeof query_result.rows[0].passwordhash = " + typeof query_result.rows[0].passwordhash);
                                 if (checkpasswordhash === query_result.rows[0].passwordhash)
                                      update_lockout_failcount_studacct(0, studentID);
                                 else {
                                      var mynewfailcount = query_result.rows[0].failcount + 1;
                                      update_lockout_failcount_studacct(mynewfailcount, studentID);
                                 }
                            }
                            else
                                 res.render('pages/result', {myresults: badstr} );
                        }
      }//querydb
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          if (err)
          {
             res.send("loginstudentsubmitfunc form.parse ERROR = " + err);
             return;
          }
          else
          { //good
             console.log("fields = " + JSON.stringify(fields));
             console.log("files = " + JSON.stringify(files));
              
             password = fields.password_name[0];
             email = fields.email_name[0].toLowerCase();
             
             querydb();
          }//good
      })//form.parse
  } //loginstudentsubmitfunc
  
  
}; //module.exports
