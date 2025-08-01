const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')
const crypto       = require('crypto');

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

  
  loginstudentsubmitfunc: function(req, res)  {
      var password;
      var email;
      var badstr;
      var goodquery;
      var query_result;
      async function querydb() {    
                        const client       = new Client(connectobj);
                        try {
                              await client.connect();
                              var stmt  = "SELECT * FROM student WHERE EMAIL='" + email + "';";
                              console.log(stmt);
                              query_result = await client.query(stmt);
                              console.log("query_result = " + JSON.stringify(query_result));
                              console.log("query_result.rows.length = " + query_result.rows.length);
                              if (query_result.rows.length == 0) {
                                   badstr = 'Sorry there is no student with email = ' + email;
                                   goodquery = false;
                              } 
                              else if (query_result.rows.length > 1) {
                                   badstr = 'wow ok, more than 1 student found with email = ' + email + ', that means i need to add validation code when creating student accounts on insert and update, need to repair code.';
                                   goodquery = false;
                              }
                              else
                                   goodquery = true;
                        } catch (err) {
                            goodquery = false;
                            badstr = 'loginstudentsubmitfunc ERROR = ' + err;
                        } finally {
                            await client.end();
                            if (goodquery)
                            {
                                 var checkpasswordhash = hashHmacJs('shs256', email, 'nodejs-pg-test');
                                 if (checkpasswordhash === query_result.rows[0].passwordhash)
                                      res.render('pages/result', {myresults: 'good password'} );
                                 else
                                      res.render('pages/result', {myresults: 'bad password'} );
                            }
                            else
                                 res.render('pages/result', {myresults: badstr} );
                        }
      }
    
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
