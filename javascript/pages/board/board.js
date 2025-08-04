/**
 * @fileoverview Board page functionality for the JOIN application
 * Handles task board display, task management, and column-based task organization
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Initializes the board when DOM content is loaded and on correct page with path validation
 * Checks if current page is board.html before initializing board functionality
 * Provides conditional board initialization for proper page-specific functionality loading
 * @function DOMContentLoaded event handler
 * @returns {void} No return value, conditionally initializes board based on current page path
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("board.html")) {
    initializeBoard();
  }
});

/**
 * Initializes the board by fetching tasks, enriching with contact data, and rendering board template
 * Fetches user tasks, loads assigned contact information for each task, and renders complete board
 * Provides comprehensive board initialization with task data loading and contact enrichment
 * @function initializeBoard
 * @returns {Promise<void>} Promise that resolves when board initialization and rendering are complete
 */
async function initializeBoard() {
  const tasks = await fetchAndEnrichTasks();
  renderBoard(tasks);
}

/**
 * Fetches tasks and enriches them with assigned contact information
 * @function fetchAndEnrichTasks
 * @returns {Promise<Array>} Array of tasks with assigned contact data
 */
async function fetchAndEnrichTasks() {
  const tasks = await fetchTaskByUser();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].assignedTo) {
      tasks[i].assignedContacts = await getAllContactsFromAssigned(
        tasks[i].assignedTo
      );
    }
  }
  return tasks;
}

/**
 * Renders the board with task data using template system
 * @function renderBoard
 * @param {Array} tasks - Array of task objects to render on board
 * @returns {void} No return value, updates board container with rendered tasks
 */
function renderBoard(tasks) {
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
}

/**
 * Shows detailed view of a specific task in an overlay with complete task and contact information
 * Fetches task data, loads assigned contact details, renders task detail overlay, and displays it
 * Provides comprehensive task detail display with contact information and overlay management
 * @function showTaskDetail
 * @param {string} taskId - The unique identifier of the task to display in detail view
 * @returns {Promise<void>} Promise that resolves when task detail overlay is loaded and displayed
 */
async function showTaskDetail(taskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  task.assignedContacts = await getAllContactsFromAssigned(task.assignedTo);
  const overlay = document.getElementById("taskOverlay");
  overlay.innerHTML = await getTaskDetailOverlay(task);
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

/**
 * Deletes a task from Firebase database and refreshes the board display with overlay closure
 * Removes task from Firebase, closes detail overlay, and refreshes board for immediate visual update
 * Provides complete task deletion workflow with database removal and UI refresh
 * @function deleteTask
 * @param {string} taskId - The unique identifier of the task to delete from Firebase database
 * @returns {Promise<void>} Promise that resolves when task deletion and board refresh are complete
 */
async function deleteTask(taskId) {
  await deleteTaskFromFirebaseByUser(taskId);
  closeTaskOverlay();
  await refreshBoard();
}

/**
 * Refreshes the board by re-fetching tasks, enriching with contact data, and re-rendering display
 * Performs complete board data refresh including task fetching, contact loading, and template rendering
 * Provides comprehensive board refresh functionality for data synchronization and visual updates
 * @function refreshBoard
 * @returns {Promise<void>} Promise that resolves when board refresh and re-rendering are complete
 */
async function refreshBoard() {
  const tasks = await fetchAndEnrichTasks();
  renderBoard(tasks);
}

/**
 * Opens the Add Task overlay for creating new tasks in a specific column status
 * Shows Add Task overlay interface for task creation with optional status preselection
 * Provides task creation interface integration with board column-specific task addition
 * @function addTaskToColumn
 * @param {string} status - The status/column identifier to add the task to ('toDo', 'inProgress', etc.)
 * @returns {void} No return value, opens Add Task overlay for new task creation
 */
function addTaskToColumn(status) {
  // Prüfe, ob die addTask.js addTaskToColumn Funktion verfügbar ist
  if (typeof window.addTaskToColumn === "function") {
    window.addTaskToColumn(status);
    return;
  }
  
  // Fallback: Setze Status und zeige Overlay
  if (typeof window.selectedStatus !== "undefined") {
    window.selectedStatus = status;
  }
  showAddTaskOverlay();
}

/**
 * Closes the task detail overlay with smooth animation and proper cleanup
 * Adds closing animation class, hides overlay after delay, and removes animation classes
 * Provides smooth overlay closure with visual feedback and complete state cleanup
 * @function closeTaskOverlay
 * @returns {void} No return value, closes task overlay with animation and cleanup after 200ms delay
 */
function closeTaskOverlay() {
  const overlay = document.getElementById("taskOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      overlay.classList.remove("closing");
    }, 200); // TIMING: Anpassbar
  }
}

