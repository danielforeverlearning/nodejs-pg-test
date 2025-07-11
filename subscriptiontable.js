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

};
