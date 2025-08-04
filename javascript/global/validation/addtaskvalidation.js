/**
 * @fileoverview Validation functions for the Add Task form
 * Handles form input validation, date formatting, and error display for task creation
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
 * Validates the entire Add Task form by checking all required fields and constraints
 * Performs comprehensive validation including title, due date, category, assignee, and priority
 * Clears previous errors before validation and shows specific error messages for failures
 * @function validateAddTaskForm
 * @returns {boolean} True if all form validations pass and form can be submitted, false if any validation fails
 */
function validateAddTaskForm() {
  const inputs = getFormInputs();
  let isValid = true;
  clearAllTaskErrors();
  if (!validateTitle(inputs.titleInput)) isValid = false;
  if (!validateDueDate(inputs.dueDateInput)) isValid = false;
  if (!validateCategory()) isValid = false;
  if (!validateAssignee()) isValid = false;
  if (!validatePriority()) isValid = false;
  return isValid;
}

/**
 * Retrieves and organizes form input elements needed for Add Task validation
 * Centralizes DOM element access to reduce repeated getElementById calls
 * Returns structured object with named properties for easy access
 * @function getFormInputs
 * @returns {Object} Object containing form input elements for validation
 * @returns {HTMLInputElement|null} returns.titleInput - Task title input element
 * @returns {HTMLInputElement|null} returns.dueDateInput - Task due date input element
 */
function getFormInputs() {
  return {
    titleInput: document.getElementById("taskTitle"),
    dueDateInput: document.getElementById("taskDueDate"),
  };
}

/**
 * Validates the task title input field for required content
 * Checks if title input exists and contains valid, non-empty content
 * Displays appropriate error message if validation fails
 * @function validateTitle
 * @param {HTMLInputElement|null} titleInput - The task title input element to validate
 * @returns {boolean} True if title is valid and not empty, false if missing or empty
 */
function validateTitle(titleInput) {
  if (!titleInput || !validateRequired(titleInput.value)) {
    showError("taskTitle", "This field is required");
    return false;
  }
  return true;
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
 * Validates the task category selection using custom dropdown system
 * Integrates with customdropdown.js system for reliable category value retrieval
 * Falls back to global selectedCategory variable if custom dropdown function unavailable
 * @function validateCategory
 * @returns {boolean} True if a valid category is selected, false if no category chosen
 */
function validateCategory() {
  const categoryValue =
    typeof getSelectedCategoryName === "function"
      ? getSelectedCategoryName()
      : selectedCategory || "";
  if (!categoryValue || categoryValue === "") {
    showCategoryError("This field is required");
    return false;
  }
  clearCategoryError();
  return true;
}

/**
 * Validates the assignee selection with support for both custom dropdown and standard select
 * Checks custom dropdown system first, falls back to standard select element
 * Ensures at least one contact is assigned to the task before submission
 * @function validateAssignee
 * @returns {boolean} True if at least one assignee is selected, false if no assignee chosen
 */
function validateAssignee() {
  if (typeof getSelectedContactIds !== "function") {
    const assigneeSelect = document.getElementById("taskAssignee");
    if (
      !assigneeSelect ||
      !assigneeSelect.value ||
      assigneeSelect.value === ""
    ) {
      return false;
    }
    return true;
  }
  const selectedContactIds = getSelectedContactIds();
  if (!selectedContactIds || selectedContactIds.length === 0) {
    showCustomDropdownError("This field is required");
    return false;
  }
  clearCustomDropdownError();
  return true;
}

/**
 * Displays validation error message for the custom contacts dropdown interface
 * Finds custom dropdown container and shows error with red border styling
 * Removes hidden class from error message element to make it visible
 * @function showCustomDropdownError
 * @param {string} message - The validation error message to display to user
 * @returns {void} No return value, updates DOM to show error state
 */
function showCustomDropdownError(message) {
  const customDropdownContainer = document.querySelector(
    ".customDropdownContainer"
  );
  if (!customDropdownContainer) return;
  const errorDiv = customDropdownContainer.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hide");
  }
  const dropdownHeader = document.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#ff0000";
  }
}

