async function showTaskDetail(taskId) {
  const task = await fetchTaskById(taskId);
  const overlay = document.getElementById("taskOverlay");
  overlay.innerHTML = getTaskDetailOverlay(task);
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

function closeTaskOverlay() {
  const overlay = document.getElementById("taskOverlay");
  overlay.classList.add("hidden");
  overlay.style.display = "none";
  overlay.innerHTML = "";
}

async function deleteTask(taskId) {
  await deleteTaskFromFirebase(taskId);
  closeTaskOverlay();
  await refreshBoard();
}

async function editTask(taskId) {
  const task = await fetchTaskById(taskId);
  closeTaskOverlay();
  showEditTaskOverlay(task);
}

async function refreshBoard() {
  const tasks = await fetchAllTasks();
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
}

function showEditTaskOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  overlay.innerHTML = getEditTaskOverlay(task);
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

function closeEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  overlay.classList.add("hidden");
  overlay.style.display = "none";
  overlay.innerHTML = "";
}