/**
 * Shows the Add Task overlay for creating new tasks with template loading and initialization
 * Loads Add Task template, displays overlay, removes hidden class, and initializes overlay functionality
 * Provides complete Add Task overlay setup with template injection and component initialization
 * @function showAddTaskOverlay
 * @returns {void} No return value, displays and initializes Add Task overlay interface
 */
function showAddTaskOverlay() {
  // Prüfe, ob die addTask.js showAddTaskOverlay Funktion verfügbar ist
  if (typeof window.showAddTaskOverlay === "function" && window.showAddTaskOverlay !== showAddTaskOverlay) {
    window.showAddTaskOverlay();
    return;
  }
  
  // Fallback für lokale Implementierung
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getAddTaskOverlay();
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
    if (typeof initializeOverlayAddTask === "function") {
      initializeOverlayAddTask();
    }
  }
}

/**
 * Gets the contact name by ID for task assignment display with error handling and fallback
 * Fetches contact data by ID and returns name, providing fallback messages for missing data
 * Provides robust contact name resolution with comprehensive error handling and user-friendly fallbacks
 * @function getContactNameById
 * @param {string} contactId - The unique identifier of the contact to retrieve name for
 * @returns {Promise<string>} Promise resolving to contact name, "Not assigned", or "Unknown Contact"
 */
async function getContactNameById(contactId) {
  if (!contactId) return "Not assigned";
  try {
    const contact = await fetchContactByIdAndUser(contactId);
    return contact ? contact.name : "Unknown Contact";
  } catch (error) {
    console.error("Error getting contact name:", error);
    return "Unknown Contact";
  }
}

/**
 * Opens contact details when clicking on a contact name in task detail with session storage and redirection
 * Fetches contact data, saves contact ID to session storage, and redirects to contacts page
 * Provides contact detail navigation from task detail with proper data persistence and error handling
 * @function openContactOverlayFromTaskDetail
 * @param {string} contactId - Unique identifier of the contact to show detail view for
 * @returns {Promise<void>} Promise that resolves when contact data is stored and redirection is initiated
 */
async function openContactOverlayFromTaskDetail(contactId) {
  try {
    await handleContactRedirectSuccess(contactId);
  } catch (error) {
    handleContactRedirectError(contactId);
  }
}

/**
 * Handles successful contact fetch and redirection setup
 * @function handleContactRedirectSuccess
 * @param {string} contactId - The contact ID to fetch and redirect for
 * @returns {Promise<void>} Promise that resolves when contact is fetched and redirect is set up
 */
async function handleContactRedirectSuccess(contactId) {
  const contact = await fetchContactByIdAndUser(contactId);
  const finalContactId = contact ? contact.id : contactId;
  sessionStorage.setItem("contactIdForOverlay", finalContactId);
  window.location.href = `contacts.html?contactId=${finalContactId}`;
}

/**
 * Handles contact fetch error and fallback redirection
 * @function handleContactRedirectError
 * @param {string} contactId - The contact ID to use for fallback redirection
 * @returns {void} No return value, sets up fallback session storage and redirection
 */
function handleContactRedirectError(contactId) {
  sessionStorage.setItem("contactIdForOverlay", contactId);
  window.location.href = `contacts.html?contactId=${contactId}`;
}

/**
 * Initiates edit mode for a task by loading data and showing edit overlay with full functionality
 * Loads task data, opens edit overlay, and initializes all editing functionality with proper timing
 * Provides complete task editing workflow initiation with error handling and data validation
 * @function editTask
 * @param {string} taskId - The unique identifier of the task to edit
 * @returns {Promise<void>} Promise that resolves when task edit mode is fully initialized
 */
async function editTask(taskId) {
  const task = await loadTaskForEdit(taskId);
  if (task) {
    openEditTaskOverlay(task);
    initializeEditTaskFunctionality(taskId, task);
  }
}

/**
 * Loads task data for editing with contact enrichment and validation
 * Fetches task by user context, finds specific task, and enriches with contact data for editing
 * Provides complete task data preparation for edit mode with assigned contacts resolution
 * @function loadTaskForEdit
 * @param {string} taskId - The unique identifier of the task to load for editing
 * @returns {Promise<Object|null>} The task object with enriched contact data or null if task not found
 */
