var db = require('../db');

module.exports = {
  messages: {
    get: function () {
      return new Promise((resolve, reject) => {
        var queryString = 'SELECT * FROM `messages`';
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
        var queryString = `INSERT INTO messages (message_text, user_id, room_id) VALUES (?, ?, ?)`; // change query
        var queryArgs = [text, userID, roomName];

        db.query(queryString, queryArgs, function(err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
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

