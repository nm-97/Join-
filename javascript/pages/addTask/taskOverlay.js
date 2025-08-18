/**
 * @fileoverview Task Overlay Management for Add Task functionality
 * Handles overlay display, initialization, and board integration
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Opens the Add Task overlay for creating a new task with proper initialization
 * Shows overlay, loads template content, applies styling, and initializes overlay components
 * Provides overlay-based task creation interface with complete functionality setup
 * @function showAddTaskOverlay
 * @returns {void} No return value, displays and initializes Add Task overlay interface
 */
function showAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.classList.remove("hidden");
    overlay.innerHTML = getAddTaskOverlay();
    overlay.style.display = "flex";
    initializeOverlayAddTask();
  }
}

/**
 * Closes the Add Task overlay and clears its contents with smooth animation
 * Adds closing animation, hides overlay, clears content, and resets classes after delay
 * Provides smooth overlay closure with complete cleanup of overlay state and content
 * @function closeAddTaskOverlay
 * @returns {void} No return value, closes overlay with animation and cleanup after 200ms delay
 */
function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
      overlay.classList.remove("closing");
    }, 200);
  }
}

/**
 * Initializes the Add Task overlay UI components and state with complete functionality setup
 * Sets up priority buttons, form submission, subtasks, contacts, categories, and default states
 * Provides comprehensive overlay initialization for complete task creation functionality
 * @function initializeOverlayAddTask
 * @returns {void} No return value, configures all overlay components and initializes state
 */
function initializeOverlayAddTask() {
  initializeOverlayComponents();
  initializeOverlayState();
  loadOverlayData();
}

/**
 * Initializes core overlay components and event handlers
 * @function initializeOverlayComponents
 * @returns {void} No return value, sets up priority buttons, form submission, and subtask events
 */
function initializeOverlayComponents() {
  setupPriorityButtons();
  setupOverlayFormSubmission();
  if (typeof setupSubtaskEvents === "function") {
    setupSubtaskEvents();
  }
  initializeDateInput();
}

/**
 * Initializes overlay state variables and default selections
 * @function initializeOverlayState
 * @returns {void} No return value, resets subtask state and sets default priority
 */
function initializeOverlayState() {
  currentSubtasks = [];
  window.currentSubtasks = currentSubtasks;
  setDefaultPriority();
}

/**
 * Loads external data for overlay functionality
 * @function loadOverlayData
 * @returns {void} No return value, loads contacts and categories with proper timing
 */
function loadOverlayData() {
  if (typeof loadContacts === "function") {
    loadContacts();
  }
  setTimeout(() => {
    loadCategories();
    setupCategoryChangeListener();
  }, 100);
}

/**
 * Sets up event listener for category dropdown changes
 * @function setupCategoryChangeListener
 * @returns {void} No return value, sets up category selection listener
 */
function setupCategoryChangeListener() {
  const categoryDropdown = document.getElementById("categoryDropdownInput");
  if (categoryDropdown) {
    categoryDropdown.addEventListener("change", function () {
      selectedCategory = this.value;
    });
  }
}

/**
 * Sets up form submission logic specifically for the overlay with create and clear button handlers
 * Attaches click event handlers to overlay create and clear buttons for overlay-specific actions
 * Provides overlay-specific form submission handling separate from main page functionality
 * @function setupOverlayFormSubmission
 * @returns {void} No return value, configures overlay-specific create and clear button event handlers
 */
function setupOverlayFormSubmission() {
  const createButton = document.getElementById("createTaskBtn");
  const clearButton = document.getElementById("clearTaskBtn");
  if (createButton) createButton.onclick = createOverlayTask;
  if (clearButton) clearButton.onclick = clearForm;
}

/**
 * Validates and creates a task from the overlay, then refreshes the board with comprehensive error handling
 * Performs form validation, creates task in Firebase, clears form, closes overlay, and refreshes board
 * Provides complete overlay task creation workflow with board refresh for immediate visual feedback
 * @function createOverlayTask
 * @returns {Promise<void>} Promise that resolves when task creation and board refresh are complete
 */
async function createOverlayTask() {
  if (!validateAddTaskForm()) return;
  const taskData = getFormData();
  try {
    await addTaskToFirebaseByUser(taskData);
    clearForm();
    closeAddTaskOverlay();
    if (typeof refreshBoard === "function") {
      await refreshBoard();
    }
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

/**
 * Opens the Add Task overlay with a pre-selected status for specific board column task creation
 * Sets selected status and opens overlay for creating tasks directly in specific board columns
 * Provides column-specific task creation functionality for board interface integration
 * @function addTaskToColumn
 * @param {string} status - The task status to preselect ('toDo', 'inProgress', 'awaitingFeedback', 'done')
 * @returns {void} No return value, sets status and opens overlay for column-specific task creation
 */
function addTaskToColumn(status) {
  selectedStatus = status;
  showAddTaskOverlay();
}

window.addTaskToColumn = addTaskToColumn;
window.showAddTaskOverlay = showAddTaskOverlay;
