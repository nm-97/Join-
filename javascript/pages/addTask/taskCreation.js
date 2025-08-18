/**
 * @fileoverview Task Creation Logic for Add Task functionality
 * Handles task creation, data collection, validation, and Firebase submission
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Determines if the current device is mobile/tablet based on screen width
 * @function isResponsiveMode
 * @returns {boolean} True if screen width is 1024px or less, false otherwise
 */
function isResponsiveMode() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 1024px)").matches
  );
}

/**
 * Gets appropriate icon names based on responsive mode
 * @function getSubtaskIconNames
 * @returns {Object} Object containing editIcon and deleteIcon names
 */
function getSubtaskIconNames() {
  const isResponsive = isResponsiveMode();
  return {
    editIcon: isResponsive ? "edit hover.svg" : "edit.svg",
    deleteIcon: isResponsive ? "delete hover.svg" : "delete.svg",
  };
}

/**
 * Prepares subtask data for template rendering with icon configuration
 * @function prepareSubtaskRenderData
 * @param {Array} subtasks - Array of subtask objects
 * @returns {Object} Enhanced subtask data with icon configuration
 */
function prepareSubtaskRenderData(subtasks = []) {
  const iconNames = getSubtaskIconNames();
  return {
    subtasks,
    ...iconNames,
  };
}

/**
 * Validates form data and creates a new task in Firebase with comprehensive error handling
 * Performs form validation, collects task data, submits to Firebase, and resets form state
 * Provides complete task creation workflow with validation, submission, and user feedback
 * @function createTask
 * @returns {void} No return value, handles task creation process with validation and Firebase submission
 */
function createTask() {
  if (!validateAddTaskForm()) {
    return;
  }
  try {
    executeTaskCreation();
    handleTaskCreationSuccess();
  } catch (error) {
    handleTaskCreationError(error);
  }
}

/**
 * Executes the core task creation process by collecting form data and submitting to Firebase
 * @function executeTaskCreation
 * @returns {void} No return value, submits task data to Firebase
 */
function executeTaskCreation() {
  const taskData = getFormData();
  const result = addTaskToFirebaseByUser(taskData);
}

/**
 * Handles successful task creation by cleaning up form state and providing user feedback
 * @function handleTaskCreationSuccess
 * @returns {void} No return value, cleans up form and shows success feedback
 */
function handleTaskCreationSuccess() {
  resetSubtaskState();
  clearForm();
  showTaskCreatedNotification();
  redirectToBoardAfterDelay();
}

/**
 * Resets the subtask state and UI after successful task creation
 * @function resetSubtaskState
 * @returns {void} No return value, clears subtask data and updates UI
 */
function resetSubtaskState() {
  window.currentSubtasks = [];
  clearSubtaskInput();
  renderEmptySubtasks();
}

/**
 * Clears the subtask input field value
 * @function clearSubtaskInput
 * @returns {void} No return value, empties subtask input field
 */
function clearSubtaskInput() {
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) {
    subtaskInput.value = "";
  }
}

/**
 * Renders empty subtasks list if the render function is available
 * @function renderEmptySubtasks
 * @returns {void} No return value, renders empty subtask list
 */
function renderEmptySubtasks() {
  if (typeof renderSubtasks === "function") {
    renderSubtasks([]);
  }
}

/**
 * Redirects to board page after a 1-second delay for user feedback
 * @function redirectToBoardAfterDelay
 * @returns {void} No return value, redirects to board page after delay
 */
function redirectToBoardAfterDelay() {
  setTimeout(() => {
    window.location.href = "../html/board.html";
  }, 1000);
}

/**
 * Handles task creation errors with appropriate error logging
 * @function handleTaskCreationError
 * @param {Error} error - The error object from task creation failure
 * @returns {void} No return value, logs error for debugging
 */
function handleTaskCreationError(error) {
  console.error("Error creating task:", error);
}

/**
 * Shows a temporary success notification overlay for successful task creation
 * Creates and displays success message overlay with automatic removal after 2 seconds
 * Provides positive user feedback confirming successful task creation completion
 * @function showTaskCreatedNotification
 * @returns {void} No return value, displays temporary success notification with auto-removal
 */
function showTaskCreatedNotification() {
  const overlay = document.createElement("div");
  overlay.id = "successMessageOverlay";
  overlay.innerHTML = getSuccessAddTaskMessageTemplate();
  overlay.style.display = "flex";
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
  }, 2000);
}
