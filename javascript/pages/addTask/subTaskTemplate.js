/**
 * @fileoverview Pure HTML templates for subtask functionality
 * Contains only template functions for rendering - NO LOGIC
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates HTML template for displaying subtasks with edit and delete options
 * @param {Array} subtasks - Array of subtask objects to render
 * @param {string} editIcon - Name of the edit icon file
 * @param {string} deleteIcon - Name of the delete icon file
 * @returns {string} HTML string for the subtasks container
 */
function selectSubtask(
  subtasks = [],
  editIcon = "edit.svg",
  deleteIcon = "delete.svg"
) {
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
          <div class="subtaskTextWrapper">
            <span class="subtaskText" contenteditable="false">${subtask.text}</span>
            <div class="subtaskHoverActions">
              <img src="../assets/icons/shared/${editIcon}" 
                   alt="Edit" 
                   class="actionImg hoverEditImg" 
                   title="Bearbeiten"
                   onclick="startEditingSubtask(${index})">
              <img src="../assets/icons/shared/${deleteIcon}" 
                   alt="Delete" 
                   class="actionImg hoverDeleteImg" 
                   title="Löschen"
                   onclick="deleteSubtask(${index})">
            </div>
            <div class="subtaskActions">
              <button class="deleteBtn" data-action="delete" title="deleteSubtask">
                  <img src="../assets/icons/shared/delete.svg" alt="deleteIcon">
              </button>
              <div class="subTaskDevider"></div>
              <button class="checkBtn" data-action="accept" title="acceptSubtask">
                <img src="../assets/icons/add task/check.svg" alt="acceptIcon" class="hover-icon">
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  subtaskHTML += "</div>";
  return subtaskHTML;
}
