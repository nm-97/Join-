/**
 * @fileoverview Task-specific field validation functions
 * Handles validation for title, category, priority, and assignee fields
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

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
 * Validates the task category selection using custom dropdown system
 * Integrates with customdropdown.js system for reliable category value retrieval
 * Falls back to global selectedCategory variable if custom dropdown function unavailable
 * @function validateCategory
 * @returns {boolean} True if a valid category is selected, false if no category chosen
 */
function validateCategory() {
  const categoryValue = getSelectedCategoryValue();

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
  if (typeof getSelectedContactIds === "function") {
    const selectedContactIds = getSelectedContactIds();
    if (!selectedContactIds || selectedContactIds.length === 0) {
      showCustomDropdownError("This field is required");
      return false;
    }
    clearCustomDropdownError();
    return true;
  }
  const assigneeSelect = document.getElementById("taskAssignee");
  if (!assigneeSelect || !assigneeSelect.value || assigneeSelect.value === "") {
    return false;
  }
  return true;
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
  clearPriorityError();
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