/**
 * Clears validation error message and styling for the custom contacts dropdown
 * Hides error message by adding hidden class and resets border color to default
 * Restores dropdown to normal visual state after successful validation
 * @function clearCustomDropdownError
 * @returns {void} No return value, updates DOM to clear error state
 */
function clearCustomDropdownError() {
  const customDropdownContainer = document.querySelector(
    ".customDropdownContainer"
  );
  if (!customDropdownContainer) return;
  const errorDiv = customDropdownContainer.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.add("hide");
  }
  const dropdownHeader = document.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#d1d1d1";
  }
}

/**
 * Displays validation error message for the category dropdown with visual feedback
 * Locates category dropdown container and shows error message with red border
 * Provides immediate visual feedback when category selection is required
 * @function showCategoryError
 * @param {string} message - The validation error message to display for category selection
 * @returns {void} No return value, updates DOM elements to show category error state
 */
function showCategoryError(message) {
  const categoryDropdown = document.getElementById("customCategoryDropdown");
  if (!categoryDropdown) return;
  const errorDiv = categoryDropdown.parentNode.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hide");
  }
  const dropdownHeader = categoryDropdown.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#ff0000";
  }
}

/**
 * Clears validation error state from category dropdown and removes error styling
 * Locates category dropdown container and hides error message with border reset
 * Restores normal visual state when category validation passes
 * @function clearCategoryError
 * @returns {void} No return value, updates DOM elements to remove category error state
 */
function clearCategoryError() {
  const categoryDropdown = document.getElementById("customCategoryDropdown");
  if (!categoryDropdown) return;
  const errorDiv = categoryDropdown.parentNode.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.add("hide");
  }
  const dropdownHeader = categoryDropdown.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#d1d1d1";
  }
}

/**
 * Validates task priority selection and ensures user has selected a priority level
 * Checks if selectedPriority global variable contains a valid priority value
 * Displays error message if no priority is selected, validation passes if priority exists
 * @function validatePriority
 * @returns {boolean} True if a priority is selected and validation passes, false if no priority selected
 */
function validatePriority() {
  if (!selectedPriority || selectedPriority === "") {
    showPriorityError("This field is required");
    return false;
  }
  return true;
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
 * Displays validation error message for the priority selection group with visual feedback
 * Locates priority error container and shows error message with red styling
 * Provides immediate visual feedback when priority selection is required for task creation
 * @function showPriorityError
 * @param {string} message - The validation error message to display for priority selection requirement
 * @returns {void} No return value, updates DOM elements to show priority error state
 */
function showPriorityError(message) {
  const priorityGroup = document.querySelector(".taskPriorityGroup");
  if (!priorityGroup) return;
  clearPriorityError();
  const errorDiv = priorityGroup.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hide");
  }
}

/**
 * Clears validation error state from priority selection group and removes error styling
 * Locates priority error container and hides error message by adding hide class
 * Restores normal visual state when priority validation passes or needs to be reset
 * @function clearPriorityError
 * @returns {void} No return value, updates DOM elements to remove priority error state
 */
function clearPriorityError() {
  const priorityGroup = document.querySelector(".taskPriorityGroup");
  if (!priorityGroup) return;
  const errorDiv = priorityGroup.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.add("hide");
  }
}

/**
 * Clears all validation error messages for the entire Add Task form comprehensively
 * Removes error states from title, due date, assignee dropdown, category dropdown, and priority selection
 * Used to reset form to clean state before new validation or after successful submission
 * @function clearAllTaskErrors
 * @returns {void} No return value, resets all form validation error states to clean state
 */
function clearAllTaskErrors() {
  clearError("taskTitle");
  clearError("taskDueDate");
  clearCustomDropdownError();
  clearCategoryError();
  clearPriorityError();
}

/**
 * Collects and formats all form data for Firebase submission with proper date conversion
 * Retrieves due date input, converts to Firebase format, and creates complete task data object
 * Handles date format conversion and delegates to createTaskDataObject for final data structure
 * @function getFormDataForFirebase
 * @returns {Object} Complete task data object formatted and ready for Firebase database submission
 */
