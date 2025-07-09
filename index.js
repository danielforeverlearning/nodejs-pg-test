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
const client = new Client({
            user: 'max', // e.g., 'postgres'
            host: 'dpg-d1kvb83e5dus73f28aig-a',
            database: 'tpjj', // The database you created
            password: 'vSuU5pRACdyJvEJmmW8EQxjnaKg5v003',
            port: 5432,
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  
  .get('/', (req, res) => res.render('pages/home'))
  
  .get('/tableread', (req,res) => {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
          client.query('SELECT * FROM cars', function(err,result) {
              done();
              if (err)
              { console.error(err); res.send("Error " + err); }
              else
              { res.render('pages/tableread', {results: result.rows} ); }
          });
      });
  })


  
  .get('/tableinsert', (req, res) => res.render('pages/tableinsert'))
  .post('/tableinsertsubmit', (req, res) => {
      var form = new formidable.IncomingForm();
      var brand;
      var model;
      var year;

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
            try {
              await client.connect();
              console.log('Connected to PostgreSQL!');
              var insertstmt = "INSERT INTO cars (BRAND, MODEL, YEAR) VALUES ('" + brand + "', '" + model + "', " + year + ");";
              const insertRes = await client.query(insertstmt);
              var result = 'insertRes = ' + JSON.stringify(insertRes);
              res.send(result);
            } catch (err) {
                var result = 'INSERT INTO cars ERROR = ' + err;
                res.send(result);
            } finally {
                await client.end();
                console.log('INSERT INTO cars Disconnected from PostgreSQL.');
            }
        });
  })


  
  .get('/tabledelete', (req, res) => res.render('pages/tabledelete'))
  .get('/dbcreatetable', (req, res) => {
          async function connectAndCreate() {
            
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
