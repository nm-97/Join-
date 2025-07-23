"use strict";

function validateLoginForm() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  if (!emailInput || !passwordInput || !errorMessage) return false;

  const email = emailInput.value;
  const password = passwordInput.value;

  clearLoginErrors();

  if (!isValidLoginData(email, password)) {
    showLoginError("Check your email and password. Please try again.");
    return false;
  }

  return true;
}

function isValidLoginData(email, password) {
  if (!validateRequired(email)) return false;
  if (!validateEmail(email)) return false;
  if (!validateRequired(password)) return false;
  if (!validatePassword(password, 6)) return false;
  return true;
}

function clearLoginErrors() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  emailInput.classList.remove("errorInput");
  passwordInput.classList.remove("errorInput");
  errorMessage.classList.add("hide");
}

function showLoginError(message) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  emailInput.classList.add("errorInput");
  passwordInput.classList.add("errorInput");
  errorMessage.textContent = message;
  errorMessage.classList.remove("hide");

  enableAllButtons();
}

async function loginUser(event) {
  event.preventDefault();
  disableAllButtons();
  if (!validateLoginForm()) {
    enableAllButtons();
    return;
  }
  const formData = new FormData(event.target);
  const email = formData.get("email");
  const password = formData.get("password");
  const loginResult = await checkUserCredentials(email, password);
  if (loginResult.success) {
    setUserLogin(loginResult.user);
  } else {
    showLoginError("Invalid email or password");
  }
  enableAllButtons();
}

async function deleteContactFromFirebase(contactId) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserContactPath(currentUser.id, contactId)
      : getGuestContactPath(contactId);
  return await deleteData(path);
}

document.addEventListener("DOMContentLoaded", function () {
  initAllPasswordToggles();
});

function disableAllButtons() {
  const loginButton = document.getElementById("loginButton");
  const guestLoginButton = document.getElementById("guestLoginButton");
  const signUpButton = document.getElementById("signUpButton");

  if (loginButton) {
    loginButton.disabled = true;
    loginButton.classList.add("buttonDisabled");
  }
  if (guestLoginButton) {
    guestLoginButton.disabled = true;
    guestLoginButton.classList.add("buttonDisabled");
  }
  if (signUpButton) {
    signUpButton.disabled = true;
    signUpButton.classList.add("buttonDisabled");
  }
}

function enableAllButtons() {
  const loginButton = document.getElementById("loginButton");
  const guestLoginButton = document.getElementById("guestLoginButton");
  const signUpButton = document.getElementById("signUpButton");

  if (loginButton) {
    loginButton.disabled = false;
    loginButton.classList.remove("buttonDisabled");
  }
  if (guestLoginButton) {
    guestLoginButton.disabled = false;
    guestLoginButton.classList.remove("buttonDisabled");
  }
  if (signUpButton) {
    signUpButton.disabled = false;
    signUpButton.classList.remove("buttonDisabled");
  }
}
