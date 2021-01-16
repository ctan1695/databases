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
      // console.log('req.body.username: ', req.body.username);
      models.users.get(req.body.username)
        .then(userID => {
          // console.log('userID: ', userID);
          // console.log('text: ', req.body);
          return models.messages.post(req.body.text, userID, req.body.roomname);
        })
        .then(() => {
          res.end();
        })
        .catch(err => {
          // console.log(err);
          // err === no user found
          if (err.message === errUserNotFound) {
            // create the user
            console.log('user not found');
            // console.log('post req: ', req);
            models.users.post(req.body.username)
              .then(() => {
                // call `.post` again
                return module.exports.messages.post(req, res);
              })
              .catch(err => {
                console.log(err);
                res.end(err);
              });
          }

          res.end();
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

