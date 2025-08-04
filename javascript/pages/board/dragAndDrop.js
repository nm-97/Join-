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
 * Initiates dragging process by storing the task ID being dragged and disabling scroll
 * Sets current dragged task ID for tracking and disables body scrolling during drag operation
 * Provides drag initiation with scroll state management for better user experience
 * @function startDragging
 * @param {string} taskId - The unique identifier of the task being dragged for tracking purposes
 * @returns {void} No return value, performs drag state initialization and scroll management
 */
function startDragging(taskId) {
  currentDraggedTaskId = taskId;
  setBodyScrollState("disabled");
}

/**
 * Starts the touch drag system for mobile devices with device detection and session initialization
 * Checks for mobile device, prevents default behavior, and initializes touch drag session
 * Provides mobile-specific drag handling with touch position tracking and timer setup
 * @function handleTouchStart
 * @param {TouchEvent} event - The touch start event containing finger position and target data
 * @param {string} taskId - The unique identifier of the touched task card for drag tracking
 * @returns {void} No return value, performs mobile touch drag initialization
 */
function handleTouchStart(event, taskId) {
  if (!isMobileDevice()) return;
  event.preventDefault();
  initializeTouchSession(event, taskId);
  startDraggingTimer(event.currentTarget);
}

/**
 * Initializes a new touch session with start position and task ID for drag tracking
 * Extracts touch coordinates, stores start position, and sets up initial drag state
 * Provides touch session initialization with coordinate tracking and drag state management
 * @function initializeTouchSession
 * @param {TouchEvent} event - The touch start event containing touch position data
 * @param {string} taskId - The unique identifier of the touched task card for tracking
 * @returns {void} No return value, performs touch session state initialization
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
 * Starts the timer for dragging with 50ms delay before activation
 * Sets timeout to activate dragging after brief delay for better touch responsiveness
 * Provides delayed drag activation to distinguish between tap and drag gestures
 * @function startDraggingTimer
 * @param {HTMLElement} taskCard - The touched task card element to activate dragging for
 * @returns {void} No return value, performs timer-based drag activation setup
 */
function startDraggingTimer(taskCard) {
  touchTimer = setTimeout(() => {
    activateDragging(taskCard);
  }, 50);
}

/**
 * Activates the dragging system and all drop zones with visual feedback
 * Sets dragging state, adds visual feedback to task card, disables scrolling, and activates drop zones
 * Provides complete drag activation with UI feedback and drop zone preparation
 * @function activateDragging
 * @param {HTMLElement} taskCard - The task card element being dragged for visual feedback
 * @returns {void} No return value, performs drag activation and drop zone setup
 */
function activateDragging(taskCard) {
  isDragging = true;
  taskCard.classList.add("drag-over");
  setBodyScrollState("disabled");
  activateAllDropZones(taskCard.parentElement.id);
}

/**
 * Activates all columns except the current one as drop zones for task placement
 * Finds all column elements and activates them as drop zones excluding the source column
 * Provides selective drop zone activation to prevent dropping on same column
 * @function activateAllDropZones
 * @param {string} currentColumnId - ID of the current column to skip from activation
 * @returns {void} No return value, performs drop zone activation for valid target columns
 */
function activateAllDropZones(currentColumnId) {
  document.querySelectorAll('[id$="Column"]').forEach((column) => {
    if (column.id !== currentColumnId) {
      activateDropZone(column);
    }
  });
}

/**
 * Processes finger movement during touch dragging with movement validation and optimization
 * Checks device compatibility, validates touch session, cancels invalid drags, and processes active dragging
 * Provides comprehensive touch movement handling with performance optimization and drag validation
 * @function handleTouchMove
 * @param {TouchEvent} event - The touch move event with finger coordinates and movement data
 * @returns {void} No return value, performs touch movement processing and drag operations
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
 * Checks if dragging should be cancelled due to excessive movement before drag activation
 * Calculates distance moved from start position and cancels if threshold exceeded without active dragging
 * Provides drag cancellation logic to distinguish between intentional drags and accidental movements
 * @function shouldCancelDragging
 * @param {Touch} touch - The current touch position containing clientX and clientY coordinates
 * @returns {boolean} True if dragging should be cancelled due to excessive movement, false otherwise
 */
function shouldCancelDragging(touch) {
  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return distance > 80 && !isDragging;
}

