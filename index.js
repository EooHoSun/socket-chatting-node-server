const socket = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');


const app = express();
app.use(cors);

app.get('/', (req, res) => {
    console.log(req);
});

const port = 5000;
const server = http.createServer(app);
server.listen(port, () => {
    console.log('server start');
});

const io = socket(server);
let idx = 0;
io.sockets.on('connection', (socket) => {
    idx++;
    console.log(`[${socket.id}] : ${socket.handshake.time}`);
    console.log(`connection!!${idx}`);
    socket.on('toServer', (data) => {
        data.name = socket.name;
        console.log(data);
        io.emit('toClient',data);
    });
    socket.on('send', (data) => {
        console.log('send 발생');
        console.log(data);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('update',
            {
                type:'disconnect',
                name:'SERVER',
                message : `[${socket.name}] 님 종료`
            }
        );
    });
});

