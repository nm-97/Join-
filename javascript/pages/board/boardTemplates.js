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
        <div id="toDoColumn" class="columnContent">
          ${renderTasksForColumn(tasks, "toDo")}
        </div>
      </div>
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">In progress</h2>
          <img src="../assets/icons/board/plus.svg" alt="addTaskIcon" onclick="addTaskToColumn('inProgress')">
        </div>
        <div id="inProgressColumn" class="columnContent">
          ${renderTasksForColumn(tasks, "inProgress")}
        </div>
      </div>
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Await feedback</h2>
          <img src="../assets/icons/board/plus.svg" alt="addTaskIcon" onclick="addTaskToColumn('awaitingFeedback')">
        </div>
        <div id="awaitingFeedbackColumn" class="columnContent">
          ${renderTasksForColumn(tasks, "awaitingFeedback")}
        </div>
      </div>
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Done</h2>
          <img src="../assets/icons/board/plus.svg" onclick="addTaskToColumn('done')" alt="addTaskIcon">
        </div>
        <div id="doneColumn" class="columnContent">
          ${renderTasksForColumn(tasks, "done")}
        </div>
      </div>
    </div>`;
}

/**
 * Generates HTML for the task detail overlay including title, description, and actions
 * @param {Object} task - The task object with details
 * @returns {string} HTML string for the task detail overlay
 */
function getTaskDetailOverlay(task) {
  const isResponsive =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(max-width: 1024px)").matches;
  const editIconName = isResponsive ? "edit hover.svg" : "edit.svg";
  const deleteIconName = isResponsive ? "delete hover.svg" : "delete.svg";
  const priority = (task.taskPriority || "medium").toLowerCase();
  const categoryLabel = getCategoryLabel(task.Category);
  const categoryClass = getCategoryClass(task.Category);
  const assignedContacts = task.assignedContacts || [];
  let assignedUsersHtml = "";
  if (assignedContacts.length === 0) {
    assignedUsersHtml = '<div class="assignedUser">Not assigned</div>';
  } else {
    assignedContacts.forEach((contact) => {
      const initials = getInitials(contact.name);
      const color = getAvatarColor(contact.name);
      assignedUsersHtml += `
        <div class="assignedUser">
          <div class="userAvatar" onclick="openContactOverlayFromTaskDetail('${contact.id}')" style="background-color: ${color};">${initials}</div>
          <span class="contactLink" onclick="openContactOverlayFromTaskDetail('${contact.id}')">${contact.name}</span>
        </div>
      `;
    });
  }

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
          ${assignedUsersHtml}
        </div>
        <div class="subtasksSection">
          <h3 class="subtasksTitle">Subtasks</h3>
          <div class="subtasksList">
            ${renderTaskDetailSubtasks(task.subtasks || [], task.id)}
          </div>
        </div>
        <div class="modalActions">
          <button class="modalButton" onclick="deleteTask('${task.id}')">
            <img src="../assets/icons/shared/${deleteIconName}" alt="delete">Delete
          </button>
          <hr>
          <button class="modalButton editButton" onclick="editTask('${
            task.id
          }')">
            <img src="../assets/icons/shared/${editIconName}" alt="edit">Edit
          </button>
        </div>
      </div>
    </div>`;
}

/**
 * Renders the subtasks list for the detail overlay or shows a placeholder if empty
 * @param {Array<Object>} subtasks - Array of subtask objects
 * @param {string} taskId - ID of the parent task
 * @returns {string} HTML string for the subtasks list
 */
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

/**
 * Filters tasks by status and renders them for a board column
 * @param {Array<Object>} tasks - All task objects
 * @param {string} status - Status key for the column
 * @returns {string} HTML string for the column content
 */
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

/**
 * Returns HTML for an empty state when no tasks are present in a column
 * @param {string} status - Column status key
 * @returns {string} HTML string for the empty state message
 */
function getEmptyStateTemplate(status) {
  const statusMessages = {
    toDo: "No tasks To do",
    inProgress: "No tasks in progress",
    awaitingFeedback: "No tasks awaiting feedback",
    done: "No tasks completed",
  };

  return `<div class="emptyState">${statusMessages[status]}</div>`;
}

/**
 * Generates HTML for a single task card element on the board
 * @param {Object} task - Task object data
 * @returns {string} HTML string for a task card
 */
function getTaskCardTemplate(task) {
  const priority = (task.taskPriority || "medium").toLowerCase();
  const assigneesHtml = renderTaskCardAssignees(task.assignedContacts || []);
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
  <div class="taskCard" data-task-id="${task.id}" 
     onpointerdown="startPointerDrag('${task.id}', event)"
     onclick="handleTaskCardClick('${task.id}', event)">
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
            ${assigneesHtml}
          </div>
          <img src="../assets/icons/shared/${priority}.svg" alt="${priority}">
        </div>
      </div>
    </div>`;
}

/**
 * Maps a category key to its display label
 * @param {string} category - Category identifier
 * @returns {string} Display label for the category
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
 * Maps a category key to its CSS class name
 * @param {string} category - Category identifier
 * @returns {string} CSS class for the category
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
 * Renders avatars for all assigned contacts in task cards
 * @param {Array} assignedContacts - Array of contact objects
 * @returns {string} HTML for all contact avatars in task cards
 */
function renderTaskCardAssignees(assignedContacts) {
  if (!assignedContacts || assignedContacts.length === 0) {
    return '<div class="noAssignee" title="Not assigned">NA</div>';
  }

  let avatarsHtml = "";
  const maxDisplay = 5;
  const visibleContacts = assignedContacts.slice(0, maxDisplay);
  const remainingCount = assignedContacts.length - maxDisplay;

  visibleContacts.forEach((contact) => {
    const initials = getInitials(contact.name);
    const color = getAvatarColor(contact.name);
    avatarsHtml += `
      <div class="assignee" style="background-color: ${color};" title="${contact.name}">
        ${initials}
      </div>
    `;
  });

  if (remainingCount > 0) {
    avatarsHtml += `<div class="assignee remainingCount" style="background-color: #cccccc; color: #666666;" title="${remainingCount} more contacts">+${remainingCount}</div>`;
  }

  return avatarsHtml;
}
