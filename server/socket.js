const uuid = require('uuid');
module.exports = function (socket) {
  console.log('New socket connection');
  let username = "";
  socket.on('in:message', function (data) {
    console.log('New message',data);
    data.id = uuid();
    socket.broadcast.emit('in:message', data);
  });
  socket.on('user:join', function (data) {

    console.log('new user',data);
    username = data.username;
    data.id = uuid();
    socket.broadcast.emit('user:join', data);
  });
  socket.on('disconnect', function () {
    console.log('User left');
    socket.broadcast.emit('user:left', {
      username,
      id: uuid()
    });
  });
};
