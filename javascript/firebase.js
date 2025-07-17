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

const getUserFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  password: new FormData(event.target).get("password"),
});

async function createUser(event) {
    event.preventDefault();
    const UserData = getUserFormData(event);
    await addUserToFirebase(UserData);
    setTimeout(() => {
        renderSuccessMessage();
    }, 500);
}

const postUserData = async (UserData) => {
  return await fetch(`${firebaseUrl}user /registered/.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(UserData),
  });
};

async function addUserToFirebase(UserData) {
  const response = await postUserData(UserData);
  const result = await response.json();
  return result.name;
}

function renderSuccessMessage() {
  document.body.insertAdjacentHTML('beforeend', getSuccessSignUpMessageTempalte());

  setTimeout(() => {
    const toast = document.getElementById('signUpSuccess');
    if (toast) toast.remove();
  }, 2000);
}
