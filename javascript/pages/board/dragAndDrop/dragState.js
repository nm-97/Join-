/**
 * @fileoverview Drag and Drop State Management
 * Manages all drag-related state variables and state transitions
 * @author Join Project Team
 * @version 1.0.0
 */

let currentDraggedTaskId = null;
let isDragging = false;
let draggedElement = null;
let pointerStart = null;
let animationFrame = null;
let lastMoveTime = 0;
let dragJustCompleted = false;

/**
 * Gets the current dragged task ID
 * @function getCurrentDraggedTaskId
 * @returns {string|null} The current dragged task ID
 */
function getCurrentDraggedTaskId() {
  return currentDraggedTaskId;
}

/**
 * Sets the current dragged task ID
 * @function setCurrentDraggedTaskId
 * @param {string|null} taskId - The task ID to set
 * @returns {void}
 */
function setCurrentDraggedTaskId(taskId) {
  currentDraggedTaskId = taskId;
}

/**
 * Gets the current dragging state
 * @function getIsDragging
 * @returns {boolean} True if currently dragging
 */
function getIsDragging() {
  return isDragging;
}

/**
 * Sets the dragging state
 * @function setIsDragging
 * @param {boolean} dragging - The dragging state
 * @returns {void}
 */
function setIsDragging(dragging) {
  isDragging = dragging;
}

/**
 * Gets the current dragged element
 * @function getDraggedElement
 * @returns {HTMLElement|null} The dragged element
 */
function getDraggedElement() {
  return draggedElement;
}

/**
 * Sets the dragged element
 * @function setDraggedElement
 * @param {HTMLElement|null} element - The element to set
 * @returns {void}
 */
function setDraggedElement(element) {
  draggedElement = element;
}

/**
 * Gets the pointer start position
 * @function getPointerStart
 * @returns {Object|null} The pointer start position
 */
function getPointerStart() {
  return pointerStart;
}

/**
 * Sets the pointer start position
 * @function setPointerStart
 * @param {Object|null} start - The start position object
 * @returns {void}
 */
function setPointerStart(start) {
  pointerStart = start;
}

/**
 * Gets the current animation frame ID
 * @function getAnimationFrame
 * @returns {number|null} The animation frame ID
 */
function getAnimationFrame() {
  return animationFrame;
}

/**
 * Sets the animation frame ID
 * @function setAnimationFrame
 * @param {number|null} frameId - The animation frame ID
 * @returns {void}
 */
function setAnimationFrame(frameId) {
  animationFrame = frameId;
}

/**
 * Gets the last move time
 * @function getLastMoveTime
 * @returns {number} The last move time
 */
function getLastMoveTime() {
  return lastMoveTime;
}

/**
 * Sets the last move time
 * @function setLastMoveTime
 * @param {number} time - The time to set
 * @returns {void}
 */
function setLastMoveTime(time) {
  lastMoveTime = time;
}

/**
 * Gets the drag just completed flag
 * @function getDragJustCompleted
 * @returns {boolean} True if drag just completed
 */
function getDragJustCompleted() {
  return dragJustCompleted;
}

/**
 * Sets the drag just completed flag
 * @function setDragJustCompleted
 * @param {boolean} completed - The completed state
 * @returns {void}
 */
function setDragJustCompleted(completed) {
  dragJustCompleted = completed;
}

/**
 * Resets all drag-related variables to initial state
 * @function resetDragVariables
 * @returns {void}
 */
function resetDragVariables() {
  currentDraggedTaskId = null;
  draggedElement = null;
  pointerStart = null;
  isDragging = false;
}

/**
 * Captures current drag state before cleanup
 * @function captureDragState
 * @returns {Object} Current drag state
 */
function captureDragState() {
  return {
    wasDragging: isDragging,
    taskId: currentDraggedTaskId,
  };
}

/**
 * Checks if all required drag state is present
 * @function hasValidDragState
 * @returns {boolean} True if drag state is valid
 */
function hasValidDragState() {
  return draggedElement && pointerStart && currentDraggedTaskId;
}

/**
 * Resets all drag states after a drop operation with comprehensive cleanup
 * @function resetDragState
 * @returns {void}
 */
function resetDragState() {
  resetDragVariables();
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}
