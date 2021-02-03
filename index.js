const socket = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const https = require('https');
const router = express.Router();

const app = express();
const port = 5000;
app.get('/',  (req, res) => {
    console.log(req);
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req);
    return res.json("wef");
});
const server = http.createServer(app);




const io = socket(server,{
    cors:{
        origin:"*",
        method:["GET","POST"],
    }
});
let idx = 0;

io.sockets.on('connection', (socket) => {
    idx++;
    console.log(`[${socket.id}] : ${socket.handshake.time}`);
    console.log(`connection!!${idx}`);


    socket.on('toServer', (data) => {
        console.log("메시지 도착 : " , data);
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

server.listen(port, "localhost",5000, () => {
    console.log('server start');
});