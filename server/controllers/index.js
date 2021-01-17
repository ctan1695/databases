const { response } = require('express');
var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get()
        .then((messages) => {
          res.end(JSON.stringify(messages));
        })
        .catch(err => {
          console.log(err);
          res.end(null);
        });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      const errUserNotFound = 'not found';

      const {
        roomname,
        text,
        username
      } = req.body;

      models.users.get(username)
        .then(user => {
          if (!user) {
            throw new Error(`failed to fetch ${username}`);
          }

          const userID = user.id;

          return models.messages.post(text, userID, roomname);
        })
        .then(() => {
          res.writeHead(200);
          res.end();
        })
        .catch(err => {
          if (err.message === errUserNotFound) {
            // create the user
            console.log(`${username} not found. creating user...`);
            models.users.post(username)
              .then(() => {
                // call `.post` again
                console.log(`created user: ${username}`);
                return module.exports.messages.post(req, res);
              })
              .catch(err => {
                console.log(`failed to create user (${username}): ${err.message}`);
                res.end(err);
              });
          } else {
            res.writeHead(500, {
              'Content-Type': 'text/plain'
            });

            res.end(err.message);
          }
        });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      // get username from body
      const username = req.body.username;

      // return users
      models.users.get(username)
        .then((users) => {
          res.end(JSON.stringify(users));
        })
        .catch(err => {
          console.log(err);
          res.end();
        });

    },
    post: function (req, res) {
      console.log(req.body.username);

      models.users.post(req.body.username)
        .then(() => {
          res.end();
        })
        .catch(err => {
          console.log(err);
          res.end();
        });
    }
  }
};

