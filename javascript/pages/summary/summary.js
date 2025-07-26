/**
 * @fileoverview Summary page functionality for the JOIN application
 * Handles dashboard display, task statistics, and user greeting
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Initializes summary page when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("summaryUser.html")) {
    rendersummaryMainContent();
    loadAllDataSimultaneously();
  }
});

/**
 * Renders the main summary content template
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
 * Loads all summary data simultaneously and updates the dashboard
 * @returns {Promise<void>} Resolves when data is loaded and UI is updated
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
 * Counts tasks by status and priority for dashboard statistics
 * @param {Array} allTasks - Array of all task objects
 * @returns {Object} Object containing counts for different task categories
 */
function countEveryTaskLength(allTasks) {
  return {
    todoCount: allTasks.filter((task) => task.Status === "toDo").length,
    doneCount: allTasks.filter((task) => task.Status === "done").length,
    inProgressCount: allTasks.filter((task) => task.Status === "inProgress")
      .length,
    awaitFeedbackCount: allTasks.filter(
      (task) => task.Status === "awaitFeedback"
    ).length,
    boardCount: allTasks.filter(
      (task) =>
        task.Status === "toDo" ||
        task.Status === "done" ||
        task.Status === "inProgress" ||
        task.Status === "awaitFeedback"
    ).length,
    urgentCount: allTasks.filter((task) => task.taskPriority === "Urgent")
      .length,
  };
}

/**
 * Updates all dashboard counters based on task counts and next deadline
 * @param {Object} taskCounts - Object containing task counts for each category
 * @param {string|number} nextDeadline - The next upcoming task deadline display value
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
 * Loads and displays user-specific information (time and name) on the summary page
 */
function loadUserInfo() {
  showLocalTimeFormUser();
  getUserName();
}