async function loadTaskForEdit(taskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.assignedContacts = await getAllContactsFromAssigned(task.assignedTo);
  }
  return task;
}

/**
 * Opens the edit task overlay with task data and displays editing interface
 * Renders edit task overlay HTML, shows overlay with proper styling, and removes hidden class
 * Provides visual task editing interface with populated data and proper overlay display
 * @function openEditTaskOverlay
 * @param {Object} task - The task object to edit containing all task properties and data
 * @returns {void} No return value, performs DOM manipulation to show edit overlay
 */
function openEditTaskOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getEditTaskOverlay(task);
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
  }
}

/**
 * Initializes edit task functionality with proper timing for DOM elements and form setup
 * Uses nested setTimeout to ensure DOM elements are ready before initializing functionality
 * Provides sequential setup of overlay functions, form data loading, and save button configuration
 * @function initializeEditTaskFunctionality
 * @param {string} taskId - The ID of the task being edited for save button setup
 * @param {Object} task - The task object being edited containing data for form population
 * @returns {void} No return value, performs timed initialization of edit functionality
 */
function initializeEditTaskFunctionality(taskId, task) {
  setTimeout(() => {
    initializeEditTaskOverlayFunctions();
    setTimeout(() => {
      loadTaskDataIntoEditForm(task);
      setupEditTaskSaveButton(taskId);
    }, 100);
  }, 100);
}

/**
 * Initializes overlay functions specific to task editing with conditional function calling
 * Checks for function availability and calls overlay initialization if function exists
 * Provides safe function initialization with existence validation for overlay functionality
 * @function initializeEditTaskOverlayFunctions
 * @returns {void} No return value, performs conditional overlay function initialization
 */
function initializeEditTaskOverlayFunctions() {
  if (typeof initializeOverlayAddTask === "function") {
    initializeOverlayAddTask();
  }
}

/**
 * Loads task data into the edit form fields with subtask management and global state setup
 * Populates form with existing task data, sets up current and original subtasks arrays
 * Provides comprehensive form data loading with subtask rendering and state initialization
 * @function loadTaskDataIntoEditForm
 * @param {Object} task - Task object containing existing values including subtasks array
 * @returns {void} No return value, performs form population and global state setup
 */
function loadTaskDataIntoEditForm(task) {
  currentSubtasks = task.subtasks || [];
  window.currentSubtasks = currentSubtasks;
  window.originalSubtasks = task.subtasks || [];
  if (typeof renderSubtasks === "function") {
    renderSubtasks(window.currentSubtasks);
  }
}

/**
 * Sets up the save button behavior within the edit overlay with event handler configuration
 * Finds save button element and attaches click event handler for task save functionality
 * Provides save button functionality with event prevention and asynchronous task saving
 * @function setupEditTaskSaveButton
 * @param {string} taskId - The ID of the task being edited for save operation targeting
 * @returns {void} No return value, performs save button event handler setup
 */
function setupEditTaskSaveButton(taskId) {
  const saveButton = document.getElementById("editSaveBtn");
  if (saveButton) {
    saveButton.onclick = async function (event) {
      event.preventDefault();
      await saveEditTask(taskId);
    };
  }
}

/**
 * Persists edited task data to Firebase with comprehensive data collection and error handling
 * Collects form data, updates Firebase, finalizes save process, and handles any errors
 * Provides complete task edit save workflow with data persistence and UI updates
 * @function saveEditTask
 * @param {string} taskId - The unique identifier of the task to update in Firebase
 * @returns {Promise<void>} Promise that resolves when task save process is complete
 */
