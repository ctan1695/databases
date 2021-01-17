var Sequelize = require('sequelize');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var db = new Sequelize('chat', 'root', '', {
  dialect: 'mysql'
});

var User = db.define('User', {
  name: Sequelize.STRING
});

// The following keys are wrapped in strings because pomander
// does not like snake case for keys
var Message = db.define('Message', {
  'message_text': Sequelize.STRING,
  'user_id': Sequelize.INTEGER,
  'room_name': Sequelize.STRING
});
User.sync();
Message.sync();

module.exports = db;