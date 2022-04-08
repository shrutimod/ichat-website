//Node Server

const io = require("socket.io")(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};

//io.on is a socket.io instance which will listen to multiple socket connections
io.on("connection", (socket) => {
  //socket.on -> ek particular connection ke lie h
  //jaise user-joined event mila tb name ko set krega in users
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;

    //if any new user joined then send an event to other users
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  //When user disconnects then listen an event

  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
