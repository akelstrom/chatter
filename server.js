const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const bot = 'ChatterBot'

//run when client connects to socket
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room}) => {
    const user = userJoin(socket.id, username, room);
    
    socket.join(user.room);

    //welcome current user
    socket.emit('message', formatMessage(bot, 'Welcome to ChatterBox'));

    //broadcast when a user connects
    //this will emit to everyone except the user that is connecting
    socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the chat`));

    });

    //runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(bot, `A user has left the chat`));
    });

    //listen for chatMessage
    socket.on('chatMessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    })
});

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

