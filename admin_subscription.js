const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

const db_credential = require('db_credential');
const connectobj    = db_credential.myconnectobj();


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
  }//subscriptiontabledropfunc
  
}; //module.exports
