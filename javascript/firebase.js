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

