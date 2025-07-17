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

async function createOverlayTask() {
  const taskData = getFormData();
  
  if (!validateTaskData(taskData)) {
    return;
  }
  
  await addTaskToFirebase(taskData);
  clearForm();
  closeOverlay();
  await refreshBoard();
}

function setupOverlayFormSubmission() {
  const createButton = document.getElementById('createTaskBtn');
  const clearButton = document.getElementById('clearTaskBtn');
  
  createButton.onclick = createOverlayTask;
  clearButton.onclick = clearForm;
}