/**
 * @fileoverview Board UI helper functions
 * Handles UI rendering helpers, category mapping, and visual utilities
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Returns a user-friendly display label for a given category value with fallback support
 * Maps internal category keys to proper display names for UI presentation
 * Provides consistent category labeling with default fallback for unknown categories
 * @function getCategoryLabel
 * @param {string} category - The category key to get display label for (Technical Task, User Story, technicalTask, userStory)
 * @returns {string} Human-readable display label for the category, defaults to "Technical Task" for unknown values
 */
function getCategoryLabel(category) {
  const categoryMap = {
    "Technical Task": "Technical Task",
    "User Story": "User Story",
    technicalTask: "Technical Task",
    userStory: "User Story",
  };
  return categoryMap[category] || "Technical Task";
}

/**
 * Returns a CSS class name for a given category value with consistent styling mapping
 * Maps category values to corresponding CSS class identifiers for proper visual styling
 * Provides consistent CSS class mapping with fallback for unknown category types
 * @function getCategoryClass
 * @param {string} category - The category key to get CSS class for (Technical Task, User Story, technicalTask, userStory)
 * @returns {string} CSS class identifier for styling the category, defaults to "technicalTask" for unknown values
 */
function getCategoryClass(category) {
  const classMap = {
    "Technical Task": "technicalTask",
    "User Story": "userStory",
    technicalTask: "technicalTask",
    userStory: "userStory",
  };
  return classMap[category] || "technicalTask";
}

/**
 * Renders a single user avatar for display in task cards with personalized styling
 * Creates HTML for contact avatar with initials and background color based on contact data
 * Provides visual representation of assigned contact with consistent avatar styling
 * @function renderSingleAssignee
 * @param {string} assignedTo - Contact ID to render avatar for, must be valid contact identifier
 * @returns {string} HTML snippet for user avatar with styling, or empty string if no contact provided
 */
function renderSingleAssignee(assignedTo) {
  if (!assignedTo) return "";
  const initials = getInitials(assignedTo);
  const color = getAvatarColor(assignedTo);
  return `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
}

/**
 * Renders the board with task data using template system
 * @function renderBoard
 * @param {Array} tasks - Array of task objects to render on board
 * @returns {void} No return value, updates board container with rendered tasks
 */
function renderBoard(tasks) {
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
  if (typeof initializeDropZones === "function") {
    initializeDropZones();
  }
}
