const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const port = 3001

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methode: ["GET", "POST"],
    }
})

//채팅클라이언트에 연결
io.on("connection", (socket) => {
    console.log('@@@',socket,new Date().toLocaleTimeString())
    console.log(`User Connected: ${socket.id}`)

    //whereRoom에 참가하기
    socket.on("join-room", (whereRoom) => {
        socket.join(whereRoom)
        console.log(`User ID: ${socket.id} joined room: ${whereRoom}`)
    })

    //whereRoom 내에서의 채팅로그
    socket.on("send_message", (chatLog) => {
        socket.to(chatLog.room).emit("receive_message", chatLog)
        console.log('chatLog:',chatLog)
    })

    //클라이언트와 연결 종료
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})

server.listen(port, () => {
    console.log(new Date().toLocaleTimeString(),port,'CONNECT')
})
