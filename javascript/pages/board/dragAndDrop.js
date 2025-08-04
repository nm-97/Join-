/**
 * @fileoverview Drag and drop functionality for the task board
 * Handles task movement between columns with visual feedback and animations
 * @author Join Project Team
 * @version 1.0.0
 */

let currentDraggedTaskId = null;
let touchTimer = null;
let touchStart = null;
let isDragging = false;
let lastScrollTime = 0;
let animationFrame = null;

/**
 * Initiates dragging process by storing the task ID being dragged
 * @param {string} taskId - The ID of the task being dragged
 */
function startDragging(taskId) {
  currentDraggedTaskId = taskId;
  setBodyScrollState("disabled");
}

/**
 * Starts the touch drag system for mobile devices (screen width ≤ 1024px)
 * @param {TouchEvent} event - The touch start event
 * @param {string} taskId - The ID of the touched task card
 */
function handleTouchStart(event, taskId) {
  if (!isMobileDevice()) return;
  event.preventDefault();
  initializeTouchSession(event, taskId);
  startDraggingTimer(event.currentTarget);
}

/**
 * Initializes a new touch session with start position and task ID
 * @param {TouchEvent} event - The touch start event
 * @param {string} taskId - The ID of the touched task card
 */
function initializeTouchSession(event, taskId) {
  const touch = event.touches[0];
  touchStart = {
    x: touch.clientX,
    y: touch.clientY,
  };
  currentDraggedTaskId = taskId;
  isDragging = false;
}

/**
 * Starts the timer for dragging (50ms delay)
 * @param {HTMLElement} taskCard - The touched task card
 */
function startDraggingTimer(taskCard) {
  touchTimer = setTimeout(() => {
    activateDragging(taskCard);
  }, 50);
}

/**
 * Activates the dragging system and all drop zones
 * @param {HTMLElement} taskCard - The task card being dragged
 */
function activateDragging(taskCard) {
  isDragging = true;
  taskCard.classList.add("drag-over");
  setBodyScrollState("disabled");
  activateAllDropZones(taskCard.parentElement.id);
}

/**
 * Activates all columns except the current one as drop zones
 * @param {string} currentColumnId - ID of the current column (will be skipped)
 */
function activateAllDropZones(currentColumnId) {
  document.querySelectorAll('[id$="Column"]').forEach((column) => {
    if (column.id !== currentColumnId) {
      activateDropZone(column);
    }
  });
}

/**
 * Processes finger movement during touch dragging
 * @param {TouchEvent} event - The touch move event with finger coordinates
 */
function handleTouchMove(event) {
  if (!isMobileDevice() || !touchStart) return;
  const touch = event.touches[0];
  if (shouldCancelDragging(touch)) {
    handleTouchEnd();
    return;
  }
  optimizeAnimationFrame(() => {
    if (isDragging) {
      processTouchDragging(touch);
    }
  });
}

/**
 * Checks if dragging should be cancelled (too much movement before dragging starts)
 * @param {Touch} touch - The current touch position
 * @returns {boolean} True if dragging should be cancelled
 */
function shouldCancelDragging(touch) {
  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return distance > 80 && !isDragging;
}

/**
 * Optimizes animation performance through requestAnimationFrame
 * @param {Function} callback - The function to execute
 */
function optimizeAnimationFrame(callback) {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  animationFrame = requestAnimationFrame(callback);
}

/**
 * Processes active touch dragging (auto-scroll and drop zone detection)
 * @param {Touch} touch - The current touch position
 */
function processTouchDragging(touch) {
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  const column = elementBelow?.closest('[id$="Column"]');
  handleAutoScroll(touch);
  handleDropZoneDetection(column);
}

/**
 * Handles automatic scrolling at screen edges
 * @param {Touch} touch - The current touch position
 */
function handleAutoScroll(touch) {
  const now = Date.now();
  const scrollThreshold = 120;
  const windowHeight = window.innerHeight;
  if (now - lastScrollTime > 16) {
    if (touch.clientY > windowHeight - scrollThreshold) {
      enableScrolling();
      window.scrollBy({ top: 8, behavior: "smooth" });
    } else if (touch.clientY < scrollThreshold) {
      enableScrolling();
      window.scrollBy({ top: -8, behavior: "smooth" });
    } else {
      disableScrolling();
    }
    lastScrollTime = now;
  }
}

/**
 * Enables scrolling for auto-scroll functionality
 */
function enableScrolling() {
  setBodyScrollState("enabled");
}

/**
 * Disables scrolling during dragging
 */
function disableScrolling() {
  setBodyScrollState("disabled");
}

/**
 * Handles drop zone detection under the finger
 * @param {HTMLElement|null} column - The column under the finger (or null)
 */
function handleDropZoneDetection(column) {
  if (column) {
    clearOtherDragOverEffects(column);
    if (!column.classList.contains("drag-over")) {
      activateDropZone(column);
    }
  } else {
    clearAllDragOverEffects();
  }
}

/**
 * Handles the end of touch event and executes drop operation
 * @param {TouchEvent} event - Touch end event
 */
