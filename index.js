const allowedOrigins = require('./config/allowedOrigins');
const express = require("express");
const app = express();
const cors = require("cors");
const CONFIG = require("./config");
const connectToMongoDB = require("./config/connectToMongoDB");
const routes = require("./routes");
const cookieParser = require('cookie-parser');
const errorHandler = require("./middlewares/errorHandler");
const corsOptions = require("./config/corsOptions");
const fileUpload = require("express-fileupload");
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});
const ChatModel = require("./models/chat.model");

connectToMongoDB();

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  // res.setHeader("Access-Control-Allow-Origin", allowOriginUrl);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization,X-Requested-With,content-type"
  );
  //res.header('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use("/api", routes);
app.use(errorHandler);

io.on("connection", socket => {
  console.log("socket", socket.id);
});

server.listen(CONFIG.PORT.EXPRESS, () => {
  console.log("Backend server is running!");
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join room', (roomId) => {
    console.log(`User joined room ${roomId}`);
    socket.join(roomId);
  })

  // Leave room event handler
  socket.on('leave room', (room) => {
    console.log('Leaving room:', room);
    socket.leave(room);
  });

  // Chat message event handler
  socket.on('send message', async ({ room, message, users, conversations }) => {
    let chat = await ChatModel.findOne({ users: { $all: users } });
    console.log("chat", users);
    if (chat) {
      chat.conversations = conversations;
      chat.save();
    }
    else {
      chat = await ChatModel.create({ users, conversations });
    }
    socket.to(room).emit('receive message', message);
  });

  // Disconnect event handler
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

module.exports = io;