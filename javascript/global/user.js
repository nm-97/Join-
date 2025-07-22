"use strict";

async function getUserName() {
  const user = getCurrentUser();
  let displayName = "User";
  if (user.type === "guest") {
    displayName = "Guest";
  } else if (user.type === "registered") {
    displayName = user.name || "User";
  }
  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.textContent = displayName;
  }
  return displayName;
}

function logoutUserDirectly() {
  sessionStorage.removeItem("currentUser");
  window.location.href = "../html/index.html";
}

function showLocalTimeFormUser() {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 8) greeting = "Good evening,";
  else if (hour < 12) greeting = "Good morning,";
  else if (hour < 18) greeting = "Good afternoon,";
  else greeting = "Good evening,";
  const welcomeElement = document.getElementById("welcomeText");
  if (welcomeElement) {
    welcomeElement.textContent = greeting;
  }
  return greeting;
}

function renderSignUpSuccessMessage() {
  document.body.insertAdjacentHTML(
    "beforeend",
    getSuccessSignUpMessageTemplate()
  );
  setTimeout(() => {
    const toast = document.getElementById("signUpSuccess");
    if (toast) toast.remove();
  }, 2000);
}

async function initializeUserData() {
  await showContactSideBar();
}

function getInitials(name) {
  if (!name) return "";
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[1].charAt(0).toUpperCase()
    );
  }
  return name.charAt(0).toUpperCase() + (name.charAt(1) || "").toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    "#FF8A00",
    "#9327FF",
    "#29ABE2",
    "#FF5EB3",
    "#6E52FF",
    "#00BEE8",
    "#1FD7C1",
    "#FF745E",
    "#FFA35E",
    "#FC71FF",
    "#FFC701",
    "#0038FF",
    "#C3FF2B",
    "#FFE62B",
    "#FF4646",
    "#FFBB2B",
  ];
  return colors[name.charCodeAt(0) % colors.length];
}