/**
 * Optimizes animation performance through requestAnimationFrame with frame cancellation
 * Cancels previous animation frame and requests new one for smooth performance optimization
 * Provides animation frame management to prevent performance issues during frequent updates
 * @function optimizeAnimationFrame
 * @param {Function} callback - The function to execute within the animation frame
 * @returns {void} No return value, performs animation frame optimization and callback execution
 */
function optimizeAnimationFrame(callback) {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }
  animationFrame = requestAnimationFrame(callback);
}

/**
 * Processes active touch dragging with auto-scroll and drop zone detection functionality
 * Finds element under touch, identifies target column, handles automatic scrolling, and detects drop zones
 * Provides comprehensive active drag processing with scroll management and target detection
 * @function processTouchDragging
 * @param {Touch} touch - The current touch position containing coordinate and movement data
 * @returns {void} No return value, performs active drag processing and UI updates
 */
function processTouchDragging(touch) {
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  const column = elementBelow?.closest('[id$="Column"]');
  handleAutoScroll(touch);
  handleDropZoneDetection(column);
}

/**
 * Handles automatic scrolling at screen edges with timing optimization and threshold detection
 * Checks timing constraints, detects edge proximity, and triggers appropriate scroll actions
 * Provides smooth auto-scroll functionality for better drag and drop user experience
 * @function handleAutoScroll
 * @param {Touch} touch - The current touch position containing clientY coordinate for edge detection
 * @returns {void} No return value, performs automatic scrolling based on touch position
 */
function handleAutoScroll(touch) {
  const now = Date.now();
  const scrollThreshold = 120;
  const windowHeight = window.innerHeight;
  if (now - lastScrollTime > 16) {
    performScrollBasedOnPosition(touch, scrollThreshold, windowHeight);
    lastScrollTime = now;
  }
}

/**
 * Performs scrolling based on touch position relative to screen edges
 * @function performScrollBasedOnPosition
 * @param {Touch} touch - The current touch position
 * @param {number} scrollThreshold - The edge threshold for triggering scroll
 * @param {number} windowHeight - The current window height
 * @returns {void} No return value, performs position-based scrolling
 */
function performScrollBasedOnPosition(touch, scrollThreshold, windowHeight) {
  if (touch.clientY > windowHeight - scrollThreshold) {
    enableScrolling();
    window.scrollBy({ top: 8, behavior: "smooth" });
  } else if (touch.clientY < scrollThreshold) {
    enableScrolling();
    window.scrollBy({ top: -8, behavior: "smooth" });
  } else {
    disableScrolling();
  }
}

/**
 * Enables scrolling for auto-scroll functionality during drag operations
 * Sets body scroll state to enabled for automatic scrolling at screen edges
 * Provides scroll enabling functionality for smooth drag and drop auto-scroll behavior
 * @function enableScrolling
 * @returns {void} No return value, performs scroll state enabling for auto-scroll operations
 */
function enableScrolling() {
  setBodyScrollState("enabled");
}

/**
 * Disables scrolling during dragging to prevent unwanted page movement
 * Sets body scroll state to disabled for controlled drag and drop experience
 * Provides scroll disabling functionality to maintain focus during drag operations
 * @function disableScrolling
 * @returns {void} No return value, performs scroll state disabling for drag control
 */
function disableScrolling() {
  setBodyScrollState("disabled");
}

/**
 * Handles drop zone detection under the finger with visual feedback management
 * Clears other drop zone effects, activates current drop zone, or clears all effects based on detection
 * Provides dynamic drop zone detection with proper visual state management during dragging
 * @function handleDropZoneDetection
 * @param {HTMLElement|null} column - The column element under the finger or null if none detected
 * @returns {void} No return value, performs drop zone detection and visual feedback management
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
 * Handles the end of touch event and executes drop operation with comprehensive cleanup
 * Performs device check, cleans up timers and cards, executes drop if active, and restores normal state
 * Provides complete touch end handling with proper cleanup and drop execution
 * @function handleTouchEnd
 * @param {TouchEvent} event - Touch end event containing touch completion data
 * @returns {void} No return value, performs touch end processing and state cleanup
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
 * Cleans up the touch timer to prevent delayed drag activation
 * Clears the timeout timer and resets timer variable to prevent unwanted drag activation
 * Provides timer cleanup functionality for proper touch session management
 * @function cleanupTouchTimer
 * @returns {void} No return value, performs touch timer cleanup and variable reset
 */
function cleanupTouchTimer() {
  if (touchTimer) {
    clearTimeout(touchTimer);
    touchTimer = null;
  }
}

