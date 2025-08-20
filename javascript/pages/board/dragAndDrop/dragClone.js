/**
 * @fileoverview Drag Clone Management
 * Handles creation, positioning, and removal of drag clone elements
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Creates the drag clone element with proper positioning and styling
 * @function createDragClone
 * @returns {void}
 */
function createDragClone() {
  const draggedElement = getDraggedElement();
  if (!draggedElement) return;

  const rect = draggedElement.getBoundingClientRect();
  const clone = draggedElement.cloneNode(true);

  clone.id = "drag-clone";
  clone.className += " dragClone";

  setupClonePosition(rect);
  setupCloneStyles(clone, rect);

  document.body.appendChild(clone);
}

/**
 * Sets up CSS custom properties for clone positioning
 * @function setupClonePosition
 * @param {DOMRect} rect - The bounding rectangle of the original element
 * @returns {void}
 */
function setupClonePosition(rect) {
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
}

/**
 * Applies styles to the drag clone element
 * @function setupCloneStyles
 * @param {HTMLElement} clone - The clone element
 * @param {DOMRect} rect - The bounding rectangle
 * @returns {void}
 */
function setupCloneStyles(clone, rect) {
  clone.style.left = `var(--drag-clone-left)`;
  clone.style.top = `var(--drag-clone-top)`;
  clone.style.width = `var(--drag-clone-width)`;
  clone.style.height = `var(--drag-clone-height)`;
}

/**
 * Updates the position of the drag clone element during dragging
 * @function updateDragClonePosition
 * @param {PointerEvent} event - The pointer event
 * @returns {void}
 */
function updateDragClonePosition(event) {
  const clone = document.getElementById("drag-clone");
  if (!clone) return;

  const offsetX = clone.offsetWidth / 2;
  const offsetY = clone.offsetHeight / 2;
  const newLeft = event.clientX - offsetX;
  const newTop = event.clientY - offsetY;

  updateClonePosition(newLeft, newTop);
  applyClonePosition(clone);
}

/**
 * Updates clone position CSS properties
 * @function updateClonePosition
 * @param {number} left - Left position
 * @param {number} top - Top position
 * @returns {void}
 */
function updateClonePosition(left, top) {
  document.documentElement.style.setProperty("--drag-clone-left", `${left}px`);
  document.documentElement.style.setProperty("--drag-clone-top", `${top}px`);
}

/**
 * Applies position styles to clone element
 * @function applyClonePosition
 * @param {HTMLElement} clone - The clone element
 * @returns {void}
 */
function applyClonePosition(clone) {
  clone.style.left = `var(--drag-clone-left)`;
  clone.style.top = `var(--drag-clone-top)`;
}

/**
 * Removes the drag clone element and any duplicates
 * @function removeDragClone
 * @returns {void}
 */
function removeDragClone() {
  const clone = document.getElementById("drag-clone");
  if (clone) {
    clone.remove();
  }

  const allClones = document.querySelectorAll('[id="drag-clone"]');
  allClones.forEach((c) => c.remove());
}

/**
 * Clears CSS custom properties used for drag positioning
 * @function clearCSSProperties
 * @returns {void}
 */
function clearCSSProperties() {
  document.documentElement.style.removeProperty("--drag-clone-left");
  document.documentElement.style.removeProperty("--drag-clone-top");
  document.documentElement.style.removeProperty("--drag-clone-width");
  document.documentElement.style.removeProperty("--drag-clone-height");
}

/**
 * Gets the current drag clone element
 * @function getDragClone
 * @returns {HTMLElement|null} The drag clone element
 */
function getDragClone() {
  return document.getElementById("drag-clone");
}

/**
 * Checks if a drag clone exists
 * @function hasDragClone
 * @returns {boolean} True if drag clone exists
 */
function hasDragClone() {
  return !!document.getElementById("drag-clone");
}
