/**
 * @fileoverview Drag and Drop Task Management
 * Handles task movement, status updates, and database operations
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Moves a task card to a target column with DOM manipulation and original column tracking
 * Stores original column reference, appends task card to target column, and returns source column
 * Provides task card movement functionality between columns with proper DOM updates
 * @function moveTaskToColumn
 * @param {HTMLElement} taskCard - The task card element to move between columns
 * @param {HTMLElement} targetColumn - The target column element to receive the task card
 * @returns {HTMLElement} The original column element where the task card was moved from
 */
function moveTaskToColumn(taskCard, targetColumn) {
  const originalColumn = taskCard.parentElement;
  targetColumn.appendChild(taskCard);
  return originalColumn;
}

/**
 * Updates task status in local data structure to prevent re-rendering conflicts
 * @function updateLocalTaskStatus
 * @param {string} taskId - The task ID to update
 * @param {string} newStatus - The new status value
 * @returns {void}
 */
function updateLocalTaskStatus(taskId, newStatus) {
  if (
    typeof window.allTasks !== "undefined" &&
    Array.isArray(window.allTasks)
  ) {
    const taskIndex = window.allTasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      window.allTasks[taskIndex].Status = newStatus;
    }
  }
  if (typeof window.tasks !== "undefined" && Array.isArray(window.tasks)) {
    const taskIndex = window.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      window.tasks[taskIndex].Status = newStatus;
    }
  }
}

/**
 * Sends a status update request for a dragged task with user-specific data handling
 * Delegates to user-specific task status change function for proper data persistence
 * Provides task status update functionality with user context awareness during drag operations
 * @function updateTaskStatus
 * @param {string} taskId - The unique identifier of the task being dragged for status update
 * @param {string} newStatus - The new status value to assign to the task based on target column
 * @returns {Promise<void>} Promise that resolves when the task status update is complete
 */
async function updateTaskStatus(taskId, newStatus) {
  updateLocalTaskStatus(taskId, newStatus);
  await changeStatusforDraggedTask(taskId, { Status: newStatus });
}

/**
 * Sends a patch request to update the status of a dragged task with user-specific path handling
 * Gets current user, determines appropriate database path, and sends patch request with task data
 * Provides task status update functionality with proper user context and database path resolution
 * @function changeStatusforDraggedTask
 * @param {string} taskId - The unique identifier of the task to update in database
 * @param {Object} taskData - Object containing the new status field and any additional task properties
 * @returns {Promise<Object>} Promise that resolves with the result of the patch operation from database
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
 * Executes the actual task movement between columns with validation and visual updates
 * Validates task and status, finds DOM elements, moves task, updates empty states, adds animation, and updates status
 * Provides comprehensive task movement execution with proper validation and visual feedback
 * @function executeTaskMove
 * @param {Object} dropInfo - Drop information object containing columnId and newStatus properties
 * @returns {Promise<void>} Promise that resolves when task movement and status update are complete
 */
async function executeTaskMove(dropInfo) {
  if (!currentDraggedTaskId || !dropInfo.newStatus) return;
  const taskCard = findTaskCardById(currentDraggedTaskId);
  const taskColumn = document.getElementById(dropInfo.columnId);
  if (taskCard && taskColumn) {
    const originalColumn = moveTaskToColumn(taskCard, taskColumn);
    updateEmptyStates(originalColumn, taskColumn);
    addDropAnimation(taskCard);
    await updateTaskStatus(currentDraggedTaskId, dropInfo.newStatus);
  }
}

/**
 * Executes drop operation with a specific drop zone and task ID
 * @function executeDropWithZone
 * @param {HTMLElement} dropZone - The target drop zone element
 * @param {string} taskId - The ID of the task being dropped
 * @returns {void}
 */
function executeDropWithZone(dropZone, taskId) {
  const originalTaskId = currentDraggedTaskId;
  currentDraggedTaskId = taskId;
  const fakeEvent = {
    preventDefault: () => {},
    currentTarget: dropZone,
  };
  dropToAnotherColumn(fakeEvent);
  currentDraggedTaskId = originalTaskId;
}

/**
 * Processes the drop event and moves task card between columns with comprehensive workflow
 * Prevents default behavior, extracts drop information, deactivates drop zone, executes move, and resets state
 * Provides complete drop operation processing with task movement and proper state management
 * @function dropToAnotherColumn
 * @param {Event} ev - The drop event object containing target column and event information
 * @returns {Promise<void>} Promise that resolves when drop operation and cleanup are complete
 */
async function dropToAnotherColumn(ev) {
  ev.preventDefault();
  const dropInfo = extractDropInformation(ev);
  deactivateDropZone(dropInfo.column);
  await executeTaskMove(dropInfo);
  cleanupAfterDrop();
  resetDragState();
}

/**
 * Cleans up after a drop operation with scroll restoration and animation cleanup
 * Restores normal scrolling behavior and cleans up any running animations for clean state
 * Provides post-drop cleanup functionality for proper state restoration after drag operations
 * @function cleanupAfterDrop
 * @returns {void} No return value, performs post-drop cleanup and state restoration
 */
function cleanupAfterDrop() {
  restoreScrolling();
  cleanupAnimations();
}

window.dropToAnotherColumn = dropToAnotherColumn;
