function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.style.display = "none";
  overlay.innerHTML = "";
}

function showAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  overlay.innerHTML = getAddTaskOverlay();
  overlay.style.display = "flex";
  
  // Initialisiere die Overlay-Funktionalität
  setTimeout(() => {
    initializeOverlayAddTask();
  }, 100);
}

