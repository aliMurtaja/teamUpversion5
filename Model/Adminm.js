var db = require('../config');

var Admin_tab = db.db.MyAppModel.extend({
    tableName: "t_user",
  });
  
  Admin = new Admin_tab();

  module.exports ={Admin}

