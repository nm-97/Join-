
function getAddTaskOverlay(params = {}) {
  return `
        <div class="overlayContent">
            <button class="closeBtn" onclick="closeAddTaskOverlay()">&times;</button>
            
            <h1 class="addTaskH1">Add Task</h1>
            
            <div class="addTaskFormsWrapper">
                <form>
                    <div class="formGroup">
                        <label for="taskTitle">Title <span class="requiredStar">*</span></label>
                        <input type="text" placeholder="Enter a title" id="taskTitle" name="taskTitle" required>
                    </div>
                    <div class="formGroup">
                        <label for="taskDescription">Description <span class="requiredStar">*</span></label>
                        <textarea id="taskDescription" placeholder="Enter a description" name="taskDescription" required></textarea>
                    </div>
                    <div class="formGroup">
                        <label for="taskDueDate">Due Date <span class="requiredStar">*</span></label>
                        <div class="inputIcon">
                            <input placeholder="dd/mm/yyyy" id="taskDueDate" name="taskDueDate" required>
                            <img src="../assets/icons/add task/event.svg" alt="">
                        </div>
                    </div>
                </form>
                
                <div class="addTaskFormsDivider"></div>
                
                <form>
                    <div class="formGroup">
                        <label for="taskPriority" class="taskPriorityLabel">Task Priority</label>
                        <div class="taskPriorityGroup">
                            <button type="button" class="taskPriorityBtn" id="urgentBtn">
                                <img src="../assets/icons/shared/urgent.svg" alt="">
                                <span>Urgent</span>
                            </button>
                            <button type="button" class="taskPriorityBtnOrange" id="mediumBtn">
                                <img src="../assets/icons/shared/medium.svg" alt="">
                                <span>Medium</span>
                            </button>
                            <button type="button" class="taskPriorityBtn" id="lowBtn">
                                <img src="../assets/icons/shared/low.svg" alt="">
                                <span>Low</span>
                            </button>
                        </div>
                    </div>
                    <div class="formGroup">
                        <label for="taskAssignee">Assigned to <span class="requiredStar">*</span></label>
                        <select id="taskAssignee" name="taskAssignee" required>
                            <option value="" disabled selected hidden>Select contacts to assign</option>
                        </select>
                    </div>
                    <div class="formGroup">
                        <label for="taskStatus">Category <span class="requiredStar">*</span></label>
                        <select id="taskStatus" name="taskStatus" required>
                            <option value="" disabled selected hidden>Select task category</option>
                            <option value="userStory">User Story</option>
                            <option value="technicalTask">Technical Task</option>
                        </select>
                    </div>
                    <div class="formGroup">
                        <label for="Subtask">Subtask</label>
                        <input type="text" placeholder="Add new subtask" id="taskSubtask" name="taskSubtask">
                    </div>
                    <div class="formActions">
                        <span class="requiredStarText">*This field is required</span>
                        <div class="formButtons">
                            <button type="button" class="cancelTaskBtn" id="clearTaskBtn">
                                Clear
                                <img src="../assets/icons/shared/close.svg" alt="cancel icon">
                            </button>
                            <button type="button" class="addTaskBtn" id="createTaskBtn">
                                Create Task
                                <img src="../assets/icons/add task/check.svg" alt="check icon">
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>`;
}

function getEditTaskOverlay(task) {
  const assignedPersonInitials = getInitials(task.assignedTo || '');
  const assignedPersonColor = getAvatarColor(task.assignedTo || '');
  
  return `
    <div class="overlay">
      <div class="taskDetailModal">
        <div class="modalHeader">
          <button class="closeButton" onclick="closeEditTaskOverlay()">
            <img src="../assets/icons/shared/close.svg" alt="close">
          </button>
        </div>
        
        <div class="editFormGroup">
          <label class="editLabel">Title</label>
          <input type="text" id="editTaskTitle" placeholder="Title" class="editInput" value="${task.title || ''}">
        </div>
        
        <div class="editFormGroup">
          <label class="editLabel">Description</label>
          <textarea id="editTaskDescription" placeholder="Description" class="editTextarea">${task.description || ''}</textarea>
        </div>
        
        <div class="editFormGroup">
          <label class="editLabel">Due date</label>
          <div class="editInputIcon">
            <input type="date" id="editTaskDueDate" placeholder="Due Date" class="editInput" value="${task.dueDate || ''}">
            <img src="../assets/icons/add task/event.svg" class="editDateIcon">
          </div>
        </div>
        
        <div class="formGroup">
          <label for="taskPriority" class="taskPriorityLabel">Task Priority</label>
            <div class="taskPriorityGroup">
                <button type="button" class="taskPriorityBtn" id="urgentBtn">
                <img src="../assets/icons/shared/urgent.svg" alt="">
                <span>Urgent</span>
                </button>
              <button type="button" class="taskPriorityBtnOrange" id="mediumBtn">
                <img src="../assets/icons/shared/medium.svg" alt="">
                <span>Medium</span>
              </button>
              <button type="button" class="taskPriorityBtn" id="lowBtn">
                <img src="../assets/icons/shared/low.svg" alt="">
                <span>Low</span>
              </button>
            </div>
        </div>
        
        <div class="editFormGroup">
          <label class="editLabel">Assigned to</label>
          <select placeholder="Choose the Contact" id="editTaskAssignee" class="editInput">
            <option value="" disabled hidden>Select contacts to assign</option>
          </select>
          <div class="assignedUsers">
            <div class="assignedUser">
            <div class="userAvatar" style="background-color: ${assignedPersonColor};">${assignedPersonInitials}</div>
            <span>${task.assignedTo || 'Not assigned'}</span>
          </div>
        </div>
        </div>
        
        <div class="editFormGroup editFormGroupLast">
          <label class="editLabel">Subtasks</label>
          <div class="editSubtaskInput">
            <input type="text" id="editTaskSubtask" placeholder="Add new subtask" class="editInput">
            <span class="editSubtaskAdd">+</span>
          </div>
          <div class="editSubtaskList">
            <div class="editSubtaskItem">
              <span class="editSubtaskBullet"></span>
              <span>Implement Recipe Recommendation</span>
            </div>
            <div class="editSubtaskItem">
              <span class="editSubtaskBullet"></span>
              <span>Start Page Layout</span>
            </div>
          </div>
        </div>
        
        <div class="editButtonContainer">
          <button class="editOkBtn" id="editSaveBtn">
            Ok
            <img src="../assets/icons/add task/check.svg">
          </button>
        </div>
      </div>
    </div>`;
}


function getTaskNotificationTemplate(message = 'Task added to board') {
  return `
    <div class="ntfbottom ntfmask" id="taskNotification">${message}
      <img src="../assets/icons/summary and sideboard/board.svg" alt="">
    </div>`;
}
