var db = require('../db');
var sequelize = require('sequelize');

module.exports = {
  messages: {
    get: function () {
      return db.models.messages.findAll({
        attributes: {
          include: [
            [
              sequelize.literal(`(
                select name
                from users
                where id = messages.user_id
              )`),
              'username'
            ]
          ]
        }
      });
    }, // a function which produces all the messages
    post: function (text, userID, roomName) {
      // we have to wrap these keys in quotes
      // because of pomander enforcing camelCase rules
      return db.models.messages.create({
        'message_text': text,
        'user_id': userID,
        'room_name': roomName
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (username) {
      if (username) {
        console.log(`fetching "${username}"`);
        return db.models.users.findAll({
          where: {
            name: username
          }
        }).then(rows => {
          if (rows && rows.length > 0) {
            return rows[0];
          } else {
            throw new Error ('not found');
          }
        });
      } else {
        console.log('fetching all users');
        return db.models.users.findAll();
      }

    },
    post: function (username) {
      if (!username) {
        return new Promise((resolve, reject) => {
          reject(new Error('empty username'));
        });
      } else {
        return db.models.users.create({
          name: username,
        });
      }
    }
  }
};

