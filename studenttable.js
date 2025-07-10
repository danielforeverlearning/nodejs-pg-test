const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

/*****************************
const connectobj   = {
                                    user: 'max', // e.g., 'postgres'
                                    host: 'dpg-d1kvb83e5dus73f28aig-a',
                                    database: 'tpjj', // The database you created
                                    password: 'vSuU5pRACdyJvEJmmW8EQxjnaKg5v003',
                                    port: 5432,
                     };
*****************************/
const connectobj   = {
                                    user: 'dbadmin', // e.g., 'postgres'
                                    host: 'dpg-d1nhturipnbc73am7180-a',
                                    database: 'garagedb_cwyn', // The database you created
                                    password: 'cH8a1Ifb1iYBZt2ckpOowoclf5nrfjid',
                                    port: 5432,
                     };


module.exports = {
  studenttablereadfunc: function(req,res)  {
            async function connectAndRead() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('studenttablereadfunc Connected to PostgreSQL!');
                          const result = await client.query('SELECT * FROM student');
                          console.log("result = " + JSON.stringify(result));
                          res.render('pages/studenttableread', {results: result.rows} );
                        } catch (err) {
                            var result = 'studenttablereadfunc ERROR = ' + err;
                            res.send(result);
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
                 var first_at = email.indexOf("@");
                 var last_at = email.lastIndexOf("@");
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

};
