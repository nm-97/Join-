/**
 * @fileoverview Task Data Management for Add Task functionality
 * Handles form data collection, category mapping, and data structure creation
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Collects and returns the current form data as structured object for Firebase submission
 * Retrieves form field values, selected contacts, category, and status for task creation
 * Provides comprehensive form data collection with proper Firebase formatting
 * @function getFormData
 * @returns {Object} Complete task data object with all form fields properly structured for database
 */
function getFormData() {
  const selectedContacts = getSelectedContactsData();
  const categoryId = getSelectedCategoryData();
  const formData = createTaskDataStructure(selectedContacts, categoryId);
  return formData;
}

/**
 * Retrieves selected contact IDs from contact selection functionality
 * @function getSelectedContactsData
 * @returns {Array} Array of selected contact IDs for task assignment
 */
function getSelectedContactsData() {
  return typeof getSelectedContactIds === "function"
    ? getSelectedContactIds()
    : [];
}

/**
 * Retrieves selected category ID from category selection functionality
 * @function getSelectedCategoryData
 * @returns {string} Selected category ID or empty string if no category selected
 */
function getSelectedCategoryData() {
  const categoryInput = getCategoryInputElement();
  const inputCategoryId = getCategoryFromInputValue(categoryInput);
  if (inputCategoryId) {
    return inputCategoryId;
  }
  const externalCategoryId = getCategoryFromExternalFunction(categoryInput);
  if (externalCategoryId) {
    return externalCategoryId;
  }
  return selectedCategory || "";
}

/**
 * Gets the category dropdown input element from the DOM
 * @function getCategoryInputElement
 * @returns {HTMLElement|null} The category input element or null if not found
 */
function getCategoryInputElement() {
  return document.getElementById("categoryDropdownInput");
}

/**
 * Extracts category ID from input field value with name-to-ID mapping
 * @function getCategoryFromInputValue
 * @param {HTMLElement|null} categoryInput - The category input element
 * @returns {string} Category ID or empty string if no valid value found
 */
function getCategoryFromInputValue(categoryInput) {
  if (!categoryInput || !categoryInput.value) {
    return "";
  }
  const inputValue = categoryInput.value;
  return mapCategoryNameToId(inputValue);
}

/**
 * Maps category display names to their corresponding IDs
 * @function mapCategoryNameToId
 * @param {string} inputValue - The category name or ID from input field
 * @returns {string} Mapped category ID or original value if already an ID
 */
function mapCategoryNameToId(inputValue) {
  const categoryMapping = {
    "User Story": "userStory",
    "Technical Task": "technicalTask",
  };
  if (categoryMapping[inputValue]) {
    return categoryMapping[inputValue];
  }
  if (inputValue === "userStory" || inputValue === "technicalTask") {
    return inputValue;
  }
  return inputValue;
}

/**
 * Attempts to get category ID from external category selection function
 * @function getCategoryFromExternalFunction
 * @param {HTMLElement|null} categoryInput - The category input element for validation
 * @returns {string} Category ID from external function or empty string if not available
 */
function getCategoryFromExternalFunction(categoryInput) {
  if (typeof getSelectedCategoryId !== "function") {
    return "";
  }
  const categoryId = getSelectedCategoryId();
  if (isValidExternalCategoryId(categoryId, categoryInput)) {
    return categoryId;
  }
  return "";
}

/**
 * Validates if the external category ID is reliable and should be used
 * @function isValidExternalCategoryId
 * @param {string} categoryId - The category ID from external function
 * @param {HTMLElement|null} categoryInput - The category input element for cross-validation
 * @returns {boolean} True if the external category ID is valid and reliable
 */
function isValidExternalCategoryId(categoryId, categoryInput) {
  if (!categoryId) {
    return false;
  }
  if (
    categoryId === "technicalTask" &&
    hasNonDefaultInputValue(categoryInput)
  ) {
    return false;
  }
  return true;
}

/**
 * Checks if the input field has a non-default value that differs from "Technical Task"
 * @function hasNonDefaultInputValue
 * @param {HTMLElement|null} categoryInput - The category input element
 * @returns {boolean} True if input has a different value than the default
 */
function hasNonDefaultInputValue(categoryInput) {
  return (
    categoryInput &&
    categoryInput.value &&
    categoryInput.value !== "Technical Task"
  );
}

/**
 * Creates structured task data object with all form fields for Firebase submission
 * @function createTaskDataStructure
 * @param {Array} selectedContacts - Array of selected contact IDs
 * @param {string} categoryId - Selected category ID
 * @returns {Object} Complete task data object with all required fields
 */
function createTaskDataStructure(selectedContacts, categoryId) {
  return {
    title: document.getElementById("taskTitle")?.value || "",
    description: document.getElementById("taskDescription")?.value || "",
    dueDate: document.getElementById("taskDueDate")?.value || "",
    taskPriority: selectedPriority,
    assignedTo: selectedContacts,
    Category: mapCategoryToFirebase(categoryId),
    Status: mapStatusToFirebase(selectedStatus),
    subtasks: currentSubtasks,
  };
}

/**
 * Maps UI status value to Firebase-compatible status string for database storage
 * Provides standardized status mapping between UI representation and Firebase storage format
 * Returns default "toDo" status for unmapped values to ensure data integrity
 * @function mapStatusToFirebase
 * @param {string} status - UI status value from task creation interface
 * @returns {string} Firebase-compatible status string, defaults to "toDo" if status not recognized
 */
function mapStatusToFirebase(status) {
  const statusMap = {
    toDo: "toDo",
    inProgress: "inProgress",
    awaitingFeedback: "awaitingFeedback",
    done: "done",
  };
  return statusMap[status] || "toDo";
}
