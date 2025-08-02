/**
 * @fileoverview HTML templates for the Add Task functionality
 * Contains all template functions for rendering Add Task forms and overlays
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Generates HTML template for the Add Task overlay
 * @param {Object} params - Optional parameters for customizing the template
 * @returns {string} HTML string for the Add Task overlay
 */
function getAddTaskOverlay(params = {}) {
  return `
       <div class="overlayContent">
           <button class="closeBtn" onclick="closeAddTaskOverlay()">&times;</button>
           <h1 class="addTaskH1">Add Task</h1>
           <div class="addTaskFormsWrapper">
               <form>
                 <div class="formGroup">
                   <label for="taskTitle"
                     >Title <span class="requiredStar">*</span></label>
                   <input type="text" placeholder="Enter a title" id="taskTitle" name="taskTitle"/>
                   <div class="errorMessage hide"></div>
                 </div>
                 <div class="formGroup">
                   <label for="taskDescription">Description</label>
                   <textarea id="taskDescription" placeholder="Enter a description" name="taskDescription"></textarea>
                 </div>
                 <div class="formGroup">
                   <label for="taskDueDate" >Due Date <span class="requiredStar">*</span></label>
                   <div class="inputIcon">
                     <input placeholder="dd/mm/yyyy" id="taskDueDate" name="taskDueDate" maxlength="10" autocomplete="off"/>
                     <img src="../assets/icons/add task/event.svg" alt="calendarIcon"/>
                   </div>
                   <div class="errorMessage hide" id="taskDueDateError"></div>
                 </div>
               </form>
               <div class="addTaskFormsDivider"></div>
               <form>
                 <div class="formGroup">
                   <label class="taskPriorityLabel">Task Priority</label>
                   <div class="taskPriorityGroup">
                     <button type="button" class="taskPriorityBtn" id="urgentBtn">
                       <img src="../assets/icons/shared/urgent.svg" alt="urgentIcon"/>
                       <span>Urgent</span>
                     </button>
                     <button type="button" class="taskPriorityBtn" id="mediumBtn">
                       <img src="../assets/icons/shared/medium.svg" alt="mediumIcon"/>
                       <span>Medium</span>
                     </button>
                     <button type="button" class="taskPriorityBtn" id="lowBtn">
                       <img src="../assets/icons/shared/low.svg" alt="lowIcon" />
                       <span>Low</span>
                     </button>
                     <div class="errorMessage hide"></div>
                   </div>
                 </div>
                 <div class="formGroup">
                   <label for="dropdownInput">Assigned to <span class="requiredStar">*</span></label>
                   <div class="customDropdownContainer">
                     <div class="customDropdown" id="customDropdown">
                       <div class="dropdownHeader">
                         <input type="text" class="dropdownInput" id="dropdownInput" name="taskAssignee" placeholder="Select contacts to assign" readonly/>
                         <button type="button" class="dropdownArrow" id="dropdownArrow"></button>
                       </div>
                       <div class="dropdownContent" id="dropdownContent">
                         <div class="contactsList" id="contactsDropdownList">
                           <!-- Contacts werden hier dynamisch eingefügt -->
                         </div>
                       </div>
                     </div>
                     <div class="selectedContactsDisplay" id="selectedContactsDisplay">
                       <!-- Ausgewählte Kontakte werden hier angezeigt -->
                     </div>
                   </div>
                   <div class="errorMessage hide"></div>
                 </div>
                 <div class="formGroup">
                   <label for="categoryDropdownInput"
                     >Category <span class="requiredStar">*</span></label>
                   <div class="customDropdownContainer">
                   <div class="customDropdown" id="customCategoryDropdown">
                      <div class="dropdownHeader">
                         <input type="text" class="dropdownInput" id="categoryDropdownInput" name="taskCategory" placeholder="Select task category"readonly/>
                           <button type="button" class="dropdownArrow" id="categoryDropdownArrow"></button>
                       </div>
                         <div class="dropdownContent" id="categoryDropdownContent">
                             <div class="contactsList" id="categoriesDropdownList">
                                   <!-- Categories werden hier dynamisch eingefügt -->
                                 </div>
                               </div>
                             </div>
                   <div class="errorMessage hide"></div>
                 </div>
                 <div class="formGroup">
                   <label for="taskSubtask">Subtask</label>
                   <div class="inputIcon">
                     <input type="text" placeholder="Add new subtask" id="taskSubtask" name="taskSubtask" multiple/>
                     <img src="../assets/icons/board/addtask.svg" alt="addSubtask" id="createSubtaskButton"/>
                   </div>
                     <div id="editableDiv" class="subtaskDisplayContainer">
                  </div>
                 </div>
                  <div class="formActions">
                  <span class="requiredStarText">* This field is required</span>
                  <div class="formButtons">
                    <button type="button" class="cancelTaskBtn" id="clearTaskBtn">Clear
                    <img src="../assets/icons/shared/close.svg" alt="cancel icon"/>
                  </button>
                  <button type="button" class="addTaskBtn" id="createTaskBtn">
                    Create Task
                    <img src="../assets/icons/add task/check.svg" alt="check icon"/>
                  </button>
                  </div>
                 </div>
               </form>
           </div>
       </div>`;
}

