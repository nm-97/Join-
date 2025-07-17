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

async function fetchTaskById(taskId) {
  let response = await fetch(`${firebaseUrl}user/guest /task/${taskId}.json`);
  let data = await response.json();
  
  if (!data) {
    response = await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`);
    data = await response.json();
  }
  
  return mapApiTaskToTemplate({ id: taskId, ...data });
}

async function initializeBoard() {
  const tasks = await fetchAllTasks();
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("board.html")) {
    initializeBoard();
  }
});
