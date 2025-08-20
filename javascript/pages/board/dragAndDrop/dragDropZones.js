/**
 * @fileoverview Drag and Drop Zone Management
 * Handles drop zone detection, activation, and event management
 * @author Join Project Team
 * @version 1.0.0
 */

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
 * Initializes drop zones when DOM content is loaded
 * @function DOMContentLoaded
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeDropZones();
});

window.moveToAnotherColumn = moveToAnotherColumn;
