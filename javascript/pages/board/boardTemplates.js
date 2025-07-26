/**
 * @fileoverview HTML templates for the Board page
 * Contains template functions for rendering the task board and its components
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates the main board template with all columns and tasks
 * @param {Array} tasks - Array of task objects to render on the board
 * @returns {string} HTML string for the complete board layout
 */
function getBoardTemplate(tasks = []) {
  return `
    <div class="boardContainer">
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">To do</h2>
          <img src="../assets/icons/board/plus.svg" alt="addTaskIcon" onclick="addTaskToColumn('toDo')">
        </div>
        <div id="toDoColumn" class="columnContent" ondrop="dropToAnotherColumn(event)" ondragover="moveToAnotherColumn(event)">
          ${renderTasksForColumn(tasks, "toDo")}
        </div>
      </div>
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">In progress</h2>
          <img src="../assets/icons/board/plus.svg" alt="addTaskIcon" onclick="addTaskToColumn('inProgress')">
        </div>
        <div id="inProgressColumn" class="columnContent" ondrop="dropToAnotherColumn(event)" ondragover="moveToAnotherColumn(event)">
          ${renderTasksForColumn(tasks, "inProgress")}
        </div>
      </div>
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Await feedback</h2>
          <img src="../assets/icons/board/plus.svg" alt="addTaskIcon" onclick="addTaskToColumn('awaitingFeedback')">
        </div>
        <div id="awaitingFeedbackColumn" class="columnContent" ondrop="dropToAnotherColumn(event)" ondragover="moveToAnotherColumn(event)">
          ${renderTasksForColumn(tasks, "awaitingFeedback")}
        </div>
      </div>
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Done</h2>
          <img src="../assets/icons/board/plus.svg" onclick="addTaskToColumn('done')" alt="addTaskIcon">
        </div>
        <div id="doneColumn" class="columnContent" ondrop="dropToAnotherColumn(event)" ondragover="moveToAnotherColumn(event)">
          ${renderTasksForColumn(tasks, "done")}
        </div>
      </div>
    </div>`;
}

function getTaskDetailOverlay(task) {
  const assignedPersonName = task.assignedToName || "Not assigned";
  const assignedPersonInitials = getInitials(assignedPersonName);
  const assignedPersonColor = getAvatarColor(assignedPersonName);
  const priority = (task.taskPriority || "medium").toLowerCase();
  const categoryLabel = getCategoryLabel(task.Category);
  const categoryClass = getCategoryClass(task.Category);

  return `
    <div class="overlay" id="taskOverlay">
      <div class="taskDetailModal">
        <div class="modalHeader">
          <span class="modalLabel ${categoryClass}">${categoryLabel}</span>
          <button class="closeButton" onclick="closeTaskOverlay()">
            <img src="../assets/icons/shared/close.svg" alt="close">
          </button>
        </div>
        <h2 class="modalTitle">${task.title || "Untitled Task"}</h2>
        <p class="modalDescription">${
          task.description || "No description available"
        }</p>
        <div class="detailRow">
          <span class="detailLabel">Due date:</span>
          <span class="detailValue">${
            formatDate(task.dueDate) || "No due date"
          }</span>
        </div>
        <div class="detailRow">
          <span class="detailLabel">Priority:</span>
          <span class="detailValue">
            ${
              task.taskPriority || "Medium"
            } <img src="../assets/icons/shared/${priority}.svg" alt="${priority}">
          </span>
        </div>
        <div class="detailRow">
          <span class="detailLabel">Assigned To:</span>
        </div>
        <div class="assignedUsers">
          <div class="assignedUser">
            <div class="userAvatar" style="background-color: ${assignedPersonColor};">${assignedPersonInitials}</div>
            <span>${assignedPersonName}</span>
          </div>
        </div>
        <div class="subtasksSection">
          <h3 class="subtasksTitle">Subtasks</h3>
          <div class="subtasksList">
            ${renderTaskDetailSubtasks(task.subtasks || [], task.id)}
          </div>
        </div>
        <div class="modalActions">
          <button class="modalButton" onclick="deleteTask('${task.id}')">
            <img src="../assets/icons/shared/delete.svg" alt="delete">Delete
          </button>
          <hr>
          <button class="modalButton editButton" onclick="editTask('${
            task.id
          }')">
            <img src="../assets/icons/shared/edit.svg" alt="edit">Edit
          </button>
        </div>
      </div>
    </div>`;
}