function handleTouchEnd(event) {
  if (!isMobileDevice()) return;
  cleanupTouchTimer();
  cleanupTaskCard();
  executeDropIfActive();
  cleanupTouchSession();
  restoreScrolling();
}

/**
 * Cleans up the touch timer
 */
function cleanupTouchTimer() {
  if (touchTimer) {
    clearTimeout(touchTimer);
    touchTimer = null;
  }
}

/**
 * Finds a task card by its ID
 * @param {string} taskId - The ID of the task card
 * @returns {HTMLElement|null} The found task card or null
 */
function findTaskCardById(taskId) {
  return document.querySelector(`[data-task-id="${taskId}"]`);
}

/**
 * Removes visual feedback from the task card
 */
function cleanupTaskCard() {
  if (currentDraggedTaskId) {
    const taskCard = findTaskCardById(currentDraggedTaskId);
    if (taskCard) {
      taskCard.classList.remove("drag-over");
    }
  }
}

/**
 * Executes drop operation if dragging was active
 */
function executeDropIfActive() {
  if (isDragging) {
    const activeDropZone = document.querySelector(".drag-over[id$='Column']");
    if (activeDropZone && currentDraggedTaskId) {
      const fakeEvent = {
        preventDefault: () => {},
        currentTarget: activeDropZone,
      };
      dropToAnotherColumn(fakeEvent);
    }
  }
}

/**
 * Cleans up all touch session data and animations
 */
function cleanupTouchSession() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  clearAllDragOverEffects();
  touchStart = null;
  isDragging = false;
  currentDraggedTaskId = null;
}

/**
 * Restores normal scroll behavior
 */
function restoreScrolling() {
  setBodyScrollState("restore");
}

/**
 * Clears all drag-over visual effects from all columns
 */
function clearAllDragOverEffects() {
  document.querySelectorAll(".drag-over").forEach((col) => {
    removeDragOverClasses(col);
  });
}

/**
 * Clears drag-over effects from all columns except the current one
 * @param {HTMLElement} currentColumn - The column to keep the drag-over effect on
 */
function clearOtherDragOverEffects(currentColumn) {
  document.querySelectorAll(".drag-over").forEach((col) => {
    if (col !== currentColumn) {
      removeDragOverClasses(col);
    }
  });
}

/**
 * Activates the drop zone visual effect with animation
 * @param {HTMLElement} column - The column element to activate as drop zone
 */
function activateDropZone(column) {
  column.classList.add("drag-over");
  addTemporaryClass(column, "drop-zone-active", 400);
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
  addTemporaryClass(column, "drop-zone-deactivate", 200);
  column.classList.remove("drag-over");
  column.classList.remove("drop-zone-active");
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
 * Resets all drag states after a drop operation
 */
function resetDragState() {
  resetBasicDragStates();
  cleanupTouchTimer();
  removeTaskCardVisualFeedback();
  cleanupAnimations();
  restoreScrolling();
}

/**
 * Resets basic drag states
 */
function resetBasicDragStates() {
  currentDraggedTaskId = null;
  touchStart = null;
  isDragging = false;
}

/**
 * Sets the scroll state of the body element
 * @param {string} scrollState - "disabled", "enabled" or "restore"
 */
function setBodyScrollState(scrollState) {
  document.body.classList.remove(
    "drag-scroll-disabled",
    "drag-scroll-enabled",
    "drag-scroll-restore"
  );
  if (scrollState !== "restore") {
    document.body.classList.add(`drag-scroll-${scrollState}`);
  } else {
    addTemporaryClass(document.body, "drag-scroll-restore", 300);
  }
}

/**
 * Removes drag-over classes from an element
 * @param {HTMLElement} element - The element to remove classes from
 */
function removeDragOverClasses(element) {
  element.classList.remove("drag-over", "drop-zone-active");
}

/**
 * Adds CSS classes to an element and removes them after a delay
 * @param {HTMLElement} element - The element
 * @param {string} className - The CSS class
 * @param {number} duration - Duration in milliseconds
 */
function addTemporaryClass(element, className, duration) {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

/**
 * Removes visual feedback from all task cards with smooth animation
 */
function removeTaskCardVisualFeedback() {
  document.querySelectorAll(".taskCard.drag-over").forEach((card) => {
    addTemporaryClass(card, "task-card-smooth-transition", 200);
    card.classList.remove("drag-over");
  });
}

/**
 * Stops and cleans up all running animations
 */
function cleanupAnimations() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

/**
 * Applies a drop animation to a task card and removes it after animation
 * @param {HTMLElement} taskCard - The task card element to animate
 */
function addDropAnimation(taskCard) {
  addTemporaryClass(taskCard, "task-dropped", 200);
}

/**
 * Processes the drop event and moves task card between columns
 * @param {Event} ev - The drop event object
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
 * Extracts all relevant information for the drop operation
 * @param {Event} ev - The drop event object
 * @returns {Object} Drop information (columnId, newStatus, column)
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
 * Executes the actual task movement between columns
 * @param {Object} dropInfo - Drop information (columnId, newStatus)
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
 * Cleans up after a drop operation (scroll restoration and animations)
 */
function cleanupAfterDrop() {
  restoreScrolling();
  cleanupAnimations();
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
