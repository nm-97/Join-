
function getBoardTemplate(tasks = []) {
  return `
    <div class="boardContainer">
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">To do</h2>
          <img src="../assets/icons/board/plus.svg" alt="" onclick="addTaskToColumn('toDo')">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'toDo')}
        </div>
      </div>

      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">In progress</h2>
          <img src="../assets/icons/board/plus.svg" alt="" onclick="addTaskToColumn('inProgress')">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'inProgress')}
        </div>
      </div>

      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Await feedback</h2>
          <img src="../assets/icons/board/plus.svg" alt="" onclick="addTaskToColumn('awaitingFeedback')">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'awaitingFeedback')}
        </div>
      </div>

      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Done</h2>
          <img src="../assets/icons/board/plus.svg" alt="" onclick="addTaskToColumn('done')">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'done')}
        </div>
      </div>
    </div>`;
}


function getTaskDetailOverlay(task) {
  const assignedPersonInitials = getInitials(task.assignedTo || '');
  const assignedPersonColor = getAvatarColor(task.assignedTo || '');
  const priority = (task.taskPriority || 'medium').toLowerCase();

  const categoryLabel = getCategoryLabel(task.Category);
  const categoryClass = getCategoryClass(task.Category);
  
  const subtasks = task.subtasks || [];
  
  return `
    <div class="overlay" id="taskOverlay">
      <div class="taskDetailModal">
        <div class="modalHeader">
          <span class="modalLabel ${categoryClass}">${categoryLabel}</span>
          <button class="closeButton" onclick="closeTaskOverlay()">
            <img src="../assets/icons/shared/close.svg" alt="close">
          </button>
        </div>
        
        <h2 class="modalTitle">${task.title || 'Untitled Task'}</h2>
        
        <p class="modalDescription">${task.description || 'No description available'}</p>
        
        <div class="detailRow">
          <span class="detailLabel">Due date:</span>
          <span class="detailValue">${formatDate(task.dueDate) || 'No due date'}</span>
        </div>
        
        <div class="detailRow">
          <span class="detailLabel">Priority:</span>
          <span class="detailValue">
            ${task.taskPriority || 'Medium'} <img src="../assets/icons/shared/${priority}.svg" alt="${priority}">
          </span>
        </div>
        
        <div class="detailRow">
          <span class="detailLabel">Assigned To:</span>
        </div>
        <div class="assignedUsers">
          <div class="assignedUser">
            <div class="userAvatar" style="background-color: ${assignedPersonColor};">${assignedPersonInitials}</div>
            <span>${task.assignedTo || 'Not assigned'}</span>
          </div>
        </div>

        <div class="subtasksSection">
          <h3 class="subtasksTitle">Subtasks</h3>
          <div class="subtasksList">
            ${renderSubtasks(task.subtasks || [], task.id)}
          </div>
        </div>
        
        <div class="modalActions">
          <button class="modalButton" onclick="deleteTask('${task.id}')">
            <img src="../assets/icons/shared/delete.svg" alt="delete">Delete
          </button>
          <hr>
          <button class="modalButton editButton" onclick="editTask('${task.id}')">
            <img src="../assets/icons/shared/edit.svg" alt="edit">Edit
          </button>
        </div>
      </div>
    </div>`;
}


function renderSubtasks(subtasks, taskId) {
  if (!subtasks || subtasks.length === 0) {
    return '<div class="noSubtasks">No subtasks available</div>';
  }
  
  let html = '';
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    const checkedClass = subtask.completed ? 'checked' : '';
    const iconSrc = subtask.completed ? 'checked button.svg' : 'check button.svg';
    
    html += `
      <div class="subtaskItem">
        <div class="checkbox ${checkedClass}" onclick="toggleSubtask('${taskId}', '${subtask.id}')"></div>
        <img src="../assets/icons/board/${iconSrc}" alt="">
        <span>${subtask.text || 'Untitled Subtask'}</span>
      </div>`;
  }
  return html;
}


function renderTasksForColumn(tasks, status) {
  // WICHTIG: Großes "S" verwenden
  const filteredTasks = tasks.filter(task => task.Status === status);
  
  if (filteredTasks.length === 0) {
    return getEmptyStateTemplate(status);
  }
  
  let html = '';
  for (let i = 0; i < filteredTasks.length; i++) {
    html += getTaskCardTemplate(filteredTasks[i]);
  }
  return html;
}


function getEmptyStateTemplate(status) {
  const statusMessages = {
    toDo: 'No tasks To do',
    inProgress: 'No tasks in progress',
    awaitingFeedback: 'No tasks awaiting feedback', 
    done: 'No tasks completed'
  };
  
  return `<div class="emptyState">${statusMessages[status]}</div>`;
}


function getTaskCardTemplate(task) {
  const priority = (task.taskPriority || 'medium').toLowerCase();
  const assignedPerson = task.assignedTo || '';
  
  const categoryLabel = getCategoryLabel(task.Category);
  const categoryClass = getCategoryClass(task.Category);

  const subtasks = task.subtasks || [
    { id: 'demo1', text: 'Setup project', completed: true },
    { id: 'demo2', text: 'Implementation', completed: false }
  ];
  
  const completedSubtasks = subtasks.filter(sub => sub.completed).length;
  const progressPercent = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  const hasSubtasks = subtasks.length > 0;
  
  return `
    <div class="taskCard" onclick="showTaskDetail('${task.id}')">
      <span class="taskLabel ${categoryClass}">${categoryLabel}</span>
      <h3 class="taskTitle">${task.title || 'Untitled Task'}</h3>
      <p class="taskDescription">${task.description || 'No description available'}</p>
      <div class="taskFooter">
        ${hasSubtasks ? `
          <div class="taskFooterTop">
            <div class="progressBar">
              <div class="progressFill" style="width: ${progressPercent}%"></div>
            </div>
            <span class="subtaskInfo">${completedSubtasks}/${subtasks.length} Subtasks</span>
          </div>
        ` : ''}
        <div class="taskFooterBottom">
          <div class="taskAssignees">
            ${renderSingleAssignee(assignedPerson)}
          </div>
          <img src="../assets/icons/shared/${priority}.svg" alt="${priority}">
        </div>
      </div>
    </div>`;
}


function getCategoryLabel(category) {
  const categoryMap = {
    'technicalTask': 'Technical Task',
    'userStory': 'User Story',    
  };
  return categoryMap[category] || 'Technical Task';
}


function getCategoryClass(category) {
  const classMap = {
    'technicalTask': 'technicalTask',
    'userStory': 'userStory',     
  };
  return classMap[category] || 'technicalTask';
}


function renderSingleAssignee(assignedTo) {
  if (!assignedTo) return '';
  
  const initials = getInitials(assignedTo);
  const color = getAvatarColor(assignedTo);
  return `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
}
