let selectedPriority = "Medium";
let selectedCategory = "";

function initializeAddTask() {
  setupPriorityButtons();
  setupFormSubmission();
  loadContacts();
}

function setupPriorityButtons() {
  const urgentBtn = document.getElementById('urgentBtn');
  const mediumBtn = document.getElementById('mediumBtn');
  const lowBtn = document.getElementById('lowBtn');
    if (!urgentBtn || !mediumBtn || !lowBtn) {
    return;
  }
  
  urgentBtn.addEventListener('click', function() {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority('Urgent'); 
    urgentBtn.classList.add(priorityClass); 
    selectedPriority = 'Urgent';
  });
  
  mediumBtn.addEventListener('click', function() {
    console.log('Medium Button geklickt');
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority('Medium'); 
    console.log('Füge Klasse hinzu:', priorityClass);
    mediumBtn.classList.add(priorityClass); 
    selectedPriority = 'Medium';
  });
  
  lowBtn.addEventListener('click', function() {
    console.log('Low Button geklickt');
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority('Low'); 
    console.log('Füge Klasse hinzu:', priorityClass);
    lowBtn.classList.add(priorityClass);
    selectedPriority = 'Low';
  });
}

function clearPrioritySelection() {
  const urgentBtn = document.getElementById('urgentBtn');
  const mediumBtn = document.getElementById('mediumBtn');
  const lowBtn = document.getElementById('lowBtn');
  
  
  urgentBtn.classList.remove('taskPriorityBtnUrgentSelected', 'taskPriorityBtnMediumSelected', 'taskPriorityBtnLowSelected', 'selected');
  mediumBtn.classList.remove('taskPriorityBtnUrgentSelected', 'taskPriorityBtnMediumSelected', 'taskPriorityBtnLowSelected', 'selected');
  lowBtn.classList.remove('taskPriorityBtnUrgentSelected', 'taskPriorityBtnMediumSelected', 'taskPriorityBtnLowSelected', 'selected');

  urgentBtn.style.backgroundColor = '';
  mediumBtn.style.backgroundColor = '';
  lowBtn.style.backgroundColor = '';
  urgentBtn.style.color = '';
  mediumBtn.style.color = '';
  lowBtn.style.color = '';
}
function setupFormSubmission() {
  const createButton = document.getElementById('createTaskBtn');
  const clearButton = document.getElementById('clearTaskBtn');
  
  if (!createButton || !clearButton) {
    console.error('Form buttons nicht gefunden:', createButton, clearButton);
    return;
  }
  
  createButton.onclick = createTask;
  clearButton.onclick = clearForm;
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeAddTask(); 
    }, 200);
  }
});

async function loadContacts() {
  const contacts = await fetchAllContacts();
  const assigneeSelect = document.getElementById('taskAssignee');
  assigneeSelect.innerHTML = '<option value="" disabled selected hidden>Select contacts to assign</option>';
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const option = document.createElement('option');
    option.value = contact.name;
    option.textContent = contact.name;
    assigneeSelect.appendChild(option);
  }
}

async function createTask() {
  const taskData = getFormData();
  if (!validateTaskData(taskData)) {
    return;
  }
  await addTaskToFirebase(taskData);
  showTaskCreatedNotification();
  clearForm();
}
function getFormData() {
  return {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    dueDate: document.getElementById('taskDueDate').value,
    taskPriority: selectedPriority,
    assignedTo: document.getElementById('taskAssignee').value,
    Category: mapCategoryToFirebase(document.getElementById('taskStatus').value),
    Status: 'toDo'  
  };
}

function mapCategoryToFirebase(category) {
  const categoryMap = {
    'userStory': 'User Story',          // ← value → label
    'technicalTask': 'Technical Task',  // ← value → label
  };
  return categoryMap[category] || 'Technical Task';
}

function mapApiTaskToTemplate(data) {
  return {
    id: data.id || null,
    Category: data.Category || "Technical Task",  
    Status: data.Status || "toDo",                
    assignedTo: data.assignedTo || "",
    description: data.description || "",
    dueDate: data.dueDate || "",
    taskPriority: data.taskPriority || "Medium",
    title: data.title || "Untitled Task"
  };
}

function validateTaskData(taskData) {
  if (!taskData.title) {
    alert('Please enter a title');
    return false;
  }
  if (!taskData.description) {
    alert('Please enter a description');
    return false;
  }
  if (!taskData.dueDate) {
    alert('Please select a due date');
    return false;
  }
  if (!taskData.assignedTo) {
    alert('Please select an assignee');
    return false;
  }
  if (!document.getElementById('taskStatus').value) {
    alert('Please select a category');
    return false;
  }
  return true;
}

function showTaskCreatedNotification() {
  const notification = document.getElementById('taskNotification');
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function clearForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDueDate').value = '';
  document.getElementById('taskAssignee').value = '';
  document.getElementById('taskStatus').value = '';
  document.getElementById('taskSubtask').value = '';
  clearPrioritySelection();
  selectedPriority = "Medium";
}

async function updateTask(event, taskId) {
  event.preventDefault();
  const taskData = getFormData();          
  if (!validateTaskData(taskData)) {       
    return;
  }
  await updateTaskInFirebase(taskId, taskData);
  closeEditTaskOverlay();
  await refreshBoard();
  showTaskUpdatedNotification();           
}

const pushTaskData = async (taskData, taskId) => {
  return await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  console.log('Task updated successfully:', taskId);
};

async function fetchAllTasks() {
  let response = await fetch(`${firebaseUrl}user/guest /task.json`);
  let data = await response.json();
  if (!data) {
    response = await fetch(`${firebaseUrl}user /guest /task.json`);
    data = await response.json();
  }
  if (!data) return [];
  const tasks = [];
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    const task = mapApiTaskToTemplate({ id, ...data[id] });
    tasks.push(task);
  }
  return tasks;
}


async function addTaskToFirebase(taskData) {
  const response = await fetch(`${firebaseUrl}user /guest /task.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  const result = await response.json();
  return result.name;
}

async function deleteTaskFromFirebase(taskId) {
  const response = await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`, {
    method: "DELETE",
  });
  return true;
}

async function updateTaskInFirebase(taskId, taskData) {
  const response = await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  return true;
}

function changeColorBasedOnPriority(priority) {
  const classes = {
    "Urgent": "taskPriorityBtnUrgentSelected",
    "Medium": "taskPriorityBtnMediumSelected", 
    "Low": "taskPriorityBtnLowSelected"
  };
  return classes[priority] || ""; 
}