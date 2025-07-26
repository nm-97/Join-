/**
 * @fileoverview Contact form validation functions
 * Handles validation for contact creation and editing forms
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates the contact form including name, email, and phone fields
 * @returns {boolean} True if all validations pass, false otherwise
 */
function validateContactForm() {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  if (!nameInput || !emailInput || !phoneInput || !errorMessage) return false;

  const name = nameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;

  clearContactErrors();

  const validationResult = checkAllContactFields(name, email, phone);

  if (!validationResult.isValid) {
    markContactErrorInputs(name, email, phone);
    showContactError(validationResult.errorText);
    return false;
  }

  return true;
}

/**
 * Checks all contact form fields for validity
 * @param {string} name - The contact name to validate
 * @param {string} email - The email address to validate
 * @param {string} phone - The phone number to validate
 * @returns {Object} Validation result with isValid boolean and errorText
 */
function checkAllContactFields(name, email, phone) {
  if (!validateRequired(name)) {
    return { isValid: false, errorText: "Please enter a name." };
  }

  if (email && !validateEmail(email)) {
    return { isValid: false, errorText: "Please enter a valid email address." };
  }

  if (phone && !validatePhone(phone)) {
    return {
      isValid: false,
      errorText: "Phone number is too long or contains invalid characters.",
    };
  }

  return { isValid: true };
}

/**
 * Validates phone number format and length
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if phone number is valid, false otherwise
 */
function validatePhone(phone) {
  if (phone.length > 15) return false;

  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone);
}

/**
 * Marks input fields with error class based on invalid values
 * @param {string} name - The name input value
 * @param {string} email - The email input value
 * @param {string} phone - The phone input value
 */
function markContactErrorInputs(name, email, phone) {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');

  if (!validateRequired(name)) {
    nameInput.classList.add("errorInput");
  }

  if (email && !validateEmail(email)) {
    emailInput.classList.add("errorInput");
  }

  if (phone && !validatePhone(phone)) {
    phoneInput.classList.add("errorInput");
  }
}

/**
 * Clears all contact form error states and messages
 */
function clearContactErrors() {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  if (nameInput) nameInput.classList.remove("errorInput");
  if (emailInput) emailInput.classList.remove("errorInput");
  if (phoneInput) phoneInput.classList.remove("errorInput");
  if (errorMessage) errorMessage.classList.add("hide");
}

/**
 * Displays a contact form error message
 * @param {string} text - The error message to display
 */
function showContactError(text) {
  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  if (errorMessage) {
    errorMessage.textContent = text;
    errorMessage.classList.remove("hide");
  }
}

/**
 * Sets up input filter for phone fields to allow valid characters
 */
function setupPhoneInputFilter() {
  const phoneInputs = document.querySelectorAll('input[name="phone"]');

  for (let i = 0; i < phoneInputs.length; i++) {
    const phoneInput = phoneInputs[i];

    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value;
      let filteredValue = value.replace(/[^0-9+\-\s()]/g, "");

      if (value !== filteredValue) {
        e.target.value = filteredValue;
      }
    });
  }
}
