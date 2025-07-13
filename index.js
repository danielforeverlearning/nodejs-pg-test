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

var studenttable = require('./studenttable');
var subscriptiontable = require('./subscriptiontable');
var admin_subscription = require('./admin_subscription');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  
  .get('/', (req, res) => res.render('pages/home'))

  .get('/studenttableupdate', (req,res) => res.render('pages/studenttableupdate1'))
  .post('/studenttableupdateID', (req,res) => { studenttable.studenttableupdateIDfunc(req,res); })
  .post('/studenttableupdatesubmit', (req,res) => { studenttable.studenttableupdate3func(req,res); })
  .get('/studentupdate/:id', (req, res) => {  
                                              const studentID = req.params.id;
                                              studenttable.updatefunc(req,res,studentID);
                                           })

  .get('/student', (req,res) => { studenttable.studentviewfunc(req,res); })
  
  .get('/studenttableread', (req,res) => { studenttable.studenttablereadfunc(req,res); })
  .get('/subscriptiontableread', (req,res) => { subscriptiontable.subscriptiontablereadfunc(req,res); })

  .get('/studentmonthlysubscription/:id', (req,res) => {  
                                                            const studentID = req.params.id; 
                                                            subscriptiontable.read1IDfunc(req,res,studentID);
                                                       })

  .get('/studenttableinsert', (req, res) => res.render('pages/studenttableinsert'))
  .post('/studenttableinsertsubmit', (req, res) => { studenttable.studenttableinsertfunc(req,res); })
 
  
  .get('/studentdelete/:id', (req, res) => {  
                                              const studentID = req.params.id;
                                              studenttable.deletefunc(req,res,studentID);
                                           })
  .get('/studenttabledelete', (req, res) => res.render('pages/studenttabledelete'))
  .post('/studenttabledeletesubmit', (req, res) => { studenttable.studenttabledeletefunc(req,res); })

  .get('/subscripinsert/:id', (req, res) => {
                                                const studentID = req.params.id;
                                                res.render('pages/subscriptiontableinsert'))
                                            })
  .post('/subscriptiontableinsertsubmit', (req, res) => { subscriptiontable.subscriptiontableinsertsubmitfunc(req,res); })
  .get('/subscripupdate/:id', (req, res) => {  
                                              const studentID = req.params.id;
                                              subscriptiontable.updatefunc(req,res,studentID);
                                            })
  .post('/subscripupdatepost/:id', (req,res) => { 
                                                    const studentID = req.params.id;
                                                    subscriptiontable.updatepostfunc(req,res,studentID);
                                                })
  
  .get('/dbcreatestudenttable', (req, res) => { studenttable.studenttablecreatefunc(req, res); })
  
  .get('/dbdropstudenttable', (req, res) => { studenttable.studenttabledropfunc(req, res); })
  

  .get('/dbcreatesubscriptiontable', (req, res) => { admin_subscription.subscriptiontablecreatefunc(req, res); })
  .get('/dbdropsubscriptiontable', (req, res) => { admin_subscription.subscriptiontabledropfunc(req,res); }) 
  .get('/subscriptiontabledelete', (req, res) => res.render('admin_pages/subscriptiontabledelete'))
  .post('/subscriptiontabledeletesubmit', (req, res) => { admin_subscription.subscriptiontabledeletesubmitfunc(req,res); })
  
    
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
