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
                   <label for="taskPriority" class="taskPriorityLabel">Task Priority</label>
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
                   <label for="taskAssignee">Assigned to <span class="requiredStar">*</span></label>
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
                   <label for="taskCategory"
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
                   <label for="Subtask">Subtask</label>
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
               </form>
           </div>
       </div>`;
}

function getEditTaskOverlay(task) {
  const assignedPersonInitials = getInitials(task.assignedTo || "");
  const assignedPersonColor = getAvatarColor(task.assignedTo || "");

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
            <input type="date" id="editTaskDueDate" placeholder="Due Date" class="editInput" value="${
              task.dueDate || ""
            }">
            <img src="../assets/icons/add task/event.svg" class="editDateIcon" alt="calendarIcon">
          </div>
        </div>
        
        <div class="formGroup">
          <label for="taskPriority" class="taskPriorityLabel">Task Priority</label>
            <div class="taskPriorityGroup">
                <button type="button" class="taskPriorityBtn" id="urgentBtn">
                <img src="../assets/icons/shared/urgent.svg" alt="urgentIcon">
                <span>Urgent</span>
                </button>
              <button type="button" class="taskPriorityBtnOrange" id="mediumBtn">
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
          <label class="editLabel">Assigned to</label>
          <select placeholder="Choose the Contact" id="editTaskAssignee" class="editInput">
            <option value="" disabled hidden>Select contacts to assign</option>
          </select>
          <div class="assignedUsers">
            <div class="assignedUser">
            <div class="userAvatar" style="background-color: ${assignedPersonColor};">${assignedPersonInitials}</div>
            <span>${task.assignedTo || "Not assigned"}</span>
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
            <img src="../assets/icons/add task/check.svg" alt="checkIcon">
          </button>
        </div>
      </div>
    </div>`;
}

function getSuccessAddTaskMessageTemplate() {
  return `  <div class="ntfcenterS ntfmask" id="taskNotification">Task added to board
   <img src="../assets/icons/summary and sideboard/board.svg" alt="boardIcon"></img>
    </div>`;
}

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
               <label for="taskPriority" class="taskPriorityLabel">Task Priority</label>
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
               <label for="taskAssignee">Assigned to <span class="requiredStar">*</span></label>
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
               <label for="taskCategory"
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
               <label for="Subtask">Subtask</label>
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