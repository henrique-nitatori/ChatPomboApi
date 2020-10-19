import cors from 'cors'
import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app)
import socket from 'socket.io'
const io = socket(server)

app.use(express.json())
app.use(cors());

interface Users {
    id: string,
    user: string,
}
interface Messages {
    id: string,
    text?: string,
    user: string,
}

let messages: Messages[] = []
let users: Users[] = []

app.get('/messages', (req, res) => {
    return res.status(200).send(messages)
})

app.get('/users', (req, res) => {
    return res.status(200).send(users)
})

io.on('connection',  (socket: socket.Socket) => { 
    socket.on('message', (msg) => {
        msg.id = socket.id
        const user = users.find(el => {
            return el.user === msg.user
        })
        if(!user) {
            users.push({ user: msg.user, id: socket.id})
        } 
        messages.push(msg)
        io.emit('message', msg)
    })
    
    socket.on('disconnect', (sock) => {
        const userIndex = users.findIndex((el, index) => {
            if(el.id === sock.id) {
                return index 
            } 
        })
        users.splice(userIndex, 1)
        console.log(`socket com o id ${socket.id} desconectou`)
    })
})


server.listen(3333, () => {
    console.log('Servidor iniciado')
})