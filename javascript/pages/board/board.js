/**
 * @fileoverview Board page functionality for the JOIN application
 * Handles task board display, task management, and column-based task organization
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Initializes the board when DOM content is loaded and on correct page
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("board.html")) {
    initializeBoard();
  }
});

/**
 * Initializes the board by fetching tasks and rendering the board template
 */
async function initializeBoard() {
  const tasks = await fetchTaskByUser();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].assignedTo) {
      tasks[i].assignedToName = await getContactNameById(tasks[i].assignedTo);
    }
  }
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
}

/**
 * Shows detailed view of a specific task in an overlay
 * @param {string} taskId - The ID of the task to display
 */
async function showTaskDetail(taskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  task.assignedToName = await getContactNameById(task.assignedTo);
  const overlay = document.getElementById("taskOverlay");
  overlay.innerHTML = getTaskDetailOverlay(task);
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

/**
 * Deletes a task from Firebase and refreshes the board
 * @param {string} taskId - The ID of the task to delete
 */
async function deleteTask(taskId) {
  await deleteTaskFromFirebaseByUser(taskId);
  closeTaskOverlay();
  await refreshBoard();
}

/**
 * Refreshes the board by re-fetching tasks and re-rendering
 */
async function refreshBoard() {
  const tasks = await fetchTaskByUser();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].assignedTo) {
      tasks[i].assignedToName = await getContactNameById(tasks[i].assignedTo);
    }
  }
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
}

/**
 * Opens the Add Task overlay for a specific column status
 * @param {string} status - The status/column to add the task to
 */
function addTaskToColumn(status) {
  showAddTaskOverlay();
}

/**
 * Closes the task detail overlay
 */
function closeTaskOverlay() {
  const overlay = document.getElementById("taskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
  }
}

/**
 * Shows the Add Task overlay for creating new tasks
 */
function showAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getAddTaskOverlay();
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
    initializeOverlayAddTask();
  }
}

/**
 * Gets the contact name by ID for task assignment display
 * @param {string} contactId - The ID of the contact
 * @returns {Promise<string>} The contact name or "Not assigned" if not found
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
 * Initiates edit mode for a task by loading data and showing edit overlay
 * @param {string} taskId - The ID of the task to edit
 */
async function editTask(taskId) {
  const task = await loadTaskForEdit(taskId);
  if (task) {
    openEditTaskOverlay(task);
    initializeEditTaskFunctionality(taskId, task);
  }
}

/**
 * Loads task data for editing
 * @param {string} taskId - The ID of the task to load
 * @returns {Promise<Object|null>} The task object with contact name or null if not found
 */
async function loadTaskForEdit(taskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.assignedToName = await getContactNameById(task.assignedTo);
  }
  return task;
}

/**
 * Opens the edit task overlay with task data
 * @param {Object} task - The task object to edit
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
 * Initializes edit task functionality with proper timing for DOM elements
 * @param {string} taskId - The ID of the task being edited
 * @param {Object} task - The task object being edited
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
 * Initializes overlay functions specific to task editing
 */
function initializeEditTaskOverlayFunctions() {
  if (typeof initializeOverlayAddTask === "function") {
    initializeOverlayAddTask();
  }
}

/**
 * Loads task data into the edit form fields
 * @param {Object} task - Task object containing existing values
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
 * Sets up the save button behavior within the edit overlay
 * @param {string} taskId - The ID of the task being edited
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
 * Persists edited task data to Firebase
 * @param {string} taskId - The ID of the task to update
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
 * Collects and returns form data from the edit task overlay
 * @returns {Object} Updated task data
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
 * Retrieves the currently selected category from the edit form
 * @returns {string} Category name
 */
function getSelectedCategory() {
  return typeof getSelectedCategoryName === "function"
    ? getSelectedCategoryName()
    : selectedCategory || "Technical Task";
}

/**
 * Retrieves the currently selected assignee from the edit form
 * @returns {string} Contact ID of assignee
 */
function getSelectedAssignedTo() {
  return typeof getSelectedContactIds === "function"
    ? getSelectedContactIds()[0]
    : "";
}

/**
 * Sends updated task object to Firebase
 * @param {string} taskId - The ID of the task
 * @param {Object} taskData - The task data to save
 */
async function updateTaskInFirebase(taskId, taskData) {
  await updateTaskInFirebaseByUser(taskId, taskData);
}

/**
 * Finalizes saving the edit by closing overlay and refreshing view
 * @param {string} taskId - The ID of the task just saved
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
function closeEditTaskOverlay() {
  hideEditTaskOverlay();
}

/**
 * Hides the edit task overlay and clears its content
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
 * Closes the Add Task overlay
 */
function closeAddTaskOverlay() {
  hideAddTaskOverlay();
}

/**
 * Hides the Add Task overlay and clears its content
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
 * Returns a display label for a given category value
 * @param {string} category - The category key
 * @returns {string} Display label for the category
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
 * Returns a CSS class name for a given category value
 * @param {string} category - The category key
 * @returns {string} CSS class identifier for the category
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
 * Renders a single user avatar for display in task cards
 * @param {string} assignedTo - Contact ID to render avatar for
 * @returns {string} HTML snippet for user avatar
 */
function renderSingleAssignee(assignedTo) {
  if (!assignedTo) return "";
  const initials = getInitials(assignedTo);
  const color = getAvatarColor(assignedTo);
  return `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
}

/**
 * Toggles completion state of a subtask within a task overlay
 * @param {string} taskId - Parent task ID
 * @param {string} subtaskId - Subtask ID to toggle
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
 * Finds a task, toggles a subtask's completed flag, and returns updated task
 * @param {string} taskId - Parent task ID
 * @param {string} subtaskId - Subtask ID to find and toggle
 * @returns {Promise<Object|null>} Updated task object or null
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
 * Updates a task in Firebase with new data
 * @param {string} taskId - The ID of the task to update
 * @param {Object} task - The updated task object
 * @returns {Promise<void>} Resolves when update is complete
 */
async function updateTaskInFirebase(taskId, task) {
  await updateTaskInFirebaseByUser(taskId, task);
}


/**
 * Updates the subtask list in the task detail overlay UI
 * @param {Object} task - The task object containing subtasks
 * @param {string} taskId - The ID of the parent task
 */
function updateSubtaskListInOverlay(task, taskId) {
  const overlay = document.getElementById("taskOverlay");
  if (!overlay || overlay.classList.contains("hidden")) return;
  const subtasksList = overlay.querySelector(".subtasksList");
  if (subtasksList) {
    subtasksList.innerHTML = renderTaskDetailSubtasks(task.subtasks, taskId);
  }
}