/**
 * Finds a task card by its unique data attribute identifier
 * Searches the DOM for task card element using data-task-id attribute selector
 * Provides task card element retrieval functionality for drag and drop operations
 * @function findTaskCardById
 * @param {string} taskId - The unique identifier of the task card to find
 * @returns {HTMLElement|null} The found task card element or null if not found
 */
function findTaskCardById(taskId) {
  return document.querySelector(`[data-task-id="${taskId}"]`);
}

/**
 * Removes visual feedback from the task card after drag operation completion
 * Finds the currently dragged task card and removes drag-over visual styling class
 * Provides task card visual cleanup functionality for proper drag operation finalization
 * @function cleanupTaskCard
 * @returns {void} No return value, performs task card visual feedback removal
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
 * Executes drop operation if dragging was active with drop zone detection and fake event creation
 * Checks for active dragging state, finds active drop zone, and executes drop with simulated event
 * Provides conditional drop execution functionality for touch-based drag and drop completion
 * @function executeDropIfActive
 * @returns {void} No return value, performs conditional drop operation execution
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
 * Cleans up all touch session data and animations with comprehensive state reset
 * Cancels animation frames, clears drag effects, resets touch variables, and clears drag state
 * Provides complete touch session cleanup functionality for proper drag operation finalization
 * @function cleanupTouchSession
 * @returns {void} No return value, performs comprehensive touch session data cleanup
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
 * Restores normal scroll behavior after drag operation completion
 * Sets body scroll state to restore for returning to normal scrolling functionality
 * Provides scroll behavior restoration functionality after drag and drop operations
 * @function restoreScrolling
 * @returns {void} No return value, performs scroll behavior restoration to normal state
 */
function restoreScrolling() {
  setBodyScrollState("restore");
}

/**
 * Clears all drag-over visual effects from all columns with class removal
 * Finds all elements with drag-over class and removes drag-related styling classes
 * Provides comprehensive visual effect cleanup functionality for drag operation completion
 * @function clearAllDragOverEffects
 * @returns {void} No return value, performs drag-over visual effects removal from all elements
 */
function clearAllDragOverEffects() {
  document.querySelectorAll(".drag-over").forEach((col) => {
    removeDragOverClasses(col);
  });
}

/**
 * Clears drag-over effects from all columns except the current one with selective cleanup
 * Iterates through all drag-over elements and removes effects from non-current columns only
 * Provides selective visual effect cleanup functionality to maintain current column highlighting
 * @function clearOtherDragOverEffects
 * @param {HTMLElement} currentColumn - The column element to keep the drag-over effect on
 * @returns {void} No return value, performs selective drag-over effect removal
 */
function clearOtherDragOverEffects(currentColumn) {
  document.querySelectorAll(".drag-over").forEach((col) => {
    if (col !== currentColumn) {
      removeDragOverClasses(col);
    }
  });
}

/**
 * Activates the drop zone visual effect with animation and styling classes
 * Adds drag-over class to column and applies temporary active animation with timing
 * Provides drop zone activation functionality with visual feedback and animation effects
 * @function activateDropZone
 * @param {HTMLElement} column - The column element to activate as drop zone with visual feedback
 * @returns {void} No return value, performs drop zone activation with visual styling
 */
function activateDropZone(column) {
  column.classList.add("drag-over");
  addTemporaryClass(column, "drop-zone-active", 400);
}

/**
 * Handles drag over event for column elements with visual feedback management
 * Prevents default behavior, clears other column effects, and activates current drop zone
 * Provides drag over event handling with proper visual state management during dragging
 * @function moveToAnotherColumn
 * @param {Event} ev - The drag over event containing target and position information
 * @returns {void} No return value, performs drag over event processing and visual updates
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
 * Deactivates the drop zone visual effect with animation and class removal
 * Adds temporary deactivate animation, removes drag-over and active classes for clean state
 * Provides drop zone deactivation functionality with smooth visual transition effects
 * @function deactivateDropZone
 * @param {HTMLElement} column - The column element to deactivate from drop zone state
 * @returns {void} No return value, performs drop zone deactivation with visual cleanup
 */
function deactivateDropZone(column) {
  addTemporaryClass(column, "drop-zone-deactivate", 200);
  column.classList.remove("drag-over");
  column.classList.remove("drop-zone-active");
}

/**
 * Removes drag-over effect when drag leaves a column with deactivation animation
 * Handles drag leave event by deactivating the drop zone with proper visual feedback
 * Provides drag leave event handling with smooth drop zone deactivation functionality
 * @function removeDragOver
 * @param {Event} ev - The drag leave event containing target column information
 * @returns {void} No return value, performs drag leave processing and drop zone deactivation
 */
