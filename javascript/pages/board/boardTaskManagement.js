/**
 * @fileoverview Board task management functionality
 * Handles task CRUD operations, editing, and detailed task management
 * @author Join Project Team
 * @version 1.0.0
 */

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
  document.body.classList.add("no-scroll");
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
      setTimeout(() => {
        preselectAssignedContacts(task.assignedTo);
      }, 150);
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
 * Pre-selects assigned contacts in the custom dropdown when editing a task
 * Uses the setSelectedContacts function to mark previously assigned contacts as selected
 * Provides visual feedback for already assigned contacts in the edit overlay
 * @function preselectAssignedContacts
 * @param {string[]} assignedContactIds - Array of contact IDs that are currently assigned to the task
 * @returns {void} No return value, updates UI to show pre-selected contacts
 */
function preselectAssignedContacts(assignedContactIds) {
  if (
    typeof setSelectedContacts === "function" &&
    assignedContactIds &&
    assignedContactIds.length > 0
  ) {
    setSelectedContacts(assignedContactIds);
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
  window.originalAssignedTo = task.assignedTo || [];
  window.selectedContacts = task.assignedTo || [];

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
 * Calls contact selection function if available, otherwise returns originally assigned contacts
 * Provides safe assignee retrieval with fallback to original assignment
 * @function getSelectedAssignedTo
 * @returns {Array} Array of contact IDs of selected assignees or original assignees if none selected
 */
function getSelectedAssignedTo() {
  if (typeof getSelectedContactIds === "function") {
    const selectedIds = getSelectedContactIds();
    if (selectedIds && selectedIds.length > 0) {
      return selectedIds;
    }
  }
  return window.selectedContacts || window.originalAssignedTo || [];
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