async function saveEditTask(taskId) {
  try {
    const updatedTaskData = collectEditTaskFormData();
    await updateTaskInFirebase(taskId, updatedTaskData);
    await finishEditTaskSave(taskId);
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

/**
 * Collects and returns form data from the edit task overlay with comprehensive field gathering
 * Extracts values from all form fields including title, description, date, priority, category, assignments
 * Provides complete task data object with fallback values and subtask array for Firebase update
 * @function collectEditTaskFormData
 * @returns {Object} Updated task data object containing all form values and current state
 */
function collectEditTaskFormData() {
  return {
    title: document.getElementById("editTaskTitle")?.value || "",
    description: document.getElementById("editTaskDescription")?.value || "",
    dueDate: document.getElementById("editTaskDueDate")?.value || "",
    taskPriority: selectedPriority || "Medium",
    Category: getSelectedCategory(),
    assignedTo: getSelectedAssignedTo(),
    subtasks: window.currentSubtasks || window.originalSubtasks || [],
  };
}

/**
 * Retrieves the currently selected category from the edit form with function availability checking
 * Calls category selection function if available, otherwise returns fallback category value
 * Provides safe category retrieval with default fallback for form data collection
 * @function getSelectedCategory
 * @returns {string} Category name from form selection or "Technical Task" as default value
 */
function getSelectedCategory() {
  return typeof getSelectedCategoryName === "function"
    ? getSelectedCategoryName()
    : selectedCategory || "Technical Task";
}

/**
 * Retrieves the currently selected assignees from the edit form with function delegation
 * Calls contact selection function if available, otherwise returns empty array
 * Provides safe assignee retrieval with complete array return for form data collection
 * @function getSelectedAssignedTo
 * @returns {Array} Array of contact IDs of selected assignees or empty array if function unavailable
 */
function getSelectedAssignedTo() {
  return typeof getSelectedContactIds === "function"
    ? getSelectedContactIds()
    : [];
}

/**
 * Sends updated task object to Firebase using user-specific update functionality
 * Delegates to user-specific Firebase update function for proper data persistence and security
 * Provides centralized Firebase update with user context and proper data handling
 * @function updateTaskInFirebase
 * @param {string} taskId - The unique identifier of the task to update in Firebase
 * @param {Object} taskData - The complete task data object to save with all properties
 * @returns {Promise<void>} Promise that resolves when Firebase update operation is complete
 */
async function updateTaskInFirebase(taskId, taskData) {
  await updateTaskInFirebaseByUser(taskId, taskData);
}

/**
 * Finalizes saving the edit by closing overlay and refreshing view with updated data
 * Closes edit overlay, shows updated task detail, and refreshes board display
 * Provides complete save finalization workflow with UI updates and data synchronization
 * @function finishEditTaskSave
 * @param {string} taskId - The ID of the task just saved for detail view refresh
 * @returns {Promise<void>} Promise that resolves when all finalization operations are complete
 */
async function finishEditTaskSave(taskId) {
  closeEditTaskOverlay();
  if (taskId) {
    await showTaskDetail(taskId);
  }
  if (typeof refreshBoard === "function") {
    await refreshBoard();
  }
}

/**
 * Closes the edit task overlay UI
 */
/**
 * Closes the Add Task overlay with animation and cleanup effects
 * Triggers closing animation, hides overlay after delay, and clears content for fresh state
 * Provides smooth visual transition when closing task creation overlay
 * @function closeAddTaskOverlay
 * @returns {void} No return value, performs overlay closing operations with timing control
 */
function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.style.animation = "taskOverlayClose 0.4s ease-in-out forwards";
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
      overlay.style.animation = "";
    }, 400);
  }
}

/**
 * Hides the edit task overlay and clears its content for clean state reset
 * Immediately hides overlay, adds hidden class, and clears innerHTML for memory management
 * Provides instant overlay hiding without animation for specific use cases
 * @function hideEditTaskOverlay
 * @returns {void} No return value, performs immediate overlay hiding and content cleanup
 */
function hideEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}

/**
 * Closes the Edit Task overlay with smooth animation and delayed cleanup
 * Adds closing class for CSS animation, then hides overlay and clears content after timing
 * Provides animated closing transition for better user experience during task editing completion
 * @function closeEditTaskOverlay
 * @returns {void} No return value, performs animated overlay closing with 400ms timing delay
 */
function closeEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
      overlay.classList.remove("closing");
    }, 400);
  }
}

/**
 * Hides the Add Task overlay and clears its content for immediate state reset
 * Instantly hides overlay element, adds hidden class, and clears innerHTML for memory cleanup
 * Provides immediate overlay hiding without animation for specific reset scenarios
 * @function hideAddTaskOverlay
 * @returns {void} No return value, performs instant overlay hiding and content removal
 */
function hideAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}

/**
 * Returns a user-friendly display label for a given category value with fallback support
 * Maps internal category keys to proper display names for UI presentation
 * Provides consistent category labeling with default fallback for unknown categories
 * @function getCategoryLabel
 * @param {string} category - The category key to get display label for (Technical Task, User Story, technicalTask, userStory)
 * @returns {string} Human-readable display label for the category, defaults to "Technical Task" for unknown values
 */
function getCategoryLabel(category) {
  const categoryMap = {
    "Technical Task": "Technical Task",
    "User Story": "User Story",
    technicalTask: "Technical Task",
    userStory: "User Story",
  };
  return categoryMap[category] || "Technical Task";
}

