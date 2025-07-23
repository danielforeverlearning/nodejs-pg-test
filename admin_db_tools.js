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

const filePath = path.join(__dirname, 'public/student_table.txt'); // Path to your text file

module.exports = {  

  make_student_table_func: function(req,res) {
          async function connectAndRead() {
                      const client       = new Client(connectobj);
                      try {
                          await client.connect();
                          const result = await client.query('SELECT * FROM student ORDER BY ID ASC');
                          result.rows.forEach(function(row) {
                                try {
                                    var line = '' + row.ID + ', "' + row.firstname + '", "' + row.lastname + '", "' + row.email + '", ' + row.phoneareacode + ', ' + row.phonenumber + '\n';
                                    fs.appendFileSync(filePath, line);
                                } catch (err) {
                                    var badstr = 'Error appendFileSync:' + err;
                                    console.log(badstr);
                                    res.render('pages/result', {myresults: badstr} );
                                }
                          }
                      } catch (err) {
                          var result = 'Error reading student table = ' + err;
                          res.send(result);
                      } finally {
                          await client.end();
                          res.render('admin_pages/download_student_table');
                      }
          }

          try {
              fs.writeFileSync(filePath, 'ID, FIRSTNAME, LASTNAME, EMAIL, PHONEAREACODE, PHONENUMBER\n');
          } catch (err) {
              var badstr = 'Error writeFileSync:' + err;
              console.log(badstr);
              res.render('pages/result', {myresults: badstr} );
          }
          
          connectAndRead();
  }, //make_student_table_func

  download_student_table_func: function(req,res) {
        const fileName = 'downloaded_text.txt'; // Name for the downloaded file
        res.download(filePath, fileName, (err) => {
            if (err) {
              console.error('Error downloading the file:', err);
              res.status(500).send('Error downloading the file:' + err);
            } else {
              var goodstr = 'download good';
              res.render('pages/result', {myresults: goodstr} );
            } 
        });
  }

}; //module.exports
