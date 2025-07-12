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

    subscriptiontablereadfunc: function(req,res)  {
            async function connectAndRead() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('subscriptiontablereadfunc Connected to PostgreSQL!');
                          const result = await client.query('SELECT * FROM subscription');
                          console.log("result = " + JSON.stringify(result));
                          res.render('pages/subscriptiontableread', {results: result.rows} );
                        } catch (err) {
                            var result = 'subscriptiontablereadfunc ERROR = ' + err;
                            res.send(result);
                        } finally {
                            await client.end();
                            console.log('subscriptiontablereadfunc Disconnected from PostgreSQL.');
                        }
            }
            connectAndRead(); 
  },

  subscriptiontableinsertsubmitfunc: function(req,res) {
      var studentID;
      var active;
      var lastpaidmonth;
      var lastpaidyear;
      async function connectAndInsert() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('INSERT INTO subscription Connected to PostgreSQL!');
                          var insertstmt = "INSERT INTO subscription (STUDENTID, ACTIVE, LASTPAIDMONTH, LASTPAIDYEAR) VALUES (" + studentID + ", " + active + ", " + lastpaidmonth + ", " + lastpaidyear + ");";
                          console.log(insertstmt);
                          const insertRes = await client.query(insertstmt);
                          var resultstr = 'insertRes = ' + JSON.stringify(insertRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'INSERT INTO subscription ERROR = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                            console.log('INSERT INTO subscription Disconnected from PostgreSQL.');
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("subscriptiontableinsertsubmitfunc err = " + err);
          }
          else
          {
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             studentID = fields.studentid_name;
             if (fields.active_name == "YES")
                 active = true;
             else
                 active = false;
             console.log("active = " + active);
             lastpaidmonth = fields.lastpaidmonth_name;
             lastpaidyear = fields.lastpaidyear_name;

             connectAndInsert();
          }
      })
  }, //subscriptiontableinsertsubmitfunc

  subscriptiontabledeletesubmitfunc: function(req,res)  {
      var primarykeyID;
      async function connectAndDelete() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const deleteRes = await client.query("DELETE FROM subscription WHERE STUDENTID = " + primarykeyID + ";");
                          var resultstr = 'deleteRes = ' + JSON.stringify(deleteRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'DELETE FROM subscription ERROR = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                            console.log('DELETE FROM subscription Disconnected from PostgreSQL.');
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             var badstr = "subscriptiontabledeletesubmitfunc err = " + err;
             res.render('pages/result', {myresults: badstr} );
          }
          else
          {
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             primarykeyID = fields.primarykey_name;
             connectAndDelete(); 
          }
      })
    
  }, //subscriptiontabledeletesubmitfunc

  subscriptiontablecreatefunc: function(req,res) {
          async function connectAndCreate() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE subscription (STUDENTID INTEGER PRIMARY KEY, ACTIVE BOOLEAN, LASTPAIDMONTH INT, LASTPAIDYEAR INT, CONSTRAINT mysubscriptiontablefkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
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

  subscriptiontabledropfunc: function(req,res) {
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: drop table
                          const dropRes = await client.query(
                              'DROP TABLE subscription;'
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
  },

  read1IDfunc: function(req, res, studentID) {
    
      async function connectAndSelectByID() {  
                        const client       = new Client(connectobj);
                        try {
                              await client.connect();
                              const selectIDres = await client.query("SELECT * FROM subscription WHERE STUDENTID = " + studentID + ";");
                              console.log("read1IDfunc = " + JSON.stringify(selectIDres));
                              console.log("selectIDres.rows.length = " + selectIDres.rows.length);
                              if (selectIDres.rows.length == 0)
                              {
                                  //var badstr = 'Sorry there is no row in table student with ID = ' + studentID + ', if you want to update a row the ID must be good.';
                                  //res.render('pages/result', {myresults: badstr} );
                                  res.render('pages/subscriptionview', {rowcount:0} );
                              }
                              else if (selectIDres.rows.length == 1)
                                  res.render('pages/subscriptionview', {rowcount:1, existingrow: selectIDres.rows[0]} );
                              else {
                                  console.log("read1IDfunc: rowcount = " + selectIDres.rows.length);
                                  console.log("rows = " + JSON.stringify(selectIDres.rows));
                                  res.render('pages/subscriptionview', {rowcount:selectIDres.rows.length, rows: selectIDres.rows} );
                              }
                        } catch (err) {
                              var badstr = 'read1IDfunc ID = ' + studentID + ', ERROR = ' + err;
                              res.render('pages/result', {myresults: badstr} );
                        } finally {
                              await client.end();
                        }
      }
      connectAndSelectByID();
  },

};
