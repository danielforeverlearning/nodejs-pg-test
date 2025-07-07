//github.com --> settings --> integration-applications --> render.com configure
//environment variable BASE_URL 0.0.0.0
//npm init
//npm install pg
//npm install express
//npm install path
//npm install https
//npm install ejs

const pg           = require('pg');
const express      = require('express')
const path         = require('path')

const PORT         = process.env.PORT || 5000

var   https        = require('https');






express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/home'))
  .get('/tableinsert', (req, res) => res.render('pages/tableinsert'))
  .get('/tabledelete', (req, res) => res.render('pages/tabledelete'))
  .get('/dbcreatetable', (req, res) => {
          const { Client } = require('pg');

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
                'CREATE TABLE cars (brand VARCHAR(255),model VARCHAR(255),year INT);'
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
          const { Client } = require('pg');

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
  /**************************************************
  .get('/db', (req,res) => {
      pg.connect(process.env.DATABASE_URL, function(err, client, done) {
          client.query('SELECT * FROM test_table', function(err,result) {
              done();
              if (err)
              { console.error(err); res.send("Error " + err); }
              else
              { res.render('pages/db', {results: result.rows} ); }
          });
      });
  })
  ****************************************************/
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
