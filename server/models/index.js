var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      return new Promise((resolve, reject) => {
        var queryString = 'select *, (select name from `users` where id = m.user_id) username from `messages` m;';
        var queryArgs = [];

        db.query(queryString, queryArgs, function(err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    }, // a function which produces all the messages
    post: function (text, userID, roomName) {
      return new Promise((resolve, reject) => {
        var queryString = `INSERT INTO messages (message_text, user_id, room_name) VALUES (?, ?, ?)`;
        var queryArgs = [text, userID, roomName];

        db.query(queryString, queryArgs, function(err, results) {
          if (err) {
            reject(err);
          } else {
            console.log('messages results: ', results);
            resolve(results);
          }
        });
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (username) {
      return new Promise((resolve, reject) => {
        var queryString;
        var queryArgs;

        if (username) {
          queryString = `SELECT id, name FROM users WHERE name = ?`; // change query
          queryArgs = [username];
        } else {
          queryString = `SELECT id, name FROM users`; // change query
          queryArgs = [];
        }

        db.query(queryString, queryArgs, function(err, results) {
          if (err) {
            reject(err);
          } else {
            if (results.length > 0) {
              resolve(username ? results[0].id : results);
            } else {
              reject(new Error('not found'));
            }
          }
        });
      });
    },
    post: function (username) {
      return new Promise((resolve, reject) => {
        var queryString = `INSERT INTO users (name) VALUES (?)`; // change query
        var queryArgs = [username];

        db.query(queryString, queryArgs, function(err, results) {
          if (err) {
            reject(err);
          } else {
            console.log('results: ', results);
            resolve(results);
          }
        });
      });
    }
  }
};

