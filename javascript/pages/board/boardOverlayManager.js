/**
 * @fileoverview Board overlay management functionality
 * Handles opening, closing, and managing task overlays with animations
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Opens the Add Task overlay for creating new tasks in a specific column status
 * Shows Add Task overlay interface for task creation with optional status preselection
 * Provides task creation interface integration with board column-specific task addition
 * @function addTaskToColumn
 * @param {string} status - The status/column identifier to add the task to ('toDo', 'inProgress', etc.)
 * @returns {void} No return value, opens Add Task overlay for new task creation
 */
function addTaskToColumn(status) {
  if (typeof window.selectedStatus !== "undefined") {
    window.selectedStatus = status;
  } else {
    window.selectedStatus = status;
  }
  if (typeof window.showAddTaskOverlay === "function") {
    window.showAddTaskOverlay();
    return;
  }
  showAddTaskOverlay();
}

/**
 * Shows the Add Task overlay for creating new tasks with template loading and initialization
 * Loads Add Task template, displays overlay, removes hidden class, and initializes overlay functionality
 * Provides complete Add Task overlay setup with template injection and component initialization
 * @function showAddTaskOverlay
 * @returns {void} No return value, displays and initializes Add Task overlay interface
 */
function showAddTaskOverlay() {
  if (
    typeof window.showAddTaskOverlay === "function" &&
    window.showAddTaskOverlay !== showAddTaskOverlay
  ) {
    window.showAddTaskOverlay();
    return;
  }
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getAddTaskOverlay();
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
    if (typeof initializeOverlayAddTask === "function") {
      initializeOverlayAddTask();
    }
  }
}

/**
 * Closes the Add Task overlay with animation and cleanup effects
 * Triggers closing animation, hides overlay after delay, and clears content for fresh state
 * Provides smooth visual transition when closing task creation overlay
 * @function closeAddTaskOverlay
 * @returns {void} No return value, performs overlay closing operations with timing control
 */
function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.style.animation = "taskOverlayClose 0.4s ease-in-out forwards";
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
      overlay.style.animation = "";
    }, 400);
  }
}

/**
 * Hides the Add Task overlay and clears its content for immediate state reset
 * Instantly hides overlay element, adds hidden class, and clears innerHTML for memory cleanup
 * Provides immediate overlay hiding without animation for specific reset scenarios
 * @function hideAddTaskOverlay
 * @returns {void} No return value, performs instant overlay hiding and content removal
 */
function hideAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}

/**
 * Opens the edit task overlay with task data and displays editing interface
 * Renders edit task overlay HTML, shows overlay with proper styling, and removes hidden class
 * Provides visual task editing interface with populated data and proper overlay display
 * @function openEditTaskOverlay
 * @param {Object} task - The task object to edit containing all task properties and data
 * @returns {void} No return value, performs DOM manipulation to show edit overlay
 */
function openEditTaskOverlay(task) {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getEditTaskOverlay(task);
    overlay.style.display = "flex";
    overlay.classList.remove("hidden");
  }
}

/**
 * Closes the Edit Task overlay with smooth animation and delayed cleanup
 * Adds closing class for CSS animation, then hides overlay and clears content after timing
 * Provides animated closing transition for better user experience during task editing completion
 * @function closeEditTaskOverlay
 * @returns {void} No return value, performs animated overlay closing with 400ms timing delay
 */
function closeEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      overlay.innerHTML = "";
      overlay.classList.remove("closing");
    }, 400);
  }
}

/**
 * Hides the edit task overlay and clears its content for clean state reset
 * Immediately hides overlay, adds hidden class, and clears innerHTML for memory management
 * Provides instant overlay hiding without animation for specific use cases
 * @function hideEditTaskOverlay
 * @returns {void} No return value, performs immediate overlay hiding and content cleanup
 */
function hideEditTaskOverlay() {
  const overlay = document.getElementById("editTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.add("hidden");
    overlay.innerHTML = "";
  }
}

/**
 * Closes the task detail overlay with smooth animation and proper cleanup
 * Adds closing animation class, hides overlay after delay, and removes animation classes
 * Provides smooth overlay closure with visual feedback and complete state cleanup
 * @function closeTaskOverlay
 * @returns {void} No return value, closes task overlay with animation and cleanup after 200ms delay
 */
function closeTaskOverlay() {
  const overlay = document.getElementById("taskOverlay");
  if (overlay) {
    overlay.classList.add("closing");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      overlay.style.display = "none";
      overlay.classList.add("hidden");
      overlay.classList.remove("closing");
    }, 200);
  }
}
