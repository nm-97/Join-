"use strict";


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