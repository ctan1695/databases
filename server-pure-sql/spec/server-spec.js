/* You'll need to have MySQL running and your Node server running
 * for these tests to pass. */

var mysql = require('mysql');
var request = require('request'); // You might need to npm install the request module!
var expect = require('chai').expect;

describe('Persistent Node Chat Server', function() {
  var dbConnection;


  beforeEach(function(done) {
    dbConnection = mysql.createConnection({
      user: 'root',
      password: '',
      database: 'chat'
    });
    dbConnection.connect();

    var tablename = 'messages'; // TODO: fill this out

    /* Empty the db table before each test so that multiple tests
     * (or repeated runs of the tests) won't screw each other up: */
    dbConnection.query('set FOREIGN_KEY_CHECKS=0');
    dbConnection.query('truncate messages');
    dbConnection.query('truncate users', done);

  });

  afterEach(function() {
    dbConnection.query('set FOREIGN_KEY_CHECKS=1');
    dbConnection.end();
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

        // TODO: You might have to change this test to get all the data from
        // your message table, since this is schema-dependent.
        // Chloe: We have not changed anything for this TODO yet.
        var queryString = 'SELECT * FROM `messages`';
        var queryArgs = [];

        //dbConnection.query(queryString, queryArgs, function(err, results) {
        dbConnection.query(queryString, function(err, results) {
          // Should have one result:
          expect(results.length).to.equal(1);

          // TODO: If you don't have a column named text, change this test.
          expect(results[0].message_text).to.equal('In mercy\'s name, three days is all I need.');

          done();
        });
      });
    });
  });

  it('Should output all messages from the DB', function(done) {
    // Let's insert a message into the db
    var queryString = "INSERT INTO `messages` (message_text, user_id, room_name) VALUES ('Men like you can never change!', 1, 'main')";
    var queryArgs = [];
    // TODO - The exact query string and query args to use
    // here depend on the schema you design, so I'll leave
    // them up to you. */

    dbConnection.query(queryString, queryArgs, function(err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messageLog = JSON.parse(body);
        expect(messageLog[0].message_text).to.equal('Men like you can never change!');
        expect(messageLog[0].room_name).to.equal('main');
        done();
      });
    });
  });

  it('Should return all of the users from the DB', function(done) {
    const users = ['justin1', 'justin2', 'justin3', 'justin4'];

    // Let's insert a message into the db
    var queryString = "INSERT INTO `users` (name) values ('justin1'), ('justin2'), ('justin3'), ('justin4')";

    dbConnection.query(queryString, function(err) {
      if (err) { throw err; }

      // Now query the Node chat server and see if it returns
      // the message we just inserted:
      request('http://127.0.0.1:3000/classes/users', function(error, response, body) {
        var usersFromServer = JSON.parse(body);
        console.log('usersFromServer: ', usersFromServer);
        for(var i = 0; i < usersFromServer.length; i++) {
          expect(usersFromServer[i].name).to.include(users[i]);
        }

        done();
      });
    });
  });

  it('Should return one user from the DB', function(done) {
    var queryString = "INSERT INTO `users` (name) values ('justin1')";

    dbConnection.query(queryString, function(err) {
      if (err) {
        throw err;
      }

      request({
        method: 'GET',
        uri: 'http://127.0.0.1:3000/classes/users',
        json: {
          username: 'justin1'
        }
      }, function () {

        var queryString = 'SELECT * FROM `users` where `name` = "justin1"';
        dbConnection.query(queryString, function(err, results) {
          if (err) {
            console.log('db error:', err);
            return;
          }
          // Should have one result:
          console.log('results:', results);
          console.log('results type:',  typeof results);
          expect(results.length).to.equal(1);
          done();
        });
      });
    });
  });
});



