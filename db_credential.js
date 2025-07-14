const connectobj   = {
                                    user: 'garagedb_i5vo_user', // e.g., 'postgres'
                                    host: 'dpg-d1p3n83ipnbc73fk1qk0-a',
                                    database: 'garagedb_i5vo', // The database you created
                                    password: 'TTMNPyqcxBv2Gf3WwmBhAlnsLx3M40ek',
                                    port: 5432,
                     };


module.exports = {

  myconnectobj: function() {
      return connectobj;
  }

};
