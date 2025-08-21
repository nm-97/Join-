/**
 * @fileoverview Drag Event Handling
 * Manages pointer events, event listeners, and event processing
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Initiates pointer-based drag operation for task cards
 * @function startPointerDrag
 * @param {string} taskId - The ID of the task to drag
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function startPointerDrag(taskId, event) {
  if (!event.isPrimary) return;
  event.preventDefault();

  const taskCard = event.currentTarget;
  initializeDragOperation(taskId, taskCard, event);
  setupTouchHandling(event);
  attachDragEventListeners(taskCard);
}

/**
 * Initializes the drag operation with basic state
 * @function initializeDragOperation
 * @param {string} taskId - The task ID
 * @param {HTMLElement} taskCard - The task card element
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function initializeDragOperation(taskId, taskCard, event) {
  setCurrentDraggedTaskId(taskId);
  setDraggedElement(taskCard);
  setPointerStart({
    x: event.clientX,
    y: event.clientY,
    time: Date.now(),
  });
  setIsDragging(false);
}

/**
 * Sets up touch handling if needed
 * @function setupTouchHandling
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function setupTouchHandling(event) {
  if (event.pointerType === "touch" || isResponsiveMode()) {
    addScrollPrevention();
  }
}

/**
 * Attaches drag-related event listeners to the task card
 * @function attachDragEventListeners
 * @param {HTMLElement} taskCard - The task card element
 * @returns {void}
 */
function attachDragEventListeners(taskCard) {
  taskCard.addEventListener("pointermove", onPointerMove);
  taskCard.addEventListener("pointerup", onPointerUp);
  taskCard.addEventListener("pointercancel", onPointerUp);
}

/**
 * Removes drag-related event listeners
 * @function removeEventListeners
 * @returns {void}
 */
function removeEventListeners() {
  const draggedElement = getDraggedElement();
  if (!draggedElement) return;

  draggedElement.removeEventListener("pointermove", onPointerMove);
  draggedElement.removeEventListener("pointerup", onPointerUp);
  draggedElement.removeEventListener("pointercancel", onPointerUp);
}

/**
 * Sets up pointer capture for the drag operation
 * @function setupPointerCapture
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function setupPointerCapture(event) {
  const draggedElement = getDraggedElement();
  if (!draggedElement) return;

  try {
    draggedElement.setPointerCapture(event.pointerId);
  } catch (e) {
    console.warn("Could not capture pointer:", e);
  }
}

/**
 * Releases pointer capture safely
 * @function releasePointerCapture
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function releasePointerCapture(event) {
  const draggedElement = getDraggedElement();
  if (!draggedElement || !getIsDragging()) return;

  try {
    draggedElement.releasePointerCapture(event.pointerId);
  } catch (e) {}
}

/**
 * Handles task card clicks, preventing clicks after drag operations
 * @function handleTaskCardClick
 * @param {string} taskId - The ID of the task
 * @param {Event} event - The click event
 * @returns {void}
 */
function handleTaskCardClick(taskId, event) {
  if (getDragJustCompleted()) {
    event.preventDefault();
    event.stopPropagation();
    setDragJustCompleted(false);
    return;
  }
  showTaskDetail(taskId);
}

/**
 * Simulates a click event for quick clicks
 * @function simulateClickEvent
 * @param {PointerEvent} event - The original pointer event
 * @returns {void}
 */
function simulateClickEvent(event) {
  const clickEvent = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    clientX: event.clientX,
    clientY: event.clientY,
  });
  requestAnimationFrame(() => {
    event.target.dispatchEvent(clickEvent);
  });
}

/**
 * Sets drag just completed flag with timeout
 * @function setDragJustCompletedWithTimeout
 * @returns {void}
 */
function setDragJustCompletedWithTimeout() {
  setDragJustCompleted(true);
  setTimeout(() => {
    setDragJustCompleted(false);
  }, 100);
}

/**
 * Legacy compatibility function for older templates
 * @function startDragging
 * @param {string} taskId - The task ID to start dragging
 * @returns {void}
 */
function startDragging(taskId) {
  setCurrentDraggedTaskId(taskId);
  setBodyScrollState("disabled");
}

window.startPointerDrag = startPointerDrag;
window.handleTaskCardClick = handleTaskCardClick;
window.startDragging = startDragging;
