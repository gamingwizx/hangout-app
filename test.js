const {createServer} = require("http")
const Client = require("socket.io-client")
const {Server} = require("socket.io");

describe("test io", () => {
    let io, clientSocket, serverSocket;
    beforeAll((done) => {
        const httpServer = createServer()
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`)
            io.on("connection", (socket) => {
                serverSocket = socket;
            })
            clientSocket.on("connect", done)
        })
    })

    test("test io response", (done) => {
        serverSocket.on("event-1", (req) => {
            expect(req).toBe("1");
            done();
        })
        clientSocket.emit("event-1", "1");
    })

    test("test ack", (done) => {
        serverSocket.on("event-2", (ack) => {
            ack("hello")
        })
        clientSocket.emit("event-2", (res) => {
            expect(res).toBe("hello")
            done();
        })
    })

    afterAll((done) => {
        io.close();
        clientSocket.close()
        done()
    })
})