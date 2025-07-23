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

var fileName;
var filePath;

async function connectAndRead() {
                      var returnobj;
                      try {
                          var dd = new Date();
                          fileName =  'student_table_' + dd.getFullYear() + '_' + (dd.getMonth() + 1) + '_' + dd.getDate() + '_' + dd.getHours() + '_' + dd.getMinutes() + '_' + dd.getSeconds() + '_' + dd.getMilliseconds() + '.csv';
                          filePath = path.join(__dirname, 'public/' + fileName); // Path to your text file
                          fs.writeFileSync(filePath, 'ID, FIRSTNAME, LASTNAME, EMAIL, PHONEAREACODE, PHONENUMBER\n');
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
                                    fs.appendFileSync(filePath, line);
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
}  //connectAndRead

module.exports = {  

  download_student_table_func: function(req,res) {
        res.download(filePath, fileName, (err) => {
            if (err) {
              console.error('Error downloading the file:', err);
              res.status(500).send('Error downloading the file:' + err);
            } else {
              fs.unlink(filePath, (err) => {
                  if (err)
                      console.error('Error deleting file:', err);
                  else
                      console.log(fileName + ' deleted ssuccessfully');
              });
            }
        });
  },


  make_all_db_table_files: function(req,res) {
    
          var table_student = connectAndRead();
          console.log("table_student = " + table_student);
          if (table_student.status == -1)
              res.render('pages/result', {myresults: table_student.myresults} );

    
          res.render('admin_pages/download_all_db_table_files');
  }

}; //module.exports
