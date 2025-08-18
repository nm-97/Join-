/**
 * @fileoverview Board page main controller for the JOIN application
 * Coordinates board initialization and module orchestration
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Initializes the board when DOM content is loaded and on correct page with path validation
 * Checks if current page is board.html before initializing board functionality
 * Provides conditional board initialization for proper page-specific functionality loading
 * @function DOMContentLoaded event handler
 * @returns {void} No return value, conditionally initializes board based on current page path
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("board.html")) {
    initializeBoard();
  }
});

/**
 * Initializes the board by fetching tasks, enriching with contact data, and rendering board template
 * Fetches user tasks, loads assigned contact information for each task, and renders complete board
 * Provides comprehensive board initialization with task data loading and contact enrichment
 * @function initializeBoard
 * @returns {Promise<void>} Promise that resolves when board initialization and rendering are complete
 */
async function initializeBoard() {
  const tasks = await fetchAndEnrichTasks();
  renderBoard(tasks);
}
