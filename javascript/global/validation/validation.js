/**
 * @fileoverview Core validation utility functions
 * Provides common validation functions for email, password, and form handling
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates email format using basic structure checks for @ symbol and domain presence
 * Performs minimum length validation and checks for essential email components
 * Provides fundamental email format validation for form input validation systems
 * @function validateEmail
 * @param {string} email - The email address string to validate for basic format compliance
 * @returns {boolean} True if email format meets basic validation criteria, false if format is invalid
 */
function validateEmail(email) {
  if (email.length < 5) return false;
  if (email.indexOf("@") === -1) return false;
  if (email.indexOf(".") === -1) return false;
  return true;
}

/**
 * Validates password meets minimum length security requirement for user authentication
 * Checks password existence and validates against specified minimum character length
 * Provides essential password strength validation for secure user account creation
 * @function validatePassword
 * @param {string} password - The password string to validate for length requirements
 * @param {number} minLength - Minimum required character length for password security compliance
 * @returns {boolean} True if password meets minimum length requirements, false if password is too short or empty
 */
function validatePassword(password, minLength) {
  if (!password) return false;
  if (password.length < minLength) return false;
  return true;
}

/**
 * Validates that a form field value is present and contains meaningful content
 * Checks for value existence and ensures trimmed content is not empty or whitespace-only
 * Provides essential required field validation for form input completion verification
 * @function validateRequired
 * @param {string} value - The form field value string to validate for required field completion
 * @returns {boolean} True if value is present and contains non-whitespace content, false if empty or whitespace-only
 */
function validateRequired(value) {
  if (!value) return false;
  if (value.trim().length === 0) return false;
  return true;
}

/**
 * Displays validation error message for specific input field with visual styling and error text
 * Applies error CSS class to input field and shows error message in associated form group
 * Provides immediate visual feedback when form field validation fails with contextual error information
 * @function showError
 * @param {string} inputId - The unique identifier of the input field element to mark with error styling
 * @param {string} message - The validation error message text to display to the user for correction guidance
 * @returns {void} No return value, updates DOM elements to show error styling and message
 */
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.add("errorInput");
  const formGroup = input.closest(".formGroup");
  const errorDiv = formGroup.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hide");
  }
}

/**
 * Clears validation error state and message for specific input field to reset form validation
 * Removes error CSS class from input field and hides error message in form group or dedicated error element
 * Provides comprehensive error state cleanup for form field revalidation or successful correction
 * @function clearError
 * @param {string} inputId - The unique identifier of the input field element to clear error state from
 * @returns {void} No return value, removes error styling and hides error messages from specified input field
 */
function clearError(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.remove("errorInput");
  const errorMessage = document.getElementById(inputId + "Error");
  if (errorMessage) {
    errorMessage.textContent = "";
    errorMessage.classList.add("hide");
  } else {
    const formGroup = input.closest(".formGroup") || input.parentNode;
    const errorDiv = formGroup.querySelector(".errorMessage");
    if (errorDiv) {
      errorDiv.textContent = "";
      errorDiv.classList.add("hide");
    }
  }
}

/**
 * Clears all validation error messages for input fields within specified form element
 * Iterates through all input elements in form and removes error states using clearError function
 * Provides comprehensive form-wide error state reset for complete form validation cleanup
 * @function clearAllErrors
 * @param {HTMLElement} formElement - The form DOM element containing input fields to clear error states from
 * @returns {void} No return value, removes error styling and messages from all input fields in form
 */
function clearAllErrors(formElement) {
  const inputs = formElement.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    clearError(inputs[i].id);
  }
}

/**
 * Initializes password visibility toggle functionality for specific password input field
 * Sets up event listeners for input changes and icon clicks to manage password visibility state
 * Provides secure password input with user-controlled visibility toggle for better user experience
 * @function initPasswordToggle
 * @param {string} inputId - The unique identifier of the password input element to initialize toggle functionality for
 * @returns {void} No return value, configures password visibility toggle with event listeners and initial state
 */
function initPasswordToggle(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentNode.querySelector("img");
  if (!input || !icon) return;
  input.setAttribute("data-visible", "false");
  input.style.webkitTextSecurity = "disc";
  input.addEventListener("input", function () {
    updatePasswordIcon(inputId);
  });
  icon.addEventListener("click", function () {
    togglePasswordVisibility(inputId);
  });
  updatePasswordIcon(inputId);
}

/**
 * Updates password visibility icon based on current input value and visibility state
 * Changes icon source and accessibility attributes based on password content and visibility status
 * Provides dynamic visual feedback for password input state with appropriate accessibility labeling
 * @function updatePasswordIcon
 * @param {string} inputId - The unique identifier of the password input element to update icon for
 * @returns {void} No return value, updates icon source, alt text, and cursor styling based on password state
 */
function updatePasswordIcon(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentNode.querySelector("img");
  if (!input || !icon) return;
  if (input.value.length > 0) {
    const isVisible = input.getAttribute("data-visible") === "true";
    if (isVisible) {
      icon.src = "../assets/icons/login/visibility.svg";
      icon.alt = "Hide password";
    } else {
      icon.src = "../assets/icons/login/visibilityoff.svg";
      icon.alt = "Show password";
    }
    icon.style.cursor = "pointer";
  } else {
    icon.src = "../assets/icons/login/lock.png";
    icon.alt = "lock";
    icon.style.cursor = "default";
  }
}

/**
 * Toggles password visibility state between hidden and visible with appropriate icon and styling updates
 * Switches between masked and plain text display while updating visibility icon and accessibility attributes
 * Provides secure password input control allowing users to verify password content when needed
 * @function togglePasswordVisibility
 * @param {string} inputId - The unique identifier of the password input element to toggle visibility for
 * @returns {void} No return value, switches password masking state and updates icon styling accordingly
 */
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.parentNode.querySelector("img");
  if (!input || !icon || input.value.length === 0) return;
  const isCurrentlyVisible = input.getAttribute("data-visible") === "true";
  if (isCurrentlyVisible) {
    input.style.webkitTextSecurity = "disc";
    input.setAttribute("data-visible", "false");
    icon.src = "../assets/icons/login/visibilityoff.svg";
    icon.alt = "Show password";
  } else {
    input.style.webkitTextSecurity = "none";
    input.setAttribute("data-visible", "true");
    icon.src = "../assets/icons/login/visibility.svg";
    icon.alt = "Hide password";
  }
}

/**
 * Initializes password visibility toggle functionality for all password-related input fields on the page
 * Iterates through predefined password field IDs and applies toggle functionality to existing elements
 * Provides comprehensive password input enhancement for forms with multiple password fields
 * @function initAllPasswordToggles
 * @returns {void} No return value, configures password visibility toggles for all relevant password input fields
 */
function initAllPasswordToggles() {
  const passwordIds = ["password", "confirmPassword"];
  for (let i = 0; i < passwordIds.length; i++) {
    const input = document.getElementById(passwordIds[i]);
    if (input) {
      initPasswordToggle(passwordIds[i]);
    }
  }
}
