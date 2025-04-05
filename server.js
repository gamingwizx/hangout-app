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
    socket.on("User joined", (username, ack) => {
        socket.join("global")
        usersList.set(socket.id, username)
        console.log(usersList)
        ack({message: `User ${username} has joined global chat`, usernameResponse: username, usersList: 
            JSON.stringify(
                Array.from(usersList, ([key, value]) => ({[key]: value}))
            )
        })
    })

    socket.on("disconnect", () => {
        usersList.delete(socket.id)
    })
})

server.listen(3000, () => {
    console.log("Connected to port 3000")
})