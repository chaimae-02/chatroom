const usernameInput = document.getElementById("username");
const createBtn = document.getElementById("createBtn");
const avatars = document.querySelectorAll(".avatar");

let selectedAvatar = null;

avatars.forEach(avatar => {
  avatar.addEventListener("click", () => {
    avatars.forEach(a => a.classList.remove("selected"));
    avatar.classList.add("selected");
    selectedAvatar = avatar.src;
  });
});

createBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();

  if (!username || !selectedAvatar) return;

  localStorage.setItem("chatUser", username);
  localStorage.setItem("chatAvatar", selectedAvatar);

  window.location.href = "chat.html";
});
