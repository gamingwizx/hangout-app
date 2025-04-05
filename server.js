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

io.on("connection", (socket) => {
    socket.on("User joined", (username, ack) => {
        socket.join("global")
        ack("User joined response", username)
    })
})

server.listen(3000, () => {
    console.log("Connected to port 3000")
})