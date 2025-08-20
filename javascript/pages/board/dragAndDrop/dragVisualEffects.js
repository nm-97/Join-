/**
 * @fileoverview Drag and Drop Visual Effects
 * Handles animations, styling, and visual feedback during drag operations
 * @author Join Project Team
 * @version 1.0.0
 */

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
 * Activates the drop zone visual effect with animation and styling classes
 * Adds dragOver class to column and applies temporary active animation with timing
 * Provides drop zone activation functionality with visual feedback and animation effects
 * @function activateDropZone
 * @param {HTMLElement} column - The column element to activate as drop zone with visual feedback
 * @returns {void} No return value, performs drop zone activation with visual styling
 */
function activateDropZone(column) {
  column.classList.add("dragOver");
  if (!isResponsiveMode()) {
    addTemporaryClass(column, "dropZoneActive", 400);
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
  if (!isResponsiveMode()) {
    addTemporaryClass(column, "dropZoneDeactivate", 200);
  }
  column.classList.remove("dragOver");
  column.classList.remove("dropZoneActive");
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
