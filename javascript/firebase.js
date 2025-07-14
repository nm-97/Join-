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

function addUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  user.push({
    email: email.value,
    password: password.value,
    type: "registered"
  });
  window.location.href = "../html/index.html";
}