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


/*****************************
const { Client }   = require('pg');

const connectobj   = {
                                    user: 'max', // e.g., 'postgres'
                                    host: 'dpg-d1kvb83e5dus73f28aig-a',
                                    database: 'tpjj', // The database you created
                                    password: 'vSuU5pRACdyJvEJmmW8EQxjnaKg5v003',
                                    port: 5432,
                     };
                     
const connectobj   = {
                                    user: 'dbadmin', // e.g., 'postgres'
                                    host: 'dpg-d1nhturipnbc73am7180-a',
                                    database: 'garagedb_cwyn', // The database you created
                                    password: 'cH8a1Ifb1iYBZt2ckpOowoclf5nrfjid',
                                    port: 5432,
                     };
*************************/

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
  .post('/subscriptiontableinsertsubmit', (req, res) => { subscriptiontable.subscriptiontableinsertsubmitfunc(req,res); })
  

  .get('/studenttabledelete', (req, res) => res.render('pages/studenttabledelete'))
  .post('/studenttabledeletesubmit', (req, res) => { studenttable.studenttabledeletefunc(req,res); })

  .get('/subscriptiontabledelete', (req, res) => res.render('pages/subscriptiontabledelete'))
  .post('/subscriptiontabledeletesubmit', (req, res) => { subscriptiontable.subscriptiontabledeletesubmitfunc(req,res); })
  
  .get('/dbcreatestudenttable', (req, res) => { studenttable.studenttablecreatefunc(req, res); })
  .get('/dbcreatesubscriptiontable', (req, res) => { subscriptiontable.subscriptiontablecreatefunc(req, res); })

  .get('/dbdropstudenttable', (req, res) => { studenttable.studenttabledropfunc(req, res); })
  .get('/dbdropsubscriptiontable', (req, res) => { subscriptiontable.subscriptiontabledropfunc(req,res); }) 
    
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
