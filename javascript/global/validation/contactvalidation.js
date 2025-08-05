"use strict";

/**
 * Validates the complete contact form by checking all required fields
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
 * Validates required name, email, and phone fields and creates appropriate combined error messages
 * Returns structured validation result object with success status and specific error messages
 * @function checkAllContactFields
 * @param {string} name - The contact name string to validate for required field completion
 * @param {string} email - The email address string to validate for proper format (required field)
 * @param {string} phone - The phone number string to validate for format and length constraints (required field)
 * @returns {Object} Validation result object containing isValid boolean and errorText string for user feedback
 */
function checkAllContactFields(name, email, phone) {
  const missingFields = [];
  const invalidFields = [];
  
  if (!validateRequired(name)) {
    missingFields.push("name");
  }
  
  if (!validateRequired(email)) {
    missingFields.push("email address");
  } else if (!validateEmail(email)) {
    invalidFields.push("email address");
  }
  
  if (!validateRequired(phone)) {
    missingFields.push("phone number");
  } else if (!validatePhone(phone)) {
    invalidFields.push("phone number");
  }
  
  if (missingFields.length > 0) {
    return { isValid: false, errorText: createMissingFieldsMessage(missingFields) };
  }
  
  if (invalidFields.length > 0) {
    return { isValid: false, errorText: createInvalidFieldsMessage(invalidFields) };
  }
  
  return { isValid: true };
}

/**
 * Creates appropriate error message for missing required fields
 * @function createMissingFieldsMessage
 * @param {Array} missingFields - Array of missing field names
 * @returns {string} Formatted error message for missing fields
 */
function createMissingFieldsMessage(missingFields) {
  if (missingFields.length === 1) {
    return `Please enter a ${missingFields[0]}.`;
  } else if (missingFields.length === 2) {
    return `Please enter a ${missingFields[0]} and ${missingFields[1]}.`;
  } else {
    return `Please enter a ${missingFields[0]}, ${missingFields[1]} and ${missingFields[2]}.`;
  }
}

/**
 * Creates appropriate error message for invalid field formats
 * @function createInvalidFieldsMessage
 * @param {Array} invalidFields - Array of invalid field names
 * @returns {string} Formatted error message for invalid fields
 */
function createInvalidFieldsMessage(invalidFields) {
  if (invalidFields.length === 1) {
    return `Please enter a valid ${invalidFields[0]}.`;
  } else if (invalidFields.length === 2) {
    return `Please enter a valid ${invalidFields[0]} and ${invalidFields[1]}.`;
  } else {
    return `Please enter a valid ${invalidFields[0]}, ${invalidFields[1]} and ${invalidFields[2]}.`;
  }
}

/**
 * Validates phone number format and length constraints for contact form submission
 * Checks maximum length of 15 characters and validates that only one plus sign at the beginning is allowed, followed by numbers only
 * @function validatePhone
 * @param {string} phone - The phone number string to validate for format and length compliance
 * @returns {boolean} True if phone number meets format and length requirements, false if validation fails
 */
function validatePhone(phone) {
  if (phone.length > 15) return false;
  const phoneRegex = /^\+?[0-9]+$/;
  return phoneRegex.test(phone);
}

/**
 * Validates email address format including proper domain structure with top-level domain
 * Checks for valid email format with @ symbol, domain name, and TLD with at least 2 characters
 * @function validateEmail
 * @param {string} email - The email address string to validate
 * @returns {boolean} True if email has valid format with proper TLD, false if validation fails
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Validates that a required field contains a non-empty value
 * @function validateRequired
 * @param {string} value - The field value to check
 * @returns {boolean} True if field has content, false if empty or whitespace only
 */
function validateRequired(value) {
  return value && value.trim().length > 0;
}

/**
 * Applies error styling to contact form input fields based on validation failures
 * Adds errorInput class to fields that fail validation for visual feedback to user
 * Handles name, email, and phone required validation and format validation independently
 * @function markContactErrorInputs
 * @param {string} name - The name input value to check for required field validation
 * @param {string} email - The email input value to check for required field and format validation
 * @param {string} phone - The phone input value to check for required field and format validation
 * @returns {void} No return value, applies CSS error classes to invalid input elements
 */
function markContactErrorInputs(name, email, phone) {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  
  if (!validateRequired(name)) {
    nameInput.classList.add("errorInput");
  }
  
  if (!validateRequired(email) || !validateEmail(email)) {
    emailInput.classList.add("errorInput");
  }
  
  if (!validateRequired(phone) || !validatePhone(phone)) {
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
 * Automatically removes any characters not matching phone number pattern (optional plus at start, then numbers only)
 * @function setupPhoneInputFilter
 * @returns {void} No return value, configures input event listeners for phone number validation filtering
 */
function setupPhoneInputFilter() {
  const phoneInputs = document.querySelectorAll('input[name="phone"]');
  for (let i = 0; i < phoneInputs.length; i++) {
    const phoneInput = phoneInputs[i];
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value;
      let filteredValue = "";
      
      for (let j = 0; j < value.length && filteredValue.length < 15; j++) {
        const char = value.charAt(j);
        if (j === 0 && char === '+') {
          filteredValue += char;
        } else if (char >= '0' && char <= '9') {
          filteredValue += char;
        }
      }
      
      if (value !== filteredValue) {
        e.target.value = filteredValue;
      }
    });
  }
}