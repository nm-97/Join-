/**
 * @fileoverview Main Add Task form validation orchestrator
 * Coordinates validation of all task form fields using modular validation functions
 * @author Join Project Team
 * @version 2.0.0
 */

"use strict";

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
 * Quick validation check for required fields only
 * Performs basic validation without detailed error messages
 * @function quickValidateTaskForm
 * @returns {boolean} True if basic validation passes, false otherwise
 */
function quickValidateTaskForm() {
  const inputs = getFormInputs();

  if (!inputs.titleInput || !validateRequired(inputs.titleInput.value))
    return false;
  if (!inputs.dueDateInput || !validateRequired(inputs.dueDateInput.value))
    return false;
  if (!getSelectedCategoryValue()) return false;
  if (!selectedPriority) return false;

  if (typeof getSelectedContactIds === "function") {
    const selectedContactIds = getSelectedContactIds();
    if (!selectedContactIds || selectedContactIds.length === 0) return false;
  } else {
    const assigneeSelect = document.getElementById("taskAssignee");
    if (!assigneeSelect || !assigneeSelect.value) return false;
  }

  return true;
}

/**
 * Validates form and returns detailed result object
 * Provides comprehensive validation with detailed error information
 * @function validateTaskFormDetailed
 * @returns {Object} Validation result with isValid flag and error details
 */
function validateTaskFormDetailed() {
  const result = {
    isValid: true,
    errors: [],
  };

  const inputs = getFormInputs();

  if (!validateTitle(inputs.titleInput)) {
    result.isValid = false;
    result.errors.push({ field: "title", message: "Title is required" });
  }

  if (!validateDueDate(inputs.dueDateInput)) {
    result.isValid = false;
    result.errors.push({
      field: "dueDate",
      message: "Valid due date is required",
    });
  }

  if (!validateCategory()) {
    result.isValid = false;
    result.errors.push({ field: "category", message: "Category is required" });
  }

  if (!validateAssignee()) {
    result.isValid = false;
    result.errors.push({
      field: "assignee",
      message: "At least one assignee is required",
    });
  }

  if (!validatePriority()) {
    result.isValid = false;
    result.errors.push({ field: "priority", message: "Priority is required" });
  }

  return result;
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      if (typeof initializeDateInput === "function") {
        initializeDateInput();
      }
    }, 100);
  }
});
