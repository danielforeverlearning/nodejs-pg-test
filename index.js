//github.com --> settings --> integration-applications --> render.com configure
//environment variable BASE_URL 0.0.0.0
//npm init
//npm install pg
//npm install express
//npm install path
//npm install https
//npm install ejs
//npm install formidable
//npm install fs
//npm install crypto

const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')
const fs           = require('fs')

const PORT         = process.env.PORT || 5000

var admin_accounts = require('./admin_accounts');
var admin_student = require('./admin_student');
var admin_subscription = require('./admin_subscription');
var admin_reservation = require('./admin_reservation');
var admin_db_tools = require('./admin_db_tools');

var acctstud = require('./account_student');


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  .get('/', (req, res) => res.render('pages/home'))
  .get('/studentlogin', (req, res) => res.render('pages/student_login'))
  .post('/loginstudentsubmit', (req, res) => { acctstud.loginstudentsubmitfunc(req,res); })

  .get('/adminhome', (req, res) => res.render('admin_pages/adminhome'))
  .get('/student/:sortorder', (req,res) => {  
        const sortorder = req.params.sortorder;
        admin_student.studentviewfunc(req,res,sortorder);
  })
  .get('/studentdeleteconfirm/:id/:firstname/:lastname', (req,res) => res.render('admin_pages/delete_confirm', {studentID: req.params.id, firstname: req.params.firstname, lastname: req.params.lastname}))
  .get('/studentdelete/:id', (req, res) => {  
                                              const studentID = req.params.id;
                                              admin_student.deletefunc(req,res,studentID);
                                           })
  .get('/studentmonthlysubscription/:id/:firstname/:lastname', (req,res) => {  
                                                            const studentID = req.params.id;
                                                            const firstname = req.params.firstname;
                                                            const lastname  = req.params.lastname;
                                                            admin_subscription.read1IDfunc(req,res,studentID,firstname,lastname);
                                                       })
  .post('/studenttableupdatesubmit', (req,res) => { admin_student.studenttableupdate3func(req,res); })
  .get('/studentupdate/:id', (req, res) => {  
        const studentID = req.params.id;
        admin_student.updatefunc(req,res,studentID);
  })
  .post('/adminoverwritestudacctsubmit', (req, res) => { 
        admin_accounts.adminoverwritestudacctsubmitfunc(req,res);
  })
  .post('/admininsertstudacctsubmit', (req, res) => {
        admin_accounts.admininsertstudacctsubmitfunc(req,res);
  })
  .get('/student/:sortorder', (req,res) => {  
        const sortorder = req.params.sortorder;
        admin_student.studentviewfunc(req,res,sortorder);
  })
  .get('/studenttableinsert', (req, res) => res.render('admin_pages/studenttableinsert'))
  .post('/studenttableinsertsubmit', (req, res) => { admin_student.studenttableinsertfunc(req,res); })
  
  .get('/subscripinsert/:id/:firstname/:lastname', (req, res) => res.render('admin_pages/subscriptiontableinsert', {studentID: req.params.id, firstname: req.params.firstname, lastname: req.params.lastname }))
  .post('/subscriptiontableinsertsubmit', (req, res) => { admin_subscription.subscriptiontableinsertsubmitfunc(req,res); })
  .get('/subscripupdate/:id/:firstname/:lastname', (req, res) => {  
                                              const studentID = req.params.id;
                                              const firstname = req.params.firstname;
                                              const lastname  = req.params.lastname;
                                              admin_subscription.updatefunc(req,res,studentID,firstname,lastname);
                                            })
  .post('/subscripupdatepost/:id/:firstname/:lastname', (req,res) => { 
                                                    const studentID = req.params.id;
                                                    const firstname = req.params.firstname;
                                                    const lastname  = req.params.lastname;
                                                    admin_subscription.updatepostfunc(req,res,studentID,firstname,lastname);
                                                })
  
  .get('/ghettoadmintools', (req,res) => res.render('admin_pages/ghetto_admin_tools'))
  .get('/makealldbtablefiles', (req,res) => { admin_db_tools.make_all_db_table_files(req,res); })
  .get('/downloadstudenttablefile', (req,res) => { admin_db_tools.download_student_table_func(req,res); })
  .get('/downloadsubscriptiontablefile', (req,res) => { admin_db_tools.download_subscription_table_func(req,res); })
  .get('/downloadreservationtablefile', (req,res) => { admin_db_tools.download_reservation_table_func(req,res); })
  .get('/emailblast', (req, res) => {
        var badstr = 'Emailblast not done yet, will probably use gmail rest-API with a free gmail account';
        res.render('admin_pages/adminresult', {myresults: badstr} );
  })
  
  .get('/dbcreatestudenttable', (req, res) => { admin_student.studenttablecreatefunc(req, res); })
  .get('/dbdropstudenttable', (req, res) => { admin_student.studenttabledropfunc(req, res); })

  .get('/dbcreateaccount_student', (req, res) => { admin_accounts.studentacctcreatefunc(req, res); })
  .get('/dbdropaccount_student', (req, res) => { admin_accounts.studentacctdropfunc(req, res); })
  
  .get('/dbcreatesubscriptiontable', (req, res) => { admin_subscription.subscriptiontablecreatefunc(req, res); })
  .get('/dbdropsubscriptiontable', (req, res) => { admin_subscription.subscriptiontabledropfunc(req,res); }) 
  .get('/subscriptiontabledelete', (req, res) => res.render('admin_pages/subscriptiontabledelete'))
  .post('/subscriptiontabledeletesubmit', (req, res) => { admin_subscription.subscriptiontabledeletesubmitfunc(req,res); })
  .get('/subscriptiontableread', (req,res) => { admin_subscription.subscriptiontablereadfunc(req,res); })

  .get('/dbcreatereservationtable', (req, res) => { admin_reservation.reservationtablecreatefunc(req, res); })
  .get('/dbdropreservationtable', (req, res) => { admin_reservation.reservationtabledropfunc(req, res); })
  .get('/reservationmonthyearchooser', (req, res) => res.render('admin_pages/reservation_month_year_chooser'))
  .post('/reservationmonthyearchooserpost', (req, res) => { admin_reservation.month_year_validate_func(req, res); })




  
  .get('/studentmakereservation/:id/:firstname/:lastname', (req,res) => {  
                                                            const studentID = req.params.id;
                                                            const firstname = req.params.firstname;
                                                            const lastname  = req.params.lastname;
                                                            res.render('pages/reservation_insert', { studentID:studentID, firstname:firstname, lastname:lastname });
                                                       })
    
  .post('/reservation_insert_post/:id/:firstname/:lastname', (req,res) => {  
                                                            const studentID = req.params.id;
                                                            const firstname = req.params.firstname;
                                                            const lastname  = req.params.lastname;
                                                            admin_reservation.reservation_check_date(req,res,studentID,firstname,lastname);
                                                       })
  .post('/reservation_insert_post_2/:id/:firstname/:lastname/:month/:day/:year', (req,res) => {  
                                                            const studentID = req.params.id;
                                                            const firstname = req.params.firstname;
                                                            const lastname  = req.params.lastname;
                                                            const month     = req.params.month;
                                                            const day       = req.params.day;
                                                            const year      = req.params.year;
                                                            admin_reservation.reservation_check_location_time(req,res,studentID,firstname,lastname,month,day,year);
                                                       }) 


  
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


