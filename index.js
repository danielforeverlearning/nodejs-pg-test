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
var admin_student = require('./admin_student');
var admin_subscription = require('./admin_subscription');
var admin_reservation = require('./admin_reservation');


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  
  .get('/', (req, res) => res.render('pages/home'))

  .post('/studenttableupdatesubmit', (req,res) => { studenttable.studenttableupdate3func(req,res); })
  .get('/studentupdate/:id', (req, res) => {  
                                              const studentID = req.params.id;
                                              studenttable.updatefunc(req,res,studentID);
                                           })
  .get('/student', (req,res) => { studenttable.studentviewfunc(req,res); })
  .get('/studentmonthlysubscription/:id/:firstname/:lastname', (req,res) => {  
                                                            const studentID = req.params.id;
                                                            const firstname = req.params.firstname;
                                                            const lastname  = req.params.lastname;
                                                            subscriptiontable.read1IDfunc(req,res,studentID,firstname,lastname);
                                                       })
  .get('/studenttableinsert', (req, res) => res.render('pages/studenttableinsert'))
  .post('/studenttableinsertsubmit', (req, res) => { studenttable.studenttableinsertfunc(req,res); })
  .get('/studentdeleteconfirm/:id/:firstname/:lastname', (req,res) => res.render('pages/delete_confirm', {studentID: req.params.id, firstname: req.params.firstname, lastname: req.params.lastname}))
  .get('/studentdelete/:id', (req, res) => {  
                                              const studentID = req.params.id;
                                              studenttable.deletefunc(req,res,studentID);
                                           })

  

  .get('/subscripinsert/:id/:firstname/:lastname', (req, res) => res.render('pages/subscriptiontableinsert', {studentID: req.params.id, firstname: req.params.firstname, lastname: req.params.lastname }))
  .post('/subscriptiontableinsertsubmit', (req, res) => { subscriptiontable.subscriptiontableinsertsubmitfunc(req,res); })
  .get('/subscripupdate/:id/:firstname/:lastname', (req, res) => {  
                                              const studentID = req.params.id;
                                              const firstname = req.params.firstname;
                                              const lastname  = req.params.lastname;
                                              subscriptiontable.updatefunc(req,res,studentID,firstname,lastname);
                                            })
  .post('/subscripupdatepost/:id/:firstname/:lastname', (req,res) => { 
                                                    const studentID = req.params.id;
                                                    const firstname = req.params.firstname;
                                                    const lastname  = req.params.lastname;
                                                    subscriptiontable.updatepostfunc(req,res,studentID,firstname,lastname);
                                                })

  
  .get('/dbcreatestudenttable', (req, res) => { admin_student.studenttablecreatefunc(req, res); })
  .get('/dbdropstudenttable', (req, res) => { admin_student.studenttabledropfunc(req, res); })
  
  .get('/dbcreatesubscriptiontable', (req, res) => { admin_subscription.subscriptiontablecreatefunc(req, res); })
  .get('/dbdropsubscriptiontable', (req, res) => { admin_subscription.subscriptiontabledropfunc(req,res); }) 
  .get('/subscriptiontabledelete', (req, res) => res.render('admin_pages/subscriptiontabledelete'))
  .post('/subscriptiontabledeletesubmit', (req, res) => { admin_subscription.subscriptiontabledeletesubmitfunc(req,res); })
  .get('/subscriptiontableread', (req,res) => { admin_subscription.subscriptiontablereadfunc(req,res); })

  .get('/dbcreatereservationtable', (req, res) => { admin_reservation.reservationtablecreatefunc(req, res); })
  .get('/dbdropreservationtable', (req, res) => { admin_reservation.reservationtabledropfunc(req, res); })
  .get('/reservation_month_year_chooser', (req, res) => res.render('admin_pages/reservation_month_year_chooser'))
  .post('/reservation_month_year_chooser_post', (req, res) => { admin_reservation.month_year_validate_func(req, res); })
    
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
