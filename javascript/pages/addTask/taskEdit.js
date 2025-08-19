/**
 * @fileoverview Task editing functionality for the Add Task feature
 * Handles task editing logic and template assembly
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates HTML template for the Edit Task overlay with complete logic and data processing
 * Processes task data, handles assigned contacts logic, and assembles all template components
 * @param {Object} task - Task object containing task data for editing
 * @returns {string} HTML string for the Edit Task overlay
 */
function getEditTaskOverlay(task) {
  const content = assembleEditTaskContent(task);
  return getOverlayWrapper(content);
}

/**
 * Assembles the complete content for the edit task modal
 * @param {Object} task - Task object containing task data for editing
 * @returns {string} HTML string for the modal content
 */
function assembleEditTaskContent(task) {
  return [
    getEditTaskModalHeader(),
    getEditFormGroup("Title", "editTaskTitle", "Title", task.title),
    getEditFormGroup(
      "Description",
      "editTaskDescription",
      "Description",
      task.description,
      "textarea"
    ),
    getEditDateFormGroup(task.dueDate),
    getEditPrioritySection(),
    getEditAssignedContactsSection(),
    getEditSubtaskSection(),
    getEditTaskButtons(),
  ].join("");
}

/**
 * Processes assigned contacts and generates the display HTML
 * Handles empty contacts list and generates avatar information for each contact
 * @param {Array} assignedContacts - Array of assigned contact objects
 * @returns {string} HTML string for assigned contacts display
 */
function processAssignedContacts(assignedContacts = []) {
  if (assignedContacts.length === 0) {
    return '<div class="assignedInfo">Not assigned</div>';
  }

  return assignedContacts
    .map((contact) => generateContactInfo(contact))
    .join("");
}

/**
 * Generates HTML for a single contact's information
 * Creates avatar with initials and color based on contact name
 * @param {Object} contact - Contact object with name property
 * @returns {string} HTML string for single contact info
 */
function generateContactInfo(contact) {
  const initials = getInitials(contact.name);
  const color = getAvatarColor(contact.name);

  return `
    <div class="assignedInfo">
      <div class="userAvatar" style="background-color: ${color};">${initials}</div>
      <span>${contact.name}</span>
    </div>
  `;
}

/**
 * Validates task object and ensures all required properties exist
 * @param {Object} task - Task object to validate
 * @returns {Object} Validated task object with default values
 */
function validateTaskData(task) {
  return {
    title: task.title || "",
    description: task.description || "",
    dueDate: task.dueDate || "",
    assignedContacts: task.assignedContacts || [],
    priority: task.priority || "medium",
    subtasks: task.subtasks || [],
  };
}

/**
 * Initializes the edit task form with provided task data
 * Sets up form fields and populates them with current task values
 * @param {Object} task - Task object containing current data
 * @returns {void} No return value, initializes form state
 */
function initializeEditTaskForm(task) {
  const validatedTask = validateTaskData(task);
  populateFormFields(validatedTask);
  setupEditTaskEventListeners();
}

/**
 * Populates form fields with task data
 * @param {Object} task - Validated task object
 * @returns {void} No return value, updates form fields
 */
function populateFormFields(task) {
  const titleField = document.getElementById("editTaskTitle");
  const descriptionField = document.getElementById("editTaskDescription");
  const dueDateField = document.getElementById("editTaskDueDate");

  if (titleField) titleField.value = task.title;
  if (descriptionField) descriptionField.value = task.description;
  if (dueDateField) dueDateField.value = task.dueDate;
}

/**
 * Sets up event listeners for the edit task form
 * @returns {void} No return value, configures event handlers
 */
function setupEditTaskEventListeners() {
  const saveButton = document.getElementById("editSaveBtn");
  if (saveButton) {
    saveButton.addEventListener("click", handleEditTaskSave);
  }
}

/**
 * Handles the save action for edited task
 * @param {Event} event - Click event from save button
 * @returns {void} No return value, processes task save
 */
function handleEditTaskSave(event) {
  event.preventDefault();
  const updatedTaskData = collectEditedTaskData();
  saveEditedTask(updatedTaskData);
}

/**
 * Collects edited task data from form fields
 * @returns {Object} Updated task data object
 */
function collectEditedTaskData() {
  return {
    title: document.getElementById("editTaskTitle")?.value || "",
    description: document.getElementById("editTaskDescription")?.value || "",
    dueDate: document.getElementById("editTaskDueDate")?.value || "",
  };
}

/**
 * Saves the edited task data
 * @param {Object} taskData - Updated task data
 * @returns {void} No return value, saves task changes
 */
function saveEditedTask(taskData) {
  console.log("Saving edited task:", taskData);
}
