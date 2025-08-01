
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
                            res.render('admin_pages/adminresult', {myresults: errormsg} );
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
                          var deletestmt  = "DELETE FROM reservation WHERE STUDENTID = " + studentID + ";";
                              deletestmt += "DELETE FROM subscription WHERE STUDENTID = " + studentID + ";";
                              deletestmt += "DELETE FROM student WHERE ID = " + studentID + ";";
                          const deleteRes = await client.query(deletestmt);
                          var resultstr = 'student subscription reservation deletefunc = ' + JSON.stringify(deleteRes);
                          res.render('admin_pages/adminresult', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'student subscription reservation deletefunc, ERROR = ' + err;
                            res.render('admin_pages/adminresult', {myresults: badstr} );
                        } finally {
                            await client.end();
                        }
      }
      connectAndDelete(); 
  },

  studenttablecreatefunc: function(req, res) {
          async function connectAndCreate() {
                      var result;
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE student (ID SERIAL PRIMARY KEY, FIRSTNAME VARCHAR(255), LASTNAME VARCHAR(255), EMAIL VARCHAR(255), PHONEAREACODE INT, PHONENUMBER INT);'
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
  },

  studenttabledropfunc: function(req, res) {
          var result;
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
              
                          // Example: drop table
                          const dropRes = await client.query(
                              'DROP TABLE student;'
                          );
                          result = 'dropRes = ' + JSON.stringify(dropRes);
                      } catch (err) {
                          result = 'Error connecting or dropping table = ' + err;
                      } finally {
                          await client.end();
                          res.send(result);
                      }
          }
          connectAndDrop();
  },

  
  studenttableinsertfunc: function(req, res)  {
      var firstname;
      var lastname;
      var email;
      var phoneareacode;
      var phonenumber;
      var password;
      var confirm;
      var badstr;
      var resultstr;
      async function connectAndMaybeInsert() {    
                        const client       = new Client(connectobj);
                        //check duplicate email
                        try {
                             await client.connect();
                             var query = "SELECT * FROM student WHERE EMAIL='" + email + "';";
                             const queryRes = await client.query(query);
                             if (queryRes.rows.length > 0)
                             {
                                 await client.end();
                                 badstr = "Sorry, there is at least 1 other student with the same email address, i will not create a new student account, email=" + email;
                                 res.render('admin_pages/adminresult', {myresults: badstr} );
                                 return;
                             }
                        } catch (err) {
                            await client.end();
                            badstr = 'studenttableinsertfunc, query for duplicate email ERROR = ' + err;
                            res.render('admin_pages/adminresult', {myresults: badstr} );
                            return;
                        }
        
                        //insert
                        try {
                          var insertstmt = "INSERT INTO student (FIRSTNAME, LASTNAME, EMAIL, PHONEAREACODE, PHONENUMBER) VALUES ('" + firstname + "', '" + lastname + "', '" + email + "', " + phoneareacode + ", " + phonenumber + ");";
                          console.log(insertstmt);
                          const insertRes = await client.query(insertstmt);
                          resultstr = 'insertRes = ' + JSON.stringify(insertRes);
                        } catch (err) {
                            resultstr = 'INSERT INTO student ERROR = ' + err;
                        } finally {
                            await client.end();
                            res.render('admin_pages/adminresult', {myresults: resultstr} );
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("studenttableinsertfunc err = " + err);
             return;
          }
          else
          { //good
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             firstname = fields.firstname_name;
             lastname = fields.lastname_name;
             email = fields.email_name[0].toLowerCase();
             phoneareacode = fields.phoneareacode_name;
             phonenumber = fields.phonenumber_name;
             password = fields.password_name[0];
             confirm = fields.confirm_name[0];

             //validation checking
             if (phoneareacode < 0 || phoneareacode > 999)
             {
                  var badstr = 'Sorry phone area code must be between 000 and 999';
                  res.render('admin_pages/adminresult', {myresults: badstr} );
                  return;
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
                      res.render('admin_pages/adminresult', {myresults: badstr} );
                      return;
                 }
                 else if (first_at != last_at)
                 {
                      var badstr = 'Sorry email must have only 1 @ character, for example darthvader@gmail.com but you put more than 1 @ character';
                      res.render('admin_pages/adminresult', {myresults: badstr} );
                      return;
                 }
                 else
                      connectAndMaybeInsert();
             }
          }//good
      })//form.parse
  },


  updatefunc: function(req, res, studentID) {
    
      async function connectAndSelectByID() {  
                        const client       = new Client(connectobj);
                        var selectIDres;
                        var badstr = "";
                        try {
                              await client.connect();
                              selectIDres = await client.query("SELECT * FROM student WHERE ID = " + studentID + ";");
                              console.log("selectIDres = " + JSON.stringify(selectIDres));
                              console.log("selectIDres.rows.length = " + selectIDres.rows.length);
                              if (selectIDres.rows.length  != 1)
                                  badstr = 'Sorry there is no row in table student with ID = ' + studentID + ', if you want to update a row the ID must be good.';
                        } catch (err) {
                              badstr = 'updatefunc ID = ' + studentID + ', ERROR = ' + err;
                        } finally {
                              await client.end();
                              if (badstr.length > 0)
                                   res.render('admin_pages/adminresult', {myresults: badstr} );
                              else
                                   res.render('admin_pages/studenttableupdate2', {existingval: selectIDres.rows[0]} );
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
                        //check duplicate email
                        try {
                             await client.connect();
                             var query = "SELECT * FROM student WHERE EMAIL='" + email + "' AND ID <> " + primarykeyID + ";";
                             const queryRes = await client.query(query);
                             if (queryRes.rows.length > 0)
                             {
                                 await client.end();
                                 badstr = "Sorry, there is at least 1 other student with the same email address, i will not create a new student account, email=" + email;
                                 res.render('admin_pages/adminresult', {myresults: badstr} );
                                 return;
                             }
                        } catch (err) {
                            await client.end();
                            badstr = 'studenttableupdate3func, query for duplicate email ERROR = ' + err;
                            res.render('admin_pages/adminresult', {myresults: badstr} );
                            return;
                        }
                        //update
                        try {
                          var stmt = "UPDATE student SET FIRSTNAME = '" + firstname + "', LASTNAME = '" + lastname + "', EMAIL = '" + email + "', PHONEAREACODE = " + phoneareacode + ", PHONENUMBER = " + phonenumber + " WHERE ID = " + primarykeyID + ";";
                          console.log(stmt);
                          updateRes = await client.query(stmt);
                          dbgoodresult = true;
                        } catch (err) {
                            badstr = 'studenttableupdate3func, UPDATE student ID = ' + primarykeyID + ', err = ' + err;
                            dbgoodresult = false;
                        } finally {
                            await client.end();
                            if (dbgoodresult) {
                                 //var resultstr = 'updateRes = ' + JSON.stringify(updateRes);
                                 //res.render('admin_pages/adminresult', {myresults: resultstr} );
                                 res.render('admin_pages/askupdatestudacct', {studentID:primarykeyID, firstname:firstname, lastname:lastname} );
                            }
                            else
                                 res.render('admin_pages/adminresult', {myresults: badstr} );
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("studenttableupdate3func err = " + err);
             return;
          }
          else
          { //good
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             primarykeyID = fields.primarykey_name;
             firstname = fields.firstname_name;
             lastname = fields.lastname_name;

             console.log("typeof fields.email_name = " + typeof fields.email_name);
             email = fields.email_name[0];
             console.log("typeof email = " + typeof email);
             email = email.toLowerCase();
            
             phoneareacode = fields.phoneareacode_name;
             phonenumber = fields.phonenumber_name;

             //validation checking
             if (phoneareacode < 0 || phoneareacode > 999)
             {
                  var badstr = 'Sorry phone area code must be between 000 and 999';
                  res.render('admin_pages/adminresult', {myresults: badstr} );
                  return;
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
                      res.render('admin_pages/adminresult', {myresults: badstr} );
                      return;
                 }
                 else if (first_at != last_at)
                 {
                      var badstr = 'Sorry email must have only 1 @ character, for example darthvader@gmail.com but you put more than 1 @ character';
                      res.render('admin_pages/adminresult', {myresults: badstr} );
                      return;
                 }
               
                 connectAndUpdate(); 
             }
          }//good
      })//form.parse
  }
}; //module.exports

