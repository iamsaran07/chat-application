const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const Message = require('./models/message');
const mongoose = require('mongoose')
require("dotenv").config();
require("./config/mongo");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/secret-chat', (req, res) => {
  res.render('chat');
});

io.on('connection', async (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('login', async (username) => {
    try {
        const user = await Message.findOne({ username });
        if (!user) {
            const newUser = new Message({ username });
            await newUser.save();
        }
        socket.username = username; 

        const messages = await Message.find().sort({ createdAt: 1 }).exec();
        socket.emit('old messages', messages.map(message => ({ message: message.text, username: message.username })));
    } catch (err) {
        console.error('Error authenticating user:', err);
    }
});

  socket.on('chat message', async (msg) => {
    try {
      const message = new Message({ text: msg, username: socket.username });
      await message.save();
      io.emit('chat message', { message: msg, username: socket.username });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("CONNECTED TO DATABASE...");
    app.listen(PORT, () => {
      console.log(`PORT CONNECTED TO ${PORT}...`);
    });
  })
  .catch((err) => {
    console.log("FAILED TO CONNECT DATABASE...")
    console.log(err);
  });
