/**
 * @fileoverview Sign up form validation functions
 * Handles validation for user registration forms including all required fields
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Validates the complete signup form by checking all required fields and terms acceptance
 * Retrieves form elements, validates their values, and displays appropriate error messages
 * Provides comprehensive form validation for user registration process
 * @function validateSignupForm
 * @returns {boolean} True if all signup form validations pass successfully, false if any validation fails
 */
function validateSignupForm() {
  const formElements = getSignupFormElements();
  if (!formElements.isValid) return false;

  const formValues = extractSignupFormValues(formElements);
  clearSignupErrors();

  return processSignupValidation(formValues);
}

/**
 * Processes the signup validation and handles errors
 * @function processSignupValidation
 * @param {Object} formValues - Object containing form values to validate
 * @returns {boolean} True if validation passes, false otherwise
 */
function processSignupValidation(formValues) {
  const validationResult = checkAllSignupFields(
    formValues.name,
    formValues.email,
    formValues.password,
    formValues.confirmPassword,
    formValues.termsAccepted
  );

  if (!validationResult.isValid) {
    handleSignupValidationError(formValues, validationResult.errorText);
    return false;
  }

  return true;
}

/**
 * Handles signup validation errors by marking inputs and showing error
 * @function handleSignupValidationError
 * @param {Object} formValues - Object containing form values
 * @param {string} errorText - Error message to display
 * @returns {void}
 */
function handleSignupValidationError(formValues, errorText) {
  markErrorInputs(
    formValues.name,
    formValues.email,
    formValues.password,
    formValues.confirmPassword
  );
  showSignupError(errorText);
}

/**
 * Retrieves all required signup form elements for validation
 * @function getSignupFormElements
 * @returns {Object} Object containing form elements and validation status
 */
function getSignupFormElements() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  const isValid =
    nameInput &&
    emailInput &&
    passwordInput &&
    confirmPasswordInput &&
    termsCheckbox &&
    errorMessage;
  return {
    nameInput,
    emailInput,
    passwordInput,
    confirmPasswordInput,
    termsCheckbox,
    errorMessage,
    isValid,
  };
}

/**
 * Extracts values from signup form elements for validation
 * @function extractSignupFormValues
 * @param {Object} formElements - Object containing form elements
 * @returns {Object} Object containing extracted form values
 */
function extractSignupFormValues(formElements) {
  return {
    name: formElements.nameInput.value,
    email: formElements.emailInput.value,
    password: formElements.passwordInput.value,
    confirmPassword: formElements.confirmPasswordInput.value,
    termsAccepted: formElements.termsCheckbox.checked,
  };
}

/**
 * Performs comprehensive validation checks on all signup form fields with detailed error reporting
 * Validates name, email, password, confirm password, and terms acceptance with specific error messages
 * Returns structured validation result object for appropriate error handling and user feedback
 * @function checkAllSignupFields
 * @param {string} name - The user's name string to validate for required field completion
 * @param {string} email - The user's email address string to validate for required status and format
 * @param {string} password - The user's password string to validate for required status and minimum length
 * @param {string} confirmPassword - The confirmed password string to validate for matching with original password
 * @param {boolean} termsAccepted - Whether terms and conditions checkbox is checked for agreement
 * @returns {Object} Validation result object containing isValid boolean and errorText string for user feedback
 */
function checkAllSignupFields(
  name,
  email,
  password,
  confirmPassword,
  termsAccepted
) {
  const validations = [
    () => validateNameField(name),
    () => validateEmailField(email),
    () => validatePasswordField(password),
    () => validateConfirmPasswordField(confirmPassword, password),
    () => validateTermsField(termsAccepted),
  ];

  for (const validation of validations) {
    const result = validation();
    if (!result.isValid) return result;
  }

  return { isValid: true };
}

/**
 * Validates the name field for required completion
 * @function validateNameField
 * @param {string} name - The name value to validate
 * @returns {Object} Validation result with isValid boolean and errorText
 */
function validateNameField(name) {
  if (!validateRequired(name)) {
    return { isValid: false, errorText: "Please enter your name." };
  }
  return { isValid: true };
}

/**
 * Validates the email field for required completion and format
 * @function validateEmailField
 * @param {string} email - The email value to validate
 * @returns {Object} Validation result with isValid boolean and errorText
 */
function validateEmailField(email) {
  if (!validateRequired(email)) {
    return { isValid: false, errorText: "Please enter an email address." };
  }
  if (!validateEmail(email)) {
    return { isValid: false, errorText: "Please enter a valid email address." };
  }
  return { isValid: true };
}

/**
 * Validates the password field for required completion and minimum length
 * @function validatePasswordField
 * @param {string} password - The password value to validate
 * @returns {Object} Validation result with isValid boolean and errorText
 */
function validatePasswordField(password) {
  if (!validateRequired(password)) {
    return { isValid: false, errorText: "Please enter a password." };
  }
  if (!validatePassword(password, 6)) {
    return {
      isValid: false,
      errorText: "Password must be at least 6 characters long.",
    };
  }
  return { isValid: true };
}

/**
 * Validates the confirm password field for completion and matching
 * @function validateConfirmPasswordField
 * @param {string} confirmPassword - The confirm password value to validate
 * @param {string} password - The original password to match against
 * @returns {Object} Validation result with isValid boolean and errorText
 */
function validateConfirmPasswordField(confirmPassword, password) {
  if (!validateRequired(confirmPassword)) {
    return { isValid: false, errorText: "Please confirm your password." };
  }
  if (password !== confirmPassword) {
    return { isValid: false, errorText: "Passwords do not match." };
  }
  return { isValid: true };
}

