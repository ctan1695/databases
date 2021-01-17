const url = require('url');
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
      let username = req.body.username;

      if (!username) {
        // or from uri
        const parsedURL = url.parse(req.url);
        // we're looking for a username like '?name=justin1' within the url
        const queries = parsedURL.query ? parsedURL.query.split('&') : [];
        let query = null;

        for (let i = 0; i < queries.length; i++) {
          query = queries[i];
          if (query.indexOf('name=') > -1) {
            query = query.split('=');
            username = query.length > 1 ? query[1] : null;
            break;
          }
        }
      }

      // return users
      models.users.get(username)
        .then((users) => {
          res.end(JSON.stringify(users));
        })
        .catch(err => {
          if (err.message === 'not found') {
            res.writeHead(404);
            res.end('not found');
          } else {
            res.writeHead(500);
            res.end('internal server error');
          }
        });

    },
    post: function (req, res) {
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

