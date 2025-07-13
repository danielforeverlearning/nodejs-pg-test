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
  studentviewfunc: function(req,res)  {
            async function connectAndRead() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const result = await client.query('SELECT * FROM student');
                          //console.log(" result = " + JSON.stringify(result));
                          res.render('pages/studentview', {results: result.rows} );
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
  
  studenttablereadfunc: function(req,res)  {
            async function connectAndRead() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('studenttablereadfunc Connected to PostgreSQL!');
                          const result = await client.query('SELECT * FROM student');
                          console.log("studenttablereadfunc result = " + JSON.stringify(result));
                          res.render('pages/studenttableread', {results: result.rows} );
                        } catch (err) {
                            var errormsg = "studenttablereadfunc err = " + err;
                            console.log(errormsg);
                            console.log("typeof err = " + typeof err);
                            console.log("err = " + JSON.stringify(err));
                            res.render('pages/result', {myresults: errormsg} );
                        } finally {
                            await client.end();
                            console.log('studenttablereadfunc Disconnected from PostgreSQL.');
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
                          console.log('INSERT INTO student Connected to PostgreSQL!');
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
                            console.log('INSERT INTO student Disconnected from PostgreSQL.');
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
                          const deleteRes = await client.query("DELETE FROM student WHERE ID = " + studentID + ";");
                          var resultstr = 'deleteRes = ' + JSON.stringify(deleteRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'DELETE FROM students ERROR = ' + err;
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

  

  studenttableupdateIDfunc: function(req, res) {
      var primarykeyID;
      async function connectAndSelectByID() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const selectIDres = await client.query("SELECT * FROM student WHERE ID = " + primarykeyID + ";");
                          console.log("selectIDres = " + JSON.stringify(selectIDres));
                          console.log("selectIDres.rows.length = " + selectIDres.rows.length);
                          if (selectIDres.rows.length  != 1)
                          {
                              var badstr = 'Sorry there is no row in table student with ID = ' + primarykeyID + ', if you want to update a row the ID must be good.';
                              res.render('pages/result', {myresults: badstr} );
                          }
                          else
                              res.render('pages/studenttableupdate2', {existingval: selectIDres.rows[0]} );
                        } catch (err) {
                              var badstr = 'studenttableupdateIDfunc ID = ' + primarykeyID + ', ERROR = ' + err;
                              res.render('pages/result', {myresults: badstr} );
                        } finally {
                              await client.end();
                              console.log('studenttableupdateIDfunc ID = ' + primarykeyID + ', Disconnected from PostgreSQL.');
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("studenttableupdateIDfunc form parse err = " + err);
          }
          else
          {
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             primarykeyID = fields.primarykey_name;
             connectAndSelectByID(); 
          }
      })
  },

  studenttableupdate3func: function(req, res) {
      var primarykeyID;
      var firstname;
      var lastname;
      var email;
      var phoneareacode;
      var phonenumber;
      async function connectAndUpdate() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('studenttableupdate3func Connected to PostgreSQL!');
                          var stmt = "UPDATE student SET FIRSTNAME = '" + firstname + "', LASTNAME = '" + lastname + "', EMAIL = '" + email + "', PHONEAREACODE = " + phoneareacode + ", PHONENUMBER = " + phonenumber + " WHERE ID = " + primarykeyID + ";";
                          console.log(stmt);
                          const updateRes = await client.query(stmt);
                          var resultstr = 'updateRes = ' + JSON.stringify(updateRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'UPDATE student ID = ' + primarykeyID + ', err = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                            console.log('studenttableupdate3func Disconnected from PostgreSQL.');
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
