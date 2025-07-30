const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable');

const PORT         = process.env.PORT || 5000;

const { Client }   = require('pg');

var db_credential = require('./db_credential');
const connectobj    = db_credential.myconnectobj();

var securitytable = require('./securitytable');

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
                          res.render('pages/studentview', {results: result.rows, sortorder: sortorder} );
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

  studenttableinsertfunc: function(req, res)  {
      var firstname;
      var lastname;
      var email;
      var phoneareacode;
      var phonenumber;
      async function connectAndInsert() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          //console.log('INSERT INTO student Connected to PostgreSQL!');
                          var insertstmt = "INSERT INTO student (FIRSTNAME, LASTNAME, EMAIL, PHONEAREACODE, PHONENUMBER) VALUES ('" + firstname + "', '" + lastname + "', '" + email + "', " + phoneareacode + ", " + phonenumber + ");";
                          console.log(insertstmt);
                          const insertRes = await client.query(insertstmt);
                          var resultstr = 'insertRes = ' + JSON.stringify(insertRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'INSERT INTO student ERROR = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                            //console.log('INSERT INTO student Disconnected from PostgreSQL.');
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("studenttableinsertfunc err = " + err);
          }
          else
          { //good
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             firstname = fields.firstname_name;
             lastname = fields.lastname_name;
             email = fields.email_name;
             phoneareacode = fields.phoneareacode_name;
             phonenumber = fields.phonenumber_name;

             //validation checking
             if (phoneareacode < 0 || phoneareacode > 999)
             {
                  var badstr = 'Sorry phone area code must be between 000 and 999';
                  res.render('pages/result', {myresults: badstr} );
             }
             else 
             {
                 console.log("typeof email = " + typeof email);
                 var emailstr = JSON.stringify(email);
                 console.log("emailstr = " + emailstr);
               
                 var first_at = emailstr.indexOf("@");
                 var last_at = emailstr.lastIndexOf("@");
               
                 console.log("first_at = " + first_at);
                 console.log("last_at = " + last_at);

                 if (first_at == -1)
                 {
                      var badstr = 'Sorry email must have 1 @ character, for example darthvader@gmail.com';
                      res.render('pages/result', {myresults: badstr} );
                 }
                 else if (first_at != last_at)
                 {
                      var badstr = 'Sorry email must have only 1 @ character, for example darthvader@gmail.com but you put more than 1 @ character';
                      res.render('pages/result', {myresults: badstr} );
                 }
                 else
                      connectAndInsert(); 
             }
          }//good
      })//form.parse
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


  updatefunc: function(req, res, studentID) {
    
      async function connectAndSelectByID() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const selectIDres = await client.query("SELECT * FROM student WHERE ID = " + studentID + ";");
                          console.log("selectIDres = " + JSON.stringify(selectIDres));
                          console.log("selectIDres.rows.length = " + selectIDres.rows.length);
                          if (selectIDres.rows.length  != 1)
                          {
                              var badstr = 'Sorry there is no row in table student with ID = ' + studentID + ', if you want to update a row the ID must be good.';
                              res.render('pages/result', {myresults: badstr} );
                          }
                          else
                              res.render('pages/studenttableupdate2', {existingval: selectIDres.rows[0]} );
                        } catch (err) {
                              var badstr = 'updatefunc ID = ' + studentID + ', ERROR = ' + err;
                              res.render('pages/result', {myresults: badstr} );
                        } finally {
                              await client.end();
                              console.log('studenttableupdateIDfunc ID = ' + studentID + ', Disconnected from PostgreSQL.');
                        }
      }
      connectAndSelectByID();
  },


  studenttableupdate3func: function(req, res) {
      var primarykeyID;
      var firstname;
      var lastname;
      var email;
      var phoneareacode;
      var phonenumber;
      var dbgoodresult;
      var badstr;
      var updateRes;
      async function connectAndUpdate() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          //console.log('studenttableupdate3func Connected to PostgreSQL!');
                          var stmt = "UPDATE student SET FIRSTNAME = '" + firstname + "', LASTNAME = '" + lastname + "', EMAIL = '" + email + "', PHONEAREACODE = " + phoneareacode + ", PHONENUMBER = " + phonenumber + " WHERE ID = " + primarykeyID + ";";
                          console.log(stmt);
                          updateRes = await client.query(stmt);
                          dbgoodresult = true;
                        } catch (err) {
                            badstr = 'UPDATE student ID = ' + primarykeyID + ', err = ' + err;
                            dbgoodresult = false;
                        } finally {
                            await client.end();
                            //console.log('studenttableupdate3func Disconnected from PostgreSQL.');
                            if (dbgoodresult) {
                                 //var resultstr = 'updateRes = ' + JSON.stringify(updateRes);
                                 //res.render('pages/result', {myresults: resultstr} );
                                 securitytable.securityReadByStudentID(res, primarykeyID, firstname, lastname);
                            }
                            else
                                 res.render('pages/result', {myresults: badstr} );
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("studenttableupdate3func err = " + err);
          }
          else
          { //good
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             primarykeyID = fields.primarykey_name;
             firstname = fields.firstname_name;
             lastname = fields.lastname_name;
             email = fields.email_name;
             phoneareacode = fields.phoneareacode_name;
             phonenumber = fields.phonenumber_name;

             //validation checking
             if (phoneareacode < 0 || phoneareacode > 999)
             {
                  var badstr = 'Sorry phone area code must be between 000 and 999';
                  res.render('pages/result', {myresults: badstr} );
             }
             else 
             {
                 console.log("typeof email = " + typeof email);
                 var emailstr = JSON.stringify(email);
                 console.log("emailstr = " + emailstr);
               
                 var first_at = emailstr.indexOf("@");
                 var last_at = emailstr.lastIndexOf("@");
               
                 console.log("first_at = " + first_at);
                 console.log("last_at = " + last_at);

                 if (first_at == -1)
                 {
                      var badstr = 'Sorry email must have 1 @ character, for example darthvader@gmail.com';
                      res.render('pages/result', {myresults: badstr} );
                 }
                 else if (first_at != last_at)
                 {
                      var badstr = 'Sorry email must have only 1 @ character, for example darthvader@gmail.com but you put more than 1 @ character';
                      res.render('pages/result', {myresults: badstr} );
                 }
                 else
                      connectAndUpdate(); 
             }
          }//good
      })//form.parse
  }
};
