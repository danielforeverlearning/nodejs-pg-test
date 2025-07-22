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

          try {
              fs.writeFileSync(filePath, 'header line\n');
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
          
          //connectAndRead();

          res.render('admin_pages/download_student_table');
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
