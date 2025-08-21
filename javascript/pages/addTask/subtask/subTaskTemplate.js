/**
 * @fileoverview HTML templates for subtask functionality
 * Contains template functions for rendering subtasks in the Add Task feature
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates HTML template for displaying empty subtasks container
 * @returns {string} HTML string for empty subtasks container
 */
function getEmptySubtasksTemplate() {
  return `<div class="noSubtasks">
    </div>`;
}

/**
 * Generates HTML template for subtasks container wrapper
 * @param {string} content - The inner content for the container
 * @returns {string} HTML string for the subtasks container
 */
function getSubtasksContainerTemplate(content) {
  return `<div class="subtasksContainer">${content}</div>`;
}

/**
 * Generates HTML template for a single subtask item
 * @param {Object} subtask - Subtask object with text property
 * @param {number} index - Index of the subtask in the array
 * @param {string} editIconName - Name of the edit icon file
 * @param {string} deleteIconName - Name of the delete icon file
 * @returns {string} HTML string for a single subtask item
 */
function getSubtaskItemTemplate(subtask, index, editIconName, deleteIconName) {
  return `
    <div class="subtaskItem" data-index="${index}">
      <div class="subtaskContent">
        <span class="subtaskBullet">•</span>
        <div class="subtaskTextWrapper">
          <span class="subtaskText" contenteditable="false">${subtask.text}</span>
          <div class="subtaskHoverActions">
            <img src="../assets/icons/shared/${editIconName}" 
                 alt="Edit" 
                 class="actionImg hoverEditImg" 
                 title="Bearbeiten"
                 onclick="startEditingSubtask(${index})">
            <img src="../assets/icons/shared/${deleteIconName}" 
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
}
