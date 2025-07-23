const express      = require('express')
const path         = require('path')
const https        = require('https');
const formidable   = require('formidable')
const fs           = require('fs')

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

var fileNameTableStudent;
var filePathTableStudent;

var fileNameTableSubscription;
var filePathTableSubscription;

async function connectAndReadTableStudent() {
                      var returnobj;
                      try {
                          var dd = new Date();
                          fileNameTableStudent =  'student_table_' + dd.getFullYear() + '_' + (dd.getMonth() + 1) + '_' + dd.getDate() + '_' + dd.getHours() + '_' + dd.getMinutes() + '_' + dd.getSeconds() + '_' + dd.getMilliseconds() + '.csv';
                          filePathTableStudent = path.join(__dirname, 'public/' + fileNameTableStudent); // Path to your text file
                          fs.writeFileSync(filePathTableStudent, 'ID, FIRSTNAME, LASTNAME, EMAIL, PHONEAREACODE, PHONENUMBER\n');
                      } catch (err) {
                          var badstr = 'Error student table writeFileSync:' + err;
                          returnobj = {status: -1, myresults: badstr};
                          return returnobj;
                      }
    
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          const result = await client.query('SELECT * FROM student ORDER BY ID ASC');
                          
                          result.rows.forEach(function(row) {
                                try {
                                    var line = '' + row.id + ', "' + row.firstname + '", "' + row.lastname + '", "' + row.email + '", ' + row.phoneareacode + ', ' + row.phonenumber + '\n';
                                    fs.appendFileSync(filePathTableStudent, line);
                                } catch (err) {
                                    var badstr = 'Error student table appendFileSync:' + err;
                                    returnobj = {status: -1, myresults: badstr};
                                    return returnobj;
                                }
                          })
                      } catch (err) {
                          var badstr = 'Error reading student table = ' + err;
                          returnobj = {status: -1, myresults: badstr};
                          return returnobj;
                      } finally {
                          await client.end();
                          returnobj = {status: 0, myresults: ""};
                          return returnobj;
                      }
}  //connectAndReadTableStudent

async function connectAndReadTableSubscription() {
                      var returnobj;
                      try {
                          var dd = new Date();
                          fileNameTableSubscription =  'subscription_table_' + dd.getFullYear() + '_' + (dd.getMonth() + 1) + '_' + dd.getDate() + '_' + dd.getHours() + '_' + dd.getMinutes() + '_' + dd.getSeconds() + '_' + dd.getMilliseconds() + '.csv';
                          filePathTableSubscription = path.join(__dirname, 'public/' + fileNameTableSubscription); // Path to your text file
                          fs.writeFileSync(filePathTableSubscription, 'STUDENTID, ACTIVE, LASTPAIDMONTH, LASTPAIDYEAR\n');
                      } catch (err) {
                          var badstr = 'Error subscription table writeFileSync:' + err;
                          returnobj = {status: -1, myresults: badstr};
                          return returnobj;
                      }
    
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          const result = await client.query('SELECT * FROM subscription ORDER BY STUDENTID ASC');
                          
                          result.rows.forEach(function(row) {
                                try {
                                    var line = '' + row.studentid + ', ' + row.active + ', ' + row.lastpaidmonth + ', ' + row.lastpaidyear + '\n';
                                    fs.appendFileSync(filePathTableSubscription, line);
                                } catch (err) {
                                    var badstr = 'Error subscription table appendFileSync:' + err;
                                    returnobj = {status: -1, myresults: badstr};
                                    return returnobj;
                                }
                          })
                      } catch (err) {
                          var badstr = 'Error reading subscription table = ' + err;
                          returnobj = {status: -1, myresults: badstr};
                          return returnobj;
                      } finally {
                          await client.end();
                          returnobj = {status: 0, myresults: ""};
                          return returnobj;
                      }
}  //connectAndReadTableSubscription

module.exports = {  

  download_student_table_func: function(req,res) {
        res.download(filePathTableStudent, fileNameTableStudent, (err) => {
            if (err) {
              console.error('Error downloading table student file:', err);
              res.status(500).send('Error downloading table student file:' + err);
            } else {
              fs.unlink(filePathTableStudent, (err) => {
                  if (err)
                      console.error('Error deleting table student file:', err);
                  else
                      console.log(fileNameTableStudent + ' deleted successfully');
              });
            }
        });
  },

  download_subscription_table_func: function(req,res) {
        res.download(filePathTableSubscription, fileNameTableSubscription, (err) => {
            if (err) {
              console.error('Error downloading table subscription file:', err);
              res.status(500).send('Error downloading table subscription file:' + err);
            } else {
              fs.unlink(filePathTableSubscription, (err) => {
                  if (err)
                      console.error('Error deleting table subscription file:', err);
                  else
                      console.log(fileNameTableSubscription + ' deleted successfully');
              });
            }
        });
  },


  make_all_db_table_files: function(req,res) {
    
          var table_student = connectAndReadTableStudent();
          if (table_student.status == -1)
              res.render('pages/result', {myresults: table_student.myresults} );

          var table_subscription = connectAndReadTableSubscription();
          if (table_subscription.status == -1)
              res.render('pages/result', {myresults: table_subscription.myresults} );


    
          res.render('admin_pages/download_all_db_table_files');
  }

}; //module.exports
