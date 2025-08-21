/**
 * @fileoverview Task form reset and cleanup utilities
 * Handles form clearing, priority reset, category reset, and validation cleanup
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

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
  const titleInput = document.getElementById("taskTitle");
  const descriptionInput = document.getElementById("taskDescription");
  const dueDateInput = document.getElementById("taskDueDate");
  const subtaskInput = document.getElementById("taskSubtask");

  if (titleInput) titleInput.value = "";
  if (descriptionInput) descriptionInput.value = "";
  if (dueDateInput) dueDateInput.value = "";
  if (subtaskInput) subtaskInput.value = "";
  if (typeof clearContactSelections === "function") {
    clearContactSelections();
  }
  if (typeof clearSubtasks === "function") {
    clearSubtasks();
  }
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
  if (typeof selectedPriority !== "undefined") {
    selectedPriority = "Medium";
  }
  resetPriorityButtonStyles();
}

/**
 * Resets the visual styling of priority buttons to default state
 * Removes active classes and resets button appearances
 * @function resetPriorityButtonStyles
 * @returns {void} No return value, resets priority button visual states
 */
function resetPriorityButtonStyles() {
  const priorityButtons = document.querySelectorAll(".taskPriorityBtn");
  priorityButtons.forEach((button) => {
    button.classList.remove("selected", "active");
  });
  const mediumBtn = document.getElementById("mediumBtn");
  if (mediumBtn) {
    mediumBtn.classList.add("selected");
  }
}

/**
 * Resets the selected category to its default empty state with placeholder restoration
 * Clears selected category variable and resets dropdown input to initial placeholder state
 * Provides clean category selection state for new task creation or form reset
 * @function resetCategoryToDefault
 * @returns {void} No return value, resets category selection and dropdown display to default state
 */
function resetCategoryToDefault() {
  if (typeof selectedCategory !== "undefined") {
    selectedCategory = "";
  }
  const categoryInput = document.getElementById("categoryDropdownInput");
  if (categoryInput) {
    categoryInput.value = "";
    categoryInput.placeholder = "Select task category";
  }
  if (typeof clearCategorySelection === "function") {
    clearCategorySelection();
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
 * Clears the Add Task form completely by delegating to comprehensive form reset function
 * Provides simplified interface to clearFormWithValidation for complete form cleanup
 * Ensures all form inputs, validation states, and selections are reset to initial state
 * @function clearForm
 * @returns {void} No return value, performs complete form reset including inputs and validation
 */
function clearForm() {
  clearFormWithValidation();
}

/**
 * Resets form to initial state for creating a new task
 * Similar to clearForm but may preserve certain settings like status
 * @function resetFormForNewTask
 * @returns {void} No return value, resets form for new task creation
 */
function resetFormForNewTask() {
  clearAllFormInputs();
  resetPriorityToDefault();
  resetCategoryToDefault();
  clearAllTaskErrors();
  if (!window.selectedStatus) {
    window.selectedStatus = "toDo";
  }
}
