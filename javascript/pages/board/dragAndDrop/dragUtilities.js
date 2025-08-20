/**
 * @fileoverview Drag Utility Functions
 * Helper functions for drag calculations, validations, and measurements
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Checks if pointer movement should be processed
 * @function shouldProcessPointerMove
 * @returns {boolean} True if movement should be processed
 */
function shouldProcessPointerMove() {
  const isDragging = getIsDragging();
  const pointerStart = getPointerStart();
  const draggedElement = getDraggedElement();
  const currentDraggedTaskId = getCurrentDraggedTaskId();

  return (isDragging || pointerStart) && draggedElement && currentDraggedTaskId;
}

/**
 * Throttles movement updates for performance
 * @function shouldThrottleMovement
 * @returns {boolean} True if movement should proceed
 */
function shouldThrottleMovement() {
  const now = performance.now();
  const lastMoveTime = getLastMoveTime();

  if (now - lastMoveTime < 16) return false;
  setLastMoveTime(now);
  return true;
}

/**
 * Calculates drag distance from start position
 * @function calculateDragDistance
 * @param {PointerEvent} event - The pointer event
 * @returns {number} Distance in pixels
 */
function calculateDragDistance(event) {
  const pointerStart = getPointerStart();
  if (!pointerStart) return 0;

  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Determines if dragging should start based on distance
 * @function shouldStartDragging
 * @param {number} distance - Current drag distance
 * @returns {boolean} True if dragging should start
 */
function shouldStartDragging(distance) {
  const dragThreshold = isResponsiveMode() ? 8 : 5;
  return distance > dragThreshold;
}

/**
 * Calculates drag metrics for determining drag type
 * @function calculateDragMetrics
 * @param {PointerEvent} event - The pointer event
 * @returns {Object} Drag metrics object
 */
function calculateDragMetrics(event) {
  const pointerStart = getPointerStart();
  if (!pointerStart) return { timeDiff: 0, deltaX: 0, deltaY: 0, distance: 0 };

  const timeDiff = Date.now() - pointerStart.time;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  return { timeDiff, deltaX, deltaY, distance };
}

/**
 * Determines if the interaction was a quick click
 * @function isQuickClick
 * @param {Object} metrics - Drag metrics
 * @returns {boolean} True if it was a quick click
 */
function isQuickClick(metrics) {
  return metrics.timeDiff < 200 && metrics.distance < 5;
}

/**
 * Finds the active drop zone under the pointer
 * @function findActiveDropZone
 * @param {PointerEvent} event - The pointer event
 * @returns {HTMLElement|null} The active drop zone element
 */
function findActiveDropZone(event) {
  if (!getIsDragging()) return null;

  const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
  return elementBelow?.closest('[id$="Column"]');
}

/**
 * Schedules drop zone detection and auto-scroll updates
 * @function scheduleDropZoneUpdates
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function scheduleDropZoneUpdates(event) {
  const currentFrame = getAnimationFrame();
  if (currentFrame) {
    cancelAnimationFrame(currentFrame);
  }

  const newFrame = requestAnimationFrame(() => {
    handleAutoScrollPointer(event);
    handleDropZoneDetection(event);
    setAnimationFrame(null);
  });

  setAnimationFrame(newFrame);
}

/**
 * Stops all running animations and removes scroll prevention
 * @function stopAnimations
 * @returns {void}
 */
function stopAnimations() {
  removeScrollPrevention();
  const animationFrame = getAnimationFrame();
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    setAnimationFrame(null);
  }
}

/**
 * Stops and cleans up all running animations with frame cancellation
 * @function cleanupAnimations
 * @returns {void}
 */
function cleanupAnimations() {
  const animationFrame = getAnimationFrame();
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    setAnimationFrame(null);
  }
}

/**
 * Gets the drag threshold based on device type
 * @function getDragThreshold
 * @returns {number} Threshold in pixels
 */
function getDragThreshold() {
  return isResponsiveMode() ? 8 : 5;
}

/**
 * Validates if drag can start with current conditions
 * @function canStartDrag
 * @param {PointerEvent} event - The pointer event
 * @returns {boolean} True if drag can start
 */
function canStartDrag(event) {
  return event.isPrimary && hasValidDragState();
}

/**
 * Gets the center point of an element
 * @function getElementCenter
 * @param {HTMLElement} element - The element
 * @returns {Object} Center coordinates {x, y}
 */
function getElementCenter(element) {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}
