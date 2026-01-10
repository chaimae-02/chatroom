const stickers = document.querySelectorAll(".sticker");

stickers.forEach(sticker => {
  sticker.addEventListener("click", () => {
    messages.push({
      user: user,
      avatar: avatar,
      sticker: sticker.src,   // store sticker URL
      text: null              // no text
    });
    renderMessages();
  });
});




const emojiToggle = document.getElementById("emojiToggle");
const emojiPanel = document.querySelector(".emoji-panel");

emojiToggle.addEventListener("click", () => {
  if (emojiPanel.style.display === "none") {
    emojiPanel.style.display = "flex";
  } else {
    emojiPanel.style.display = "none";
  }
});




const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const user = localStorage.getItem("chatUser");
const avatar = localStorage.getItem("chatAvatar");

if (!user || !avatar) {
  window.location.href = "login.html";
}

let messages = [];

function renderMessages() {
  messagesDiv.innerHTML = "";

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("message");

    if (msg.sticker) {
      // sticker message
      div.innerHTML = `
        <img src="${msg.avatar}" class="msg-avatar" />
        <div class="msg-content">
          <span>${msg.user}</span>
          <img src="${msg.sticker}" class="chat-sticker" />
        </div>
      `;
    } else {
      // normal text message
      div.innerHTML = `
        <img src="${msg.avatar}" class="msg-avatar" />
        <div class="msg-content">
          <span>${msg.user}</span>
          <p>${msg.text}</p>
        </div>
      `;
    }

    messagesDiv.appendChild(div);
  });

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  messages.push({
    user: user,
    avatar: avatar,
    text: text
  });

  messageInput.value = "";
  renderMessages();
}
// select all emoji spans
const emojiElements = document.querySelectorAll(".emoji");

// when clicked, add emoji to input
emojiElements.forEach(emoji => {
  emoji.addEventListener("click", () => {
    messageInput.value += emoji.textContent; // insert emoji at cursor end
    messageInput.focus(); // keep typing in input
  });
});
