const usernameInput = document.getElementById("username");
const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomInput");
const avatars = document.querySelectorAll(".avatar");

let selectedAvatar = null;

avatars.forEach(avatar => {
  avatar.addEventListener("click", () => {
    avatars.forEach(a => a.classList.remove("selected"));
    avatar.classList.add("selected");
    selectedAvatar = avatar.src;
  });
});

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

createBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username || !selectedAvatar) return;

  const roomCode = generateRoomCode();

  localStorage.setItem("chatUser", username);
  localStorage.setItem("chatAvatar", selectedAvatar);
  localStorage.setItem("roomCode", roomCode);
  localStorage.setItem("role", "host");

  alert("Room Code 💗: " + roomCode);

  window.location.href = "chat.html";
});

joinBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const roomCode = roomInput.value.trim().toUpperCase();

  if (!username || !selectedAvatar || !roomCode) return;

  localStorage.setItem("chatUser", username);
  localStorage.setItem("chatAvatar", selectedAvatar);
  localStorage.setItem("roomCode", roomCode);
  localStorage.setItem("role", "guest");

  window.location.href = "chat.html";
});
