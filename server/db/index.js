var Sequelize = require('sequelize');

// Create a database connection and export it from this file.
// You will need to connect with the user "root", no password,
// and to the database "chat".

var db = new Sequelize('chat', 'root', '', {
  dialect: 'mysql',
  logging: false
});

var Users = db.define('users', {
  name: Sequelize.STRING
});

// The following keys are wrapped in strings because pomander
// does not like snake case for keys
var Messages = db.define('messages', {
  'message_text': Sequelize.STRING,
  'user_id': Sequelize.INTEGER,
  'room_name': Sequelize.STRING
});
Users.sync();
Messages.sync();

module.exports = db;