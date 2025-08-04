/**
 * @fileoverview Add Task page functionality for the JOIN application
 * Handles task creation, form validation, priority selection, and subtask management
 * @author Join Project Team
 * @version 1.0.0
 */

let selectedPriority = "Medium";
let selectedCategory = "";
let selectedStatus = "toDo"; // Hinzugefügt für Status-Management
let currentSubtasks = [];

/**
 * Initializes the Add Task page with all necessary components and event listeners
 */
function initializeAddTask() {
  renderAddTaskMainContent();
  initializeDateInput();
  setupPriorityButtons();
  setupFormSubmission();
  currentSubtasks = [];
  window.currentSubtasks = currentSubtasks;
  setupSubtaskEvents();
  loadContacts();
  loadCategories();
  setDefaultPriority();
}

/**
 * Renders the main content for the Add Task page
 */
function renderAddTaskMainContent() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = getaddTaskMainContent();
}

/**
 * Sets up event listeners for priority selection buttons
 */
function setupPriorityButtons() {
  const buttons = getPriorityButtons();
  if (!validateAllButtonsExist(buttons)) return;

  attachPriorityButtonEvents(buttons);
}

/**
 * Validates that all priority buttons exist in the DOM
 * @param {Object} buttons - Object containing priority button elements
 * @returns {boolean} True if all buttons exist, false otherwise
 */
function validateAllButtonsExist(buttons) {
  return buttons.urgent && buttons.medium && buttons.low;
}

/**
 * Attaches click event listeners to priority buttons
 * @param {Object} buttons - Object containing priority button elements
 */
function attachPriorityButtonEvents(buttons) {
  buttons.urgent.onclick = () => selectPriority("Urgent", buttons.urgent);
  buttons.medium.onclick = () => selectPriority("Medium", buttons.medium);
  buttons.low.onclick = () => selectPriority("Low", buttons.low);
}

/**
 * Selects a priority level and updates button styling
 * @param {string} priority - The priority level to select
 * @param {HTMLElement} button - The button element that was clicked
 */
function selectPriority(priority, button) {
  clearPrioritySelection();
  const priorityClass = changeColorBasedOnPriority(priority);
  button.classList.add(priorityClass);
  selectedPriority = priority;
}

/**
 * Clears all priority selections and resets button styles
 */
function clearPrioritySelection() {
  const buttons = getPriorityButtons();
  removeAllPriorityClasses(buttons);
  resetButtonStyles(buttons);
}

/**
 * Retrieves priority button elements from the DOM
 * @returns {Object} Object containing urgent, medium, and low buttons
 */
function getPriorityButtons() {
  return {
    urgent: document.getElementById("urgentBtn"),
    medium: document.getElementById("mediumBtn"),
    low: document.getElementById("lowBtn"),
  };
}

/**
 * Removes all selected priority CSS classes from priority buttons
 * @param {Object} buttons - Priority button elements
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
 * Resets inline styles for priority buttons
 * @param {Object} buttons - Priority button elements
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
 * Determines the CSS class to apply based on selected priority
 * @param {string} priority - Selected priority ('Urgent', 'Medium', 'Low')
 * @returns {string} CSS class name for the priority button
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
 * Sets the default priority selection to Medium on page load
 */
function setDefaultPriority() {
  const mediumBtn = document.getElementById("mediumBtn");
  if (mediumBtn) {
    mediumBtn.classList.add("taskPriorityBtnMediumSelected");
  }
}

/**
 * Sets up click handlers for the create and clear buttons
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
 * Clears the selected category back to the default state
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
 * Populates the assignee select element with contacts from Firebase
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
 * Validates form data and creates a new task in Firebase
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
 * Collects and returns the current form data as an object
 * @returns {Object} Task data object
 */
function getFormData() {
  const selectedContacts =
    typeof getSelectedContactIds === "function" ? getSelectedContactIds() : [];

  // Use getSelectedCategoryId() instead of getSelectedCategoryName()
  const categoryId =
    typeof getSelectedCategoryId === "function"
      ? getSelectedCategoryId()
      : selectedCategory || "";

  const formData = {
    title: document.getElementById("taskTitle")?.value || "",
    description: document.getElementById("taskDescription")?.value || "",
    dueDate: document.getElementById("taskDueDate")?.value || "",
    taskPriority: selectedPriority,
    assignedTo: selectedContacts,
    Category: mapCategoryToFirebase(categoryId),
    Status: mapStatusToFirebase(selectedStatus),
    subtasks: currentSubtasks,
  };

  return formData;
}

/**
 * Maps UI status value to Firebase status string
 * @param {string} status - UI status value
 * @returns {string} Firebase status string
 */
function mapStatusToFirebase(status) {
  const statusMap = {
    toDo: "toDo",
    inProgress: "inProgress",
    awaitFeedback: "awaitFeedback",
    done: "done",
  };
  return statusMap[status] || "toDo";
}

/**
 * Shows a temporary success notification for task creation
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
 * Clears all input fields and resets state for the Add Task form
 */
function clearForm() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) subtaskInput.value = "";
  clearPrioritySelection();
  clearCategorySelection();
  selectedPriority = "Medium";
  selectedCategory = "";
  currentSubtasks = [];
  if (typeof renderSubtasks === "function") {
    renderSubtasks([]);
  }
  if (typeof clearContactSelections === "function") {
    clearContactSelections();
  }
}

/**
 * Opens the Add Task overlay for creating a new task
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
 * Closes the Add Task overlay and clears its contents
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
 * Initializes the Add Task overlay UI components and state
 */
function initializeOverlayAddTask() {
  setupPriorityButtons();
  setupOverlayFormSubmission();
  if (typeof setupSubtaskEvents === "function") {
    setupSubtaskEvents();
  }
  currentSubtasks = [];
  window.currentSubtasks = currentSubtasks;
  if (typeof loadContacts === "function") {
    loadContacts();
  }
  setTimeout(() => {
    loadCategories();
  }, 100);
  initializeDateInput();
  setDefaultPriority();
}

/**
 * Sets up form submission logic specifically for the overlay
 */
function setupOverlayFormSubmission() {
  const createButton = document.getElementById("createTaskBtn");
  const clearButton = document.getElementById("clearTaskBtn");
  if (createButton) createButton.onclick = createOverlayTask;
  if (clearButton) clearButton.onclick = clearForm;
}

/**
 * Validates and creates a task from the overlay, then refreshes the board
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
  } catch (error) {}
}

/**
 * Opens the Add Task overlay with a pre-selected status
 * @param {string} status - The task status to preselect
 */
function addTaskToColumn(status) {
  selectedStatus = status;
  showAddTaskOverlay();
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeAddTask();
    }, 200);
  }
});
