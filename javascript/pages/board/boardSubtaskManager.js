/**
 * @fileoverview Board subtask management functionality
 * Handles subtask toggling, updating, and UI synchronization
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Toggles completion state of a subtask within a task overlay with full data persistence
 * Finds subtask, toggles completed flag, updates Firebase, refreshes UI, and syncs board display
 * Provides interactive subtask completion management with comprehensive state synchronization
 * @function toggleSubtask
 * @param {string} taskId - Parent task ID containing the subtask to toggle
 * @param {string} subtaskId - Subtask ID to toggle completion state for
 * @returns {Promise<void>} Promise that resolves when subtask toggle and all updates are complete
 */
async function toggleSubtask(taskId, subtaskId) {
  try {
    const task = await findAndToggleSubtask(taskId, subtaskId);
    if (!task) return;
    await updateTaskInFirebase(taskId, task);
    updateSubtaskListInOverlay(task, taskId);
    await refreshBoard();
  } catch (error) {
    console.error("Error toggling subtask:", error);
  }
}

/**
 * Finds a task, toggles a subtask's completed flag, and returns updated task with validation
 * Fetches task data, locates specific subtask, toggles completion state, and validates operations
 * Provides safe subtask modification with comprehensive error handling and data validation
 * @function findAndToggleSubtask
 * @param {string} taskId - Parent task ID to search for and modify subtask within
 * @param {string} subtaskId - Subtask ID to find and toggle completion state for
 * @returns {Promise<Object|null>} Updated task object with modified subtask or null if task/subtask not found
 */
async function findAndToggleSubtask(taskId, subtaskId) {
  const tasks = await fetchTaskByUser();
  const task = tasks.find((t) => t.id === taskId);
  if (!task || !task.subtasks) return null;
  const subtaskIndex = task.subtasks.findIndex((sub) => sub.id === subtaskId);
  if (subtaskIndex === -1) return null;
  task.subtasks[subtaskIndex].completed =
    !task.subtasks[subtaskIndex].completed;
  return task;
}

/**
 * Updates the subtask list in the task detail overlay UI with real-time rendering
 * Finds overlay element, locates subtasks list container, and re-renders with updated data
 * Provides dynamic UI updates for subtask changes while overlay is visible
 * @function updateSubtaskListInOverlay
 * @param {Object} task - The task object containing updated subtasks array with completion states
 * @param {string} taskId - The ID of the parent task for proper subtask rendering context
 * @returns {void} No return value, performs direct DOM manipulation for UI updates
 */
function updateSubtaskListInOverlay(task, taskId) {
  const overlay = document.getElementById("taskOverlay");
  if (!overlay || overlay.classList.contains("hidden")) return;
  const subtasksList = overlay.querySelector(".subtasksList");
  if (subtasksList) {
    subtasksList.innerHTML = renderTaskDetailSubtasks(task.subtasks, taskId);
  }
}