/**
 * Validates the terms and conditions acceptance checkbox
 * @function validateTermsField
 * @param {boolean} termsAccepted - Whether terms checkbox is checked
 * @returns {Object} Validation result with isValid boolean and errorText
 */
function validateTermsField(termsAccepted) {
  if (!termsAccepted) {
    return { isValid: false, errorText: "Please accept the Privacy Policy." };
  }
  return { isValid: true };
}

/**
 * Applies error styling to signup form input fields based on validation failures
 * Adds errorInput CSS class to fields that fail validation for immediate visual feedback
 * Handles name, email, password, and confirm password field error styling independently
 * @function markErrorInputs
 * @param {string} name - The name input value to check for required field validation
 * @param {string} email - The email input value to check for required and format validation
 * @param {string} password - The password input value to check for required and length validation
 * @param {string} confirmPassword - The confirm password input value to check for required and matching validation
 * @returns {void} No return value, applies CSS error classes to invalid input elements
 */
function markErrorInputs(name, email, password, confirmPassword) {
  const errorFields = [
    { id: "name", isValid: validateRequired(name) },
    { id: "email", isValid: validateRequired(email) && validateEmail(email) },
    {
      id: "password",
      isValid: validateRequired(password) && validatePassword(password, 6),
    },
    {
      id: "confirmPassword",
      isValid:
        validateRequired(confirmPassword) && password === confirmPassword,
    },
  ];

  errorFields.forEach((field) => {
    if (!field.isValid) {
      document.getElementById(field.id).classList.add("errorInput");
    }
  });
}

/**
 * Clears all signup form error indicators and messages to reset form to clean validation state
 * Removes errorInput CSS classes from all signup input fields and hides error message display
 * Provides comprehensive error state reset for signup form revalidation or new registration attempt
 * @function clearSignupErrors
 * @returns {void} No return value, removes error styling and hides error messages from signup form
 */
function clearSignupErrors() {
  const inputIds = ["name", "email", "password", "confirmPassword"];
  inputIds.forEach((id) => {
    document.getElementById(id).classList.remove("errorInput");
  });

  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  errorMessage.classList.add("hide");
}

/**
 * Displays signup form validation error message with button re-enabling for user retry
 * Shows error message text to user and enables signup button for additional registration attempts
 * Provides immediate visual feedback when signup form validation fails with retry capability
 * @function showSignupError
 * @param {string} text - The validation error message text to display to the user for feedback
 * @returns {void} No return value, updates DOM to show error message and enables signup button
 */
function showSignupError(text) {
  const errorMessage = document.getElementsByClassName("errorMessage")[0];
  errorMessage.textContent = text;
  errorMessage.classList.remove("hide");
  enableSignUpButton();
}

/**
 * Handles complete user signup form submission process including validation and account creation
 * Prevents default form submission, validates credentials, and processes user registration with Firebase
 * Provides comprehensive signup flow with button state management and error handling throughout process
 * @function signupUser
 * @param {Event} event - The form submission event object containing signup form data and preventing default behavior
 * @returns {Promise<void>} No return value, handles async signup process with credential validation and account creation
 */
async function signupUser(event) {
  event.preventDefault();
  disableSignUpButton();

  if (!validateSignupForm()) {
    enableSignUpButton();
    return;
  }

  const userData = extractUserDataFromForm(event.target);
  await processSignup(userData.name, userData.email, userData.password);
}

/**
 * Extracts user data from form submission
 * @function extractUserDataFromForm
 * @param {HTMLFormElement} form - The form element
 * @returns {Object} Object containing name, email, and password
 */
function extractUserDataFromForm(form) {
  const formData = new FormData(form);
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };
}

/**
 * Processes signup logic and communicates with Firebase for user account creation
 * Creates user data object, sends registration request to Firebase, and handles success or failure responses
 * Provides comprehensive signup processing with appropriate success messages or error handling
 * @function processSignup
 * @param {string} name - The user's full name for account creation and profile setup
 * @param {string} email - The user's email address for account identification and authentication
 * @param {string} password - The user's password for account security and login authentication
 * @returns {Promise<void>} No return value, handles async signup processing with Firebase integration
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
 * Displays success message on successful signup with automatic redirect to login page
 * Shows green success message to user and redirects to login page after 2-second delay
 * Provides positive user feedback and seamless transition to login flow after successful registration
 * @function showSuccessMessage
 * @returns {void} No return value, displays success message and schedules automatic page redirect
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
 * Displays error message when email address is already registered in the system
 * Applies error styling to email input field and shows specific error message with button re-enabling
 * Provides clear feedback when user attempts to register with existing email address
 * @function showEmailAlreadyExistsError
 * @returns {void} No return value, updates DOM to show email conflict error and enables signup button
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
 * Disables the signup button during form processing to prevent multiple submissions
 * Applies disabled state and visual styling to signup button for user interface protection
 * Provides protection against double-clicks and concurrent signup attempts during processing
 * @function disableSignUpButton
 * @returns {void} No return value, updates signup button state to disabled with appropriate CSS styling
 */
function disableSignUpButton() {
  const signUpButton = document.getElementById("SignUpButton");
  if (signUpButton) {
    signUpButton.disabled = true;
    signUpButton.classList.add("buttonDisabled");
  }
}

/**
 * Enables the signup button after form processing to restore normal form functionality
 * Removes disabled state and visual styling from signup button for user retry capability
 * Provides user interface restoration allowing users to retry signup or navigate between forms
 * @function enableSignUpButton
 * @returns {void} No return value, updates signup button state to enabled with normal CSS styling restored
 */
function enableSignUpButton() {
  const signUpButton = document.getElementById("SignUpButton");
  if (signUpButton) {
    signUpButton.disabled = false;
    signUpButton.classList.remove("buttonDisabled");
  }
}
