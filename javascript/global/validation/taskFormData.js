/**
 * @fileoverview Task form data collection and Firebase formatting
 * Handles form data gathering, format conversion, and object creation for database storage
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

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
 * Creates comprehensive task data object from all form inputs for database storage
 * Assembles title, description, assignees, due date, category, priority, and subtasks into structured object
 * Handles category name resolution and ensures all required fields are properly formatted
 * @function createTaskDataObject
 * @param {string} formattedDueDate - Due date in YYYY-MM-DD format ready for Firebase storage
 * @returns {Object} Complete task data object with all form fields properly structured for database
 */
function createTaskDataObject(formattedDueDate) {
  const categoryValue = getSelectedCategoryValue();
  const assignedToValue = getAssignedToValue();

  return {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value || "",
    dueDate: formattedDueDate,
    taskPriority: selectedPriority,
    assignedTo: assignedToValue,
    Category: mapCategoryToFirebase(categoryValue),
    Status: getSelectedStatus() || "toDo",
  };
}

/**
 * Gets the selected category value using appropriate method (custom dropdown or global variable)
 * Integrates with customdropdown.js system for reliable category value retrieval
 * Falls back to global selectedCategory variable if custom dropdown function unavailable
 * @function getSelectedCategoryValue
 * @returns {string} The currently selected category value or empty string if none selected
 */
function getSelectedCategoryValue() {
  if (typeof getSelectedCategoryName === "function") {
    return getSelectedCategoryName();
  }
  return selectedCategory || "";
}

/**
 * Gets the assigned contacts value using appropriate method (custom dropdown or standard select)
 * Checks for custom dropdown system first, falls back to standard select element
 * Handles both single and multiple contact assignment scenarios
 * @function getAssignedToValue
 * @returns {string|Array} The assigned contact(s) value, format depends on system used
 */
function getAssignedToValue() {
  if (typeof getSelectedContactIds === "function") {
    return getSelectedContactIds();
  }
  const assigneeSelect = document.getElementById("taskAssignee");
  return assigneeSelect ? assigneeSelect.value : "";
}

/**
 * Gets the selected status for the task (used in board column creation)
 * Returns the global selectedStatus or defaults to "toDo"
 * @function getSelectedStatus
 * @returns {string} The task status to assign to the new task
 */
function getSelectedStatus() {
  return window.selectedStatus || "toDo";
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
 * Retrieves and organizes form input elements needed for validation
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
