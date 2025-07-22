function addDragAnimation(taskElement) {
  taskElement.classList.add("dragging");
}

function removeDragAnimation(taskElement) {
  taskElement.classList.remove("dragging");
  taskElement.classList.remove("moving");
}

async function addDropAnimation(taskElement) {
  taskElement.classList.add("task-dropped");
  await new Promise((resolve) => {
    setTimeout(() => {
      taskElement.classList.remove("task-dropped");
      resolve();
    }, 400);
  });
}

async function handleDragStart(event) {
  const taskElement = event.target.closest(".taskCard");
  if (!taskElement) return;
  currentDraggedTaskId = taskElement.dataset.taskId;
  taskElement.style.transform = "scale(0.95)";
  setTimeout(() => {
    taskElement.style.transform = "";
    addDragAnimation(taskElement);
  }, 100);
}

async function handleDragEnd(event) {
  const taskElement = event.target.closest(".taskCard");
  if (!taskElement) return;
  removeDragAnimation(taskElement);
  taskElement.style.transform = "";
  await addDropAnimation(taskElement);
  if (currentDraggedTaskId) {
    try {
      await updateTaskInDatabase(currentDraggedTaskId, "Dropped");
    } catch (error) {
      console.error("Error updating task in database:", error);
      await handleDropError();
    }
  }
  cleanupAfterDrop();
}

async function handleDragOver(event) {
  event.preventDefault();
  const columnElement = event.target.closest(".columnContent");
  if (!columnElement) return;
  columnElement.classList.add("drag-over");
}

function addMouseSupport() {
  document.querySelectorAll(".taskCard").forEach((card) => {
    card.addEventListener("mousedown", function () {
      if (!this.classList.contains("dragging")) {
        this.style.transform = "scale(0.95)";
      }
    });

    card.addEventListener("mouseup", function () {
      if (!this.classList.contains("dragging")) {
        this.style.transform = "";
      }
    });

    card.addEventListener("mouseleave", function () {
      if (!this.classList.contains("dragging")) {
        this.style.transform = "";
      }
    });
  });
}

function addTouchSupport() {
  document.querySelectorAll(".taskCard").forEach((card) => {
    card.addEventListener("touchstart", function () {
      if (!this.classList.contains("dragging")) {
        this.style.transform = "scale(0.95)";
      }
    });

    card.addEventListener("touchend", function () {
      if (!this.classList.contains("dragging")) {
        this.style.transform = "";
      }
    });
  });
}

function cleanupAfterDrop() {
  currentDraggedTaskId = null;
  document.querySelectorAll(".dragging").forEach((element) => {
    element.classList.remove("dragging");
    element.style.transform = "";
  });
  document.querySelectorAll(".drag-over").forEach((element) => {
    element.classList.remove("drag-over");
  });
}

function initializeBoardAnimations() {
  addMouseSupport();
  addTouchSupport();
}