/**
 * Returns a CSS class name for a given category value with consistent styling mapping
 * Maps category values to corresponding CSS class identifiers for proper visual styling
 * Provides consistent CSS class mapping with fallback for unknown category types
 * @function getCategoryClass
 * @param {string} category - The category key to get CSS class for (Technical Task, User Story, technicalTask, userStory)
 * @returns {string} CSS class identifier for styling the category, defaults to "technicalTask" for unknown values
 */
function getCategoryClass(category) {
  const classMap = {
    "Technical Task": "technicalTask",
    "User Story": "userStory",
    technicalTask: "technicalTask",
    userStory: "userStory",
  };
  return classMap[category] || "technicalTask";
}

/**
 * Renders a single user avatar for display in task cards with personalized styling
 * Creates HTML for contact avatar with initials and background color based on contact data
 * Provides visual representation of assigned contact with consistent avatar styling
 * @function renderSingleAssignee
 * @param {string} assignedTo - Contact ID to render avatar for, must be valid contact identifier
 * @returns {string} HTML snippet for user avatar with styling, or empty string if no contact provided
 */
function renderSingleAssignee(assignedTo) {
  if (!assignedTo) return "";
  const initials = getInitials(assignedTo);
  const color = getAvatarColor(assignedTo);
  return `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
}

/**
 * Toggles completion state of a subtask within a task overlay with full data persistence
 * Finds subtask, toggles completed flag, updates Firebase, refreshes UI, and syncs board display
 * Provides interactive subtask completion management with comprehensive state synchronization
 * @function toggleSubtask
 * @param {string} taskId - Parent task ID containing the subtask to toggle
 * @param {string} subtaskId - Subtask ID to toggle completion state for
 * @returns {Promise<void>} Promise that resolves when subtask toggle and all updates are complete
 */
async function toggleSubtask(taskId, subtaskId) {
  try {
    const task = await findAndToggleSubtask(taskId, subtaskId);
    if (!task) return;
    await updateTaskInFirebase(taskId, task);
    updateSubtaskListInOverlay(task, taskId);
    await refreshBoard();
  } catch (error) {
    console.error("Error toggling subtask:", error);
  }
}

/**
 * Finds a task, toggles a subtask's completed flag, and returns updated task with validation
 * Fetches task data, locates specific subtask, toggles completion state, and validates operations
 * Provides safe subtask modification with comprehensive error handling and data validation
 * @function findAndToggleSubtask
 * @param {string} taskId - Parent task ID to search for and modify subtask within
 * @param {string} subtaskId - Subtask ID to find and toggle completion state for
 * @returns {Promise<Object|null>} Updated task object with modified subtask or null if task/subtask not found
 */
async function findAndToggleSubtask(taskId, subtaskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  if (!task || !task.subtasks) return null;
  const subtaskIndex = task.subtasks.findIndex((sub) => sub.id === subtaskId);
  if (subtaskIndex === -1) return null;
  task.subtasks[subtaskIndex].completed =
    !task.subtasks[subtaskIndex].completed;
  return task;
}

/**
 * Updates a task in Firebase with new data using user-specific database operations
 * Delegates to user-specific Firebase update function for proper data persistence and security
 * Provides centralized task update functionality with user context awareness
 * @function updateTaskInFirebase
 * @param {string} taskId - The unique identifier of the task to update in Firebase
 * @param {Object} task - The updated task object containing all modified data and properties
 * @returns {Promise<void>} Promise that resolves when Firebase update operation is complete
 */
async function updateTaskInFirebase(taskId, task) {
  await updateTaskInFirebaseByUser(taskId, task);
}

/**
 * Updates the subtask list in the task detail overlay UI with real-time rendering
 * Finds overlay element, locates subtasks list container, and re-renders with updated data
 * Provides dynamic UI updates for subtask changes while overlay is visible
 * @function updateSubtaskListInOverlay
 * @param {Object} task - The task object containing updated subtasks array with completion states
 * @param {string} taskId - The ID of the parent task for proper subtask rendering context
 * @returns {void} No return value, performs direct DOM manipulation for UI updates
 */
function updateSubtaskListInOverlay(task, taskId) {
  const overlay = document.getElementById("taskOverlay");
  if (!overlay || overlay.classList.contains("hidden")) return;
  const subtasksList = overlay.querySelector(".subtasksList");
  if (subtasksList) {
    subtasksList.innerHTML = renderTaskDetailSubtasks(task.subtasks, taskId);
  }
}
