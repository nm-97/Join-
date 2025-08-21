/**
 * @fileoverview Date validation and formatting utilities
 * Handles date input formatting, validation, and future date checks
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Initializes date input formatting for the task due date field on page load
 * Finds the due date input element and applies DD/MM/YYYY formatting behavior
 * Early return if input element is not found to prevent errors
 * @function initializeDateInput
 * @returns {void} No return value, sets up input formatting or exits gracefully
 */
function initializeDateInput() {
  const dueDateInput = document.getElementById("taskDueDate");
  if (!dueDateInput) return;
  setupDateFormatting(dueDateInput);
}

/**
 * Sets up real-time date formatting for input field with DD/MM/YYYY pattern
 * Automatically adds slashes as user types and limits input to 10 characters
 * Removes non-digit characters and formats into DD/MM/YYYY structure
 * @function setupDateFormatting
 * @param {HTMLInputElement} input - The date input element to apply formatting to
 * @returns {void} No return value, attaches input event listener for real-time formatting
 */
function setupDateFormatting(input) {
  input.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + "/" + value.substring(5);
    }
    e.target.value = value.substring(0, 10);
  });
}

/**
 * Validates date string format against DD/MM/YYYY pattern using regular expression
 * Checks if provided date string matches exact DD/MM/YYYY format requirements
 * Used for client-side date format validation before form submission
 * @function validateDateFormat
 * @param {string} dateString - The date string to validate against DD/MM/YYYY format
 * @returns {boolean} True if date string matches DD/MM/YYYY format exactly, false if format is invalid
 */
function validateDateFormat(dateString) {
  if (dateString.length !== 10) return false;
  if (dateString[2] !== "/" || dateString[5] !== "/") return false;
  const day = dateString.substring(0, 2);
  const month = dateString.substring(3, 5);
  const year = dateString.substring(6, 10);
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 2024) return false;

  return true;
}

/**
 * Validates that given date string represents today or a future date (not past)
 * First validates date format using validateDateFormat, then compares against current date
 * Ensures tasks cannot be assigned due dates in the past for logical task management
 * @function validateTodayOrFutureDate
 * @param {string} dateString - The date string in DD/MM/YYYY format to validate against current date
 * @returns {boolean} True if date is today or in the future, false if date is in the past or invalid format
 */
function validateTodayOrFutureDate(dateString) {
  if (!validateDateFormat(dateString)) return false;
  const day = dateString.substring(0, 2);
  const month = dateString.substring(3, 5);
  const year = dateString.substring(6, 10);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
}

/**
 * Alias function for validateTodayOrFutureDate providing semantic naming for due date validation
 * Ensures due date is not in the past by delegating to comprehensive date validation logic
 * Provides clear function name indicating future date requirement for task due dates
 * @function validateFutureDate
 * @param {string} dateString - The date string in DD/MM/YYYY format to validate as future date
 * @returns {boolean} True if date is today or in the future, false if date is in the past or invalid format
 */
function validateFutureDate(dateString) {
  return validateTodayOrFutureDate(dateString);
}

/**
 * Validates the due date input with comprehensive checks for format and date constraints
 * Performs multiple validation layers: required field, DD/MM/YYYY format, and future date rules
 * Shows specific error messages for each type of validation failure
 * @function validateDueDate
 * @param {HTMLInputElement|null} dueDateInput - The due date input element to validate
 * @returns {boolean} True if due date passes all validation checks, false for any validation failure
 */
function validateDueDate(dueDateInput) {
  if (!dueDateInput || !validateRequired(dueDateInput.value)) {
    showError("taskDueDate", "This field is required");
    return false;
  }
  if (!validateDateFormat(dueDateInput.value)) {
    showError("taskDueDate", "Please use DD/MM/YYYY format");
    return false;
  }
  if (!validateTodayOrFutureDate(dueDateInput.value)) {
    showError("taskDueDate", "Please select today or a future date");
    return false;
  }
  return true;
}

/**
 * Converts due date input from DD/MM/YYYY display format to YYYY-MM-DD Firebase format
 * Extracts day, month, year components from user input and reorders for database storage
 * Handles empty or invalid input by returning empty string for safe database operations
 * @function convertDateFormat
 * @param {HTMLInputElement} dueDateInput - The date input element containing DD/MM/YYYY formatted date
 * @returns {string} Date string in YYYY-MM-DD format for Firebase, or empty string if invalid input
 */
function convertDateFormat(dueDateInput) {
  if (!dueDateInput || !dueDateInput.value) return "";
  const day = dueDateInput.value.substring(0, 2);
  const month = dueDateInput.value.substring(3, 5);
  const year = dueDateInput.value.substring(6, 10);
  if (day && month && year) {
    return year + "-" + month + "-" + day;
  }
  return "";
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeDateInput();
    }, 100);
  }
});
