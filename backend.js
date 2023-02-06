require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (ws) => {
  console.log("new client connected");

  // відправляе повідомлення новому user
  ws.emit("chatMessage", "Welcome to chat!");

  //  відправляе повідомлення всім users о пыдключенні нового user
  ws.broadcast.emit("chatMessage", "New user connected");

  // відправляе message  всім users
  ws.on("chatMessage", (message) => {
    ws.broadcast.emit("chatMessage", message);
  });
});

app.get("/", (req, res, next) => {
  return res.sendFile(__dirname + "/index.html");
});

const { PORT = 5000 } = process.env;

httpServer.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("listening on port 5000");
});
