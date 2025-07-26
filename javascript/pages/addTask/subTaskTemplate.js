/**
 * @fileoverview HTML templates for subtask functionality
 * Contains template functions for rendering subtasks in the Add Task feature
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates HTML template for displaying subtasks with edit and delete options
 * @param {Array} subtasks - Array of subtask objects to render
 * @returns {string} HTML string for the subtasks container
 */
function selectSubtask(subtasks = []) {
  if (!subtasks || subtasks.length === 0) {
    return `<div class="noSubtasks">
    </div>`;
  }
  let subtaskHTML = '<div class="subtasksContainer">';
  subtasks.forEach((subtask, index) => {
    subtaskHTML += `
      <div class="subtaskItem" data-index="${index}">
        <div class="subtaskContent">
          <span class="subtaskBullet">•</span>
          <span class="subtaskText" contenteditable="false">
            ${subtask.text}
            <div class="subtaskActions"> 
              <button class="deleteBtn" data-action="delete" title="deleteSubtask">
                  <img src="../assets/icons/shared/delete.svg" alt="deleteIcon">
              </button>
              <div class="subTaskDevider"></div>
              <button class="checkBtn" data-action="accept" title="acceptSubtask">
                <img src="../assets/icons/add task/check.svg" alt="acceptIcon" class="hover-icon">
              </button>
            </div>
          </span>
        </div>
      </div>
    `;
  });
  subtaskHTML += "</div>";
  return subtaskHTML;
}
