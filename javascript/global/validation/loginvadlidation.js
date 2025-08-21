/**
 * @fileoverview Login form validation functions
 * Handles validation for user login forms including email and password checks
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates the complete login form by checking email and password field requirements
 * Retrieves email and password input elements and validates their values comprehensively
 * Clears previous errors, performs validation checks, and displays error messages if validation fails
 * @function validateLoginForm
 * @returns {boolean} True if all login form validations pass successfully, false if any validation fails
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
 * Validates login credentials for completeness, format compliance, and minimum security requirements
 * Checks email field for required status and valid format, validates password for required status and minimum length
 * Performs comprehensive credential validation ensuring both fields meet authentication standards
 * @function isValidLoginData
 * @param {string} email - The email address string to validate for required status and proper email format
 * @param {string} password - The password string to validate for required status and minimum length requirements
 * @returns {boolean} True if both email and password meet all validation criteria, false if any validation fails
 */
function isValidLoginData(email, password) {
  if (!validateRequired(email)) return false;
  if (!validateEmail(email)) return false;
  if (!validateRequired(password)) return false;
  if (!validatePassword(password, 6)) return false;
  return true;
}

/**
 * Clears all error indicators and hides error message in login form to reset validation state
 * Removes errorInput CSS classes from email and password fields and hides error message display
 * Provides comprehensive error state reset for login form revalidation or fresh login attempts
 * @function clearLoginErrors
 * @returns {void} No return value, removes error styling and hides error messages from login form
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
 * Displays login form error message with visual styling and re-enables form buttons
 * Applies error styling to email and password inputs, shows error message, and restores button functionality
 * Provides immediate visual feedback when login validation fails and ensures user can retry login
 * @function showLoginError
 * @param {string} message - The login error message text to display to the user for validation feedback
 * @returns {void} No return value, updates DOM to show error styling and message while enabling buttons
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
 * Handles complete user login submission process including validation, authentication, and state management
 * Prevents default form submission, validates credentials, authenticates with backend, and manages user session
 * Provides comprehensive login flow with button state management and error handling throughout process
 * @function loginUser
 * @param {Event} event - The form submission event object containing login form data and preventing default behavior
 * @returns {Promise<void>} No return value, handles async login process with credential validation and user authentication
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
 * Deletes a contact from Firebase database with user context handling for registered and guest users
 * Determines appropriate Firebase path based on current user type and deletes contact data
 * Provides contact deletion functionality integrated with user authentication system
 * @function deleteContactFromFirebase
 * @param {string} contactId - The unique identifier of the contact to delete from Firebase database
 * @returns {Promise<boolean>} Promise resolving to true if contact deletion was successful, false if deletion failed
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
 * Disables all authentication-related buttons to prevent multiple submissions during login process
 * Applies disabled state and visual styling to login, guest login, and sign up buttons
 * Provides user interface protection against double-clicks and concurrent authentication attempts
 * @function disableAllButtons
 * @returns {void} No return value, updates button states to disabled with appropriate CSS styling
 */
function disableAllButtons() {
  const buttonIds = ["loginButton", "guestLoginButton", "signUpButton"];
  buttonIds.forEach((buttonId) => toggleButtonState(buttonId, true));
}

/**
 * Toggles button state between enabled and disabled
 * @function toggleButtonState
 * @param {string} buttonId - The ID of the button to toggle
 * @param {boolean} disable - True to disable, false to enable
 * @returns {void}
 */
function toggleButtonState(buttonId, disable) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.disabled = disable;
    if (disable) {
      button.classList.add("buttonDisabled");
    } else {
      button.classList.remove("buttonDisabled");
    }
  }
}

/**
 * Enables all authentication-related buttons to restore normal form functionality after login process
 * Removes disabled state and visual styling from login, guest login, and sign up buttons
 * Provides user interface restoration allowing users to retry authentication or navigate between forms
 * @function enableAllButtons
 * @returns {void} No return value, updates button states to enabled with normal CSS styling restored
 */
function enableAllButtons() {
  const buttonIds = ["loginButton", "guestLoginButton", "signUpButton"];
  buttonIds.forEach((buttonId) => toggleButtonState(buttonId, false));
}
