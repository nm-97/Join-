/**
 * @fileoverview Pointer Events-based Drag and Drop for task board
 * Unified system for mouse, touch, and pen input across all devices
 * @author Join Project Team
 * @version 2.0.0
 */

let currentDraggedTaskId = null;
let isDragging = false;
let draggedElement = null;
let pointerStart = null;
let lastScrollTime = 0;
let animationFrame = null;
let lastMoveTime = 0;

/**
 * Adds scroll prevention during drag operations
 * @function addScrollPrevention
 * @returns {void}
 */
function addScrollPrevention() {
  const scrollY = window.pageYOffset;
  const scrollX = window.pageXOffset;
  document.body.classList.add("dragScrollingPrevention");
  document.body.style.setProperty("--scroll-offset", `-${scrollY}px`);
  document.body.dataset.scrollY = scrollY;
  document.body.dataset.scrollX = scrollX;

  // Optimierte Touch-Event Behandlung für Chrome Kompatibilität
  document.addEventListener("touchmove", preventTouchScroll, {
    passive: false,
    capture: true,
  });
  document.addEventListener("touchstart", preventTouchScroll, {
    passive: false,
    capture: true,
  });
  // Zusätzliche touch-action CSS wird über CSS Klasse gesetzt
  document.body.style.touchAction = "none";
  document.addEventListener("wheel", preventWheelScroll, {
    passive: false,
    capture: true,
  });
  window.addEventListener("scroll", preventWindowScroll, {
    passive: false,
    capture: true,
  });
}

/**
 * Prevents touch scroll events during dragging
 * @function preventTouchScroll
 * @param {Event} event - Touch event
 * @returns {boolean}
 */
function preventTouchScroll(event) {
  if (isDragging) {
    // Nur versuchen zu verhindern, wenn das Event cancelable ist
    if (event.cancelable) {
      event.preventDefault();
      event.stopPropagation();
    }
    return false;
  }
}

/**
 * Prevents wheel scroll events during dragging
 * @function preventWheelScroll
 * @param {Event} event - Wheel event
 * @returns {boolean}
 */
function preventWheelScroll(event) {
  if (isDragging) {
    event.preventDefault();
    return false;
  }
}

/**
 * Prevents window scroll events during dragging
 * @function preventWindowScroll
 * @param {Event} event - Scroll event
 * @returns {boolean}
 */
function preventWindowScroll(event) {
  if (isDragging) {
    event.preventDefault();
    return false;
  }
}

/**
 * Removes scroll prevention and restores normal scrolling
 * @function removeScrollPrevention
 * @returns {void}
 */
function removeScrollPrevention() {
  const scrollY = parseInt(document.body.dataset.scrollY || "0");
  const scrollX = parseInt(document.body.dataset.scrollX || "0");

  // Event Listener mit capture: true entfernen
  document.removeEventListener("touchmove", preventTouchScroll, true);
  document.removeEventListener("touchstart", preventTouchScroll, true);
  document.removeEventListener("wheel", preventWheelScroll, true);
  window.removeEventListener("scroll", preventWindowScroll, true);
  
  // Touch-action zurücksetzen
  document.body.style.touchAction = "";
  window.removeEventListener("scroll", preventWindowScroll, true);

  document.body.classList.remove(
    "dragScrollingPrevention",
    "dragTouchDisabled"
  );
  document.body.style.removeProperty("--scroll-offset");
  requestAnimationFrame(() => {
    window.scrollTo(scrollX, scrollY);
    delete document.body.dataset.scrollY;
    delete document.body.dataset.scrollX;
  });
}

