function addEventListener(event, element, callback) {
    element.addEventListener(event, (e) => {
        if (!e.target.matches(element)) return
        callback(e)
    });
}

function updateUserList(userList) {
    const userListContainer = document.querySelector(".sidebar")
    console.log(userList)
    userList.map(user => {
        const userTemplate = document.querySelector("#user-user-list")
        if (userTemplate) {
            const clonedNode = userTemplate.content.cloneNode(true)
            const userListName = clonedNode.querySelector(".user-list-name")
            const key = Object.keys(user)[0];
            const value = user[key]
            userListName.textContent = value
            userListContainer.appendChild(clonedNode)

        }
    })
    
}

const socket = io("http://localhost:3000")
let rebuiltUsersList = []

document.addEventListener("DOMContentLoaded", () => {
    socket.on("connect", () => {
        const username = prompt("Enter username: ")
                socket.emit("User joined", username, (res) => {
                    const {usersList, usernameResponse, message} = res
                    const rebuiltUsersList = JSON.parse(usersList)
                    alert(message)
                    updateUserList(rebuiltUsersList)
            })    
            
        })
    
    socket.on("disconnect", () => {
        updateUserList(rebuiltUsersList)
    })
})

