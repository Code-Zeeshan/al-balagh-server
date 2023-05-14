const socket = require("../index");
const service = {
    chatSocket: async (filter) => {

        // Join room event handler
        socket.on('chat message', ({ room, message }) => {
            console.log('Joining room:', room, message);
            socket.join(room);
        });

        socket.on('chat message', ({ room, message }) => {
            console.log('Joining room:', room, message);
            socket.join(room);
        });

        // Leave room event handler
        socket.on('leave room', (room) => {
            console.log('Leaving room:', room);
            socket.leave(room);
        });

        // Chat message event handler
        socket.on('chat message', ({ room, message }) => {
            console.log('New chat message:', message);
            io.to(room).emit('chat message', message);
        });

        // Disconnect event handler
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    }
};

module.exports = service;