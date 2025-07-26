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

function closeTaskOverlay() {
  const overlay = document.getElementById("taskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
  }
}

function showAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getAddTaskOverlay();
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
    initializeOverlayAddTask();
  }
}

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

async function editTask(taskId) {
  const task = await loadTaskForEdit(taskId);
  if (task) {
    openEditTaskOverlay(task);
    initializeEditTaskFunctionality(taskId, task);
  }
}

async function loadTaskForEdit(taskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.assignedToName = await getContactNameById(task.assignedTo);
  }
  return task;
}

function openEditTaskOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getEditTaskOverlay(task);
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
  }
}

function initializeEditTaskFunctionality(taskId, task) {
  setTimeout(() => {
    initializeEditTaskOverlayFunctions();
    setTimeout(() => {
      loadTaskDataIntoEditForm(task);
      setupEditTaskSaveButton(taskId);
    }, 100);
  }, 100);
}

function initializeEditTaskOverlayFunctions() {
  if (typeof initializeOverlayAddTask === "function") {
    initializeOverlayAddTask();
  }
}

function loadTaskDataIntoEditForm(task) {
  currentSubtasks = task.subtasks || [];
  window.currentSubtasks = currentSubtasks;
  window.originalSubtasks = task.subtasks || [];
  if (typeof renderSubtasks === "function") {
    renderSubtasks(window.currentSubtasks);
  }
}

function setupEditTaskSaveButton(taskId) {
  const saveButton = document.getElementById("editSaveBtn");
  if (saveButton) {
    saveButton.onclick = async function (event) {
      event.preventDefault();
      await saveEditTask(taskId);
    };
  }
}

async function saveEditTask(taskId) {
  try {
    const updatedTaskData = collectEditTaskFormData();
    await updateTaskInFirebase(taskId, updatedTaskData);
    await finishEditTaskSave(taskId);
  } catch (error) {
    console.error("Error updating task:", error);
  }
}

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

function getSelectedCategory() {
  return typeof getSelectedCategoryName === "function"
    ? getSelectedCategoryName()
    : selectedCategory || "Technical Task";
}

function getSelectedAssignedTo() {
  return typeof getSelectedContactIds === "function"
    ? getSelectedContactIds()[0]
    : "";
}

async function updateTaskInFirebase(taskId, taskData) {
  await updateTaskInFirebaseByUser(taskId, taskData);
}

async function finishEditTaskSave(taskId) {
  closeEditTaskOverlay();
  if (taskId) {
    await showTaskDetail(taskId);
  }
  if (typeof refreshBoard === "function") {
    await refreshBoard();
  }
}

function closeEditTaskOverlay() {
  hideEditTaskOverlay();
}

function hideEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}

function closeAddTaskOverlay() {
  hideAddTaskOverlay();
}

function hideAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}

function getCategoryLabel(category) {
  const categoryMap = {
    "Technical Task": "Technical Task",
    "User Story": "User Story",
    technicalTask: "Technical Task",
    userStory: "User Story",
  };
  return categoryMap[category] || "Technical Task";
}

function getCategoryClass(category) {
  const classMap = {
    "Technical Task": "technicalTask",
    "User Story": "userStory",
    technicalTask: "technicalTask",
    userStory: "userStory",
  };
  return classMap[category] || "technicalTask";
}

function renderSingleAssignee(assignedTo) {
  if (!assignedTo) return "";
  const initials = getInitials(assignedTo);
  const color = getAvatarColor(assignedTo);
  return `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
}

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

async function updateTaskInFirebase(taskId, task) {
  await updateTaskInFirebaseByUser(taskId, task);
}

function updateSubtaskListInOverlay(task, taskId) {
  const overlay = document.getElementById("taskOverlay");
  if (!overlay || overlay.classList.contains("hidden")) return;
  const subtasksList = overlay.querySelector(".subtasksList");
  if (subtasksList) {
    subtasksList.innerHTML = renderTaskDetailSubtasks(task.subtasks, taskId);
  }
}
