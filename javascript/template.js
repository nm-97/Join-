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
            <button onclick="deleteContact('${contact.id}')" class="deleteBtn">
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

function getSuccessMessageTemplate(params) {
  return `
    <div class="successMessage" id="successMessage">
      <div class="successMessageContent">
        <img src="../assets/icons/shared/check.svg" class="successIcon" alt="Success">
        <span class="successText">${params.message}</span>
      </div>
    </div>`;
}



function getBoardTemplate(tasks = []) {
  return `
      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">To do</h2>
          <img src="../assets/icons/board/plus.svg" alt="">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'todo')}
        </div>
      </div>

      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">In progress</h2>
          <img src="../assets/icons/board/plus.svg" alt="">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'progress')}
        </div>
      </div>

      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Await feedback</h2>
          <img src="../assets/icons/board/plus.svg" alt="">
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'feedback')}
        </div>
      </div>

      <div class="boardColumn">
        <div class="columnHeader">
          <h2 class="columnTitle">Done</h2>
        </div>
        <div class="columnContent">
          ${renderTasksForColumn(tasks, 'done')}
        </div>
    </div>`;
}

function renderTasksForColumn(tasks, status) {
  const filteredTasks = tasks.filter(task => task.status === status);
  
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
    todo: 'No tasks To do',
    progress: 'No tasks in progress',
    feedback: 'No tasks awaiting feedback',
    done: 'No tasks completed'
  };
  
  return `<div class="emptyState">${statusMessages[status]}</div>`;
}

function getTaskCardTemplate(task) {
  const categoryClass = task.category === 'User Story' ? 'userStory' : 'technicalTask';
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;
  const completedSubtasks = hasSubtasks ? task.subtasks.filter(subtask => subtask.completed).length : 0;
  const progressPercent = hasSubtasks ? (completedSubtasks / task.subtasks.length) * 100 : 0;
  
  return `
    <div class="taskCard" onclick="showTaskDetail('${task.id}')">
      <span class="taskLabel ${categoryClass}">${task.category}</span>
      <h3 class="taskTitle">${task.title}</h3>
      <p class="taskDescription">${task.description}</p>
      <div class="taskFooter">
        ${hasSubtasks ? `
          <div class="progressBar">
            <div class="progressFill" style="width: ${progressPercent}%"></div>
          </div>
          <span class="subtaskInfo">${completedSubtasks}/${task.subtasks.length} Subtasks</span>
        ` : ''}
        <div class="taskAssignees">
          ${renderTaskAssignees(task.assignees)}
        </div>
        <img src="../assets/icons/shared/${task.priority}.svg" alt="${task.priority}">
      </div>
    </div>`;
}

function renderTaskAssignees(assignees) {
  if (!assignees || assignees.length === 0) return '';
  
  let html = '';
  for (let i = 0; i < assignees.length; i++) {
    const assignee = assignees[i];
    const initials = getInitials(assignee.name);
    const color = getAvatarColor(assignee.name);
    html += `<span class="assignee" style="background-color: ${color}">${initials}</span>`;
  }
  return html;
}

function getInitials(name) {
  if (!name) return '';
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  }
  return name.charAt(0).toUpperCase() + (name.charAt(1) || '').toUpperCase();
}