/**
 * Initiates pointer-based drag operation for task cards
 * @function startPointerDrag
 * @param {string} taskId - The ID of the task to drag
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
window.startPointerDrag = function (taskId, event) {
  if (!event.isPrimary) return;
  event.preventDefault();
  const taskCard = event.currentTarget;
  currentDraggedTaskId = taskId;
  draggedElement = taskCard;
  pointerStart = {
    x: event.clientX,
    y: event.clientY,
    time: Date.now(),
  };
  isDragging = false;

  // Sofort Scroll-Prevention aktivieren für Touch-Geräte
  if (event.pointerType === "touch" || isResponsiveMode()) {
    addScrollPrevention();
  }

  taskCard.addEventListener("pointermove", onPointerMove);
  taskCard.addEventListener("pointerup", onPointerUp);
  taskCard.addEventListener("pointercancel", onPointerUp);
};

let dragJustCompleted = false;

/**
 * Handles task card clicks, but prevents clicks immediately after drag operations
 * @function handleTaskCardClick
 * @param {string} taskId - The ID of the task
 * @param {Event} event - The click event
 * @returns {void}
 */
window.handleTaskCardClick = function (taskId, event) {
  if (dragJustCompleted) {
    event.preventDefault();
    event.stopPropagation();
    dragJustCompleted = false;
    return;
  }
  showTaskDetail(taskId);
};

/**
 * Checks if we're in responsive mode (mobile/tablet) where animations should be disabled
 * @function isResponsiveMode
 * @returns {boolean} True if viewport width is 1024px or less
 */
function isResponsiveMode() {
  return window.innerWidth <= 1024;
}

/**
 * Handles pointer movement during drag operation
 * @function onPointerMove
 * @param {PointerEvent} event - The pointer move event
 * @returns {void}
 */
function onPointerMove(event) {
  if (!isDragging && !pointerStart) return;
  if (!draggedElement || !currentDraggedTaskId) return;
  const now = performance.now();
  if (now - lastMoveTime < 16) return;
  lastMoveTime = now;
  event.preventDefault();
  event.stopPropagation();
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const dragThreshold = isResponsiveMode() ? 8 : 5;
  if (!isDragging && distance > dragThreshold) {
    startDragMode(event);
  }
  if (isDragging && draggedElement) {
    const clone = document.getElementById("drag-clone");
    if (clone) {
      const offsetX = clone.offsetWidth / 2;
      const offsetY = clone.offsetHeight / 2;
      const newLeft = event.clientX - offsetX;
      const newTop = event.clientY - offsetY;

      document.documentElement.style.setProperty(
        "--drag-clone-left",
        `${newLeft}px`
      );
      document.documentElement.style.setProperty(
        "--drag-clone-top",
        `${newTop}px`
      );

      clone.style.left = `var(--drag-clone-left)`;
      clone.style.top = `var(--drag-clone-top)`;
    }

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(() => {
      handleAutoScrollPointer(event);
      handleDropZoneDetection(event);
      animationFrame = null;
    });
  }
}

/**
 * Activates drag mode with visual feedback
 * @function startDragMode
 * @param {PointerEvent} event - The pointer event that triggered drag mode
 * @returns {void}
 */
function startDragMode(event) {
  isDragging = true;
  try {
    draggedElement.setPointerCapture(event.pointerId);
  } catch (e) {
    console.warn("Could not capture pointer:", e);
  }
  event.stopPropagation();
  addScrollPrevention();
  if (isResponsiveMode()) {
    document.body.classList.add("dragTouchDisabled");
  }
  document.body.classList.add("dragScrollingPrevention");
  setBodyScrollState("disabled");

  // Erstelle eine Kopie der Karte für visuelles Feedback
  const rect = draggedElement.getBoundingClientRect();
  const clone = draggedElement.cloneNode(true);
  clone.id = "drag-clone";
  clone.className += " dragClone";

  // Setze nur die Position per CSS Custom Properties
  document.documentElement.style.setProperty(
    "--drag-clone-left",
    `${rect.left}px`
  );
  document.documentElement.style.setProperty(
    "--drag-clone-top",
    `${rect.top}px`
  );
  document.documentElement.style.setProperty(
    "--drag-clone-width",
    `${rect.width}px`
  );
  document.documentElement.style.setProperty(
    "--drag-clone-height",
    `${rect.height}px`
  );

  clone.style.left = `var(--drag-clone-left)`;
  clone.style.top = `var(--drag-clone-top)`;
  clone.style.width = `var(--drag-clone-width)`;
  clone.style.height = `var(--drag-clone-height)`;

  document.body.appendChild(clone);

  // Verstecke Original mit CSS-Klasse
  draggedElement.classList.add("dragElementActive", "dragOriginalHidden");
  const parentColumnId = draggedElement.parentElement.id;
  activateAllDropZones(parentColumnId);
}

