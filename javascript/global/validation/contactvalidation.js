"use strict";

/**
 * Validates the complete contact form by checking all required fields
 * Retrieves name, email, and phone input elements and validates their values comprehensively
 * Clears previous errors, performs validation, and displays appropriate error messages if validation fails
 * @function validateContactForm
 * @returns {boolean} True if all form validations pass successfully, false if any validation fails
 */
function validateContactForm() {
  const formElements = getContactFormElements();
  if (!formElements.isValid) return false;

  const formValues = extractFormValues(formElements);
  clearContactErrors();

  return processValidationResult(formValues);
}

/**
 * Gets all required form elements for contact validation
 * @function getContactFormElements
 * @returns {Object} Object containing form elements and validity flag
 */
function getContactFormElements() {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const errorMessage = document.getElementsByClassName("errorMessage")[0];

  return {
    nameInput,
    emailInput,
    phoneInput,
    errorMessage,
    isValid: !!(nameInput && emailInput && phoneInput && errorMessage),
  };
}

/**
 * Extracts values from form elements
 * @function extractFormValues
 * @param {Object} elements - Form elements object
 * @returns {Object} Object containing form values
 */
function extractFormValues(elements) {
  return {
    name: elements.nameInput.value,
    email: elements.emailInput.value,
    phone: elements.phoneInput.value,
  };
}

/**
 * Processes validation result and handles errors
 * @function processValidationResult
 * @param {Object} values - Form values to validate
 * @returns {boolean} True if validation passes, false otherwise
 */
function processValidationResult(values) {
  const validationResult = checkAllContactFields(
    values.name,
    values.email,
    values.phone
  );

  if (!validationResult.isValid) {
    markContactErrorInputs(values.name, values.email, values.phone);
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
  const fieldErrors = collectFieldErrors(name, email, phone);
  return generateValidationResult(fieldErrors);
}

/**
 * Collects validation errors for all contact fields
 * @function collectFieldErrors
 * @param {string} name - The contact name to validate
 * @param {string} email - The email address to validate
 * @param {string} phone - The phone number to validate
 * @returns {Object} Object containing arrays of missing and invalid fields
 */
function collectFieldErrors(name, email, phone) {
  const missingFields = [];
  const invalidFields = [];

  validateNameField(name, missingFields);
  validateEmailField(email, missingFields, invalidFields);
  validatePhoneField(phone, missingFields, invalidFields);

  return { missingFields, invalidFields };
}

/**
 * Validates name field and adds to missing fields if invalid
 * @function validateNameField
 * @param {string} name - The name to validate
 * @param {Array} missingFields - Array to add missing field names to
 * @returns {void}
 */
function validateNameField(name, missingFields) {
  if (!validateRequired(name)) {
    missingFields.push("name");
  }
}

/**
 * Validates email field and adds to appropriate error arrays
 * @function validateEmailField
 * @param {string} email - The email to validate
 * @param {Array} missingFields - Array to add missing field names to
 * @param {Array} invalidFields - Array to add invalid field names to
 * @returns {void}
 */
function validateEmailField(email, missingFields, invalidFields) {
  if (!validateRequired(email)) {
    missingFields.push("email address");
  } else if (!validateEmail(email)) {
    invalidFields.push("email address");
  }
}

/**
 * Validates phone field and adds to appropriate error arrays
 * @function validatePhoneField
 * @param {string} phone - The phone to validate
 * @param {Array} missingFields - Array to add missing field names to
 * @param {Array} invalidFields - Array to add invalid field names to
 * @returns {void}
 */
function validatePhoneField(phone, missingFields, invalidFields) {
  if (!validateRequired(phone)) {
    missingFields.push("phone number");
  } else if (!validatePhone(phone)) {
    invalidFields.push("phone number");
  }
}

/**
 * Generates validation result based on field errors
 * @function generateValidationResult
 * @param {Object} fieldErrors - Object containing missing and invalid field arrays
 * @returns {Object} Validation result with isValid flag and error text
 */
function generateValidationResult(fieldErrors) {
  const { missingFields, invalidFields } = fieldErrors;

  if (missingFields.length > 0) {
    return {
      isValid: false,
      errorText: createMissingFieldsMessage(missingFields),
    };
  }

  if (invalidFields.length > 0) {
    return {
      isValid: false,
      errorText: createInvalidFieldsMessage(invalidFields),
    };
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
  phoneInputs.forEach((phoneInput) => {
    phoneInput.addEventListener("input", handlePhoneInputEvent);
  });
}

/**
 * Handles input events for phone number fields
 * @function handlePhoneInputEvent
 * @param {Event} e - The input event
 * @returns {void}
 */
function handlePhoneInputEvent(e) {
  const originalValue = e.target.value;
  const filteredValue = filterPhoneNumber(originalValue);

  if (originalValue !== filteredValue) {
    e.target.value = filteredValue;
  }
}

/**
 * Filters phone number input to allow only valid characters
 * @function filterPhoneNumber
 * @param {string} value - The input value to filter
 * @returns {string} The filtered phone number string
 */
function filterPhoneNumber(value) {
  let filteredValue = "";

  for (let i = 0; i < value.length && filteredValue.length < 15; i++) {
    const char = value.charAt(i);
    if (isValidPhoneCharacter(char, i)) {
      filteredValue += char;
    }
  }

  return filteredValue;
}

/**
 * Checks if a character is valid for phone number at given position
 * @function isValidPhoneCharacter
 * @param {string} char - The character to check
 * @param {number} position - The position in the string
 * @returns {boolean} True if character is valid at this position
 */
function isValidPhoneCharacter(char, position) {
  if (position === 0 && char === "+") {
    return true;
  }
  return char >= "0" && char <= "9";
}
