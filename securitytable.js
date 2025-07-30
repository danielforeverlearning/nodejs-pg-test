const express      = require('express')
const path         = require('path')
var   https        = require('https');
const formidable   = require('formidable');
const crypto       = require('crypto');

const PORT         = process.env.PORT || 5000;

const { Client }   = require('pg');

var db_credential = require('./db_credential');
const connectobj    = db_credential.myconnectobj();

function hashHmacJs(algo, data, key, raw_output = false) {
    const hmac = crypto.createHmac(algo, key);
    hmac.update(data);
    const digest = hmac.digest(raw_output ? 'binary' : 'hex');
    return digest;
}//hashHmacJs

module.exports = {

  
securityReadByStudentID: async function(res, studentID, firstname, lastname) {  
                        var dbgoodresult;
                        var badstr;
                        var result;
                        const client       = new Client(connectobj);
                        try {
                          await client.connect();

                          var selectstmt = 'SELECT * FROM security WHERE STUDENTID = ' + studentID;
                          result = await client.query(selectstmt);
                          console.log(" result = " + JSON.stringify(result));
                          dbgoodresult = true;
                        } catch (err) {
                            dbgoodresult = false;
                            badstr = "securityReadByStudentID err = " + err;
                        } finally {
                            await client.end();
                            if (dbgoodresult) {
                                console.log("securityReadByStudentID result.rows.length = " + result.rows.length);
                                res.render('pages/securitytableinsert', {rows: result.rows, rowslength: result.rows.length, studentID: studentID, firstname: firstname, lastname: lastname});
                            }
                            else
                              res.render('pages/result', {myresults: badstr} );
                        }
  }, //securityReadByStudentID
  
  securitytableinsertfunc: function(req, res)  {
      res.render('pages/result', {myresults: "no code yet for securitytableinsertfunc"});
  } //securitytableinsertfunc

  
};
