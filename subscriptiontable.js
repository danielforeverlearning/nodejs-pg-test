const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable')

const PORT         = process.env.PORT || 5000

const { Client }   = require('pg');

const connectobj   = {
                                    user: 'dbadmin', // e.g., 'postgres'
                                    host: 'dpg-d1nhturipnbc73am7180-a',
                                    database: 'garagedb_cwyn', // The database you created
                                    password: 'cH8a1Ifb1iYBZt2ckpOowoclf5nrfjid',
                                    port: 5432,
                     };


module.exports = {

    subscriptiontablereadfunc: function(req,res)  {
            async function connectAndRead() {  
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();
                          console.log('subscriptiontablereadfunc Connected to PostgreSQL!');
                          const result = await client.query('SELECT * FROM subscription');
                          console.log("result = " + JSON.stringify(result));
                          res.render('pages/subscriptiontableread', {results: result.rows} );
                        } catch (err) {
                            var result = 'subscriptiontablereadfunc ERROR = ' + err;
                            res.send(result);
                        } finally {
                            await client.end();
                            console.log('subscriptiontablereadfunc Disconnected from PostgreSQL.');
                        }
            }
            connectAndRead(); 
  },

};
