exports = module.exports = function (io) {
  io.on('connection', function (socket) {
    console.log('socket connected');
    // socket.join('Lobby');
    socket.on('chat mounted', function (user) {
      // TODO: Does the server need to know the user?
      socket.emit('receive socket', socket.id)
    })
    socket.on('leave channel', function (channel) {
      socket.leave(channel)
    })
    socket.on('join channel', function (channel) {
      console.log('join channel: ' + channel.tripId);
      socket.join(channel.tripId);
    })
    socket.on('new message', function (msg) {
      io.to(msg.channel).emit('new bc message', 'to : ' + msg.channel + msg.message);
      // io.to(msg.channel).emit('new member', {id:'1234566lkj', userName:'HenryX'});
    });

    socket.on('new channel', function (channel) {
      socket.broadcast.emit('new channel', channel)
    });
    socket.on('typing', function (data) {
      socket.broadcast.to(data.channel).emit('typing bc', data.user);
    });
    socket.on('stop typing', function (data) {
      socket.broadcast.to(data.channel).emit('stop typing bc', data.user);
    });
    socket.on('new private channel', function (socketID, channel) {
      socket.broadcast.to(socketID).emit('receive private channel', channel);
    })
  });
}
