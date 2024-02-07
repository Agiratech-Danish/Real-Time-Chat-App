const socket = io();

const inboxPeople = document.querySelector(".inbox_people");
const inputField = document.querySelector(".message_form_input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".message_history");
const typingMsg = document.querySelector(".typing");

let userName = "";

const newUserConnected = () => {
    let name = prompt("Please enter your name");
    userName = name || `user-${Math.floor(Math.random() * 10000)}`;
    socket.emit("new user", userName);
};

const addToUserBox = (users) => {
    inboxPeople.innerHTML = "";
    users.forEach((user) => {
        const userBox = `
            <div class="${user}-userlist">
                <p>${user}</p>
            </div>
        `;
        inboxPeople.innerHTML += userBox;
    });
};

const addNewMessage = (data) => {
    const { user, message } = data;
    const time = new Date();
    const formattedTime = time.toLocaleTimeString([], { hour: "numeric", minute: "numeric" });

    const messageTemplate = `
        <div class="incoming_message">
            <div class="recieved_message">
                <div class="message_info">
                    <span class="message_author">${user}</span>
                    <span class="message_time">${formattedTime}</span>
                </div>
                <p>${message}</p>
            </div>
        </div>
    `;

    messageBox.innerHTML += user === userName ? messageTemplate.replace("recieved", "sent") : messageTemplate;
};

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputField.value) {
        return;
    }

    socket.emit("chat message", {
        message: inputField.value,
        user: userName, 
    });

    inputField.value = "";
});



inputField.addEventListener("keyup", () => {
    socket.emit("typing", {
        isTyping: inputField.value.length > 0,
        name: userName
    })
})


newUserConnected();

socket.on("new user", (data) => {
    addToUserBox(data);
});

socket.on("chat message", (data) => {
    addNewMessage(data);
});


socket.on("typing", (data) => {
    if (data.isTyping) {
        typingMsg.innerHTML = `<p> ${data.name} is typing... </p>`
    } else {
        typingMsg.innerHTML = ""
        return
    }
})

socket.on("user disconnected", (userId) => {
    document.querySelector(`.${userId}-userlist`).remove();
});
