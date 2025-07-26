/**
 * @fileoverview Sign up form validation functions
 * Handles validation for user registration forms including all required fields
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates the complete sign up form including all required fields
 * @returns {boolean} True if all validations pass, false otherwise
 */
function validateSignupForm() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  if (
    !nameInput ||
    !emailInput ||
    !passwordInput ||
    !confirmPasswordInput ||
    !termsCheckbox ||
    !errorMessage
  )
    return false;

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const termsAccepted = termsCheckbox.checked;

  clearSignupErrors();

  const validationResult = checkAllSignupFields(
    name,
    email,
    password,
    confirmPassword,
    termsAccepted
  );

  if (!validationResult.isValid) {
    markErrorInputs(name, email, password, confirmPassword);
    showSignupError(validationResult.errorText);
    return false;
  }

  return true;
}

/**
* Validates all signup form fields and returns validation result
* @param {string} name - The user's name
* @param {string} email - The user's email address
* @param {string} password - The user's password
* @param {string} confirmPassword - The confirmed password
* @param {boolean} termsAccepted - Whether terms and conditions are accepted
* @returns {Object} Object with isValid boolean and errorText string
*/
function checkAllSignupFields(
  name,
  email,
  password,
  confirmPassword,
  termsAccepted
) {
  if (!validateRequired(name)) {
    return { isValid: false, errorText: "Please enter your name." };
  }

  if (!validateRequired(email)) {
    return { isValid: false, errorText: "Please enter an email address." };
  }

  if (!validateEmail(email)) {
    return { isValid: false, errorText: "Please enter a valid email address." };
  }

  if (!validateRequired(password)) {
    return { isValid: false, errorText: "Please enter a password." };
  }

  if (!validatePassword(password, 6)) {
    return {
      isValid: false,
      errorText: "Password must be at least 6 characters long.",
    };
  }

  if (!validateRequired(confirmPassword)) {
    return { isValid: false, errorText: "Please confirm your password." };
  }

  if (password !== confirmPassword) {
    return { isValid: false, errorText: "Passwords do not match." };
  }

  if (!termsAccepted) {
    return { isValid: false, errorText: "Please accept the Privacy Policy." };
  }

  return { isValid: true };
}

/**
 * Marks form inputs with error class based on invalid signup values
 * @param {string} name - The name value
 * @param {string} email - The email value
 * @param {string} password - The password value
 * @param {string} confirmPassword - The confirmed password value
 */
function markErrorInputs(name, email, password, confirmPassword) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (!validateRequired(name)) {
    nameInput.classList.add("errorInput");
  }

  if (!validateRequired(email) || !validateEmail(email)) {
    emailInput.classList.add("errorInput");
  }

  if (!validateRequired(password) || !validatePassword(password, 6)) {
    passwordInput.classList.add("errorInput");
  }

  if (!validateRequired(confirmPassword) || password !== confirmPassword) {
    confirmPasswordInput.classList.add("errorInput");
  }
}

/**
 * Clears all signup form error indicators and messages
 */
function clearSignupErrors() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  nameInput.classList.remove("errorInput");
  emailInput.classList.remove("errorInput");
  passwordInput.classList.remove("errorInput");
  confirmPasswordInput.classList.remove("errorInput");
  errorMessage.classList.add("hide");
}

/**
 * Displays signup form error message and updates UI
 * @param {string} text - The error message to show
 */
function showSignupError(text) {
  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  errorMessage.textContent = text;
  errorMessage.classList.remove("hide");

  enableSignUpButton();
}

/**
 * Handles user signup form submission and creates account
 * @param {Event} event - The form submission event
 */
async function signupUser(event) {
  event.preventDefault();

  disableSignUpButton();

  if (!validateSignupForm()) {
    enableSignUpButton();
    return;
  }

  const formData = new FormData(event.target);
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  await processSignup(name, email, password);
}

/**
 * Processes the signup logic and communicates with Firebase
 * @param {string} name - The user's name
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 */
async function processSignup(name, email, password) {
  try {
    const userData = { name: name, email: email, password: password };
    const signupResult = await createUser(userData);

    if (signupResult.success) {
      showSuccessMessage();
    } else {
      showEmailAlreadyExistsError();
    }
  } catch (error) {
    showSignupError("An error occurred. Please try again.");
    console.error("SignUp Error:", error);
  }
}

/**
 * Displays success message on successful signup
 */
function showSuccessMessage() {
  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  errorMessage.textContent = "Registration successful! You can now log in.";
  errorMessage.style.color = "#4CAF50";
  errorMessage.classList.remove("hide");

  setTimeout(function () {
    window.location.href = "../html/index.html";
  }, 2000);
}

/**
 * Displays error when email is already registered
 */
function showEmailAlreadyExistsError() {
  const emailInput = document.getElementById("email");

  emailInput.classList.add("errorInput");
  showSignupError("This email address is already registered.");

  enableSignUpButton();
}

document.addEventListener("DOMContentLoaded", function () {
  initAllPasswordToggles();
});

/**
 * Disables the signup button during processing
 */
function disableSignUpButton() {
  const signUpButton = document.getElementById("SignUpButton");

  if (signUpButton) {
    signUpButton.disabled = true;
    signUpButton.classList.add("buttonDisabled");
  }
}

/**
 * Enables the signup button after processing
 */
function enableSignUpButton() {
  const signUpButton = document.getElementById("SignUpButton");

  if (signUpButton) {
    signUpButton.disabled = false;
    signUpButton.classList.remove("buttonDisabled");
  }
}
