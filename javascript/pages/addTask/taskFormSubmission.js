/**
 * @fileoverview Task Form Submission Management for Add Task functionality
 * Handles form submission, button events, and form clearing operations
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Sets up click event handlers for the create and clear buttons with form submission functionality
 * Attaches preventDefault and task creation/clearing logic to form action buttons
 * Provides complete form submission handling for task creation and form reset operations
 * @function setupFormSubmission
 * @returns {void} No return value, configures create and clear button event handlers
 */
function setupFormSubmission() {
  const buttons = getFormSubmissionButtons();
  if (!validateFormButtons(buttons)) return;
  attachCreateButtonHandler(buttons.createButton);
  attachClearButtonHandler(buttons.clearButton);
}

/**
 * Retrieves the create and clear button elements from the DOM
 * @function getFormSubmissionButtons
 * @returns {Object} Object containing createButton and clearButton elements
 */
function getFormSubmissionButtons() {
  return {
    createButton: document.getElementById("createTaskBtn"),
    clearButton: document.getElementById("clearTaskBtn"),
  };
}

/**
 * Validates that both form submission buttons exist in the DOM
 * @function validateFormButtons
 * @param {Object} buttons - Object containing createButton and clearButton elements
 * @returns {boolean} True if both buttons exist, false otherwise
 */
function validateFormButtons(buttons) {
  return buttons.createButton && buttons.clearButton;
}

/**
 * Attaches click event handler to the create task button
 * @function attachCreateButtonHandler
 * @param {HTMLElement} createButton - The create task button element
 * @returns {void} No return value, configures create button click handler
 */
function attachCreateButtonHandler(createButton) {
  createButton.onclick = (e) => {
    e.preventDefault();
    createTask();
  };
}

/**
 * Attaches click event handler to the clear form button
 * @function attachClearButtonHandler
 * @param {HTMLElement} clearButton - The clear form button element
 * @returns {void} No return value, configures clear button click handler
 */
function attachClearButtonHandler(clearButton) {
  clearButton.onclick = (e) => {
    e.preventDefault();
    executeFormClear();
  };
}

/**
 * Executes the complete form clearing process with all necessary steps
 * @function executeFormClear
 * @returns {void} No return value, performs comprehensive form reset
 */
function executeFormClear() {
  clearFormInputs();
  resetFormSelections();
  resetFormState();
  clearExternalSelections();
  clearSubtasksIfAvailable();
  setDefaultPriority();
}

/**
 * Clears subtasks if the deleteAllSubtasks function is available
 * @function clearSubtasksIfAvailable
 * @returns {void} No return value, clears subtasks if function exists
 */
function clearSubtasksIfAvailable() {
  if (typeof window.deleteAllSubtasks === "function") {
    window.deleteAllSubtasks();
  }
}

/**
 * Clears all basic form input field values
 * @function clearFormInputs
 * @returns {void} No return value, empties title, description, due date, and subtask input fields
 */
function clearFormInputs() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) subtaskInput.value = "";
}

/**
 * Resets priority and category selections to default state
 * @function resetFormSelections
 * @returns {void} No return value, clears priority and category selections
 */
function resetFormSelections() {
  clearPrioritySelection();
  clearCategorySelection();
}

/**
 * Resets form state variables to initial values
 * @function resetFormState
 * @returns {void} No return value, resets priority, category, and subtask state variables
 */
function resetFormState() {
  selectedPriority = "Medium";
  selectedCategory = "";
  currentSubtasks = [];
}

/**
 * Clears external component selections like contacts and renders empty subtasks
 * @function clearExternalSelections
 * @returns {void} No return value, clears contact selections and renders empty subtask list
 */
function clearExternalSelections() {
  if (typeof renderSubtasks === "function") {
    renderSubtasks([]);
  }
  if (typeof clearContactSelections === "function") {
    clearContactSelections();
  }
}

/**
 * Clears the selected category selection back to default empty state
 * Resets category variable and dropdown input placeholder for new category selection
 * Provides category selection reset functionality for form clearing or new task creation
 * @function clearCategorySelection
 * @returns {void} No return value, resets category selection state and dropdown display
 */
function clearCategorySelection() {
  selectedCategory = "";
  const categoryInput = document.getElementById("categoryDropdownInput");
  if (categoryInput) {
    categoryInput.value = "";
    categoryInput.placeholder = "Select task category";
  }
}

/**
 * Clears all input fields and resets state for the Add Task form to initial conditions
 * Resets form fields, priority selection, category selection, and subtask state
 * Provides comprehensive form reset functionality for new task creation or form clearing
 * @function clearForm
 * @returns {void} No return value, resets all form inputs and state variables to initial values
 */
function clearForm() {
  clearFormInputs();
  resetFormSelections();
  resetFormState();
  clearExternalSelections();
  if (typeof window.deleteAllSubtasks === "function") {
    window.deleteAllSubtasks();
  }
  setDefaultPriority();
}
