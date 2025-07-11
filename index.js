//github.com --> settings --> integration-applications --> render.com configure
//environment variable BASE_URL 0.0.0.0
//npm init
//npm install pg
//npm install express
//npm install path
//npm install https
//npm install ejs
//npm install formidable

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

var studenttable = require('./studenttable');
var subscriptiontable = require('./subscriptiontable');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  
  .get('/', (req, res) => res.render('pages/home'))

  .get('/studenttableupdate', (req,res) => res.render('pages/studenttableupdate1'))
  .post('/studenttableupdateID', (req,res) => { studenttable.studenttableupdateIDfunc(req,res); })
  .post('/studenttableupdatesubmit', (req,res) => { studenttable.studenttableupdate3func(req,res); })
  
  .get('/studenttableread', (req,res) => { studenttable.studenttablereadfunc(req,res); })
  .get('/subscriptiontableread', (req,res) => { subscriptiontable.subscriptiontablereadfunc(req,res); })


  .get('/studenttableinsert', (req, res) => res.render('pages/studenttableinsert'))
  .post('/studenttableinsertsubmit', (req, res) => { studenttable.studenttableinsertfunc(req,res); })
  .get('/subscriptiontableinsert', (req, res) => res.render('pages/subscriptiontableinsert'))
  .post('/tableinsertsubmit', (req, res) => {
      var brand;
      var model;
      var year;
      async function connectAndInsert() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('INSERT INTO cars Connected to PostgreSQL!');
                          var insertstmt = "INSERT INTO cars (BRAND, MODEL, YEAR) VALUES ('" + brand + "', '" + model + "', " + year + ");";
                          console.log(insertstmt);
                          const insertRes = await client.query(insertstmt);
                          var resultstr = 'insertRes = ' + JSON.stringify(insertRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'INSERT INTO cars ERROR = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                            console.log('INSERT INTO cars Disconnected from PostgreSQL.');
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("tableinsertsubmit err = " + err);
          }
          else
          {
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             brand = fields.brand_name;
             model = fields.model_name;
             year = fields.year_name;
             connectAndInsert(); 
          }
      })
    
  })

    


  .get('/studenttabledelete', (req, res) => res.render('pages/studenttabledelete'))
  .post('/studenttabledeletesubmit', (req, res) => { studenttable.studenttabledeletefunc(req,res); })
  .get('/tabledelete', (req, res) => res.render('pages/tabledelete'))
  .post('/tabledeletesubmit', (req, res) => {
      var primarykeyID;
      async function connectAndDelete() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const deleteRes = await client.query("DELETE FROM cars WHERE ID = " + primarykeyID + ";");
                          var resultstr = 'deleteRes = ' + JSON.stringify(deleteRes);
                          res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'DELETE FROM cars ERROR = ' + err;
                            res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                            console.log('DELETE FROM cars Disconnected from PostgreSQL.');
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
  
          if (err)
          {
             res.send("tabledeletesubmit err = " + err);
          }
          else
          {
             console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
             primarykeyID = fields.primarykey_name;
             connectAndDelete(); 
          }
      })
    
  })

  .get('/dbcreatestudenttable', (req, res) => { studenttable.studenttablecreatefunc(req, res); })
  .get('/dbcreatetable', (req, res) => {
          async function connectAndCreate() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE cars (ID SERIAL PRIMARY KEY, BRAND VARCHAR(255),MODEL VARCHAR(255),YEAR INT);'
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
  })

  .get('/dbdropstudenttable', (req, res) => { studenttable.studenttabledropfunc(req, res); })
  .get('/dbdroptable', (req, res) => {
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: drop table
                          const dropRes = await client.query(
                              'DROP TABLE cars;'
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
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
