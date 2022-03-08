const express = require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

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
        console.log(`User with ID: ${socket.id} joined room: ${whereRoom}`)
    })

    socket.on("send_message", (chatLog) => {
        socket.to(chatLog.room).emit("receive_message", chatLog)
        console.log('chatLog:',chatLog)
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id)
    })
})



server.listen(3001, () => {
    console.log("SERVER RUNNING")
})
