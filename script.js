function addEventListener(event, element, callback) {
    element.addEventListener(event, (e) => {
        if (!e.target.matches(element)) return
        callback(e)
    });
}

const socket = io("http://localhost:3000")

document.addEventListener("DOMContentLoaded", () => {
    socket.on("connect", () => {
        const username = prompt("Enter username: ")
                socket.emit("User joined", username, (res) => {
                alert(`User ${username} joined global chat`)
            })    
            
        })
    })    