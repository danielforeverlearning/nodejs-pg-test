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

const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')
const fs           = require('fs')

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

  .get('/testdownload', (req,res) => {
        const filePath = path.join(__dirname, 'public/mydumbass.txt'); // Path to your text file
        try {
            fs.writeFileSync(filePath, 'header line');
        } catch (err) {
            var badstr = 'Error writeFileSync:' + err;
            console.log(badstr);
            res.render('pages/result', {myresults: badstr} );
        }

        try {
            fs.appendFileSync(filePath, 'second line');
        } catch (err) {
            var badstr = 'Error appendFileSync:' + err;
            console.log(badstr);
            res.render('pages/result', {myresults: badstr} );
        }

        /***
        const fileName = 'downloaded_text.txt'; // Name for the downloaded file
        res.download(filePath, fileName, (err) => {
            if (err) {
              var badstr = 'Error downloading file:' + err;
              console.log(badstr);
              res.render('pages/result', {myresults: badstr} );
            }
        });
        *****/

        var goodstr = "made file";
        //var goodstr = 'File download should be successful, look at your web-browser download status at the top right side of your web-browser.';
        console.log(goodstr);
        res.render('pages/result', {myresults: goodstr} );
  })
  
  .get('/ghettoadmintools', (req,res) => res.render('admin_pages/ghetto_admin_tools'))
  .get('/emailblast', (req, res) => {
        var badstr = 'Emailblast not done yet, will probably use gmail rest-API with a free gmail account';
        res.render('pages/result', {myresults: badstr} );
  })

  .post('/studenttableupdatesubmit', (req,res) => { studenttable.studenttableupdate3func(req,res); })
  .get('/studentupdate/:id', (req, res) => {  
        const studentID = req.params.id;
        studenttable.updatefunc(req,res,studentID);
  })
  .get('/student/:sortorder', (req,res) => {  
        const sortorder = req.params.sortorder;
        studenttable.studentviewfunc(req,res,sortorder);
  })
  
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
  .get('/reservationmonthyearchooser', (req, res) => res.render('admin_pages/reservation_month_year_chooser'))
  .post('/reservationmonthyearchooserpost', (req, res) => { admin_reservation.month_year_validate_func(req, res); })
  .get('/studentmakereservation/:id/:firstname/:lastname', (req,res) => {  
                                                            const studentID = req.params.id;
                                                            const firstname = req.params.firstname;
                                                            const lastname  = req.params.lastname;
                                                            res.render('admin_pages/reservation_insert', { studentID:studentID, firstname:firstname, lastname:lastname });
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
