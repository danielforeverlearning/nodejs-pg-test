const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

const connectobj   = {
                                    user: 'dbadmin', // e.g., 'postgres'
                                    host: 'dpg-d1oahd3uibrs73ch0sr0-a',
                                    database: 'garagedb_ilqq', // The database you created
                                    password: '67ak4HnNm3HzRW78dj7b91DgFmAwhQTf',
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
      var lastmonthpaid;
      var lastyearpaid;
      async function connectAndInsert() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('INSERT INTO subscription Connected to PostgreSQL!');
                          var insertstmt = "INSERT INTO subscription (STUDENTID, ACTIVE, LASTMONTHPAID, LASTYEARPAID) VALUES (" + studentID + ", " + active + ", " + lastpaidmonth + ", " + lastpaidyear + ");";
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
             if ('active_yes_name' in fields)
                 active = true;
             else
                 active = false;
             studentID = fields.studentid_name;
             lastpaidmonth = fields.lastpaidmonth_name;
             lastpaidyear = fields.lastpaidyear_name;
             connectAndInsert();
          }
      })
  }, //subscriptiontableinsertsubmitfunc

  subscriptiontablecreatefunc: function(req,res) {
          async function connectAndCreate() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE subscription (ID SERIAL PRIMARY KEY, STUDENTID INTEGER, ACTIVE BOOLEAN, LASTPAIDMONTH INT, LASTPAIDYEAR INT, CONSTRAINT mysubscriptiontablefkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
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
  }

};
