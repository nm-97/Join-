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
  closeAddTaskOverlay();
  await refreshBoard();
}

function setupOverlayFormSubmission() {
  const createButton = document.getElementById('createTaskBtn');
  const clearButton = document.getElementById('clearTaskBtn');
  
  createButton.onclick = createOverlayTask;
  clearButton.onclick = clearForm;
}