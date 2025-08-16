/**
 * @fileoverview Mobile Touch Drag and Drop Handler v3.0
 * A robust, state-machine-based implementation for mobile drag and drop.
 * This version focuses on stability, performance, and a smooth user experience.
 * @author Join Project Team
 * @version 3.0.0
 */

class MobileDragDrop {
  /**
   * Initializes the MobileDragDrop instance.
   */
  constructor() {
    this.draggedElement = null;
    this.draggedTaskId = null;
    this.originalParent = null;
    this.originalNextSibling = null;
    this.touchStartPos = { x: 0, y: 0 };
    this.scrollOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.longPressTimer = null;
    this.longPressDelay = 350;
    this.dragThreshold = 10;
    this.boundHandleTouchMove = this.handleTouchMove.bind(this);
    this.boundHandleTouchEnd = this.handleTouchEnd.bind(this);
    this.scrollRaf = null;
    this.scrollYDirection = 0;
    this.scrollXDirection = 0;
    this.edgeThreshold = 80;
    this.edgeThresholdX = 60;
    this.scrollSpeed = 14;
    this.lastPoint = null;
    this.vScrollEl = null;
    this.hScrollEl = null;
  }

  /**
   * Handles the initial touch event on a draggable element.
   * @param {TouchEvent} event The touch event.
   * @param {string} taskId The ID of the task being dragged.
   */
  handleTouchStart(event, taskId) {
    if (this.isDragging || event.touches.length !== 1) return;
    const touch = event.touches[0];
    this.draggedElement = event.currentTarget;
    this.draggedTaskId = taskId;
    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
    this.longPressTimer = setTimeout(() => {
      this.startDrag(touch);
    }, this.longPressDelay);
    document.addEventListener("touchmove", this.boundHandleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", this.boundHandleTouchEnd);
    document.addEventListener("touchcancel", this.boundHandleTouchEnd);
  }

  /**
   * Starts the drag operation after a long press.
   * @param {Touch} touch The touch object from the event.
   */
  startDrag(touch) {
    if (!this.draggedElement) return;
    this.isDragging = true;
    this.originalParent = this.draggedElement.parentElement;
    this.originalNextSibling = this.draggedElement.nextElementSibling;
    this.prepareElementForDrag(touch);
    this.disablePageScroll();
    this.triggerHapticFeedback(50);
    this.vScrollEl = this.getScrollableAncestor(this.draggedElement, "y");
    this.hScrollEl = this.getScrollableAncestor(this.draggedElement, "x");
    this.lastPoint = { clientX: touch.clientX, clientY: touch.clientY };
  }

  /**
   * Prepares the element for dragging by applying styles and calculating offsets.
   * @param {Touch} touch The touch object.
   */
  prepareElementForDrag(touch) {
    const rect = this.draggedElement.getBoundingClientRect();
    this.scrollOffset = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
    const placeholder = this.draggedElement.cloneNode(true);
    placeholder.classList.add("drag-placeholder");
    this.originalParent.insertBefore(placeholder, this.draggedElement);
    this.draggedElement.classList.add("mobile-drag-active");
    this.draggedElement.style.position = "fixed";
    this.draggedElement.style.zIndex = "10000";
    this.draggedElement.style.width = `${rect.width}px`;
    this.draggedElement.style.height = `${rect.height}px`;
    this.updatePosition(touch);
  }

  /**
   * Handles the touch move event.
   * @param {TouchEvent} event The touch move event.
   */
  handleTouchMove(event) {
    const touch = event.touches[0];
    const distance = Math.hypot(
      touch.clientX - this.touchStartPos.x,
      touch.clientY - this.touchStartPos.y
    );
    if (!this.isDragging && distance > this.dragThreshold) {
      this.cleanup();
      return;
    }
    if (this.isDragging) {
      event.preventDefault();
      this.updatePosition(touch);
      this.lastPoint = { clientX: touch.clientX, clientY: touch.clientY };
      this.autoScrollIfNearEdges(this.lastPoint);
      this.updateDropZoneHighlight(touch);
    }
  }

  /**
   * Updates the position of the dragged element.
   * @param {Touch} touch The touch object.
   */
  updatePosition(touch) {
    if (!this.draggedElement) return;
    const x = touch.clientX - this.scrollOffset.x;
    const y = touch.clientY - this.scrollOffset.y;
    this.draggedElement.style.transform = `translate(${x}px, ${y}px)`;
  }

  /**
   * Auto-scrolls the page when the finger is near the top/bottom edges.
   * @param {Touch} touch The current touch point.
   */
  autoScrollIfNearEdges(point) {
    const y = point.clientY;
    const vh = window.innerHeight;
    if (y < this.edgeThreshold) this.scrollYDirection = -1;
    else if (y > vh - this.edgeThreshold) this.scrollYDirection = 1;
    else this.scrollYDirection = 0;
    const x = point.clientX;
    const vw = window.innerWidth;
    if (x < this.edgeThresholdX) this.scrollXDirection = -1;
    else if (x > vw - this.edgeThresholdX) this.scrollXDirection = 1;
    else this.scrollXDirection = 0;
    const shouldScroll =
      this.scrollYDirection !== 0 || this.scrollXDirection !== 0;
    if (shouldScroll && this.scrollRaf === null) this.startScrollLoop();
    else if (!shouldScroll && this.scrollRaf !== null) this.stopScrollLoop();
  }

  /** Starts a continuous scroll loop while near edges. */
  startScrollLoop() {
    const tick = () => {
      if (
        !this.isDragging ||
        (this.scrollYDirection === 0 && this.scrollXDirection === 0)
      ) {
        this.stopScrollLoop();
        return;
      }
      let vy = 0;
      let vx = 0;
      if (this.lastPoint) {
        const y = this.lastPoint.clientY;
        const x = this.lastPoint.clientX;
        if (this.scrollYDirection !== 0) {
          const distY =
            this.scrollYDirection < 0
              ? Math.max(y, 1)
              : Math.max(window.innerHeight - y, 1);
          const factorY = Math.min(
            1,
            (this.edgeThreshold - Math.min(this.edgeThreshold, distY)) /
              this.edgeThreshold
          );
          vy = Math.max(1, Math.round(this.scrollSpeed * (0.4 + factorY)));
        }
        if (this.scrollXDirection !== 0) {
          const distX =
            this.scrollXDirection < 0
              ? Math.max(x, 1)
              : Math.max(window.innerWidth - x, 1);
          const factorX = Math.min(
            1,
            (this.edgeThresholdX - Math.min(this.edgeThresholdX, distX)) /
              this.edgeThresholdX
          );
          vx = Math.max(1, Math.round(this.scrollSpeed * (0.4 + factorX)));
        }
      }
      if (this.scrollYDirection !== 0) {
        const el =
          this.vScrollEl ||
          document.scrollingElement ||
          document.documentElement;
        if (el === window || el === document || el === document.body)
          window.scrollBy(0, this.scrollYDirection * vy);
        else el.scrollTop += this.scrollYDirection * vy;
      }
      if (this.scrollXDirection !== 0 && this.hScrollEl) {
        this.hScrollEl.scrollLeft +=
          this.scrollXDirection * (vx || this.scrollSpeed);
      }
      if (this.lastPoint) {
        this.updateDropZoneHighlight(this.lastPoint);
      }
      this.scrollRaf = requestAnimationFrame(tick);
    };
    this.scrollRaf = requestAnimationFrame(tick);
  }

  /** Stops the continuous scroll loop. */
  stopScrollLoop() {
    if (this.scrollRaf !== null) {
      cancelAnimationFrame(this.scrollRaf);
      this.scrollRaf = null;
    }
  }

  /**
   * Finds the nearest scrollable ancestor for a given axis.
   * @param {HTMLElement} el
   * @param {'x'|'y'} axis
   */
  getScrollableAncestor(el, axis) {
    let node = el;
    const prop = axis === "y" ? "overflowY" : "overflowX";
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node);
      const canScroll =
        axis === "y"
          ? node.scrollHeight > node.clientHeight
          : node.scrollWidth > node.clientWidth;
      if (canScroll && (style[prop] === "auto" || style[prop] === "scroll"))
        return node;
      node = node.parentElement;
    }
    if (axis === "y")
      return document.scrollingElement || document.documentElement;
    const board = document.querySelector(".boardContainer");
    if (board && board.scrollWidth > board.clientWidth) return board;
    return null;
  }

  /**
   * Handles the end of a touch event (touchend, touchcancel).
   * @param {TouchEvent} event The touch end or cancel event.
   */
  handleTouchEnd(event) {
    if (this.isDragging) {
      const touch = event.changedTouches[0];
      this.drop(touch);
    }
    this.cleanup();
  }

  /**
   * Finalizes the drop operation.
   * @param {Touch} touch The final touch object from the touchend event.
   */
  async drop(touch) {
    const dropZone = this.getActiveDropZone(touch);
    if (dropZone && dropZone !== this.originalParent) {
      const newStatus = this.getColumnStatus(dropZone.id);
      if (newStatus) {
        dropZone.appendChild(this.draggedElement);
        await this.updateTaskStatus(this.draggedTaskId, newStatus);
        this.triggerHapticFeedback([30, 50, 30]);
      }
    } else {
      this.restoreOriginalPosition();
    }
  }

  /**
   * Restores the element to its original position if not dropped in a new column.
   */
  restoreOriginalPosition() {
    if (this.originalParent) {
      if (
        this.originalNextSibling &&
        this.originalNextSibling.parentNode === this.originalParent
      ) {
        this.originalParent.insertBefore(
          this.draggedElement,
          this.originalNextSibling
        );
      } else {
        this.originalParent.appendChild(this.draggedElement);
      }
    }
  }

  /**
   * Cleans up all event listeners, timers, and styles.
   */
  cleanup() {
    clearTimeout(this.longPressTimer);
    this.longPressTimer = null;
    this.stopScrollLoop();
    document.removeEventListener("touchmove", this.boundHandleTouchMove);
    document.removeEventListener("touchend", this.boundHandleTouchEnd);
    document.removeEventListener("touchcancel", this.boundHandleTouchEnd);
    const placeholder = document.querySelector(".drag-placeholder");
    if (placeholder) {
      placeholder.remove();
    }
    if (this.draggedElement) {
      this.draggedElement.classList.remove("mobile-drag-active");
      this.draggedElement.style.position = "";
      this.draggedElement.style.zIndex = "";
      this.draggedElement.style.width = "";
      this.draggedElement.style.height = "";
      this.draggedElement.style.transform = "";
    }
    this.clearAllDropZoneHighlights();
    this.enablePageScroll();
    this.isDragging = false;
    this.draggedElement = null;
    this.draggedTaskId = null;
    this.scrollYDirection = 0;
    this.scrollXDirection = 0;
    this.lastPoint = null;
    this.vScrollEl = null;
    this.hScrollEl = null;
  }

  /**
   * Finds and highlights the current drop zone.
   * @param {Touch} touch The touch object.
   */
  updateDropZoneHighlight(touch) {
    this.clearAllDropZoneHighlights();
    const dropZone = this.getActiveDropZone(touch);
    if (dropZone && dropZone !== this.originalParent) {
      dropZone.classList.add("mobile-drop-zone-active");
    }
  }

  /**
   * Gets the drop zone element under the current touch point.
   * @param {Touch} touch The touch object.
   * @returns {HTMLElement|null} The drop zone element or null.
   */
  getActiveDropZone(touch) {
    this.draggedElement.style.display = "none";
    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    this.draggedElement.style.display = "";
    return elementBelow ? elementBelow.closest(".columnContent") : null;
  }

  /**
   * Removes highlight from all drop zones.
   */
  clearAllDropZoneHighlights() {
    document.querySelectorAll(".columnContent").forEach((col) => {
      col.classList.remove("mobile-drop-zone-active");
    });
  }

  /**
   * Disables page scrolling.
   */
  disablePageScroll() {
    document.body.style.overflow = "hidden";
  }

  /**
   * Enables page scrolling.
   */
  enablePageScroll() {
    document.body.style.overflow = "";
  }

  /**
   * Triggers haptic feedback if supported.
   * @param {number|number[]} pattern The vibration pattern.
   */
  triggerHapticFeedback(pattern) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Updates the task status in the backend.
   * @param {string} taskId The ID of the task.
   * @param {string} newStatus The new status.
   */
  async updateTaskStatus(taskId, newStatus) {
    await changeStatusforDraggedTask(taskId, { Status: newStatus });
    updateBoard();
  }

  /**
   * Gets the status string from a column's ID.
   * @param {string} columnId The ID of the column element.
   * @returns {string|null} The status string or null.
   */
  getColumnStatus(columnId) {
    const statusMap = {
      toDoColumn: "toDo",
      inProgressColumn: "inProgress",
      awaitingFeedbackColumn: "awaitingFeedback",
      doneColumn: "done",
    };
    return statusMap[columnId] || null;
  }
}

// Create a single instance of the drag-drop handler
const mobileDragDrop = new MobileDragDrop();

/**
 * Global handler to initiate mobile drag and drop.
 * This function should be called from the 'ontouchstart' attribute in the HTML.
 * @param {TouchEvent} event The touch event.
 * @param {string} taskId The ID of the task.
 */
function handleTouchStartMobile(event, taskId) {
  event.preventDefault();
  mobileDragDrop.handleTouchStart(event, taskId);
}
