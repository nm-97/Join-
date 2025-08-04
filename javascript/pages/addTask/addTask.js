/**
 * @fileoverview Add Task page functionality for the JOIN application
 * Handles task creation, form validation, priority selection, and subtask management
 * @author Join Project Team
 * @version 1.0.0
 */

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
  initializeFormComponents();
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
 * Sets up event listeners for priority selection buttons with validation and event attachment
 * Retrieves priority buttons, validates their existence, and attaches click event handlers
 * Provides comprehensive priority selection functionality for task priority management
 * @function setupPriorityButtons
 * @returns {void} No return value, configures priority button event listeners and validation
 */
function setupPriorityButtons() {
  const buttons = getPriorityButtons();
  if (!validateAllButtonsExist(buttons)) return;

  attachPriorityButtonEvents(buttons);
}

/**
 * Validates that all required priority buttons exist in the DOM for proper functionality
 * Checks for urgent, medium, and low priority button elements to ensure complete button set
 * Provides essential validation before attaching event listeners to priority buttons
 * @function validateAllButtonsExist
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {boolean} True if all priority buttons exist in DOM, false if any button is missing
 */
function validateAllButtonsExist(buttons) {
  return buttons.urgent && buttons.medium && buttons.low;
}

/**
 * Attaches click event listeners to priority buttons for priority selection functionality
 * Assigns onclick handlers to urgent, medium, and low priority buttons with selectPriority calls
 * Provides interactive priority selection behavior for task priority assignment
 * @function attachPriorityButtonEvents
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {void} No return value, configures click event handlers for priority selection
 */
function attachPriorityButtonEvents(buttons) {
  buttons.urgent.onclick = () => selectPriority("Urgent", buttons.urgent);
  buttons.medium.onclick = () => selectPriority("Medium", buttons.medium);
  buttons.low.onclick = () => selectPriority("Low", buttons.low);
}

/**
 * Selects a priority level and updates button styling with proper visual feedback
 * Clears previous selections, applies priority-specific CSS class, and updates global priority state
 * Provides complete priority selection functionality with visual state management
 * @function selectPriority
 * @param {string} priority - The priority level to select ('Urgent', 'Medium', 'Low')
 * @param {HTMLElement} button - The button element that was clicked for priority selection
 * @returns {void} No return value, updates priority selection state and button visual styling
 */
function selectPriority(priority, button) {
  clearPrioritySelection();
  const priorityClass = changeColorBasedOnPriority(priority);
  button.classList.add(priorityClass);
  selectedPriority = priority;
}

/**
 * Clears all priority selections and resets button styles to default state
 * Removes priority CSS classes and inline styles from all priority buttons
 * Provides complete priority selection reset for new priority selection or form clearing
 * @function clearPrioritySelection
 * @returns {void} No return value, resets all priority buttons to unselected state
 */
function clearPrioritySelection() {
  const buttons = getPriorityButtons();
  removeAllPriorityClasses(buttons);
  resetButtonStyles(buttons);
}

/**
 * Retrieves all priority button elements from the DOM for priority management operations
 * Returns structured object containing urgent, medium, and low priority button references
 * Provides centralized access to priority buttons for event handling and styling operations
 * @function getPriorityButtons
 * @returns {Object} Object containing urgent, medium, and low button elements from DOM
 */
function getPriorityButtons() {
  return {
    urgent: document.getElementById("urgentBtn"),
    medium: document.getElementById("mediumBtn"),
    low: document.getElementById("lowBtn"),
  };
}

/**
 * Removes all priority-related CSS classes from priority buttons for state reset
 * Iterates through priority buttons and removes selected state classes and general selection classes
 * Provides comprehensive CSS class cleanup for priority button state management
 * @function removeAllPriorityClasses
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {void} No return value, removes priority selection CSS classes from all buttons
 */
function removeAllPriorityClasses(buttons) {
  const classesToRemove = [
    "taskPriorityBtnUrgentSelected",
    "taskPriorityBtnMediumSelected",
    "taskPriorityBtnLowSelected",
    "selected",
  ];

  Object.values(buttons).forEach((btn) => {
    if (btn) {
      btn.classList.remove(...classesToRemove);
    }
  });
}

/**
 * Resets inline styles for priority buttons to remove custom styling and restore defaults
 * Clears backgroundColor and color inline styles from all priority buttons
 * Provides complete style reset for priority buttons to default CSS state
 * @function resetButtonStyles
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {void} No return value, removes inline styles from all priority buttons
 */