/**
 * Generates HTML template for the Edit Task overlay
 * @param {Object} task - Task object containing task data for editing
 * @returns {string} HTML string for the Edit Task overlay
 */
function getEditTaskOverlay(task) {
  const assignedContacts = task.assignedContacts || [];
  let assignedInfoHtml = "";
  if (assignedContacts.length === 0) {
    assignedInfoHtml = '<div class="assignedInfo">Not assigned</div>';
  } else {
    assignedContacts.forEach((contact) => {
      const initials = getInitials(contact.name);
      const color = getAvatarColor(contact.name);
      assignedInfoHtml += `
        <div class="assignedInfo">
          <div class="userAvatar" style="background-color: ${color};">${initials}</div>
          <span>${contact.name}</span>
        </div>
      `;
    });
  }
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
          <input type="text" id="editTaskTitle" placeholder="Title" class="editInput" value="${
            task.title || ""
          }">
        </div>
        <div class="editFormGroup">
          <label class="editLabel">Description</label>
          <textarea id="editTaskDescription" placeholder="Description" class="editTextarea">${
            task.description || ""
          }</textarea>
        </div>
        <div class="editFormGroup">
          <label class="editLabel">Due date</label>
          <div class="editInputIcon">
            <input type="text" id="editTaskDueDate" placeholder="Due Date" class="editInput" value="${
              task.dueDate || ""
            }">
            <img src="../assets/icons/add task/event.svg" class="editDateIcon" alt="calendarIcon">
          </div>
        </div>
        <div class="formGroup">
          <label class="taskPriorityLabel">Task Priority</label>
            <div class="taskPriorityGroup">
                <button type="button" class="taskPriorityBtn" id="urgentBtn">
                <img src="../assets/icons/shared/urgent.svg" alt="urgentIcon">
                <span>Urgent</span>
                </button>
              <button type="button" class="taskPriorityBtn" id="mediumBtn">
                <img src="../assets/icons/shared/medium.svg" alt="mediumIcon">
                <span>Medium</span>
              </button>
              <button type="button" class="taskPriorityBtn" id="lowBtn">
                <img src="../assets/icons/shared/low.svg" alt="lowIcon">
                <span>Low</span>
              </button>
            </div>
        </div>
        <div class="editFormGroup">
         <label for="dropdownInput">Assigned to <span class="requiredStar">*</span></label>
               <div class="customDropdownContainer">
                 <div class="customDropdown" id="customDropdown">
                   <div class="dropdownHeader">
                     <input type="text" class="dropdownInput" id="dropdownInput" name="taskAssignee" placeholder="Select contacts to assign" readonly/>
                     <button type="button" class="dropdownArrow" id="dropdownArrow"></button>
                   </div>
                   <div class="dropdownContent" id="dropdownContent">
                     <div class="contactsList" id="contactsDropdownList">
                       <!-- Contacts werden hier dynamisch eingefügt -->
                     </div>
                   </div>
                 </div>
                 <div class="selectedContactsDisplay" id="selectedContactsDisplay">
                   <!-- Ausgewählte Kontakte werden hier angezeigt -->
                 </div>
               </div>
               <div class="errorMessage hide"></div>
        </div>
        <div class="editFormGroup editFormGroupLast">
           <label for="taskSubtask">Subtask</label>
               <div class="inputIcon">
                 <input type="text" placeholder="Add new subtask" id="taskSubtask" name="taskSubtask" multiple/>
                 <img src="../assets/icons/board/addtask.svg" alt="addSubtask" id="createSubtaskButton"/>
               </div>
               <div id="editableDiv" class="subtaskDisplayContainer">
               </div>
        </div>
        <div class="editButtonContainer">
          <button class="editOkBtn" id="editSaveBtn">
            Ok
            <img src="../assets/icons/add task/check.svg" alt="checkIcon">
          </button>
        </div>
      </div>
    </div>`;
}

/**
 * Generates HTML for the success notification when a task is added
 * @returns {string} HTML string for the task added notification
 */
function getSuccessAddTaskMessageTemplate() {
  return `  <div class="ntfcenterS ntfmask" id="taskNotification">Task added to board
   <img src="../assets/icons/summary and sideboard/board.svg" alt="boardIcon"></img>
    </div>`;
}

/**
 * Generates the main form HTML content for the Add Task page
 * @returns {string} HTML string for the add task main content
 */
function getaddTaskMainContent() {
  return ` <form>
             <div class="formGroup">
               <label for="taskTitle">Title <span class="requiredStar">*</span></label>
               <input type="text" placeholder="Enter a title" id="taskTitle" name="taskTitle"/>
               <div class="errorMessage hide"></div>
             </div>
             <div class="formGroup">
               <label for="taskDescription">Description</label>
               <textarea id="taskDescription" placeholder="Enter a description" name="taskDescription"></textarea>
             </div>

             <div class="formGroup">
               <label for="taskDueDate" >Due Date <span class="requiredStar">*</span></label>
               <div class="inputIcon">
                 <input placeholder="dd/mm/yyyy" id="taskDueDate" name="taskDueDate" maxlength="10" autocomplete="off"/>
                 <img src="../assets/icons/add task/event.svg" alt="calendarIcon"/>
               </div>
               <div class="errorMessage hide" id="taskDueDateError"></div>
             </div>
           </form>

           <div class="addTaskFormsDivider"></div>
           <form>
             <div class="formGroup">
               <label class="taskPriorityLabel">Task Priority</label>
               <div class="taskPriorityGroup">
                 <button type="button" class="taskPriorityBtn" id="urgentBtn">
                   <img src="../assets/icons/shared/urgent.svg" alt="urgentIcon"/>
                   <span>Urgent</span>
                 </button>
                 <button type="button" class="taskPriorityBtnOrange" id="mediumBtn">
                   <img src="../assets/icons/shared/medium.svg" alt="mediumIcon"/>
                   <span>Medium</span>
                 </button>
                 <button type="button" class="taskPriorityBtn" id="lowBtn">
                   <img src="../assets/icons/shared/low.svg" alt="lowIcon" />
                   <span>Low</span>
                 </button>
                 <div class="errorMessage hide"></div>
               </div>
             </div>

             <div class="formGroup">
               <label for="dropdownInput">Assigned to <span class="requiredStar">*</span></label>
               <div class="customDropdownContainer">
                 <div class="customDropdown" id="customDropdown">
                   <div class="dropdownHeader">
                     <input type="text" class="dropdownInput" id="dropdownInput" name="taskAssignee" placeholder="Select contacts to assign" readonly/>
                     <button type="button" class="dropdownArrow" id="dropdownArrow"></button>
                   </div>
                   <div class="dropdownContent" id="dropdownContent">
                     <div class="contactsList" id="contactsDropdownList">
                       <!-- Contacts werden hier dynamisch eingefügt -->
                     </div>
                   </div>
                 </div>
                 <div class="selectedContactsDisplay" id="selectedContactsDisplay">
                   <!-- Ausgewählte Kontakte werden hier angezeigt -->
                 </div>
               </div>
               <div class="errorMessage hide"></div>
             </div>

             <div class="formGroup">
               <label for="categoryDropdownInput"
                 >Category <span class="requiredStar">*</span></label>
               <div class="customDropdownContainer">
                 <div class="customDropdown" id="customCategoryDropdown">
                   <div class="dropdownHeader">
                     <input type="text" class="dropdownInput" id="categoryDropdownInput" name="taskCategory" placeholder="Select task category" readonly/>
                     <button type="button" class="dropdownArrow" id="categoryDropdownArrow"></button>
                   </div>
                   <div class="dropdownContent" id="categoryDropdownContent">
                     <div class="contactsList" id="categoriesDropdownList">
                       <!-- Categories werden hier dynamisch eingefügt -->
                     </div>
                   </div>
                 </div>
                 <div class="errorMessage hide"></div>
               </div>
             </div>

             <div class="formGroup">
               <label for="taskSubtask">Subtask</label>
               <div class="inputIcon">
                 <input type="text" placeholder="Add new subtask" id="taskSubtask" name="taskSubtask" multiple/>
                 <img src="../assets/icons/board/addtask.svg" alt="addSubtask" id="createSubtaskButton"/>
               </div>
               <div id="editableDiv" class="subtaskDisplayContainer">
               </div>
             </div>

             <div class="formActions">
               <span class="requiredStarText">*This field is required</span>
               <div class="formButtons">
                 <button type="button" class="cancelTaskBtn" id="clearTaskBtn">
                   Clear
                   <img src="../assets/icons/shared/close.svg" alt="cancel icon"/>
                 </button>
                 <button type="button" class="addTaskBtn" id="createTaskBtn">
             Create Task
             <img src="../assets/icons/add task/check.svg" alt="check icon"/>
             </button>
               </div>
             </div>
           </form>`;
}
