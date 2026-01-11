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

// ---------------------
// 3️⃣ Create WebRTC connection
// ---------------------
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
});

// ---------------------
// 5️⃣ DataChannel
// ---------------------
let dataChannel;

if (role === "host") {
  dataChannel = pc.createDataChannel("chat");

  dataChannel.onopen = () => {
    console.log("✅ DataChannel open (host)");
  };

  dataChannel.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    messages.push(msg);
    renderMessages();
  };
}

// Guest receives channel
pc.ondatachannel = (event) => {
  dataChannel = event.channel;

  dataChannel.onopen = () => {
    console.log("✅ DataChannel open (guest)");
  };

  dataChannel.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    messages.push(msg);
    renderMessages();
  };
};



// Firebase refs
const roomRef = database.ref("rooms/" + roomCode);
const typingRef = roomRef.child("typing");

const offerRef = roomRef.child("offer");
const answerRef = roomRef.child("answer");
const iceRef = roomRef.child("iceCandidates");

// ICE candidate exchange
pc.onicecandidate = (event) => {
  if (event.candidate) {
    iceRef.push(JSON.stringify(event.candidate));
  }
};

iceRef.on("child_added", snapshot => {
  const candidate = JSON.parse(snapshot.val());

  // Check if remoteDescription exists
  if (pc.remoteDescription) {
    pc.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error("ICE candidate error:", e));
  } else {
    // Wait until remoteDescription is set
    const wait = setInterval(() => {
      if (pc.remoteDescription) {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error("ICE candidate error:", e));
        clearInterval(wait); // stop waiting
      }
    }, 100); // check every 100ms
  }
});

// ---------------------
// 4️⃣ Host / Guest signaling FIXED
// ---------------------
let iceQueue = [];

// Safely add ICE candidates
function safeAddIce(candidate) {
  if (pc.remoteDescription) {
    pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(console.error);
  } else {
    iceQueue.push(candidate);
  }
}

// Listen for ICE candidates
iceRef.on("child_added", snapshot => {
  const candidate = JSON.parse(snapshot.val());
  safeAddIce(candidate);
});

// Host setup
if (role === "host") {
  // Create offer
  pc.createOffer()
    .then(offer => pc.setLocalDescription(offer))
    .then(() => offerRef.set(JSON.stringify(pc.localDescription)))
    .catch(console.error);

  // Listen for answer
  answerRef.on("value", snapshot => {
    if (!snapshot.exists()) return;
    const answer = JSON.parse(snapshot.val());

    pc.setRemoteDescription(answer)
      .then(() => {
        // Add any queued ICE candidates
        iceQueue.forEach(c => pc.addIceCandidate(new RTCIceCandidate(c)));
        iceQueue = [];
        console.log("✅ Host remoteDescription set, ICE applied");
      })
      .catch(console.error);
  });
}

// Guest setup
if (role === "guest") {
  offerRef.on("value", snapshot => {
    if (!snapshot.exists()) return;
    const offer = JSON.parse(snapshot.val());

    pc.setRemoteDescription(offer)
      .then(() => pc.createAnswer())
      .then(answer => pc.setLocalDescription(answer))
      .then(() => answerRef.set(JSON.stringify(pc.localDescription)))
      .then(() => {
        // Add any queued ICE candidates
        iceQueue.forEach(c => pc.addIceCandidate(new RTCIceCandidate(c)));
        iceQueue = [];
        console.log("✅ Guest remoteDescription set, ICE applied");
      })
      .catch(console.error);
  });
}

// Debugging connection states
pc.onconnectionstatechange = () => console.log("Connection state:", pc.connectionState);
pc.oniceconnectionstatechange = () => console.log("ICE state:", pc.iceConnectionState);

// Log DataChannel state changes
if (dataChannel) {
  dataChannel.onopen = () => console.log("✅ DataChannel opened");
  dataChannel.onclose = () => console.log("❌ DataChannel closed");
  dataChannel.onerror = e => console.error("DataChannel error:", e);
}















const stickers = document.querySelectorAll(".sticker");

stickers.forEach(sticker => {
  sticker.addEventListener("click", () => {
    if (!dataChannel || dataChannel.readyState !== "open") return;

    const msg = {
      user,
      avatar,
      sticker: sticker.src,
      text: null
    };

    dataChannel.send(JSON.stringify(msg));
    messages.push(msg);
    renderMessages();
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
  if (!text || !dataChannel || dataChannel.readyState !== "open") return;

  const msg = {
    user,
    avatar,
    text
  };

  dataChannel.send(JSON.stringify(msg)); // 🚀 send P2P
  messages.push(msg);                     // show locally
  renderMessages();

  messageInput.value = "";
}


let typingTimeout;

messageInput.addEventListener("input", () => {
  typingRef.set({
    user: user,
    typing: true
  });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingRef.set({
      user: user,
      typing: false
    });
  }, 1200);
});


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

const typingIndicator = document.getElementById("typingIndicator");

typingRef.on("value", snapshot => {
  if (!snapshot.exists()) {
    typingIndicator.textContent = "";
    return;
  }

  const data = snapshot.val();

  if (data.typing && data.user !== user) {
    typingIndicator.textContent = `${data.user} is typing…`;
  } else {
    typingIndicator.textContent = "";
  }
});
