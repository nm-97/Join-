/**
 * @fileoverview Add Task page main controller for the JOIN application
 * Coordinates task creation functionality and page initialization
 * @author Join Project Team
 * @version 1.0.0
 */

// Global state variables
let selectedPriority = "Medium";
let selectedCategory = "";
let selectedStatus = "toDo";
let currentSubtasks = [];

/**
 * Initializes the Add Task page with all necessary components, event listeners, and default state
 * Sets up form rendering, date input, priority buttons, form submission, subtasks, and contact loading
 * Provides comprehensive page initialization for complete task creation functionality
 * @function initializeAddTask
 * @returns {void} No return value, configures Add Task page with all required components and state
 */
function initializeAddTask() {
  renderAddTaskMainContent();
  initializeDateInput();
  setupPriorityButtons();
  setupSubtaskEvents();
  setupFormSubmission();
  initializePageState();
  loadPageData();
}

/**
 * Initializes core form components for task creation functionality
 * @function initializeFormComponents
 * @returns {void} No return value, sets up form input components and event handlers
 */
function initializeFormComponents() {
  initializeDateInput();
  setupPriorityButtons();
  setupFormSubmission();
  setupSubtaskEvents();
}

/**
 * Initializes page state variables and global subtask management
 * @function initializePageState
 * @returns {void} No return value, resets task creation state variables
 */
function initializePageState() {
  currentSubtasks = [];
  window.currentSubtasks = currentSubtasks;
  setDefaultPriority();
}

/**
 * Loads external data required for task creation form
 * @function loadPageData
 * @returns {void} No return value, loads contacts and categories from external sources
 */
function loadPageData() {
  loadContacts();
  loadCategories();
}

/**
 * Renders the main content structure for the Add Task page using template function
 * Retrieves main content container and populates with Add Task HTML template
 * Provides initial page structure setup for task creation interface
 * @function renderAddTaskMainContent
 * @returns {void} No return value, updates DOM with Add Task page content template
 */
function renderAddTaskMainContent() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = getaddTaskMainContent();
}

/**
 * Populates the assignee select element with contacts from Firebase for task assignment
 * Fetches contacts from Firebase, creates option elements, and populates assignee dropdown
 * Provides contact selection functionality for task assignment with error handling
 * @function loadContactsForSelect
 * @returns {void} No return value, populates assignee dropdown with contact options from Firebase
 */
function loadContactsForSelect() {
  try {
    const contacts = fetchContactsByIdAndUser();
    const assigneeSelect = document.getElementById("taskAssignee");
    if (!assigneeSelect) return;
    assigneeSelect.innerHTML =
      '<option value="" disabled selected hidden>Select contacts to assign</option>';
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const option = document.createElement("option");
      option.value = contact.id;
      option.textContent = contact.name;
      assigneeSelect.appendChild(option);
    }
  } catch (error) {}
}

/**
 * Deletes all currently created subtasks from the global state and re-renders the subtask list
 * Clears the window.currentSubtasks array and updates the UI accordingly
 * Used when resetting the Add Task form to its initial state
 * @function deleteAllSubtasks
 * @returns {void} No return value, clears subtasks and updates the subtask UI
 */
window.deleteAllSubtasks = function () {
  if (Array.isArray(window.currentSubtasks)) {
    window.currentSubtasks = [];
    renderSubtasks(window.currentSubtasks);
  }
};

// Page initialization
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeAddTask();
    }, 200);
  }
});
