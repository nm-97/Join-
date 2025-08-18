/**
 * @fileoverview Date Picker Management for Add Task functionality
 * Handles date picker configuration, formatting, and user interaction
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Opens and configures the date picker for task due date selection
 * @function openDatePicker
 * @returns {void} No return value, initializes and opens date picker with proper configuration
 */
function openDatePicker() {
  const elements = getDatePickerElements();
  if (!elements.picker || !elements.input) return;
  configureDatePickerMinimum(elements.picker);
  openDatePickerDialog(elements.picker);
  setupDatePickerChangeHandler(elements.picker, elements.input);
}

/**
 * Retrieves the date picker elements from the DOM
 * @function getDatePickerElements
 * @returns {Object} Object containing picker and input elements
 */
function getDatePickerElements() {
  return {
    picker: document.getElementById("hiddenDatePicker"),
    input: document.getElementById("taskDueDate"),
  };
}

/**
 * Sets the minimum date to today to prevent selecting past dates
 * @function configureDatePickerMinimum
 * @param {HTMLElement} picker - The date picker input element
 * @returns {void} No return value, sets minimum date constraint
 */
function configureDatePickerMinimum(picker) {
  const today = getTodayDateString();
  picker.min = today;
}

/**
 * Gets today's date in ISO format (YYYY-MM-DD)
 * @function getTodayDateString
 * @returns {string} Today's date in ISO format
 */
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Opens the native date picker dialog
 * @function openDatePickerDialog
 * @param {HTMLElement} picker - The date picker input element
 * @returns {void} No return value, triggers the date picker interface
 */
function openDatePickerDialog(picker) {
  picker.showPicker();
}

/**
 * Sets up the change event handler for the date picker
 * @function setupDatePickerChangeHandler
 * @param {HTMLElement} picker - The date picker input element
 * @param {HTMLElement} input - The target input field for formatted date
 * @returns {void} No return value, configures date selection handling
 */
function setupDatePickerChangeHandler(picker, input) {
  picker.onchange = () => {
    const formattedDate = formatSelectedDate(picker.value);
    input.value = formattedDate;
  };
}

/**
 * Formats the selected date from picker format to display format
 * @function formatSelectedDate
 * @param {string} pickerValue - The date value from the picker (ISO format)
 * @returns {string} Formatted date string (DD/MM/YYYY) or empty string if no value
 */
function formatSelectedDate(pickerValue) {
  if (!pickerValue) {
    return "";
  }
  const date = new Date(pickerValue);
  return formatDateToDisplayString(date);
}

/**
 * Converts a Date object to DD/MM/YYYY format string
 * @function formatDateToDisplayString
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
function formatDateToDisplayString(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