/**
 * Handles pointer up/cancel events to end dragging
 * @function onPointerUp
 * @param {PointerEvent} event - The pointer up/cancel event
 * @returns {void}
 */
function onPointerUp(event) {
  if (!draggedElement || !pointerStart) return;
  const timeDiff = Date.now() - pointerStart.time;
  const deltaX = event.clientX - pointerStart.x;
  const deltaY = event.clientY - pointerStart.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const wasQuickClick = timeDiff < 200 && distance < 5;
  event.preventDefault();
  event.stopImmediatePropagation();

  if (isDragging) {
    try {
      draggedElement.releasePointerCapture(event.pointerId);
    } catch (e) {}
  }
  draggedElement.removeEventListener("pointermove", onPointerMove);
  draggedElement.removeEventListener("pointerup", onPointerUp);
  draggedElement.removeEventListener("pointercancel", onPointerUp);
  const wasDragging = isDragging;
  const taskId = currentDraggedTaskId;
  let activeDropZone = null;
  if (wasDragging) {
    const elementBelow = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    activeDropZone = elementBelow?.closest('[id$="Column"]');
  }
  cleanupDragState();
  if (wasDragging && activeDropZone && taskId) {
    executeDropWithZone(activeDropZone, taskId);
    dragJustCompleted = true;
    setTimeout(() => {
      dragJustCompleted = false;
    }, 100);
  } else if (wasQuickClick) {
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
}

/**
 * Handles automatic scrolling only at screen edges during pointer drag
 * Optimized for stable scrolling without disabling prevention
 * @function handleAutoScrollPointer
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function handleAutoScrollPointer(event) {
  if (!isDragging) return;
  const now = Date.now();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  const isNarrowDevice = windowWidth <= 430;
  const isMobile = windowWidth <= 768;
  let edgeThreshold, scrollSpeed, scrollInterval;
  if (isMobile) {
    edgeThreshold = 120;
    scrollSpeed = 10;
    scrollInterval = 8;
  } else {
    edgeThreshold = 50;
    scrollSpeed = 12;
    scrollInterval = 6;
  }
  const frameInterval = isNarrowDevice ? 10 : isMobile ? 8 : 6;
  if (now - lastScrollTime > frameInterval) {
    let shouldScroll = false;
    let scrollDirection = 0;
    if (event.clientY < edgeThreshold) {
      shouldScroll = true;
      scrollDirection = -scrollSpeed;
    } else if (event.clientY > windowHeight - edgeThreshold) {
      shouldScroll = true;
      scrollDirection = scrollSpeed;
    }
    if (shouldScroll) {
      lastScrollTime = now;
      const currentScrollY = Math.abs(
        parseInt(
          document.body.style
            .getPropertyValue("--scroll-offset")
            ?.replace("px", "") || "0"
        )
      );
      const newScrollY = Math.max(0, currentScrollY + scrollDirection);
      document.body.style.setProperty("--scroll-offset", `-${newScrollY}px`);
      document.body.dataset.scrollY = newScrollY;
    }
  }
}

/**
 * Detects drop zones under the pointer and provides visual feedback
 * @function handleDropZoneDetection
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function handleDropZoneDetection(event) {
  const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
  const column = elementBelow?.closest('[id$="Column"]');
  if (column) {
    clearOtherDragOverEffects(column);
    if (!column.classList.contains("dragOver")) {
      activateDropZone(column);
    }
  } else {
    clearAllDragOverEffects();
  }
}

/**
 * Cleans up all drag-related state and visual effects
 * @function cleanupDragState
 * @returns {void}
 */
function cleanupDragState() {
  const tempDraggedElement = draggedElement;
  const tempIsDragging = isDragging;

  // Entferne Klon sicher
  const clone = document.getElementById("drag-clone");
  if (clone) {
    clone.remove();
  }

  // Entferne alle möglichen Klone (falls mehrere existieren)
  const allClones = document.querySelectorAll('[id="drag-clone"]');
  allClones.forEach((c) => c.remove());

  // Entferne CSS Custom Properties
  document.documentElement.style.removeProperty("--drag-clone-left");
  document.documentElement.style.removeProperty("--drag-clone-top");
  document.documentElement.style.removeProperty("--drag-clone-width");
  document.documentElement.style.removeProperty("--drag-clone-height");

  currentDraggedTaskId = null;
  draggedElement = null;
  pointerStart = null;
  isDragging = false;
  removeScrollPrevention();
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  document.body.classList.remove(
    "dragScrollingPrevention",
    "dragTouchDisabled"
  );
  if (tempDraggedElement) {
    // Stelle Original komplett wieder her nur mit CSS-Klassen
    tempDraggedElement.classList.remove(
      "dragOver",
      "dragElementActive",
      "dragOriginalHidden"
    );
    tempDraggedElement.classList.add("dragElementReset");

    // Event Listener wieder hinzufügen falls verloren
    setTimeout(() => {
      tempDraggedElement.classList.remove("dragElementReset");
      // Re-initialisiere Event Listener
      if (typeof initializeDropZones === "function") {
        initializeDropZones();
      }
    }, 300);

    tempDraggedElement.offsetHeight;
  }
  clearAllDragOverEffects();
  setBodyScrollState("restore");
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
  const columns = document.querySelectorAll('[id$="Column"]');
  columns.forEach((column) => {
    if (column.id !== currentColumnId) {
      activateDropZone(column);
    }
  });
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
 * Clears all drag-over visual effects from all columns with class removal
 * Finds all elements with dragOver class and removes drag-related styling classes
 * Provides comprehensive visual effect cleanup functionality for drag operation completion
 * @function clearAllDragOverEffects
 * @returns {void} No return value, performs drag-over visual effects removal from all elements
 */
function clearAllDragOverEffects() {
  document.querySelectorAll(".dragOver").forEach((col) => {
    removeDragOverClasses(col);
  });
}

/**
 * Clears drag-over effects from all columns except the current one with selective cleanup
 * Iterates through all dragOver elements and removes effects from non-current columns only
 * Provides selective visual effect cleanup functionality to maintain current column highlighting
 * @function clearOtherDragOverEffects
 * @param {HTMLElement} currentColumn - The column element to keep the drag-over effect on
 * @returns {void} No return value, performs selective drag-over effect removal
 */
function clearOtherDragOverEffects(currentColumn) {
  document.querySelectorAll(".dragOver").forEach((col) => {
    if (col !== currentColumn) {
      removeDragOverClasses(col);
    }
  });
}

/**
 * Activates the drop zone visual effect with animation and styling classes
 * Adds dragOver class to column and applies temporary active animation with timing
 * Provides drop zone activation functionality with visual feedback and animation effects
 * @function activateDropZone
 * @param {HTMLElement} column - The column element to activate as drop zone with visual feedback
 * @returns {void} No return value, performs drop zone activation with visual styling
 */
function activateDropZone(column) {
  column.classList.add("dragOver");

  // Skip animations in responsive mode (≤1024px) for better performance
  if (!isResponsiveMode()) {
    addTemporaryClass(column, "dropZoneActive", 400);
  }
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
  if (!column.classList.contains("dragOver")) {
    activateDropZone(column);
  }
}

/**
 * Deactivates the drop zone visual effect with animation and class removal
 * Adds temporary deactivate animation, removes dragOver and active classes for clean state
 * Provides drop zone deactivation functionality with smooth visual transition effects
 * @function deactivateDropZone
 * @param {HTMLElement} column - The column element to deactivate from drop zone state
 * @returns {void} No return value, performs drop zone deactivation with visual cleanup
 */
function deactivateDropZone(column) {
  // Skip animations in responsive mode (≤1024px) for better performance
  if (!isResponsiveMode()) {
    addTemporaryClass(column, "dropZoneDeactivate", 200);
  }
  column.classList.remove("dragOver");
  column.classList.remove("dropZoneActive");
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
  updateLocalTaskStatus(taskId, newStatus);
  await changeStatusforDraggedTask(taskId, { Status: newStatus });
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
 * Resets all drag states after a drop operation with comprehensive cleanup
 * Performs basic state reset, visual feedback removal, animation cleanup, and scroll restoration
 * Provides complete drag state reset functionality for proper drag operation finalization
 * @function resetDragState
 * @returns {void} No return value, performs comprehensive drag state reset and cleanup
 */
function resetDragState() {
  currentDraggedTaskId = null;
  draggedElement = null;
  pointerStart = null;
  isDragging = false;
  clearAllDragOverEffects();
  setBodyScrollState("restore");
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
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
    "dragScrollDisabled",
    "dragScrollEnabled",
    "dragScrollRestore"
  );
  if (scrollState !== "restore") {
    document.body.classList.add(
      `dragScroll${scrollState.charAt(0).toUpperCase() + scrollState.slice(1)}`
    );
  } else {
    if (!isResponsiveMode()) {
      addTemporaryClass(document.body, "dragScrollRestore", 300);
    }
  }
}

/**
 * Removes drag-over classes from an element for visual cleanup
 * Removes dragOver and dropZoneActive classes to clear visual drag effects
 * Provides element-specific drag class cleanup functionality for state management
 * @function removeDragOverClasses
 * @param {HTMLElement} element - The element to remove drag-related classes from
 * @returns {void} No return value, performs drag class removal from specified element
 */
function removeDragOverClasses(element) {
  element.classList.remove("dragOver", "dropZoneActive");
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
window.moveToAnotherColumn = moveToAnotherColumn;
window.dropToAnotherColumn = dropToAnotherColumn;

/**
 * Initializes drop zones when DOM content is loaded
 * @function DOMContentLoaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeDropZones();
});

/**
 * Initializes all drop zones for pointer events
 * @function initializeDropZones
 * @returns {void}
 */
function initializeDropZones() {
  const dropZones = document.querySelectorAll(".columnContent");
  dropZones.forEach((zone) => {
    zone.removeAttribute("ondrop");
    zone.removeAttribute("ondragover");
  });
}

/**
 * Legacy compatibility function for older templates
 * @function startDragging
 * @param {string} taskId - The task ID to start dragging
 * @returns {void}
 */
window.startDragging = function (taskId) {
  currentDraggedTaskId = taskId;
  setBodyScrollState("disabled");
};

/**
 * Restores normal scroll behavior after drag operation completion
 * Sets body scroll state to restore for returning to normal scrolling functionality
 * @function restoreScrolling
 * @returns {void}
 */
function restoreScrolling() {
  setBodyScrollState("restore");
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
 * Applies a drop animation to a task card and removes it after animation completion
 * Adds temporary drop animation class to provide visual feedback for successful drop operation
 * Provides drop animation functionality with automatic cleanup for drag and drop completion
 * @function addDropAnimation
 * @param {HTMLElement} taskCard - The task card element to animate with drop effects
 * @returns {void} No return value, performs drop animation application with automatic removal
 */
function addDropAnimation(taskCard) {
  if (!isResponsiveMode()) {
    addTemporaryClass(taskCard, "taskDropped", 200);
  }
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
