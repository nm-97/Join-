/**
 * @fileoverview Drag and Drop Utility Functions
 * Helper functions for drag and drop operations
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Checks if we're in responsive mode (mobile/tablet) where animations should be disabled
 * @function isResponsiveMode
 * @returns {boolean} True if viewport width is 1024px or less
 */
function isResponsiveMode() {
  return window.innerWidth <= 1024;
}

/**
 * Finds a task card by its unique data attribute identifier
 * @function findTaskCardById
 * @param {string} taskId - The unique identifier of the task card to find
 * @returns {HTMLElement|null} The found task card element or null if not found
 */
function findTaskCardById(taskId) {
  return document.querySelector(`[data-task-id="${taskId}"]`);
}

/**
 * Maps a column element ID to its corresponding task status key with comprehensive mapping
 * Uses mapping object to convert DOM column IDs to task status values for database updates
 * Provides column ID to status mapping functionality for proper task status assignment
 * @function getColumnStatus
 * @param {string} columnId - The DOM ID of the column element (toDoColumn, inProgressColumn, etc.)
 * @returns {string|undefined} Corresponding status key for task updates or undefined if not found
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
 * Extracts all relevant information for the drop operation with comprehensive data collection
 * Gets column ID, determines new status, and collects column element for drop processing
 * Provides drop information extraction functionality for proper task movement handling
 * @function extractDropInformation
 * @param {Event} ev - The drop event object containing current target and event data
 * @returns {Object} Drop information object containing columnId, newStatus, and column element
 */
function extractDropInformation(ev) {
  const columnId = ev.currentTarget.id;
  const newStatus = getColumnStatus(columnId);
  const column = ev.currentTarget;
  return {
    columnId,
    newStatus,
    column,
  };
}

/**
 * Removes the empty state placeholder from a column if it exists with DOM cleanup
 * Searches for empty state element within column and removes it to prepare for task cards
 * Provides empty state removal functionality for proper column content management during drops
 * @function removeEmptyStateFromColumn
 * @param {HTMLElement} column - The column element to clear of empty state placeholders
 * @returns {void} No return value, performs empty state element removal from column
 */
function removeEmptyStateFromColumn(column) {
  const emptyInTarget = column.querySelector(".emptyState");
  if (emptyInTarget) {
    emptyInTarget.remove();
  }
}

/**
 * Adds an empty state placeholder to a column when it has no task cards with template rendering
 * Checks task card count, gets column status, and renders empty state template if no tasks remain
 * Provides empty state management functionality for visual feedback when columns become empty
 * @function addEmptyStateToColumn
 * @param {HTMLElement} column - The column element to update with empty state if needed
 * @returns {void} No return value, performs conditional empty state addition based on task count
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
 * Updates the empty state UI for both the source and target columns after a drop with dual management
 * Removes empty state from target column and adds empty state to source column if needed
 * Provides comprehensive empty state management functionality for proper column visual states after drops
 * @function updateEmptyStates
 * @param {HTMLElement} fromColumn - The original column element that lost a task card
 * @param {HTMLElement} toColumn - The destination column element that received a task card
 * @returns {void} No return value, performs empty state updates for both source and target columns
 */
function updateEmptyStates(fromColumn, toColumn) {
  removeEmptyStateFromColumn(toColumn);
  addEmptyStateToColumn(fromColumn);
}
