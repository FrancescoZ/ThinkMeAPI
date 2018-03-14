'use strict';
module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/search')
    .post(user.search);
  
  app.route('/users/:senderId/pair')
    .put(user.pair)
    .delete(user.delet_pair);
  
  app.route('/users/:receiverId/pair/ack')
    .put(user.ack_pair);

  app.route('/users/:userId/poke')
    .get(user.poke);

  app.route('/users/:userId')
    .get(user.get_user)
    .put(user.update_password)
    .delete(user.delete_user);
};