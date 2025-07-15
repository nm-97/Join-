"use strict";

const firebaseUrl =
  "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

function getCurrentUser() {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : {type: "guest"};
}

async function initializeUserData() {
  await showContactSideBar();
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("contacts.html")) {
    initializeUserData();
  }
});

function setGuestLogin() {
  sessionStorage.setItem('currentUser', JSON.stringify({
    type: "guest"
  }));
  window.location.href = "../html/summaryUser.html"; 
}

function showSuccessMessage(message) {
  const existingMessage = document.getElementById("successMessage");
  if (existingMessage) {
    existingMessage.remove();
  }
  renderSuccessMessage(message);
  const toast = document.getElementById("successMessage");
  toast.style.display = "block";
}