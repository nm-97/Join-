/**
 * @fileoverview Contact form validation functions
 * Handles validation for contact creation and editing forms
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates the complete contact form by checking all required and optional fields
 * Retrieves name, email, and phone input elements and validates their values comprehensively
 * Clears previous errors, performs validation, and displays appropriate error messages if validation fails
 * @function validateContactForm
 * @returns {boolean} True if all form validations pass successfully, false if any validation fails
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
 * Performs comprehensive validation checks on all contact form fields with detailed error reporting
 * Validates required name field, optional email format, and optional phone number format and length
 * Returns structured validation result object with success status and specific error messages
 * @function checkAllContactFields
 * @param {string} name - The contact name string to validate for required field completion
 * @param {string} email - The email address string to validate for proper format (optional field)
 * @param {string} phone - The phone number string to validate for format and length constraints (optional field)
 * @returns {Object} Validation result object containing isValid boolean and errorText string for user feedback
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
 * Validates phone number format and length constraints for contact form submission
 * Checks maximum length of 15 characters and validates against allowed phone number characters
 * Uses regex pattern to ensure only numbers, plus signs, hyphens, spaces, and parentheses are allowed
 * @function validatePhone
 * @param {string} phone - The phone number string to validate for format and length compliance
 * @returns {boolean} True if phone number meets format and length requirements, false if validation fails
 */
function validatePhone(phone) {
  if (phone.length > 15) return false;
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone);
}

/**
 * Applies error styling to contact form input fields based on validation failures
 * Adds errorInput class to fields that fail validation for visual feedback to user
 * Handles name required validation, email format validation, and phone format validation independently
 * @function markContactErrorInputs
 * @param {string} name - The name input value to check for required field validation
 * @param {string} email - The email input value to check for format validation
 * @param {string} phone - The phone input value to check for format and length validation
 * @returns {void} No return value, applies CSS error classes to invalid input elements
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
 * Clears all contact form error states and messages to reset form to clean validation state
 * Removes errorInput CSS classes from all contact input fields and hides error message display
 * Provides comprehensive error state reset for form revalidation or new contact entry
 * @function clearContactErrors
 * @returns {void} No return value, removes error styling and hides error messages from contact form
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
 * Displays contact form validation error message with proper visibility control
 * Locates error message element and updates text content while making message visible to user
 * Provides immediate visual feedback when contact form validation fails
 * @function showContactError
 * @param {string} text - The validation error message text to display to the user
 * @returns {void} No return value, updates DOM to show error message with specified text
 */
function showContactError(text) {
  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  if (errorMessage) {
    errorMessage.textContent = text;
    errorMessage.classList.remove("hide");
  }
}

/**
 * Sets up real-time input filtering for phone number fields to allow only valid characters
 * Adds event listeners to all phone input fields to filter out invalid characters as user types
 * Automatically removes any characters not matching phone number pattern (numbers, +, -, spaces, parentheses)
 * @function setupPhoneInputFilter
 * @returns {void} No return value, configures input event listeners for phone number validation filtering
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
