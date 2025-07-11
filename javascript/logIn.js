"use strict";

function addUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  user.push({
    email: email.value,
    password: password.value,
  });
  window.location.href = "../html/index.html";
}