function removeDragOver(ev) {
  const column = ev.currentTarget;
  deactivateDropZone(column);
}

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
 * Sends a status update request for a dragged task with user-specific data handling
 * Delegates to user-specific task status change function for proper data persistence
 * Provides task status update functionality with user context awareness during drag operations
 * @function updateTaskStatus
 * @param {string} taskId - The unique identifier of the task being dragged for status update
 * @param {string} newStatus - The new status value to assign to the task based on target column
 * @returns {Promise<void>} Promise that resolves when the task status update is complete
 */
async function updateTaskStatus(taskId, newStatus) {
  await changeStatusforDraggedTask(taskId, { Status: newStatus });
}

/**
 * Resets all drag states after a drop operation with comprehensive cleanup
 * Performs basic state reset, timer cleanup, visual feedback removal, animation cleanup, and scroll restoration
 * Provides complete drag state reset functionality for proper drag operation finalization
 * @function resetDragState
 * @returns {void} No return value, performs comprehensive drag state reset and cleanup
 */
function resetDragState() {
  resetBasicDragStates();
  cleanupTouchTimer();
  removeTaskCardVisualFeedback();
  cleanupAnimations();
  restoreScrolling();
}

/**
 * Resets basic drag states to initial values for clean state management
 * Clears current dragged task ID, touch start position, and dragging flag
 * Provides basic drag state reset functionality for drag operation completion
 * @function resetBasicDragStates
 * @returns {void} No return value, performs basic drag state variable reset
 */
function resetBasicDragStates() {
  currentDraggedTaskId = null;
  touchStart = null;
  isDragging = false;
}

/**
 * Sets the scroll state of the body element with class management and temporary effects
 * Removes existing scroll classes, adds new state class, or applies temporary restore effect
 * Provides scroll state management functionality for drag and drop scroll control
 * @function setBodyScrollState
 * @param {string} scrollState - "disabled", "enabled" or "restore" to control body scroll behavior
 * @returns {void} No return value, performs body scroll state management with CSS classes
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
 * Removes drag-over classes from an element for visual cleanup
 * Removes drag-over and drop-zone-active classes to clear visual drag effects
 * Provides element-specific drag class cleanup functionality for state management
 * @function removeDragOverClasses
 * @param {HTMLElement} element - The element to remove drag-related classes from
 * @returns {void} No return value, performs drag class removal from specified element
 */
function removeDragOverClasses(element) {
  element.classList.remove("drag-over", "drop-zone-active");
}

/**
 * Adds CSS classes to an element and removes them after a delay with timeout management
 * Applies temporary CSS class for visual effects and automatically removes after specified duration
 * Provides temporary CSS class functionality for timed visual effects and animations
 * @function addTemporaryClass
 * @param {HTMLElement} element - The element to apply temporary class styling to
 * @param {string} className - The CSS class name to add temporarily for visual effects
 * @param {number} duration - Duration in milliseconds before automatic class removal
 * @returns {void} No return value, performs temporary class application with automatic removal
 */
function addTemporaryClass(element, className, duration) {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

/**
 * Removes visual feedback from all task cards with smooth animation effects
 * Finds all task cards with drag-over class, adds smooth transition, and removes drag styling
 * Provides task card visual feedback cleanup functionality with animated transitions
 * @function removeTaskCardVisualFeedback
 * @returns {void} No return value, performs task card visual feedback removal with animations
 */
function removeTaskCardVisualFeedback() {
  document.querySelectorAll(".taskCard.drag-over").forEach((card) => {
    addTemporaryClass(card, "task-card-smooth-transition", 200);
    card.classList.remove("drag-over");
  });
}

/**
 * Stops and cleans up all running animations with frame cancellation
 * Cancels active animation frame and resets animation frame variable for clean state
 * Provides animation cleanup functionality for proper resource management during drag operations
 * @function cleanupAnimations
 * @returns {void} No return value, performs animation frame cleanup and variable reset
 */
function cleanupAnimations() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
}

/**
 * Applies a drop animation to a task card and removes it after animation completion
 * Adds temporary drop animation class to provide visual feedback for successful drop operation
 * Provides drop animation functionality with automatic cleanup for drag and drop completion
 * @function addDropAnimation
 * @param {HTMLElement} taskCard - The task card element to animate with drop effects
 * @returns {void} No return value, performs drop animation application with automatic removal
 */
function addDropAnimation(taskCard) {
  addTemporaryClass(taskCard, "task-dropped", 200);
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
