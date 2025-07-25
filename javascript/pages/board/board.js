"use strict";

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("board.html")) {
    initializeBoard();
  }
});

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

async function showTaskDetail(taskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  task.assignedToName = await getContactNameById(task.assignedTo);
  const overlay = document.getElementById("taskOverlay");
  overlay.innerHTML = getTaskDetailOverlay(task);
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

async function deleteTask(taskId) {
  await deleteTaskFromFirebaseByUser(taskId);
  closeTaskOverlay();
  await refreshBoard();
}

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
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.assignedToName = await getContactNameById(task.assignedTo);
    const overlay = document.getElementById("editTaskOverlay");
    if (overlay) {
      overlay.innerHTML = getEditTaskOverlay(task);
      overlay.style.display = "flex";
      overlay.classList.remove("hidden");
    }
  }
}

function closeEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}

function closeAddTaskOverlay() {
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
    subtasksList.innerHTML = renderSubtasks(task.subtasks, taskId);
  }
}