function getFormDataForFirebase() {
  const dueDateInput = document.getElementById("taskDueDate");
  const formattedDueDate = convertDateFormat(dueDateInput);
  return createTaskDataObject(formattedDueDate);
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

/**
 * Creates comprehensive task data object from all form inputs for database storage
 * Assembles title, description, assignees, due date, category, priority, and subtasks into structured object
 * Handles category name resolution and ensures all required fields are properly formatted
 * @function createTaskDataObject
 * @param {string} formattedDueDate - Due date in YYYY-MM-DD format ready for Firebase storage
 * @returns {Object} Complete task data object with all form fields properly structured for database
 */
function createTaskDataObject(formattedDueDate) {
  const categoryValue =
    typeof getSelectedCategoryName === "function"
      ? getSelectedCategoryName()
      : selectedCategory || "";
  return {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value || "",
    dueDate: formattedDueDate,
    taskPriority: selectedPriority,
    assignedTo: document.getElementById("taskAssignee").value,
    Category: mapCategoryToFirebase(categoryValue),
    Status: "toDo",
  };
}

/**
 * Maps both category IDs and names to Firebase display names with comprehensive input support
 * Accepts both category IDs (userStory, technicalTask) and display names (User Story, Technical Task)
 * Returns default "Technical Task" for unmapped categories to ensure data integrity
 * @function mapCategoryToFirebase
 * @param {string} category - The selected category ID or name from dropdown selection
 * @returns {string} Firebase-compatible category name, defaults to "Technical Task" if unmapped
 */
function mapCategoryToFirebase(category) {
  const categoryMap = {
    userStory: "User Story",
    technicalTask: "Technical Task",
    "User Story": "User Story",
    "Technical Task": "Technical Task",
  };

  return categoryMap[category] || "Technical Task";
}

/**
 * Resets the entire Add Task form to clean state with all inputs cleared and validation reset
 * Clears all form input values and resets priority selection to default medium state
 * Provides complete form reset functionality for new task creation or form cleanup
 * @function clearFormWithValidation
 * @returns {void} No return value, resets form inputs and priority selection to initial state
 */
function clearFormWithValidation() {
  clearAllFormInputs();
  resetPriorityToDefault();
  resetCategoryToDefault();
  clearAllTaskErrors();
}

/**
 * Clears all individual input fields in the Add Task form to empty state
 * Resets title, description, due date, contact selections, and subtask input values
 * Delegates contact clearing to external function if available for modular functionality
 * @function clearAllFormInputs
 * @returns {void} No return value, empties all form input field values
 */
function clearAllFormInputs() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  if (typeof clearContactSelections === "function") {
    clearContactSelections();
  }
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) subtaskInput.value = "";
}

/**
 * Resets the selected priority to its default value using external priority management function
 * Delegates to clearPrioritySelection function if available for consistent priority state management
 * Provides fallback behavior if priority management function is not available in current context
 * @function resetPriorityToDefault
 * @returns {void} No return value, resets priority selection to default state
 */
function resetPriorityToDefault() {
  if (typeof clearPrioritySelection === "function") {
    clearPrioritySelection();
  }
  selectedPriority = "Medium";
}

/**
 * Resets the selected category to its default empty state with placeholder restoration
 * Clears selected category variable and resets dropdown input to initial placeholder state
 * Provides clean category selection state for new task creation or form reset
 * @function resetCategoryToDefault
 * @returns {void} No return value, resets category selection and dropdown display to default state
 */
function resetCategoryToDefault() {
  selectedCategory = "";
  const categoryInput = document.getElementById("categoryDropdownInput");
  if (categoryInput) {
    categoryInput.value = "";
    categoryInput.placeholder = "Select task category";
  }
}

/**
 * Clears the Add Task form completely by delegating to comprehensive form reset function
 * Provides simplified interface to clearFormWithValidation for complete form cleanup
 * Ensures all form inputs, validation states, and selections are reset to initial state
 * @function clearForm
 * @returns {void} No return value, performs complete form reset including inputs and validation
 */
function clearForm() {
  clearFormWithValidation();
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeDateInput();
    }, 100);
  }
});
