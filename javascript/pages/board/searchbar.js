/**
 * @fileoverview Search functionality for the task board
 * Handles task filtering and highlighting based on search input
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Handles search input events and triggers task filtering
 */
function handleSearchInput() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    const searchValue = searchInput.value.toLowerCase().trim();
    if (searchValue) {
      filterTaskbySearchInput(searchValue);
    } else {
      showAllTasks();
    }
  }
}

/**
 * Filters tasks based on search input value
 * @param {string} searchValue - The search term to filter tasks by
 * @returns {Promise<void>} Resolves after tasks are filtered
 */
async function filterTaskbySearchInput(searchValue) {
  const tasks = await fetchTaskByUser();

  tasks.forEach((task) => {
    const isMatch = isTaskMatchingSearch(task, searchValue);
    if (isMatch) {
      showHighlightTask(task.id);
    } else {
      hideTask(task.id);
    }
  });
}

/**
 * Checks if a task matches the search criteria
 * @param {Object} task - The task object to check
 * @param {string} searchValue - The search term
 * @returns {boolean} True if task matches search criteria, false otherwise
 */
function isTaskMatchingSearch(task, searchValue) {
  const titleMatches = doesTitleMatch(task, searchValue);
  const descriptionMatches = doesDescriptionMatch(task, searchValue);
  return titleMatches || descriptionMatches;
}

/**
 * Checks if task title matches search value
 * @param {Object} task - The task object
 * @param {string} searchValue - The search term
 * @returns {boolean} True if title matches, false otherwise
 */
function doesTitleMatch(task, searchValue) {
  return task.title && task.title.toLowerCase().includes(searchValue);
}

/**
 * Checks if task description matches search value
 * @param {Object} task - The task object
 * @param {string} searchValue - The search term
 * @returns {boolean} True if description matches, false otherwise
 */
function doesDescriptionMatch(task, searchValue) {
  return (
    task.description && task.description.toLowerCase().includes(searchValue)
  );
}

/**
 * Hides a task element from view
 * @param {string} taskId - The ID of the task to hide
 */
function hideTask(taskId) {
  const taskElement = getTaskElement(taskId);
  if (taskElement) {
    taskElement.classList.add("hidden");
    taskElement.classList.remove("highlight");
  }
}

/**
 * Shows and highlights a task element
 * @param {string} taskId - The ID of the task to show and highlight
 */
function showHighlightTask(taskId) {
  const taskElement = getTaskElement(taskId);
  if (taskElement) {
    taskElement.classList.remove("hidden");
    taskElement.classList.add("highlight");
  }
}

/**
 * Shows all tasks by removing hidden and highlight classes
 */
function showAllTasks() {
  const allTasks = document.querySelectorAll("[data-task-id]");
  allTasks.forEach((taskElement) => {
    taskElement.classList.remove("hidden", "highlight");
  });
}

/**
 * Gets the DOM element for a given task ID
 * @param {string} taskId - The ID of the task
 * @returns {Element|null} The task element or null if not found
 */
function getTaskElement(taskId) {
  return document.querySelector(`[data-task-id="${taskId}"]`);
}

/**
 * Initializes search input event listener on DOMContentLoaded
 */
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeSearch();
});