function resetButtonStyles(buttons) {
  Object.values(buttons).forEach((btn) => {
    if (btn) {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }
  });
}

/**
 * Determines the appropriate CSS class to apply based on selected priority level
 * Maps priority strings to corresponding CSS class names for button styling
 * Provides priority-to-class mapping for consistent priority button visual states
 * @function changeColorBasedOnPriority
 * @param {string} priority - Selected priority level ('Urgent', 'Medium', 'Low')
 * @returns {string} CSS class name for the priority button, empty string if priority not recognized
 */
function changeColorBasedOnPriority(priority) {
  const classes = {
    Urgent: "taskPriorityBtnUrgentSelected",
    Medium: "taskPriorityBtnMediumSelected",
    Low: "taskPriorityBtnLowSelected",
  };
  return classes[priority] || "";
}

/**
 * Sets the default priority selection to Medium priority on page load
 * Applies medium priority CSS class to medium button for default visual state
 * Provides consistent default priority selection for new task creation
 * @function setDefaultPriority
 * @returns {void} No return value, applies default medium priority styling to medium button
 */
function setDefaultPriority() {
  const mediumBtn = document.getElementById("mediumBtn");
  if (mediumBtn) {
    mediumBtn.classList.add("taskPriorityBtnMediumSelected");
  }
}

/**
 * Sets up click event handlers for the create and clear buttons with form submission functionality
 * Attaches preventDefault and task creation/clearing logic to form action buttons
 * Provides complete form submission handling for task creation and form reset operations
 * @function setupFormSubmission
 * @returns {void} No return value, configures create and clear button event handlers
 */
function setupFormSubmission() {
  const createButton = document.getElementById("createTaskBtn");
  const clearButton = document.getElementById("clearTaskBtn");
  if (!createButton || !clearButton) {
    return;
  }
  createButton.onclick = function (e) {
    e.preventDefault();
    createTask();
  };
  clearButton.onclick = function (e) {
    e.preventDefault();
    clearForm();
  };
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
 * Validates form data and creates a new task in Firebase with comprehensive error handling
 * Performs form validation, collects task data, submits to Firebase, and resets form state
 * Provides complete task creation workflow with validation, submission, and user feedback
 * @function createTask
 * @returns {void} No return value, handles task creation process with validation and Firebase submission
 */
function createTask() {
  const isValid = validateAddTaskForm();
  if (!isValid) {
    return;
  }
  try {
    const taskData = getFormData();
    const result = addTaskToFirebaseByUser(taskData);
    window.currentSubtasks = [];
    const subtaskInput = document.getElementById("taskSubtask");
    if (subtaskInput) subtaskInput.value = "";
    if (typeof renderSubtasks === "function") {
      renderSubtasks([]);
    }
    clearForm();
    showTaskCreatedNotification();
  } catch (error) {}
}

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
  // Prüfe zuerst das Category Dropdown Input Feld (most reliable)
  const categoryInput = document.getElementById("categoryDropdownInput");

  if (categoryInput && categoryInput.value) {
    const inputValue = categoryInput.value;

    // Versuche die Kategorie-ID basierend auf dem Namen zu finden
    if (inputValue === "User Story") {
      return "userStory";
    } else if (inputValue === "Technical Task") {
      return "technicalTask";
    }

    // Falls der Input bereits eine ID ist
    if (inputValue === "userStory" || inputValue === "technicalTask") {
      return inputValue;
    }

    return inputValue;
  }

  // Fallback: Versuche die Funktion zu verwenden, falls verfügbar
  if (typeof getSelectedCategoryId === "function") {
    const categoryId = getSelectedCategoryId();

    // Überprüfe, ob die Funktion einen anderen Wert als den Default zurückgibt
    if (categoryId && categoryId !== "technicalTask") {
      return categoryId;
    }

    // Prüfe, ob das Input-Feld eine andere Auswahl zeigt
    if (
      categoryInput &&
      categoryInput.value &&
      categoryInput.value !== "Technical Task"
    ) {
      const inputValue = categoryInput.value;
      if (inputValue === "User Story") {
        return "userStory";
      }
    }

    if (categoryId) return categoryId;
  }

  // Fallback: Verwende die globale selectedCategory Variable
  return selectedCategory || "";
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

// Mache die Funktionen global verfügbar für board.js
window.addTaskToColumn = addTaskToColumn;
window.showAddTaskOverlay = showAddTaskOverlay;

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeAddTask();
    }, 200);
  }
});
