function showEditTaskOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  overlay.innerHTML = getEditTaskOverlay(task);
  overlay.classList.remove("hidden");
  overlay.style.display = "flex";
}

// function showEditTaskOverlay(task) {
//   const overlay = document.getElementById("editTaskOverlay");
//   overlay.innerHTML = getEditTaskOverlay(task);
//   overlay.style.display = "flex";
// }

function closeEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  overlay.classList.add("hidden");
  overlay.style.display = "none";
  overlay.innerHTML = "";
}

async function editTask(taskId) {
  const task = await fetchTaskById(taskId);
  closeTaskOverlay();
  showEditTaskOverlay(task);
}