"use strict";

function getAddContactOverlay(params) {
  return `
         <div class="addContactModal">
                        <div class="addContactModalLeft">
                            <img class="addContactLogo" src="../assets/icons/joinlogo.svg" alt="Join Logo">
                            <h2 class="addContactTitle">Add contact</h2>
                            <p class="addContactSubtitle">Tasks are better with a team!</p>
                            <div class="addContactUnderline"></div>
                        </div>
                        <div class="addContactModalRight">
                            <button class="addContactClose" onclick="closeOverlay()">
                                <img src="../assets/icons/shared/close.svg" alt="">
                            </button>
                            <div class="addContactFormAvatarPosition">
                                <div class="addContactAvatar">
                                    <img src="../assets/icons/contacts/person.svg" alt="Avatar">
                                </div>
                                <form class="addContactForm" onsubmit="createContact(event)">
                                    <div class="addContactInputWrapper">
                                        <input type="text" name="name" placeholder="Name" required>
                                        <img src="../assets/icons/contacts/person.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input type="email" name="email" placeholder="Email" required>
                                        <img src="../assets/icons/contacts/mail.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactInputWrapper">
                                        <input type="tel" name="phone" placeholder="Phone" required>
                                        <img src="../assets/icons/contacts/call.svg" class="inputIcon" alt="">
                                    </div>
                                    <div class="addContactBtnRow">
                                        <button type="button" class="addContactCancelBtn" onclick="closeOverlay()">Cancel
                                            <img src="../assets/icons/shared/close.svg" alt=""></button>
                                        <button type="submit" class="addContactCreateBtn">Create contact
                                            <img src="../assets/icons/add task/check.svg" alt=""></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>`;
}

function getEditContactOverlay(params) {
  return `<div class="editContactModal">
                    <div class="editContactModalLeft">
                        <img class="editContactLogo" src="../assets/icons/joinlogo.svg" alt="Join Logo">
                        <h2 class="editContactTitle">Edit contact</h2>
                        <div class="editContactUnderline"></div>
                    </div>
                    <div class="editContactModalRight">
                        <button class="editContactClose" onclick="closeEditContactOverlay()">
                            <img src="../assets/icons/shared/Close.svg" alt="">
                        </button>
                        <div class="addContactFormAvatarPosition">
                            <div class="editContactAvatar">
                                <img src="../assets/icons/contacts/person.svg" alt="Avatar">
                            </div>
                            <form class="editContactForm">
                                <div class="editContactInputWrapper">
                                    <input type="text" placeholder="Name" required>
                                    <img src="../assets/icons/contacts/person.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input type="email" placeholder="Email" required>
                                    <img src="../assets/icons/contacts/mail.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactInputWrapper">
                                    <input type="tel" placeholder="Phone" required>
                                    <img src="../assets/icons/contacts/call.svg" class="inputIcon" alt="">
                                </div>
                                <div class="editContactBtnRow">
                                    <button type="button" class="editContactDeleteBtn">Cancel
                                        <img src="../assets/contacts/Close.svg" alt=""></button>
                                    <button type="submit" class="editContactSaveBtn">Save
                                        <img src="../assets/icons/add task/check.svg" alt=""></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>`;
}

function getFloatingContact(contact) {
  const initials = contact.name.charAt(0).toUpperCase();
  const color = getAvatarColor(contact.name);

  return `<div class="floatingContactMainContent">
    <div class="floatingContactCard">
      <div class="floatingContactHeader">
        <div class="floatingContactAvatar" style="background-color: ${color};">${initials}</div>
        <div class="floatingContactName">
          <span>${contact.name}</span>
          <div class="floatingContactActions">
            <button onclick="showEditContactOverlay('${contact.id}')" class="editBtn">
              <img src="../assets/icons/shared/edit.svg" alt="">
              Edit
            </button>
            <button onclick="deleteContactFromFirebase('${contact.id}')" class="deleteBtn">
              <img src="../assets/icons/shared/delete.svg" alt="">
              Delete
            </button>
          </div>
        </div>
      </div>
      <div class="floatingContactInfo">
        <div class="floatingContactInfoLabel">
          <p>Contact Information</p>
        </div>
        <div class="floatingContactInfoDetails">
          <span>Email</span><br>
          <a href="mailto:${contact.email}">${contact.email}</a><br><br>
          <span>Phone</span><br>
          <p>${contact.phone}</p>
        </div>
      </div>
    </div>
  </div>`;
}

function getContactTemplate(contact) {
  const initials = contact.name.charAt(0).toUpperCase();
  const color = getAvatarColor(contact.name);
  return `<div class="contactItem" onclick="showFloatingContact('${contact.id}')">
    <div class="contactAvatar" style="background-color: ${color};">${initials}</div>
    <div class="contactInfo">
      <div class="contactName">${contact.name}</div>
      <div class="contactEmail">${contact.email}</div>
    </div>
  </div>`;
}

function getAvatarColor(name) {
  const colors = ["#FF8A00", "#9327FF", "#29ABE2", "#FF5EB3", "#6E52FF"];
  return colors[name.charCodeAt(0) % colors.length];
}

function getSuccessContactMessageTemplate(params) {
  return `
<div class="ntfUpRight ntfMask">Contact Finished</div>`;
}

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
          <img src="../assets/icons/board/plus.svg" alt="" onclick="addTaskToColumn('Urgent')">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'Urgent')}
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
  const filteredTasks = tasks.filter(task => task.Category === status);
  
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
    Urgent: 'No tasks awaiting feedback',
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
    'toDo': 'Technical Task',
    'inProgress': 'User Story', 
    'Urgent': 'User Story',
    'done': 'Technical Task'
  };
  return categoryMap[category] || 'Technical Task';
}

function getCategoryClass(category) {
  const classMap = {
    'toDo': 'technicalTask',
    'inProgress': 'userStory',
    'Urgent': 'userStory', 
    'done': 'technicalTask'
  };
  return classMap[category] || 'technicalTask';
}

function renderSingleAssignee(assignedTo) {
  if (!assignedTo) return '';
  
  const initials = getInitials(assignedTo);
  const color = getAvatarColor(assignedTo);
  return `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
}

function getInitials(name) {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  }
  return name.charAt(0).toUpperCase() + (name.charAt(1) || '').toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE');
}