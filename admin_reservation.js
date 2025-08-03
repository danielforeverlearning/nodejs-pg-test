const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

var db_credential  = require('./db_credential');
const connectobj   = db_credential.myconnectobj();
/*****
const connectobj   = {
                                    user: , // e.g., 'postgres'
                                    host: ,
                                    database: , // The database you created
                                    password: ,
                                    port: 5432,
                     };
*****/

module.exports = {  

  reservationtablecreatefunc: function(req,res) {
          async function connectAndCreate() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
              
                          // Example: create table
                          const createRes = await client.query(
                              'CREATE TABLE reservation (ID SERIAL PRIMARY KEY, STUDENTID INTEGER, FIRSTNAME VARCHAR(255), LASTNAME VARCHAR(255), LOCATION VARCHAR(255), MONTH INTEGER, DAY INTEGER, YEAR INTEGER, HOUR INTEGER, MINUTE INTEGER, CONSTRAINT myreservationtablefkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
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
  },

  reservationtabledropfunc: function(req,res) {
          const client       = new Client(connectobj);
          async function connectAndDrop() {
                      try {
                          await client.connect();
                          console.log('Connected to PostgreSQL!');
                        
                          const dropRes = await client.query(
                              'DROP TABLE reservation;'
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
  }, //subscriptiontabledropfunc
  
  month_year_validate_func: function(req,res) {
      var month;
      var year;

      async function connectAndRead() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          const result = await client.query('SELECT * FROM reservation WHERE MONTH = ' + month + ' AND YEAR = ' + year);
                          console.log("month_year_validate_func result = " + JSON.stringify(result));
                          const myDate = new Date(year + "-" + month + "-01");
                          const dayIndex = myDate.getDay(); //0=sunday, 1=monday, 2=tuesday, 3=wednesday, 4=thursday, 5=friday, 6=saturday
                          var lastday=0;
                          if (month == 1)
                               lastday = 31;
                          else if (month == 2)
                          {
                               if ((year % 4)==0) //leap year
                                   lastday = 29;
                               else
                                   lastday = 28;
                          }
                          else if (month == 3)
                               lastday = 31;
                          else if (month == 4)
                               lastday = 30;
                          else if (month == 5)
                               lastday = 31;
                          else if (month == 6)
                               lastday = 30;
                          else if (month == 7)
                               lastday = 31;
                          else if (month == 8)
                               lastday = 31;
                          else if (month == 9)
                               lastday = 30;
                          else if (month == 10)
                               lastday = 31;
                          else if (month == 11)
                               lastday = 30;
                          else if (month == 12)
                               lastday = 31;
                          
                          res.render('admin_pages/reservation_month_view', {month: month, year: year, firstday: dayIndex, lastday: lastday, results: result.rows});
                        } catch (err) {
                            var errormsg = " err = " + err;
                            //console.log(errormsg);
                            res.render('admin_pages/adminresult', {myresults: errormsg} );
                        } finally {
                            await client.end();
                        }
      }
    
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          if (err)
          {
               var badstr = "month_year_validate_func err = " + err;
               res.render('admin_pages/adminresult', {myresults: badstr} );
          }
          else //good
          {
               console.log("month_year_validate_func fields = " + JSON.stringify(fields) + " files = " + JSON.stringify(files));
               month = fields.month_name;
               year = fields.year_name;
               const currentYear  = new Date().getFullYear();
               var currentMonth = new Date().getMonth(); // Returns 0 for January, 1 for February, etc.
               currentMonth++;
               
               //validation checking
               if (month <= 0 || month > 12)
               {
                      var badstr = 'Sorry month must be between 1 and 12';
                      res.render('admin_pages/adminresult', {myresults: badstr} );
               }
               else if (year < currentYear)
               {
                      var badstr = 'Sorry year must be ' + currentYear + ' or greater';
                      res.render('admin_pages/adminresult', {myresults: badstr} );
               }
               else
               {
                      connectAndRead();
               }
          }//good
      })//form.parse
  }, //month_year_validate_func

  reservation_check_date: function(req,res,studentID,firstname,lastname,adminbool,month,day,year) {
    
                   const currentYear  = new Date().getFullYear();
                   var currentMonth = new Date().getMonth(); // Returns 0 for January, 1 for February, etc.
                   currentMonth++;
                   const currentDay  = new Date().getDate();
                
                   //validation checking
                   if (month <= 0 || month > 12)
                   {
                          var badstr = 'Sorry month must be between 1 and 12';
                          if (adminbool)
                               res.render('admin_pages/adminresult', {myresults: badstr} );
                          else
                               res.render('pages/result', {myresults: badstr} );
                          return;
                   }
                   else if (year < currentYear)
                   {
                          var badstr = 'Sorry year must be ' + currentYear + ' or greater';
                          if (adminbool)
                               res.render('admin_pages/adminresult', {myresults: badstr} );
                          else
                               res.render('pages/result', {myresults: badstr} );
                          return;
                   }
                   else if ((year == currentYear && month < currentMonth) || (year == currentYear && month == currentMonth && day < currentDay))
                   {
                          var badstr = 'Sorry, reservation must be made for today or later, today is year=' + currentYear + ' month=' + currentMonth + ' day=' + currentDay;
                          if (adminbool)
                               res.render('admin_pages/adminresult', {myresults: badstr} );
                          else
                               res.render('pages/result', {myresults: badstr} );
                          return;
                   }
                   else if (month == 1)
                   {
                               if (day < 0 || day > 31)
                               {
                                   var badstr = 'Sorry, since the month is January please enter a day between 1 and 31';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 2)
                   {
                               if ((year % 4) == 0)
                               {
                                   if (day < 0 || day > 29)
                                   {
                                       var badstr = 'Sorry, since the year ' + year + ' is a leap year and the month is February, please enter a day between 1 and 29';
                                       if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                       else
                                        res.render('pages/result', {myresults: badstr} );
                                       return;
                                   }   
                               }
                               else
                               {
                                   if (day < 0 || day > 28)
                                   {
                                       var badstr = 'Sorry, since the year ' + year + ' is NOT a leap year and the month is February, please enter a day between 1 and 28';
                                       if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                       else
                                        res.render('pages/result', {myresults: badstr} );
                                       return;
                                   }  
                               }
                   }
                   else if (month == 3)
                   {
                               if (day < 0 || day > 31)
                               {
                                   var badstr = 'Sorry, since the month is March please enter a day between 1 and 31';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 4)
                   {
                               if (day < 0 || day > 30)
                               {
                                   var badstr = 'Sorry, since the month is April please enter a day between 1 and 30';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 5)
                   {
                         if (day < 0 || day > 31)
                         {
                             var badstr = 'Sorry, since the month is May please enter a day between 1 and 31';
                             if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                             else
                                        res.render('pages/result', {myresults: badstr} );
                             return;
                         }
                   }
                   else if (month == 6)
                   {
                         if (day < 0 || day > 30)
                         {
                             var badstr = 'Sorry, since the month is June please enter a day between 1 and 30';
                             if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                             else
                                        res.render('pages/result', {myresults: badstr} );
                             return;
                         }
                   }
                   else if (month == 7)
                   {
                               if (day < 0 || day > 31)
                               {
                                   var badstr = 'Sorry, since the month is July please enter a day between 1 and 31';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 8)
                   {
                               if (day < 0 || day > 31)
                               {
                                   var badstr = 'Sorry, since the month is August please enter a day between 1 and 31';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 9)
                   {
                               if (day < 0 || day > 30)
                               {
                                   var badstr = 'Sorry, since the month is September please enter a day between 1 and 30';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 10)
                   {
                               if (day < 0 || day > 31)
                               {
                                   var badstr = 'Sorry, since the month is October please enter a day between 1 and 31';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 11)
                   {
                               if (day < 0 || day > 30)
                               {
                                   var badstr = 'Sorry, since the month is November please enter a day between 1 and 30';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
                   else if (month == 12)
                   {
                               if (day < 0 || day > 31)
                               {
                                   var badstr = 'Sorry, since the month is December please enter a day between 1 and 31';
                                   if (adminbool)
                                        res.render('admin_pages/adminresult', {myresults: badstr} );
                                   else
                                        res.render('pages/result', {myresults: badstr} );
                                   return;
                               }
                   }
    
                   const myDate = new Date(year + "-" + month + "-" + day);
                   const dayIndex = myDate.getDay(); //0=sunday, 1=monday, 2=tuesday, 3=wednesday, 4=thursday, 5=friday, 6=saturday
                   res.render('admin_pages/reservation_chose_location_time', {studentID:studentID, firstname:firstname, lastname:lastname, month:month, day:day, year:year, dayIndex:dayIndex, adminbool:adminbool} );
  }, //reservation_check_date

  reservation_check_location_time: function(req,res,studentID,firstname,lastname,month,day,year,adminbool) {
          var classlocation;
          var classhour;
          var classminute;
    
          async function connectAndInsert() {    
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          var insertstmt = "INSERT INTO reservation (STUDENTID, FIRSTNAME, LASTNAME, LOCATION, MONTH, DAY, YEAR, HOUR, MINUTE) VALUES (" + studentID + ", '" + firstname + "', '" + lastname + "', '" + classlocation + "', " + month + ", " + day + ", " + year + ", " + classhour + ", " + classminute + ");";
                          console.log(insertstmt);
                          const insertRes = await client.query(insertstmt);
                          var resultstr = 'reservation_check_location_time insertRes = ' + JSON.stringify(insertRes);
                          if (adminbool)
                               res.render('admin_pages/adminresult', {myresults: resultstr} );
                          else
                               res.render('pages/result', {myresults: resultstr} );
                        } catch (err) {
                            var badstr = 'reservation_check_location_time, ERROR = ' + err;
                            if (adminbool)
                                 res.render('admin_pages/adminresult', {myresults: badstr} );
                            else
                                 res.render('pages/result', {myresults: badstr} );
                        } finally {
                            await client.end();
                        }
          }

    
          var form = new formidable.IncomingForm();
          form.parse(req, function (err, fields, files) {
              if (err)
              {
                   var badstr = "reservation_check_location_time err = " + err;
                   if (adminbool)
                        res.render('admin_pages/adminresult', {myresults: badstr} );
                   else
                        res.render('pages/result', {myresults: badstr} );
                   return;
              }
              else //good
              {
                   console.log("reservation_check_location_time fields = " + JSON.stringify(fields) + " files = " + JSON.stringify(files));
                   classlocation = fields.location_name;
                   var timeint   = fields.time_name;
                   if (timeint == 1000)
                   {
                        classhour     = 10;
                        classminute   = 0;
                   }
                   else if (timeint == 1100)
                   {
                        classhour     = 11;
                        classminute   = 0;
                   }
                   else if (timeint == 1730)
                   {
                        classhour     = 17;
                        classminute   = 30;
                   }
                   else
                   {
                        classhour     = 18;
                        classminute   = 45;
                   }
                
                   connectAndInsert();
              }//good
          })//form.parse
  }//reservation_check_location_time
}; //module.exports
