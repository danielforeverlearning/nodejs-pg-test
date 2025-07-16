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
                              'CREATE TABLE reservation (ID INTEGER PRIMARY KEY, STUDENTID INTEGER, LOCATION VARCHAR(255), MONTH INTEGER, DAY INTEGER, YEAR INTEGER, HOUR INTEGER, MINUTE INTEGER, CONSTRAINT myreservationtablefkconstraint FOREIGN KEY (STUDENTID) REFERENCES student(ID));'
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
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
          if (err)
          {
               var badstr = "month_year_validate_func err = " + err;
               res.render('pages/result', {myresults: badstr} );
          }
          else //good
          {
               console.log("fields = " + JSON.stringify(fields) + "<br/>files = " + JSON.stringify(files));
               var month = fields.month_name;
               var year = fields.year_name;
               //validation checking
               if (month <= 0 || month > 12)
               {
                      var badstr = 'Sorry month must be between 1 and 12';
                      res.render('pages/result', {myresults: badstr} );
               }
               else if (year < 2025)
               {
                      var badstr = 'Sorry year must be 2025 or greater';
                      res.render('pages/result', {myresults: badstr} );
               }
               else
               {
                      const myDate = new Date(year + "-" + month + "-01");
                      const dayIndex = myDate.getDay(); //0=sunday, 1=monday, 2=tuesday, 3=wednesday, 4=thursday, 5=friday, 6=saturday
                      res.render('admin_pages/reservation_month_view', {month: month, year: year, firstday: dayIndex});
               }
          }//good
      })//form.parse
  }, //month_year_validate_func

  make_reservation: function(req,res,studentID,firstname,lastname) {
          var month;
          var day;
          var year;
    
          var form = new formidable.IncomingForm();
          form.parse(req, function (err, fields, files) {
          if (err)
          {
               var badstr = "make_reservation err = " + err;
               res.render('pages/result', {myresults: badstr} );
          }
          else //good
          {
               console.log("fields = " + JSON.stringify(fields) + " files = " + JSON.stringify(files));
               month = fields.month_name;
               day   = fields.day_name;
               year  = fields.year_name;
               //validation checking
               if (month <= 0 || month > 12)
               {
                      var badstr = 'Sorry month must be between 1 and 12';
                      res.render('pages/result', {myresults: badstr} );
               }
               else if (year < 2025)
               {
                      var badstr = 'Sorry year must be 2025 or greater';
                      res.render('pages/result', {myresults: badstr} );
               }
               else
               {
                      if (month == 1)
                      {
                           if (day < 0 || day > 31)
                           {
                               var badstr = 'Sorry, since the month is January please enter a day between 1 and 31';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 2)
                      {
                           if ((year % 4) == 0)
                           {
                               if (day < 0 || day > 29)
                               {
                                   var badstr = 'Sorry, since the year ' + year + ' is a leap year and the month is February, please enter a day between 1 and 29';
                                   res.render('pages/result', {myresults: badstr} );
                               }   
                           }
                           else
                           {
                               if (day < 0 || day > 28)
                               {
                                   var badstr = 'Sorry, since the year ' + year + ' is NOT a leap year and the month is February, please enter a day between 1 and 28';
                                   res.render('pages/result', {myresults: badstr} );
                               }  
                           }
                      }
                      else if (month == 3)
                      {
                           if (day < 0 || day > 31)
                           {
                               var badstr = 'Sorry, since the month is March please enter a day between 1 and 31';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 4)
                      {
                           if (day < 0 || day > 30)
                           {
                               var badstr = 'Sorry, since the month is April please enter a day between 1 and 30';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 5)
                      {
                           if (day < 0 || day > 31)
                           {
                               var badstr = 'Sorry, since the month is May please enter a day between 1 and 31';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 6)
                      {
                           if (day < 0 || day > 30)
                           {
                               var badstr = 'Sorry, since the month is June please enter a day between 1 and 30';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 7)
                      {
                           if (day < 0 || day > 31)
                           {
                               var badstr = 'Sorry, since the month is July please enter a day between 1 and 31';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 8)
                      {
                           if (day < 0 || day > 31)
                           {
                               var badstr = 'Sorry, since the month is August please enter a day between 1 and 31';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 9)
                      {
                           if (day < 0 || day > 30)
                           {
                               var badstr = 'Sorry, since the month is September please enter a day between 1 and 30';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 10)
                      {
                           if (day < 0 || day > 31)
                           {
                               var badstr = 'Sorry, since the month is October please enter a day between 1 and 31';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else if (month == 11)
                      {
                           if (day < 0 || day > 30)
                           {
                               var badstr = 'Sorry, since the month is November please enter a day between 1 and 30';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      else
                      {
                           if (day < 0 || day > 31)
                           {
                               var badstr = 'Sorry, since the month is December please enter a day between 1 and 31';
                               res.render('pages/result', {myresults: badstr} );
                           }
                      }
                      //my_async_insert_reservation_table_func();
               }
          }//good
      })//form.parse
  }//make_reservation
}; //module.exports
