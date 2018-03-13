'use strict';
module.exports = function(app) {
  var user = require('../controllers/userNoAuthController');
  app.route('/users')
    .put(user.create_user);
    
  app.route('/usersfacebook')
    .put(user.create_user_facebook);

  app.route('/authenticate')
    .post(user.authenticate_user);
  app.route('/authenticatefacebook')
    .post(user.authenticate_user_facebook)
}


