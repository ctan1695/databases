const { response } = require('express');
var models = require('../models');

module.exports = {
  messages: {
    get: function (req, res) {}, // a function which handles a get request for all messages
    post: function (req, res) {
      // console.log(req);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
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

