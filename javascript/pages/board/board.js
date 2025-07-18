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

function initializeOverlayAddTask() {
  setupPriorityButtons();
  setupOverlayFormSubmission();
  loadContacts();
}

function addTaskToColumn(status) {
  showAddTaskOverlay();
}

// Board-spezifische Task-Funktionen
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