function renderTaskDetailSubtasks(subtasks, taskId) {
  if (!subtasks || subtasks.length === 0) {
    return '<div class="noSubtasks">No subtasks available</div>';
  }

  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    const iconSrc = subtask.completed
      ? "checked button hover.svg"
      : "check button.svg";

    html += `
      <div class="subtaskItem">
        <img src="../assets/icons/board/${iconSrc}" alt="subtaskIcon" class="subtaskCheckbox" onclick="toggleSubtask('${taskId}', '${
      subtask.id
    }')">
        <span>${subtask.text || "Untitled Subtask"}</span>
      </div>`;
  }

  return html;
}

function renderTasksForColumn(tasks, status) {
  const filteredTasks = tasks.filter((task) => task.Status === status);
  if (filteredTasks.length === 0) {
    return getEmptyStateTemplate(status);
  }
  let html = "";
  for (let i = 0; i < filteredTasks.length; i++) {
    html += getTaskCardTemplate(filteredTasks[i]);
  }
  return html;
}

function getEmptyStateTemplate(status) {
  const statusMessages = {
    toDo: "No tasks To do",
    inProgress: "No tasks in progress",
    awaitingFeedback: "No tasks awaiting feedback",
    done: "No tasks completed",
  };

  return `<div class="emptyState">${statusMessages[status]}</div>`;
}

function getTaskCardTemplate(task) {
  const priority = (task.taskPriority || "medium").toLowerCase();
  const assignedPersonName = task.assignedToName || "";
  const categoryLabel = getCategoryLabel(task.Category);
  const categoryClass = getCategoryClass(task.Category);
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(
    (sub) => sub && sub.completed
  ).length;
  const progressPercent =
    subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  const hasSubtasks = subtasks.length > 0;
  return `
    <div class="taskCard" data-task-id="${task.id}" draggable="true" 
         ondragstart="startDragging('${task.id}')" 
         onclick="showTaskDetail('${task.id}')">
      <span class="taskLabel ${categoryClass}">${categoryLabel}</span>
      <h3 class="taskTitle">${task.title || "Untitled Task"}</h3>
      <p class="taskDescription">${
        task.description || "No description available"
      }</p>
      <div class="taskFooter">
        ${
          hasSubtasks
            ? `
          <div class="taskFooterTop">
            <div class="progressBar">
              <div class="progressFill" style="width: ${progressPercent}%"></div>
            </div>
            <span class="subtaskInfo">${completedSubtasks}/${subtasks.length} Subtasks</span>
          </div>
        `
            : ""
        }
        <div class="taskFooterBottom">
          <div class="taskAssignees">
            ${renderSingleAssignee(assignedPersonName)}
          </div>
          <img src="../assets/icons/shared/${priority}.svg" alt="${priority}">
        </div>
      </div>
    </div>`;
}

function getCategoryLabel(category) {
  const categoryMap = {
    "Technical Task": "Technical Task",
    "User Story": "User Story",
    technicalTask: "Technical Task",
    userStory: "User Story",
  };
  return categoryMap[category] || "Technical Task";
}

function getCategoryClass(category) {
  const classMap = {
    "Technical Task": "technicalTask",
    "User Story": "userStory",
    technicalTask: "technicalTask",
    userStory: "userStory",
  };
  return classMap[category] || "technicalTask";
}

function renderSingleAssignee(assignedToName) {
  if (!assignedToName) return "";
  const initials = getInitials(assignedToName);
  const color = getAvatarColor(assignedToName);
  if (!initials || initials === "") {
    return `<span class="assignee" style="background-color: #FF8A00;">?</span>`;
  }
  return `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
}
