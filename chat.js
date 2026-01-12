// ---------------------
// 1️⃣ Read from localStorage
// ---------------------
const user = localStorage.getItem("chatUser");
const avatar = localStorage.getItem("chatAvatar");
const roomCode = localStorage.getItem("roomCode");
const role = localStorage.getItem("role");

if (!user || !avatar || !roomCode || !role) {
  window.location.href = "login.html";
}

// ---------------------
// 2️⃣ Initialize Firebase
// ---------------------
const firebaseConfig = {
  apiKey: "AIzaSyCR-_JqYh8tsbr_cL_pRX9tUmaEm0XSvFA",
  authDomain: "nana-chat-81913.firebaseapp.com",
  databaseURL: "https://nana-chat-81913-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "nana-chat-81913",
  storageBucket: "nana-chat-81913.firebasestorage.app",
  messagingSenderId: "334244418564",
  appId: "1:334244418564:web:1903fd25bc186d16ab1151"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Firebase refs
const roomRef = database.ref("rooms/" + roomCode);
const messagesRef = roomRef.child("messages");
const typingRef = roomRef.child("typing");


messagesRef.limitToLast(100).on("child_added", snapshot => {
  const msg = snapshot.val();
  // optional: avoid duplicates
  if (messages.some(m => m.timestamp === msg.timestamp)) return;
  messages.push(msg);
  renderMessages();
});

///////////

const stickers = document.querySelectorAll(".sticker");

stickers.forEach(sticker => {
  sticker.addEventListener("click", () => {
    const msg = {
      user,
      avatar,
      sticker: sticker.src,
      text: null,
      timestamp: Date.now()
    };

    // 🔥 SEND STICKER THROUGH FIREBASE
    messagesRef.push(msg);
  });
});


const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let isPlaying = false;

musicBtn.addEventListener("click", () => {
  if (!isPlaying) {
    music.play();
    musicBtn.textContent = "⏸ Pause";
  } else {
    music.pause();
    musicBtn.textContent = "🎵 Play";
  }
  isPlaying = !isPlaying;
});


const clickSound = new Audio();
clickSound.src = "click.mp3";
clickSound.preload = "auto";
clickSound.volume = 0.4;





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

const roomInfo = document.getElementById("roomInfo");
if (roomInfo) {
  roomInfo.textContent = `Room: ${roomCode} • You are ${role}`;
}


const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");



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

  const msg = {
    user,
    avatar,
    text,
    timestamp: Date.now()
  };

  // 🔥 SEND TO FIREBASE
  messagesRef.push(msg);

  messageInput.value = "";
}


let typingTimeout;

messageInput.addEventListener("input", () => {
  // Notify Firebase that this user is typing
  typingRef.set({
    user: user,
    typing: true
  });

  // Reset timeout
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingRef.set({
      user: user,
      typing: false
    });
  }, 1200); // 1.2 seconds after user stops typing
});

const typingIndicator = document.getElementById("typingIndicator");

typingRef.on("value", snapshot => {
  if (!snapshot.exists()) {
    typingIndicator.textContent = "";
    return;
  }

  const data = snapshot.val();

  // Only show if someone else is typing
  if (data.typing && data.user !== user) {
    typingIndicator.textContent = `${data.user} is typing…`;
  } else {
    typingIndicator.textContent = "";
  }
});

//////////////////////////////////

// select all emoji spans
const emojiElements = document.querySelectorAll(".emoji");

// when clicked, add emoji to input
emojiElements.forEach(emoji => {
  emoji.addEventListener("click", () => {
    messageInput.value += emoji.textContent; // insert emoji at cursor end
    messageInput.focus(); // keep typing in input
  });
});

document.addEventListener("click", (e) => {
  if (
    e.target.matches("button") ||
    e.target.matches(".emoji") ||
    e.target.matches(".sticker") ||
    e.target.matches(".avatar")
  ) {
    clickSound.currentTime = 0;
    clickSound.play();
  }
});
