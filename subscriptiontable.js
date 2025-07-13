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
  
    


  read1IDfunc: function(req, res, studentID, firstname, lastname) {
    
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
                                  res.render('pages/subscriptionview', {rowcount:0, norowyetstudentID: studentID, norowyetfirstname: firstname, norowyetlastname: lastname} );
                              }
                              else if (selectIDres.rows.length == 1)
                                  res.render('pages/subscriptionview', {rowcount:1, foreigntablefirstname: firstname, foreigntablelastname: lastname, existingrow: selectIDres.rows[0]} );
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

  updatefunc: function(req, res, studentID) {
    
       async function myasyncfunc() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const selectIDres = await client.query("SELECT * FROM subscription WHERE STUDENTID = " + studentID + ";");
                          console.log("subscriptiontable updatefunc = " + JSON.stringify(selectIDres));
                          res.render('pages/subscriptionviewupdate', {existingrow: selectIDres.rows[0]} );
                        } catch (err) {
                              var badstr = 'subscriptiontable updatefunc ID = ' + studentID + ', ERROR = ' + err;
                              res.render('pages/result', {myresults: badstr} );
                        } finally {
                              await client.end();
                        }
      }

      myasyncfunc();
  },

  updatepostfunc: function(req, res, studentID) {

       var activeSQLok;
       var lastpaidmonthSQLok;
       var lastpaidyearSQLok;
    
       async function myasyncfunc() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();

                          var stmt = "UPDATE subscription SET ACTIVE = " + activeSQLok + ", LASTPAIDMONTH = " + lastpaidmonthSQLok + ", LASTPAIDYEAR = " + lastpaidyearSQLok + " WHERE STUDENTID = " + studentID + ";";
                          console.log(stmt);
                          
                          const selectIDres = await client.query(stmt);
                          console.log("subscriptiontable updatefuncpost = " + JSON.stringify(selectIDres));
                          res.render('pages/result', {myresults: "STUDENTID " + studentID + " successfully updated"} );
                        } catch (err) {
                              var badstr = 'subscriptiontable updatefunc ID = ' + studentID + ', ERROR = ' + err;
                              res.render('pages/result', {myresults: badstr} );
                        } finally {
                              await client.end();
                        }
      }

      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             var badstr = "subscriptiontable updatefuncpost err = " + err;
             res.render('pages/result', {myresults: badstr} );
          }
          else
          {
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             
             if (fields.active_name == "NO")
                 activeSQLok = false;
             else
                 activeSQLok = true;
               
             if (fields.lastpaidmonth_name.indexOf(";") == -1)
                 lastpaidmonthSQLok = fields.lastpaidmonth_name;
             else
             {
                 var badstr = "subscriptiontable updatefuncpost: Suspected SQL-injection attack in LAST PAID MONTH, not doing anything";
                 res.render('pages/result', {myresults: badstr} );
             }
            
             if (fields.lastpaidyear_name.indexOf(";") == -1)
                 lastpaidyearSQLok = fields.lastpaidyear_name;
             else
             {
                 var badstr = "subscriptiontable updatefuncpost: Suspected SQL-injection attack in LAST PAID YEAR, not doing anything";
                 res.render('pages/result', {myresults: badstr} );
             }
            
             myasyncfunc(); 
          }
      })//form.parse
  }//updatepostfunc

}; //module.exports
