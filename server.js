const {createServer} = require("http")
const {Server} = require("socket.io")
const express = require("express")
const cors = require("cors")

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true
}));

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const usersList = new Map()

io.on("connection", (socket) => {
    socket.on("User joined", (username) => {
        socket.join("global")
        usersList.set(socket.id, username)
        console.log(usersList)
        socket.broadcast.emit("User joined broadcast", {message: `User ${username} has joined global chat`})
        io.emit("User joined update list", {usernameResponse: username, usersList: 
            JSON.stringify(
                Array.from(usersList, ([key, value]) => ({[key]: value}))
            )
        })
    })

    socket.on("send message to global chat", (chatContentObj) => {
        io.emit("receive message in global chat", chatContentObj);
    })

    socket.on("disconnect", () => {
        usersList.delete(socket.id)
    })

    socket.on("user typing", (username) => {
        io.emit("user typing response", {username})
    })

    socket.on("send message to private chat", (chatObject) => {
        const {
            sender,
            receiver,
            chatContent
        } = chatObject
        socket.to(receiver).emit("receive message to private chat", {sender, chatContent})
    })
})

server.listen(3000, () => {
    console.log("Connected to port 3000")
})