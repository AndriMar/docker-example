const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const r = require('rethinkdb');
let bodyParser = require('body-parser');
let socket = require('./socket');
const uuid = require('uuid');

function createApp(dbConnection,config) {
  const app = express();
  var httpServer = http.Server(app);
  var io = socketio(httpServer);
  app._rdbConn = dbConnection;
  app.use(bodyParser.json())
  app.use(express.static('dist'))

  app.get('/api/get_messages', (req, res, next) => {
    r.db(config.rethinkdb.DB).table(config.rethinkdb.Table)
    .orderBy({index: 'createdAt'})
    .run(req.app._rdbConn, function(err, cursor) {
      if(err) {
        return next(err);
      }

      cursor.toArray(function(err, result) {
        if(err) {
          return next(err);
        }
        res.json(result);
      });
    });
  });
  app.post('/api/send_message', (req, res) => {
    var message = req.body;
    message.createdAt = r.now();

    r.db(config.rethinkdb.DB).table(config.rethinkdb.Table).insert(message, {returnChanges: true}).run(req.app._rdbConn, function(err, result) {
      if(err) {
        return next(err);
      }
      message.id = uuid();
      io.emit('in:message',message);
      res.sendStatus(200);
    });
  });
  io.on('connection', socket);


  return httpServer;
}

module.exports = createApp;
