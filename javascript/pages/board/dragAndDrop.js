let currentDraggedTaskId = null;

function startDragging(taskId) {
  currentDraggedTaskId = taskId;
}

function clearAllDragOverEffects() {
  document.querySelectorAll(".drag-over").forEach((col) => {
    col.classList.remove("drag-over");
    col.style.animation = "";
  });
}

function clearOtherDragOverEffects(currentColumn) {
  document.querySelectorAll(".drag-over").forEach((col) => {
    if (col !== currentColumn) {
      col.classList.remove("drag-over");
      col.style.animation = "";
    }
  });
}

function activateDropZone(column) {
  column.classList.add("drag-over");
  column.style.animation = "dropZoneActivate 0.3s ease-out";
  setTimeout(() => {
    column.style.animation = "";
  }, 50);
}

function moveToAnotherColumn(ev) {
  ev.preventDefault();
  const column = ev.currentTarget;
  clearOtherDragOverEffects(column);
  if (!column.classList.contains("drag-over")) {
    activateDropZone(column);
  }
}

function deactivateDropZone(column) {
  column.classList.remove("drag-over");
  column.style.animation = "";
}

function removeDragOver(ev) {
  const column = ev.currentTarget;
  deactivateDropZone(column);
}

function moveTaskToColumn(taskCard, targetColumn) {
  const originalColumn = taskCard.parentElement;
  targetColumn.appendChild(taskCard);
  return originalColumn;
}

async function updateTaskStatus(taskId, newStatus) {
  await changeStatusforDraggedTask(taskId, { Status: newStatus });
}

function resetDragState() {
  currentDraggedTaskId = null;
}

function addDropAnimation(taskCard) {
  taskCard.classList.add("task-dropped");
  setTimeout(() => {
    taskCard.classList.remove("task-dropped");
  }, 200);
}

async function dropToAnotherColumn(ev) {
  ev.preventDefault();
  const columnId = ev.currentTarget.id;
  const newStatus = getColumnStatus(columnId);
  const column = ev.currentTarget;
  deactivateDropZone(column);
  if (currentDraggedTaskId && newStatus) {
    const taskCard = document.querySelector(
      `[data-task-id="${currentDraggedTaskId}"]`
    );
    const taskColumn = document.getElementById(columnId);
    if (taskCard && taskColumn) {
      const originalColumn = moveTaskToColumn(taskCard, taskColumn);
      updateEmptyStates(originalColumn, taskColumn);
      addDropAnimation(taskCard);
      await updateTaskStatus(currentDraggedTaskId, newStatus);
    }
  }
  resetDragState();
}

async function changeStatusforDraggedTask(taskId, taskData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserTaskPath(currentUser.id, taskId)
      : getGuestTaskPath(taskId);
  
  return await patchData(path, taskData);
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

function removeEmptyStateFromColumn(column) {
  const emptyInTarget = column.querySelector(".emptyState");
  if (emptyInTarget) {
    emptyInTarget.remove();
  }
}

function addEmptyStateToColumn(column) {
  const tasksLeft = column.querySelectorAll(".taskCard").length;
  if (tasksLeft === 0) {
    const columnStatus = getColumnStatus(column.id);
    if (columnStatus) {
      column.innerHTML = getEmptyStateTemplate(columnStatus);
    }
  }
}

function updateEmptyStates(fromColumn, toColumn) {
  removeEmptyStateFromColumn(toColumn);
  addEmptyStateToColumn(fromColumn);
}
