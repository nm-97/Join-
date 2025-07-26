/**
 * @fileoverview Core validation utility functions
 * Provides common validation functions for email, password, and form handling
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates email format with basic checks
 * @param {string} email - The email address to validate
 * @returns {boolean} True if email format is valid, false otherwise
 */
function validateEmail(email) {
  if (email.length < 5) return false;
  if (email.indexOf("@") === -1) return false;
  if (email.indexOf(".") === -1) return false;
  return true;
}

/**
 * Validates password meets minimum length requirement
 * @param {string} password - The password to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} True if password meets requirements, false otherwise
 */
function validatePassword(password, minLength) {
  if (!password) return false;
  if (password.length < minLength) return false;
  return true;
}

/**
 * Validates that a value is present and not empty
 * @param {string} value - The value to validate
 * @returns {boolean} True if value is present and not empty, false otherwise
 */
function validateRequired(value) {
  if (!value) return false;
  if (value.trim().length === 0) return false;
  return true;
}

/**
 * Shows error message for a specific input field
 * @param {string} inputId - The ID of the input field
 * @param {string} message - The error message to display
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
 * Clears error state and message for a specific input field
 * @param {string} inputId - The ID of the input field to clear errors for
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

function clearAllErrors(formElement) {
  const inputs = formElement.querySelectorAll("input");
  for (let i = 0; i < inputs.length; i++) {
    clearError(inputs[i].id);
  }
}

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

function initAllPasswordToggles() {
  const passwordIds = ["password", "confirmPassword"];

  for (let i = 0; i < passwordIds.length; i++) {
    const input = document.getElementById(passwordIds[i]);
    if (input) {
      initPasswordToggle(passwordIds[i]);
    }
  }
}
