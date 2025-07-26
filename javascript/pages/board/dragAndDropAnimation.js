/**
 * @fileoverview Animation handlers for drag and drop functionality
 * Manages drag events and status updates for tasks being moved between columns
 * @author Join Project Team
 * @version 1.0.0
 */

let currentDraggedTaskId = null;

/**
 * Handles the start of a drag operation
 * @param {Event} event - The drag start event
 */
function handleDragStart(event) {
  const taskElement = event.target.closest(".taskCard");
  if (!taskElement) return;
  currentDraggedTaskId = taskElement.dataset.taskId;
}

/**
 * Handles drag over events to allow dropping
 * @param {Event} event - The drag over event
 */
function handleDragOver(event) {
  event.preventDefault();
}

/**
 * Handles the drop event and updates task status
 * @param {Event} event - The drop event
 */
async function handleDrop(event) {
  event.preventDefault();
  const columnElement = event.target.closest(".columnContent");
  if (!columnElement || !currentDraggedTaskId) return;
  const columnId = columnElement.closest(".column").id;
  const newStatus = getColumnStatus(columnId);
  await changeStatusforDraggedTask(currentDraggedTaskId, newStatus);
  await initializeBoard();
  currentDraggedTaskId = null;
}
