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
        return db.models.users.findAll();
      }

      // return new Promise((resolve, reject) => {
      //   var queryString;
      //   var queryArgs;

      //   if (username) {
      //     queryString = `SELECT id, name FROM users WHERE name = ?`; // change query
      //     queryArgs = [username];
      //   } else {
      //     queryString = `SELECT id, name FROM users`; // change query
      //     queryArgs = [];
      //   }

      //   db.query(queryString, queryArgs, function(err, results) {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       if (results.length > 0) {
      //         resolve(username ? results[0].id : results);
      //       } else {
      //         reject(new Error('not found'));
      //       }
      //     }
      //   });
      // });
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


      // return new Promise((resolve, reject) => {
      //   var queryString = `INSERT INTO users (name) VALUES (?)`; // change query
      //   var queryArgs = [username];

      //   db.query(queryString, queryArgs, function(err, results) {
      //     if (err) {
      //       reject(err);
      //     } else {
      //       console.log('results: ', results);
      //       resolve(results);
      //     }
      //   });
      // });
    }
  }
};

