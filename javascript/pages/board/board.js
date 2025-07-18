"use strict";

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("board.html")) {
    initializeBoard();
  }
});

async function initializeBoard() {
  const tasks = await fetchAllTasks();
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
}

async function showTaskDetail(taskId) {
const task = await fetchTaskById(taskId);
task.assignedToName = await getContactNameById(task.assignedTo);
  const overlay = document.getElementById("taskOverlay");
  overlay.innerHTML = getTaskDetailOverlay(task);
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

async function deleteTask(taskId) {
  await deleteTaskFromFirebase(taskId);
  closeTaskOverlay();
  await refreshBoard();
}

async function refreshBoard() {
  const tasks = await fetchAllTasks();
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
    initializeAddTask();
  }
}

async function getContactNameById(contactId) {
  if (!contactId) return 'Not assigned';
  
  try {
    const contacts = await fetchAllContacts();
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  } catch (error) {
    console.error('Error getting contact name:', error);
    return 'Unknown Contact';
  }
}

async function editTask(taskId) {
  const task = await fetchTaskById(taskId);
  task.assignedToName = await getContactNameById(task.assignedTo);
  
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay && task) {
    overlay.innerHTML = getEditTaskOverlay(task);
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
  }
}
function closeEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = '';
  }
}

function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = '';
  }
}