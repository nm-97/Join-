/**
 * @fileoverview Login form validation functions
 * Handles validation for user login forms including email and password checks
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates the login form including email and password fields
 * @returns {boolean} True if all validations pass, false otherwise
 */
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

/**
 * Validates login credentials for completeness and format
 * @param {string} email - The email address to validate
 * @param {string} password - The password to validate
 * @returns {boolean} True if both email and password are valid, false otherwise
 */
function isValidLoginData(email, password) {
  if (!validateRequired(email)) return false;
  if (!validateEmail(email)) return false;
  if (!validateRequired(password)) return false;
  if (!validatePassword(password, 6)) return false;
  return true;
}

/**
 * Clears error indicators and hides error message in login form
 */
function clearLoginErrors() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  emailInput.classList.remove("errorInput");
  passwordInput.classList.remove("errorInput");
  errorMessage.classList.add("hide");
}

/**
 * Shows login form error message and styles inputs
 * @param {string} message - The error message to display
 */
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

/**
 * Handles user login submission and authentication flow
 * @param {Event} event - The form submission event
 */
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

/**
 * Deletes a contact from Firebase (utility function)
 * @param {string} contactId - The ID of the contact to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
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

/**
 * Disables all buttons in the login and related forms
 */
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

/**
 * Enables all buttons in the login and related forms
 */
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
