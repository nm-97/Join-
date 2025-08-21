/**
 * @fileoverview Summary page functionality for the JOIN application
 * Handles dashboard display, task statistics, and user greeting
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Initializes summary page when DOM content is loaded with conditional rendering and data loading
 * Checks current pathname for summary page, renders main content, loads data, and initializes welcome overlay
 * Provides complete summary page initialization with content rendering and data management
 * @function DOMContentLoaded event listener
 * @returns {void} No return value, performs summary page initialization and setup
 */
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("summaryUser.html")) {
    rendersummaryMainContent();
    loadAllDataSimultaneously();
    initializeWelcomeOverlay();
  }
});

/**
 * Renders the main summary content template with template generation and DOM insertion
 * Gets summary template HTML, finds target element, and inserts content with error handling
 * Provides summary content rendering with template integration and element validation
 * @function rendersummaryMainContent
 * @returns {void} No return value, performs summary content rendering and DOM manipulation
 */
function rendersummaryMainContent() {
  let summaryMainContent = getsummaryTemplate();
  const summaryElement = document.getElementById("summaryMainContent");
  if (summaryElement) {
    summaryElement.innerHTML = summaryMainContent;
  } else {
    console.error("summaryMainContent Element nicht gefunden!");
  }
}

/**
 * Loads all summary data simultaneously and updates the dashboard with comprehensive data processing
 * Fetches tasks, calculates counts and deadlines, updates UI counters, and loads user information
 * Provides complete data loading workflow with error handling and dashboard updates
 * @function loadAllDataSimultaneously
 * @returns {Promise<void>} Promise that resolves when all data is loaded and UI is updated successfully
 */
async function loadAllDataSimultaneously() {
  try {
    const allTasks = await fetchTaskByUser();
    const taskCounts = countEveryTaskLength(allTasks);
    const nextDeadline = calculateNextDeadline(allTasks);
    updateAllCounters(taskCounts, nextDeadline);
    loadUserInfo();
  } catch (error) {
    console.error("Fehler beim Laden der Summary-Daten:", error);
  }
}

/**
 * Counts tasks by status and priority for dashboard statistics with comprehensive filtering
 * Filters tasks by different statuses and priorities, calculates counts for each category
 * Provides complete task counting functionality for dashboard statistics and displays
 * @function countEveryTaskLength
 * @param {Array} allTasks - Array of all task objects to count and categorize
 * @returns {Object} Object containing counts for different task categories and statuses
 */
function countEveryTaskLength(allTasks) {
  const statusCounts = calculateStatusCounts(allTasks);
  const priorityCounts = calculatePriorityCounts(allTasks);
  const boardCount = calculateBoardCount(allTasks);
  return {
    ...statusCounts,
    ...priorityCounts,
    boardCount,
  };
}

/**
 * Calculates task counts by status categories
 * @function calculateStatusCounts
 * @param {Array} allTasks - Array of all task objects
 * @returns {Object} Object containing status-based task counts
 */
function calculateStatusCounts(allTasks) {
  return {
    todoCount: allTasks.filter((task) => task.Status === "toDo").length,
    doneCount: allTasks.filter((task) => task.Status === "done").length,
    inProgressCount: allTasks.filter((task) => task.Status === "inProgress")
      .length,
    awaitFeedbackCount: allTasks.filter(
      (task) => task.Status === "awaitingFeedback"
    ).length,
  };
}

/**
 * Calculates task counts by priority categories
 * @function calculatePriorityCounts
 * @param {Array} allTasks - Array of all task objects
 * @returns {Object} Object containing priority-based task counts
 */
function calculatePriorityCounts(allTasks) {
  return {
    urgentCount: allTasks.filter((task) => task.taskPriority === "Urgent")
      .length,
  };
}

/**
 * Calculates total board task count across all statuses
 * @function calculateBoardCount
 * @param {Array} allTasks - Array of all task objects
 * @returns {number} Total count of tasks on the board
 */
function calculateBoardCount(allTasks) {
  return allTasks.filter(
    (task) =>
      task.Status === "toDo" ||
      task.Status === "done" ||
      task.Status === "inProgress" ||
      task.Status === "awaitingFeedback"
  ).length;
}

/**
 * Updates all dashboard counters based on task counts and next deadline with comprehensive counter management
 * Calls update functions for each counter type with corresponding task counts and deadline information
 * Provides complete dashboard counter update functionality with systematic counter management
 * @function updateAllCounters
 * @param {Object} taskCounts - Object containing task counts for each category and status
 * @param {string|number} nextDeadline - The next upcoming task deadline display value for due date counter
 * @returns {void} No return value, performs dashboard counter updates with provided data
 */
function updateAllCounters(taskCounts, nextDeadline) {
  updateCounter("todoCounter", taskCounts.todoCount);
  updateCounter("doneCounter", taskCounts.doneCount);
  updateCounter("inProgressCounter", taskCounts.inProgressCount);
  updateCounter("awaitFeedbackCounter", taskCounts.awaitFeedbackCount);
  updateCounter("boardCounter", taskCounts.boardCount);
  updateCounter("highPriorityCounter", taskCounts.urgentCount);
  updateCounter("dueDateCounter", nextDeadline);
}

/**
 * Loads and displays user-specific information (time and name) on the summary page with complete user data setup
 * Calls functions to show local time for user and get user name for display
 * Provides comprehensive user information loading and display functionality for summary page
 * @function loadUserInfo
 * @returns {void} No return value, performs user information loading and display operations
 */
function loadUserInfo() {
  showLocalTimeFormUser();
  getUserName();
}

/**
 * Navigates to the board page with window location redirect functionality
 * Changes window location to board.html for navigation to task board interface
 * Provides board navigation functionality for summary page board access button
 * @function goToBoard
 * @returns {void} No return value, performs navigation redirect to board page
 */
function goToBoard() {
  window.location.href = "board.html";
}
