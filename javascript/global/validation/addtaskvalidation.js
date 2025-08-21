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
  return (
    quickValidateBasicFields() &&
    quickValidateCategory() &&
    quickValidatePriority() &&
    quickValidateAssignee()
  );
}

/**
 * Quick validation for title and due date fields
 * @function quickValidateBasicFields
 * @returns {boolean} True if basic fields are valid
 */
function quickValidateBasicFields() {
  const inputs = getFormInputs();
  return (
    inputs.titleInput &&
    validateRequired(inputs.titleInput.value) &&
    inputs.dueDateInput &&
    validateRequired(inputs.dueDateInput.value)
  );
}

/**
 * Quick validation for category selection
 * @function quickValidateCategory
 * @returns {boolean} True if category is selected
 */
function quickValidateCategory() {
  return !!getSelectedCategoryValue();
}

/**
 * Quick validation for priority selection
 * @function quickValidatePriority
 * @returns {boolean} True if priority is selected
 */
function quickValidatePriority() {
  return !!selectedPriority;
}

/**
 * Quick validation for assignee selection
 * @function quickValidateAssignee
 * @returns {boolean} True if at least one assignee is selected
 */
function quickValidateAssignee() {
  if (typeof getSelectedContactIds === "function") {
    const selectedContactIds = getSelectedContactIds();
    return selectedContactIds && selectedContactIds.length > 0;
  }

  const assigneeSelect = document.getElementById("taskAssignee");
  return assigneeSelect && !!assigneeSelect.value;
}

/**
 * Validates form and returns detailed result object
 * Provides comprehensive validation with detailed error information
 * @function validateTaskFormDetailed
 * @returns {Object} Validation result with isValid flag and error details
 */
function validateTaskFormDetailed() {
  const result = createValidationResult();
  const inputs = getFormInputs();
  const validationRules = getValidationRules(inputs);

  validationRules.forEach((rule) => {
    validateFieldDetailed(result, rule.validator, rule.field, rule.message);
  });

  return result;
}

/**
 * Gets validation rules configuration
 * @function getValidationRules
 * @param {Object} inputs - Form input elements
 * @returns {Array} Array of validation rule objects
 */
function getValidationRules(inputs) {
  return [
    {
      validator: () => validateTitle(inputs.titleInput),
      field: "title",
      message: "Title is required",
    },
    {
      validator: () => validateDueDate(inputs.dueDateInput),
      field: "dueDate",
      message: "Valid due date is required",
    },
    {
      validator: () => validateCategory(),
      field: "category",
      message: "Category is required",
    },
    {
      validator: () => validateAssignee(),
      field: "assignee",
      message: "At least one assignee is required",
    },
    {
      validator: () => validatePriority(),
      field: "priority",
      message: "Priority is required",
    },
  ];
}

/**
 * Creates initial validation result object
 * @function createValidationResult
 * @returns {Object} Initial validation result with isValid true and empty errors array
 */
function createValidationResult() {
  return {
    isValid: true,
    errors: [],
  };
}

/**
 * Validates a single field and adds error to result if validation fails
 * @function validateFieldDetailed
 * @param {Object} result - The validation result object to update
 * @param {Function} validator - The validation function to execute
 * @param {string} fieldName - The name of the field being validated
 * @param {string} errorMessage - The error message to add if validation fails
 * @returns {void}
 */
function validateFieldDetailed(result, validator, fieldName, errorMessage) {
  if (!validator()) {
    result.isValid = false;
    result.errors.push({ field: fieldName, message: errorMessage });
  }
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
