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

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  
  .get('/', (req, res) => res.render('pages/home'))
  
  .get('/tableread', (req,res) => {
            async function connectAndRead() {  
                        const client = new Client({
                                    user: 'max', // e.g., 'postgres'
                                    host: 'dpg-d1kvb83e5dus73f28aig-a',
                                    database: 'tpjj', // The database you created
                                    password: 'vSuU5pRACdyJvEJmmW8EQxjnaKg5v003',
                                    port: 5432,
                        });
                        try {
                          await client.connect();
                          console.log('tableread Connected to PostgreSQL!');
                          const result = await client.query('SELECT * FROM cars');
                          res.render('pages/tableread', {results: result.rows} );
                        } catch (err) {
                            var result = 'tableread ERROR = ' + err;
                            res.send(result);
                        } finally {
                            await client.end();
                            console.log('tableread Disconnected from PostgreSQL.');
                        }
            }
            connectAndRead(); 
  })


  
  .get('/tableinsert', (req, res) => res.render('/tableinsert'))
  .post('/tableinsertsubmit', (req, res) => {
      var brand;
      var model;
      var year;
      var form = new formidable.IncomingForm();
      //***** do not get confused these console.log are server-side *****
      form.parse(req)
        .on('field', function(name,field) {
            console.log('tableinsertsubmit field:', name, ' = ', field);
            if (name == 'BRAND')
              brand = field;
            else if (name == 'MODEL')
              model = field;
            else if (name == 'YEAR')
              year = field;
          
            //res.write('<p>field name: ' + name + '</p>');
            //res.write('<p>field: ' + field + '</p>');
        })
        .on('error', function(err) {
            console.log('tableinsertsubmit error: ');
            console.log(err);
            res.write('<p>got an error check console log</p>');
            res.end();
        })
        .on('end', function() {
            console.log('tableinsertsubmit end');
            //connectAndInsert();
        });
  })


  
  .get('/tabledelete', (req, res) => res.render('pages/tabledelete'))
  .get('/dbcreatetable', (req, res) => {
          async function connectAndCreate() {
                      const client = new Client({
                                    user: 'max', // e.g., 'postgres'
                                    host: 'dpg-d1kvb83e5dus73f28aig-a',
                                    database: 'tpjj', // The database you created
                                    password: 'vSuU5pRACdyJvEJmmW8EQxjnaKg5v003',
                                    port: 5432,
                      });
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


  .get('/dbdroptable', (req, res) => {
          async function connectAndDrop() {
                      const client = new Client({
                                    user: 'max', // e.g., 'postgres'
                                    host: 'dpg-d1kvb83e5dus73f28aig-a',
                                    database: 'tpjj', // The database you created
                                    password: 'vSuU5pRACdyJvEJmmW8EQxjnaKg5v003',
                                    port: 5432,
                      });
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
