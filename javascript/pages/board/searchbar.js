/**
 * @fileoverview Search functionality for the task board
 * Handles task filtering and highlighting based on search input
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Handles search input events and triggers task filtering with input validation
 * Gets search input element, extracts and processes search value, triggers filtering or shows all tasks
 * Provides search input event handling with proper value processing and conditional filtering logic
 * @function handleSearchInput
 * @returns {void} No return value, performs search input processing and task filtering operations
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
 * Filters tasks based on search input value with comprehensive matching and visibility control
 * Fetches user tasks, checks each task for search matches, and shows/hides tasks based on criteria
 * Provides complete task filtering functionality with search matching and visual feedback management
 * @function filterTaskbySearchInput
 * @param {string} searchValue - The search term to filter tasks by, should be lowercase and trimmed
 * @returns {Promise<void>} Promise that resolves after all tasks are filtered and visibility is updated
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
 * Checks if a task matches the search criteria using title and description comparison
 * Performs title and description matching against search value and returns combined result
 * Provides comprehensive task search matching functionality with multiple field comparison
 * @function isTaskMatchingSearch
 * @param {Object} task - The task object to check containing title and description properties
 * @param {string} searchValue - The search term to match against task fields
 * @returns {boolean} True if task matches search criteria in title or description, false otherwise
 */
function isTaskMatchingSearch(task, searchValue) {
  const titleMatches = doesTitleMatch(task, searchValue);
  const descriptionMatches = doesDescriptionMatch(task, searchValue);
  return titleMatches || descriptionMatches;
}

/**
 * Checks if task title matches search value with case-insensitive comparison
 * Validates task title existence and performs lowercase substring matching against search value
 * Provides title-specific search matching functionality with null safety and case handling
 * @function doesTitleMatch
 * @param {Object} task - The task object containing title property to check
 * @param {string} searchValue - The search term to match against task title
 * @returns {boolean} True if title exists and contains search value, false otherwise
 */
function doesTitleMatch(task, searchValue) {
  return task.title && task.title.toLowerCase().includes(searchValue);
}

/**
 * Checks if task description matches search value with case-insensitive comparison
 * Validates task description existence and performs lowercase substring matching against search value
 * Provides description-specific search matching functionality with null safety and case handling
 * @function doesDescriptionMatch
 * @param {Object} task - The task object containing description property to check
 * @param {string} searchValue - The search term to match against task description
 * @returns {boolean} True if description exists and contains search value, false otherwise
 */
function doesDescriptionMatch(task, searchValue) {
  return (
    task.description && task.description.toLowerCase().includes(searchValue)
  );
}

/**
 * Hides a task element from view with CSS class management and highlight removal
 * Finds task element by ID, adds hidden class for visibility control, and removes highlight styling
 * Provides task hiding functionality with proper CSS class management for search filtering
 * @function hideTask
 * @param {string} taskId - The unique identifier of the task to hide from view
 * @returns {void} No return value, performs task element hiding with CSS class updates
 */
function hideTask(taskId) {
  const taskElement = getTaskElement(taskId);
  if (taskElement) {
    taskElement.classList.add("hidden");
    taskElement.classList.remove("highlight");
  }
}

/**
 * Shows and highlights a task element with CSS class management and visibility control
 * Finds task element by ID, removes hidden class for visibility, and adds highlight styling
 * Provides task showing and highlighting functionality for search result display
 * @function showHighlightTask
 * @param {string} taskId - The unique identifier of the task to show and highlight
 * @returns {void} No return value, performs task element showing with highlight styling
 */
function showHighlightTask(taskId) {
  const taskElement = getTaskElement(taskId);
  if (taskElement) {
    taskElement.classList.remove("hidden");
    taskElement.classList.add("highlight");
  }
}

/**
 * Shows all tasks by removing hidden and highlight classes with comprehensive reset
 * Finds all task elements and removes both hidden and highlight classes for clean state
 * Provides complete task visibility reset functionality for clearing search filters
 * @function showAllTasks
 * @returns {void} No return value, performs visibility reset for all task elements
 */
function showAllTasks() {
  const allTasks = document.querySelectorAll("[data-task-id]");
  allTasks.forEach((taskElement) => {
    taskElement.classList.remove("hidden", "highlight");
  });
}

/**
 * Gets the DOM element for a given task ID using data attribute selector
 * Searches DOM for element with matching data-task-id attribute value
 * Provides task element retrieval functionality for search operations and visibility control
 * @function getTaskElement
 * @param {string} taskId - The unique identifier of the task to find in DOM
 * @returns {Element|null} The task element with matching data-task-id or null if not found
 */
function getTaskElement(taskId) {
  return document.querySelector(`[data-task-id="${taskId}"]`);
}

/**
 * Initializes search input event listener on DOMContentLoaded with element validation
 * Finds search input element and attaches input event listener for search functionality
 * Provides search functionality initialization with proper event listener setup
 * @function initializeSearch
 * @returns {void} No return value, performs search input event listener initialization
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
