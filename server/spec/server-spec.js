/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var dbConnection = require('../db/index');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  beforeEach(function(done) {
    console.log(dbConnection.models.messages);

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('set FOREIGN_KEY_CHECKS=0')
      .then(() => dbConnection.query('truncate messages'))
      .then(() => dbConnection.query('truncate users'))
      .then(() => done())
      .catch(err => {
        console.log(`before each hook: ${err.message}`);

        done();
      });
  });

  afterEach(function() {
    dbConnection.query('set FOREIGN_KEY_CHECKS=1');
  });

  it('Should insert posted messages to the DB', function(done) {
    console.log('before we send POST');
    // Post the user to the chat server.
    request({
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/users',
      json: { username: 'Valjean' }
    }, function (err, res, body) {
      // Post a message to the node chat server:
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'Valjean',
          text: 'In mercy\'s name, three days is all I need.',
          roomname: 'Hello'
        }
      }, function () {
        // Now if we look in the database, we should find the
        // posted message there.

        dbConnection.models.messages.findAll()
          .then(results => {
            expect(results.length).to.equal(1);

            expect(results[0].message_text).to.equal('In mercy\'s name, three days is all I need.');

            done();
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    const tests = {
      text: 'Men like you can never change!',
      userID: 1,
      roomName: 'main'
    };

    dbConnection.models.messages.create({
      'message_text': tests.text,
      'user_id': tests.userID,
      'room_name': tests.roomName
    }).then(() => {
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].message_text).to.equal(tests.text);
        expect(messageLog[0].room_name).to.equal(tests.roomName);
        done();
      });
    }).catch(err => {
      console.log(err);
    });
  });

  it('Should return all of the users from the DB', function(done) {
    const users = ['justin1', 'justin2', 'justin3', 'justin4'];

    // Let's insert a message into the db
    dbConnection.models.users.bulkCreate([
      { name: users[0] },
      { name: users[1] },
      { name: users[2] },
      { name: users[3] },
    ]).then(() => {
      request('http://127.0.0.1:3000/classes/users', function(error, response, body) {
        var usersFromServer = JSON.parse(body);
        for(var i = 0; i < usersFromServer.length; i++) {
          expect(usersFromServer[i].name).to.include(users[i]);
        }

        done();
      });
    }).catch(err => {
      console.log(`return all of the users err: ${err.message}`);
    });
  });

  it('Should return one user from the DB', function(done) {
    const username = 'justin1';

    dbConnection.models.users.create({
      name: username
    }).then(() => {
      request({
        method: 'GET',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: {
          username: username
        }
      }, function () {

        dbConnection.models.users.findAll({
          where: {
            name: username
          }
        }).then((results) => {
          if (results.length < 1) {
            throw new Error('not found');
          } else {
            console.log('results length', results.length);
            expect(results.length).to.equal(1);
            expect(results[0].dataValues.name).to.equal(username);
            done();
          }
        }).catch(err => {
          console.log(`fetch single user error: ${err}`);
          expect(err).to.be.null;
          done();
        });
      });
    }).catch(err => {
      console.log(`create user error: ${err}`);
      expect(err).to.be.null;

      done();
    });
  });
});
