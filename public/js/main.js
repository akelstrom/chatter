const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room from URL (qs library)
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(username, room)

const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
})

//message from server
socket.on('message', message => {
  console.log(message);

  outputMessage(message);

  //scroll down everytime we get a message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) => {
e.preventDefault();

//create msg variable, grab this by the form id (chatForm) element's value
const msg = e.target.elements.msg.value;

//emit message to the server
socket.emit('chatMessage', msg);

//clear input
e.target.elements.msg.value = '';
e.target.elements.msg.focus();
})

//output message to dom
const outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="text">
   ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add roomname to dom
const outputRoomName = (room) => {
    roomName.innerText = room;
}

//add users to dom
const outputUsers = (users) => {
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}