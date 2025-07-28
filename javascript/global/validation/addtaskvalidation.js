/**
 * @fileoverview Validation functions for the Add Task form
 * Handles form input validation, date formatting, and error display for task creation
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Initializes date input formatting for the task due date field
 */
function initializeDateInput() {
  const dueDateInput = document.getElementById("taskDueDate");
  if (!dueDateInput) return;
  setupDateFormatting(dueDateInput);
}

/**
 * Sets up date formatting for input field with DD/MM/YYYY pattern
 * @param {HTMLElement} input - The date input element to format
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
 * Validates the entire Add Task form
 * @returns {boolean} True if all validations pass, false otherwise
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
 * Gets form input elements for validation
 * @returns {Object} Object containing title and due date input elements
 */
function getFormInputs() {
  return {
    titleInput: document.getElementById("taskTitle"),
    dueDateInput: document.getElementById("taskDueDate"),
  };
}

/**
 * Validates the task title input
 * @param {HTMLElement} titleInput - The title input element to validate
 * @returns {boolean} True if title is valid, false otherwise
 */
function validateTitle(titleInput) {
  if (!titleInput || !validateRequired(titleInput.value)) {
    showError("taskTitle", "This field is required");
    return false;
  }
  return true;
}

/**
 * Validates the due date input including required, format, and date constraints
 * @param {HTMLElement} dueDateInput - The due date input element to validate
 * @returns {boolean} True if due date is valid, false otherwise
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
 * Validates the task category selection
 * @returns {boolean} True if a category is selected, false otherwise
 */
function validateCategory() {
  // Use the customdropdown.js system which is more reliable
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
 * Validates the assignee selection using custom dropdown or select element
 * @returns {boolean} True if assignee is selected, false otherwise
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
 * Displays an error message for the custom contacts dropdown
 * @param {string} message - The error message to show
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
 * Clears the error message for the custom contacts dropdown
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
 * Displays an error message for the category dropdown
 * @param {string} message - The error message to show
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
 * Clears the error message for the category dropdown
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
 * Validates that a priority has been selected
 * @returns {boolean} True if priority is selected, false otherwise
 */
function validatePriority() {
  if (!selectedPriority || selectedPriority === "") {
    showPriorityError("This field is required");
    return false;
  }
  return true;
}

/**
 * Checks if a date string matches DD/MM/YYYY format
 * @param {string} dateString - The date string to check
 * @returns {boolean} True if format is valid, false otherwise
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
 * Checks if the given date string represents today or a future date
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if date is today or in the future, false otherwise
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
 * Alias for validateTodayOrFutureDate to ensure due date is not in the past
 * @param {string} dateString - The date string to validate
 * @returns {boolean} True if date is valid, false otherwise
 */
function validateFutureDate(dateString) {
  return validateTodayOrFutureDate(dateString);
}

/**
 * Displays an error message for the priority group
 * @param {string} message - The error message to show
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
 * Clears the error message for the priority group
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
 * Clears all validation error messages for the Add Task form
 */
function clearAllTaskErrors() {
  clearError("taskTitle");
  clearError("taskDueDate");
  clearCustomDropdownError();
  clearCategoryError();
  clearPriorityError();
}

/**
 * Collects and formats form data for Firebase submission
 * @returns {Object} Task data object ready for Firebase
 */
function getFormDataForFirebase() {
  const dueDateInput = document.getElementById("taskDueDate");
  const formattedDueDate = convertDateFormat(dueDateInput);
  return createTaskDataObject(formattedDueDate);
}

/**
 * Converts input date from DD/MM/YYYY to YYYY-MM-DD
 * @param {HTMLElement} dueDateInput - The date input element
 * @returns {string} Date string in YYYY-MM-DD format or empty string
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
 * Creates a task data object from form inputs
 * @param {string} formattedDueDate - Due date in YYYY-MM-DD format
 * @returns {Object} New task data object
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
 * Maps the selected category name to Firebase category value
 * @param {string} category - The selected category name
 * @returns {string} Firebase-compatible category name
 */
function mapCategoryToFirebase(category) {
  const categoryMap = {
    "User Story": "User Story",
    "Technical Task": "Technical Task",
  };
  return categoryMap[category] || "Technical Task";
}

/**
 * Resets the Add Task form inputs and validation states
 */
function clearFormWithValidation() {
  clearAllFormInputs();
  resetPriorityToDefault();
  resetCategoryToDefault();
  clearAllTaskErrors();
}

/**
 * Clears all input fields in the Add Task form
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
 * Resets the selected priority to its default value
 */
function resetPriorityToDefault() {
  if (typeof clearPrioritySelection === "function") {
    clearPrioritySelection();
  }
  selectedPriority = "Medium";
}

/**
 * Resets the selected category to its default state
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
 * Clears the Add Task form completely
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
