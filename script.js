function addEventListener(event, element, callback) {
    element.addEventListener(event, (e) => {
        if (!e.target.matches(element)) return
        callback(e)
    });
}

function updateUserList(username, userList) {
    const userListContainer = document.querySelector(".sidebar-list")
    console.log(userList)
    while (userListContainer.firstChild) {
        userListContainer.removeChild(userListContainer.firstChild);
    }
    userList.map(user => {
        const userTemplate = document.querySelector("#user-user-list")
        const chatAreaGlobal = document.querySelector(".chat-area__global")
        const chatAreaPrivate = document.querySelector(".chat-area__private")
        const chatBoxGlobal = document.querySelector(".chat-box__global")
        const chatBoxPrivate = document.querySelector(".chat-box__private")
        const chatAreaTitlePrivate = chatAreaPrivate.querySelector(".chat-area-title__private")
        if (userTemplate) {
            const clonedNode = userTemplate.content.cloneNode(true)
            const userBlock = clonedNode.querySelector(".user-block")
            const messageButton = clonedNode.querySelector(".user-list-button")
            const userListName = clonedNode.querySelector(".user-list-name")
            const key = Object.keys(user)[0];
            const value = user[key]
            userListName.textContent = value
            if (value === username) {
                userBlock.removeChild(messageButton)
            }

            messageButton.addEventListener("click", (e) => {
                chatAreaGlobal.style.display = "none"
                chatAreaPrivate.style.display = "block"
                chatBoxGlobal.style.display = "none"
                chatBoxPrivate.style.display = "grid"
                const chatContentPrivate = chatBoxPrivate.querySelector(".chat-content")
                chatContentPrivate.dataset.username = key
                chatAreaTitlePrivate.textContent = `Currently chatting with ${value}!`
            })

            userListContainer.appendChild(clonedNode)

        }
    })
    
}

function sendMessage(channel, chatContentObj) {
    const chatAreaGlobal = document.querySelector(".chat-area__global")
    const {username, chatContent} = chatContentObj
    const userMessageTemplate = document.querySelector("#user").content.cloneNode(true)
    const userMessageTemplateName = userMessageTemplate.querySelector(".global-chat-user-name")
    const userMessageTemplateMessage = userMessageTemplate.querySelector(".global-chat-user-message")
    userMessageTemplateName.textContent = `${username}: `
    userMessageTemplateMessage.textContent = chatContent;
    chatAreaGlobal.appendChild(userMessageTemplate)
}

const socket = io("http://localhost:3000")
const chatboxGlobal = document.querySelector(".chat-box__global")
const chatboxPrivate = document.querySelector(".chat-box__private")
const chatContent = document.querySelector(".chat-content")
const userListButton = document.querySelector(".user-list-button")
const backToGlobal = document.querySelector(".back-to-global")
let username = ""
let rebuiltUsersList = []

document.addEventListener("DOMContentLoaded", () => {
    socket.on("connect", () => {
        username = prompt("Enter username: ")
        socket.emit("User joined", username)  
            
    })

    socket.on("User joined broadcast", (res) => {
        const {message} = res
        alert(message)
    })
    
    socket.on("User joined update list", (res) => {
        const {usernameResponse, usersList} = res
        const rebuiltUsersList = JSON.parse(usersList)
        updateUserList(username, rebuiltUsersList)

    })

    socket.on("user typing response", (res) => {
        const {username} = res
        console.log("user typing response event")
        const isTypingElement = document.querySelector(".is-typing")
        isTypingElement.textContent = `${username} is typing...`
        isTypingElement.style.display = "block"
        setTimeout(() => {
            isTypingElement.style.display = "none"
        }, 3000)
    })
    
    socket.on("disconnect", () => {
        updateUserList(username, rebuiltUsersList)
    })

    socket.on("receive message in global chat", (chatContentObj) => {
        sendMessage("global", chatContentObj)
    })

    socket.on("receive message to private chat", (messageObj) => {
        const {sender, chatContent} = messageObj;
        const modalWindow = document.querySelector(".modal-content")
        const modalTitle = modalWindow.querySelector(".modal-title")
        const modalMessage = modalWindow.querySelector(".modal-message")
        modalTitle.textContent = `New message from ${sender}`
        modalMessage.textContent = `${chatContent}`
        modalWindow.style.display = "block"
        setTimeout(() => {
            modalWindow.style.display = "none"
        }, 3000)
    })
})

chatboxGlobal.addEventListener("submit", (e) => {
    e.preventDefault()
    const chatContent = document.querySelector(".chat-content").value;    
    const chatContentObject = {
        username,
        chatContent
    }
    socket.emit("send message to global chat", chatContentObject)
})

chatboxPrivate.addEventListener("submit", (e) => {
    e.preventDefault()
    const chatContentElement = chatboxPrivate.querySelector(".chat-content");    
    const chatContent = chatContentElement.value;
    const receiver = chatContentElement.dataset.username;
    const chatContentObject = {
        sender: username,
        receiver: receiver,
        chatContent
    }
    socket.emit("send message to private chat", chatContentObject)
})

chatContent.addEventListener("input", (event) => {
    console.log("Typing...", username)
    socket.emit("user typing", username)
})

backToGlobal.addEventListener("click", (event) => {
    const chatAreaGlobal = document.querySelector(".chat-area__global")
    const chatAreaPrivate = document.querySelector(".chat-area__private")
    const chatBoxGlobal = document.querySelector(".chat-box__global")
    const chatBoxPrivate = document.querySelector(".chat-box__private")
    const chatAreaTitlePrivate = chatAreaPrivate.querySelector(".chat-area-title__private")

    chatAreaGlobal.style.display = "block"
    chatAreaPrivate.style.display = "none"
    chatBoxGlobal.style.display = "grid"
    chatBoxPrivate.style.display = "none"
})

const modal = document.getElementById("myModal");

    // Get the button that opens the modal
    const btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }