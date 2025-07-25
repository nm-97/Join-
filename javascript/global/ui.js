function toggleUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

function closeUserMenu() {
  const dropdown = document.getElementById("usermenu");
  dropdown.style.display = "none";
}

function initializeUserAvatar() {
  const user = getCurrentUser();
  let displayName = "User";
  
  if (user.type === "guest") {
    displayName = "Guest";
  } else if (user.type === "registered") {
    displayName = user.name || "User";
  }
  
  const userAvatarElement = document.getElementById("userAvatar");
  if (userAvatarElement) {
    const initials = getInitials(displayName);
    const color = getAvatarColor(displayName);
    
    userAvatarElement.textContent = initials;
    userAvatarElement.style.backgroundColor = color;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeUserAvatar();
});