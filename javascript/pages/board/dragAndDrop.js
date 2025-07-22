let currentDraggedTaskId = null;

function startDragging(taskId) {
  currentDraggedTaskId = taskId;

  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) {
    taskElement.style.animation =
      "cardGrab 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards";
    setTimeout(() => {
      taskElement.classList.add("dragging");
      taskElement.style.animation = "";
      addFloatingEffect(taskElement);
    }, 300);
  }
}

function addFloatingEffect(taskElement) {
  let moveTimer;
  const addMovingClass = () => {
    taskElement.classList.add("moving");
    clearTimeout(moveTimer);

    moveTimer = setTimeout(() => {
      taskElement.classList.remove("moving");
    }, 200);
  };
  const handleMouseMove = () => addMovingClass();
  document.addEventListener("mousemove", handleMouseMove);
  const originalCleanup = cleanupAfterDrop;
  cleanupAfterDrop = function () {
    document.removeEventListener("mousemove", handleMouseMove);
    taskElement.classList.remove("moving");
    originalCleanup();
  };
}

function moveToAnotherColumn(ev) {
  ev.preventDefault();
  const column = ev.currentTarget;
  column.classList.add("drag-over");
  column.style.animation = "dropZoneActivate 0.3s ease-out";
  setTimeout(() => {
    column.style.animation = "";
  }, 300);
}

function addDropAnimation(taskElement) {
  taskElement.classList.remove("dragging", "moving");
  taskElement.style.animation =
    "cardRelease 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards";
  setTimeout(() => {
    taskElement.style.animation = "";
    taskElement.style.animation =
      "taskDrop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards";
    setTimeout(() => {
      taskElement.style.animation = "";
    }, 600);
  }, 500);
}

function cleanupAfterDrop() {
  currentDraggedTaskId = null;
  document.querySelectorAll(".dragging").forEach((element) => {
    element.classList.remove("dragging", "moving");
    element.style.animation = "cardRelease 0.4s ease-out forwards";
    setTimeout(() => {
      element.style.animation = "";
    }, 400);
  });
  document.querySelectorAll(".drag-over").forEach((element) => {
    element.classList.remove("drag-over");
    element.style.animation = "";
  });
}

async function dropToAnotherColumn(ev) {
  ev.preventDefault();
  const dropResult = handleDropEvent(ev);
  if (!dropResult.success) return;
  const { columnId, newStatus } = dropResult;
  if (currentDraggedTaskId && newStatus) {
    await processTaskDrop(currentDraggedTaskId, columnId, newStatus);
  }
  cleanupAfterDrop();
}

function handleDropEvent(ev) {
  const columnElement = ev.currentTarget;
  const columnId = columnElement.id;
  const newStatus = getColumnStatus(columnId);
  removeDragOverEffects(columnElement);
  return {
    success: Boolean(columnId && newStatus),
    columnId,
    newStatus,
  };
}

async function processTaskDrop(taskId, targetColumnId, newStatus) {
  try {
    updateTaskVisually(taskId, targetColumnId);
    await updateTaskInDatabase(taskId, newStatus);
  } catch (error) {
    console.error("Error processing task drop:", error);
    await handleDropError();
  }
}

function updateTaskVisually(taskId, targetColumnId) {
  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
  if (taskElement) {
    removeDraggingAnimation(taskElement);
    showTaskinRightColumn(taskId, targetColumnId);
    addDropAnimation(taskElement);
  }
}

async function updateTaskInDatabase(taskId, newStatus) {
  await changeStatusforDraggedTask(taskId, {
    Status: newStatus,
  });
}

function removeDraggingAnimation(taskElement) {
  taskElement.classList.remove("dragging");
  taskElement.style.animation = "";
}

function addDropAnimation(taskElement) {
  taskElement.classList.add("task-dropped");
  setTimeout(() => {
    taskElement.classList.remove("task-dropped");
  }, 400);
}

function removeDragOverEffects(columnElement) {
  columnElement.classList.remove("drag-over");
}

function cleanupAfterDrop() {
  currentDraggedTaskId = null;
  removeAllDraggingClasses();
  removeAllDragOverEffects();
}

function removeAllDraggingClasses() {
  document.querySelectorAll(".dragging").forEach((element) => {
    element.classList.remove("dragging");
    element.style.animation = "";
  });
}

function removeAllDragOverEffects() {
  document.querySelectorAll(".drag-over").forEach((element) => {
    element.classList.remove("drag-over");
  });
}

async function handleDropError() {
  try {
    await initializeBoard();
  } catch (error) {
    console.error("Error reinitializing board:", error);
  }
}

async function updateColumnStatus(taskId, status) {
  try {
    await updateTaskInFirebase(taskId, { Status: status });
    await initializeBoard();
  } catch (error) {}
}

async function changeStatusforDraggedTask(taskId, taskData) {
  const response = await fetch(
    `${firebaseUrl}user /guest /task/${taskId}.json`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    }
  );
  return response.ok;
}

function getColumnStatus(columnId) {
  const TaskStatus = {
    toDoColumn: "toDo",
    inProgressColumn: "inProgress",
    awaitingFeedbackColumn: "awaitingFeedback",
    doneColumn: "done",
  };
  return TaskStatus[columnId];
}

function showTaskinRightColumn(taskId, targetColumnId) {
  const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
  const taskColumn = document.getElementById(targetColumnId);
  if (taskCard && taskColumn) {
    const originalColumn = taskCard.parentElement;
    taskColumn.appendChild(taskCard);
    updateEmptyStates(originalColumn, taskColumn);
  }
}

function updateEmptyStates(fromColumn, toColumn) {
  const emptyInTarget = toColumn.querySelector(".emptyState");
  if (emptyInTarget) {
    emptyInTarget.remove();
  }
  const tasksLeft = fromColumn.querySelectorAll(".taskCard").length;
  if (tasksLeft === 0) {
    const columnStatus = getColumnStatus(fromColumn.id);
    if (columnStatus) {
      fromColumn.innerHTML = getEmptyStateTemplate(columnStatus);
    }
  }
}
