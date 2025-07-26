/**
 * @fileoverview Drag and drop functionality for the task board
 * Handles task movement between columns with visual feedback and animations
 * @author Join Project Team
 * @version 1.0.0
 */

let currentDraggedTaskId = null;

/**
 * Initiates dragging process by storing the task ID being dragged
 * @param {string} taskId - The ID of the task being dragged
 */
function startDragging(taskId) {
  currentDraggedTaskId = taskId;
}

/**
 * Clears all drag-over visual effects from all columns
 */
function clearAllDragOverEffects() {
  document.querySelectorAll(".drag-over").forEach((col) => {
    col.classList.remove("drag-over");
    col.style.animation = "";
  });
}

/**
 * Clears drag-over effects from all columns except the current one
 * @param {HTMLElement} currentColumn - The column to keep the drag-over effect on
 */
function clearOtherDragOverEffects(currentColumn) {
  document.querySelectorAll(".drag-over").forEach((col) => {
    if (col !== currentColumn) {
      col.classList.remove("drag-over");
      col.style.animation = "";
    }
  });
}

/**
 * Activates the drop zone visual effect with animation
 * @param {HTMLElement} column - The column element to activate as drop zone
 */
function activateDropZone(column) {
  column.classList.add("drag-over");
  column.style.animation = "dropZoneActivate 0.3s ease-out";
  setTimeout(() => {
    column.style.animation = "";
  }, 50);
}

/**
 * Handles drag over event for column elements
 * @param {Event} ev - The drag over event
 */
function moveToAnotherColumn(ev) {
  ev.preventDefault();
  const column = ev.currentTarget;
  clearOtherDragOverEffects(column);
  if (!column.classList.contains("drag-over")) {
    activateDropZone(column);
  }
}

/**
 * Deactivates the drop zone visual effect
 * @param {HTMLElement} column - The column element to deactivate
 */
function deactivateDropZone(column) {
  column.classList.remove("drag-over");
  column.style.animation = "";
}

/**
 * Removes drag-over effect when drag leaves a column
 * @param {Event} ev - The drag leave event
 */
function removeDragOver(ev) {
  const column = ev.currentTarget;
  deactivateDropZone(column);
}

/**
 * Moves a task card to a target column with animation
 * @param {HTMLElement} taskCard - The task card element to move
 * @param {HTMLElement} targetColumn - The target column element
 */
function moveTaskToColumn(taskCard, targetColumn) {
  const originalColumn = taskCard.parentElement;
  targetColumn.appendChild(taskCard);
  return originalColumn;
}

/**
 * Sends a status update request for a dragged task
 * @param {string} taskId - The ID of the task being dragged
 * @param {string} newStatus - The new status for the task
 * @returns {Promise<void>} Resolves when the task status is updated
 */
async function updateTaskStatus(taskId, newStatus) {
  await changeStatusforDraggedTask(taskId, { Status: newStatus });
}

/**
 * Resets the drag state after completing a drop operation
 */
function resetDragState() {
  currentDraggedTaskId = null;
}

/**
 * Applies a drop animation to a task card and removes it after animation
 * @param {HTMLElement} taskCard - The task card element to animate
 */
function addDropAnimation(taskCard) {
  taskCard.classList.add("task-dropped");
  setTimeout(() => {
    taskCard.classList.remove("task-dropped");
  }, 200);
}

/**
 * Handles the drop event to move a task card to another column and update its status
 * @param {Event} ev - The drop event object
 */
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

/**
 * Sends a patch request to update the status of a dragged task
 * @param {string} taskId - The ID of the task to update
 * @param {Object} taskData - Object containing the new status field
 * @returns {Promise<Object>} Result of the patch operation
 */
async function changeStatusforDraggedTask(taskId, taskData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserTaskPath(currentUser.id, taskId)
      : getGuestTaskPath(taskId);

  return await patchData(path, taskData);
}

/**
 * Maps a column element ID to its corresponding task status key
 * @param {string} columnId - The DOM ID of the column element
 * @returns {string|undefined} Corresponding status key or undefined
 */
function getColumnStatus(columnId) {
  const TaskStatus = {
    toDoColumn: "toDo",
    inProgressColumn: "inProgress",
    awaitingFeedbackColumn: "awaitingFeedback",
    doneColumn: "done",
  };
  return TaskStatus[columnId];
}

/**
 * Removes the empty state placeholder from a column if it exists
 * @param {HTMLElement} column - The column element to clear
 */
function removeEmptyStateFromColumn(column) {
  const emptyInTarget = column.querySelector(".emptyState");
  if (emptyInTarget) {
    emptyInTarget.remove();
  }
}

/**
 * Adds an empty state placeholder to a column when it has no task cards
 * @param {HTMLElement} column - The column element to update
 */
function addEmptyStateToColumn(column) {
  const tasksLeft = column.querySelectorAll(".taskCard").length;
  if (tasksLeft === 0) {
    const columnStatus = getColumnStatus(column.id);
    if (columnStatus) {
      column.innerHTML = getEmptyStateTemplate(columnStatus);
    }
  }
}

/**
 * Updates the empty state UI for both the source and target columns after a drop
 * @param {HTMLElement} fromColumn - The original column element
 * @param {HTMLElement} toColumn - The destination column element
 */
function updateEmptyStates(fromColumn, toColumn) {
  removeEmptyStateFromColumn(toColumn);
  addEmptyStateToColumn(fromColumn);
}
