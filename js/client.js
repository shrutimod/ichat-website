//It is differnt than node server

const socket = io("http://localhost:8000");

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
var audio = new Audio("ting.mp3");

//append function

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

//when form is submit then an event listener
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message != "") {
    append(`You : ${message}`, "right");
    socket.emit("send", message);
  }

  messageInput.value = "";
});

//When user joins then take name and emit the event
const userName = prompt("Enter Your Name to Join");
socket.emit("new-user-joined", userName);

//listen the event user-joined from server and append in the container with a message for other users

socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

//listen message receive event

socket.on("receive", (data) => {
  append(`${data.name} : ${data.message}`, "left");
});

//listen the left event

socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});
