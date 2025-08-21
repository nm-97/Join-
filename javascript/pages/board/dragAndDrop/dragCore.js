/**
 * @fileoverview Drag and Drop Core Orchestrator
 * Main coordination of drag operations using modular components
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Handles pointer movement during drag operation
 * @function onPointerMove
 * @param {PointerEvent} event - The pointer move event
 * @returns {void}
 */
function onPointerMove(event) {
  if (!shouldProcessPointerMove()) return;
  if (!shouldThrottleMovement()) return;

  event.preventDefault();
  event.stopPropagation();

  const dragDistance = calculateDragDistance(event);

  if (!getIsDragging() && shouldStartDragging(dragDistance)) {
    startDragMode(event);
  }

  if (getIsDragging() && getDraggedElement()) {
    updateDragClonePosition(event);
    scheduleDropZoneUpdates(event);
  }
}

/**
 * Activates drag mode with visual feedback
 * @function startDragMode
 * @param {PointerEvent} event - The pointer event that triggered drag mode
 * @returns {void}
 */
function startDragMode(event) {
  setIsDragging(true);
  setupPointerCapture(event);
  event.stopPropagation();
  setupDragEnvironment();
  createDragClone();
  setupDragStyles();
  activateDropZones();
}

/**
 * Sets up the drag environment and scroll prevention
 * @function setupDragEnvironment
 * @returns {void}
 */
function setupDragEnvironment() {
  addScrollPrevention();
  if (isResponsiveMode()) {
    document.body.classList.add("dragTouchDisabled");
  }
  document.body.classList.add("dragScrollingPrevention");
  setBodyScrollState("disabled");
}

/**
 * Sets up drag-related CSS classes on the original element
 * @function setupDragStyles
 * @returns {void}
 */
function setupDragStyles() {
  const draggedElement = getDraggedElement();
  if (draggedElement) {
    draggedElement.classList.add("dragElementActive", "dragOriginalHidden");
  }
}

/**
 * Activates all drop zones for the current drag operation
 * @function activateDropZones
 * @returns {void}
 */
function activateDropZones() {
  const draggedElement = getDraggedElement();
  if (draggedElement && draggedElement.parentElement) {
    const parentColumnId = draggedElement.parentElement.id;
    activateAllDropZones(parentColumnId);
  }
}

/**
 * Handles pointer up/cancel events to end dragging
 * @function onPointerUp
 * @param {PointerEvent} event - The pointer up/cancel event
 * @returns {void}
 */
function onPointerUp(event) {
  if (!getDraggedElement() || !getPointerStart()) return;

  const dragMetrics = calculateDragMetrics(event);
  const wasQuickClick = isQuickClick(dragMetrics);

  event.preventDefault();
  event.stopImmediatePropagation();

  releasePointerCapture(event);
  removeEventListeners();

  const dragState = captureDragState();
  const activeDropZone = findActiveDropZone(event);

  cleanupDragState();

  handleDragCompletion(dragState, activeDropZone, wasQuickClick, event);
}

/**
 * Handles completion of drag operation
 * @function handleDragCompletion
 * @param {Object} dragState - Captured drag state
 * @param {HTMLElement|null} activeDropZone - Active drop zone
 * @param {boolean} wasQuickClick - Whether it was a quick click
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function handleDragCompletion(dragState, activeDropZone, wasQuickClick, event) {
  if (dragState.wasDragging && activeDropZone && dragState.taskId) {
    executeDropWithZone(activeDropZone, dragState.taskId);
    setDragJustCompletedWithTimeout();
  } else if (wasQuickClick) {
    simulateClickEvent(event);
  }
}

/**
 * Cleans up all drag-related state and visual effects
 * @function cleanupDragState
 * @returns {void}
 */
function cleanupDragState() {
  const tempDraggedElement = getDraggedElement();

  removeDragClone();
  clearCSSProperties();
  resetDragVariables();
  stopAnimations();
  restoreScrolling();
  resetElementStyles(tempDraggedElement);
  clearAllDragOverEffects();
  setBodyScrollState("restore");
}

/**
 * Restores scrolling by removing drag-related CSS classes
 * @function restoreScrolling
 * @returns {void}
 */
function restoreScrolling() {
  document.body.classList.remove(
    "dragScrollingPrevention",
    "dragTouchDisabled"
  );
}

/**
 * Resets element styles and reinitializes drop zones
 * @function resetElementStyles
 * @param {HTMLElement} element - The dragged element to reset
 * @returns {void}
 */
function resetElementStyles(element) {
  if (!element) return;

  element.classList.remove(
    "dragOver",
    "dragElementActive",
    "dragOriginalHidden"
  );
  element.classList.add("dragElementReset");

  setTimeout(() => {
    element.classList.remove("dragElementReset");
    if (typeof initializeDropZones === "function") {
      initializeDropZones();
    }
  }, 300);

  element.offsetHeight; // Force reflow
}
