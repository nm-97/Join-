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
  
  urgentBtn.onclick = function() {
    clearPrioritySelection();
    urgentBtn.classList.add('selected');
    urgentBtn.style.backgroundColor = changeColorBasedOnPriority('Urgent');
    urgentBtn.style.color = 'white';
    selectedPriority = 'Urgent';
  };
  mediumBtn.onclick = function() {
    clearPrioritySelection();
    mediumBtn.classList.add('selected');
    mediumBtn.style.backgroundColor = changeColorBasedOnPriority('Medium');
    mediumBtn.style.color = 'white';
    selectedPriority = 'Medium';
  };
  lowBtn.onclick = function() {
    clearPrioritySelection();
    lowBtn.classList.add('selected');
    lowBtn.style.backgroundColor = changeColorBasedOnPriority('Low');
    lowBtn.style.color = 'white';
    selectedPriority = 'Low';
  };
}

function clearPrioritySelection() {
  const urgentBtn = document.getElementById('urgentBtn');
  const mediumBtn = document.getElementById('mediumBtn');
  const lowBtn = document.getElementById('lowBtn');
  
  urgentBtn.classList.remove('selected');
  mediumBtn.classList.remove('selected');
  lowBtn.classList.remove('selected');

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
  createButton.onclick = createTask;
  clearButton.onclick = clearForm;
}

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
    Category: mapCategoryToFirebase(document.getElementById('taskStatus').value)
  };
}

function mapCategoryToFirebase(category) {
  const categoryMap = {
    'todo': 'toDo',
    'in-progress': 'inProgress',
    'await-feedback': 'awaitFeedback',
    'done': 'done'
  };
  return categoryMap[category] || 'toDo';
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

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("addTask.html")) {
    initializeAddTask();
  }
});

async function updateTask(event, taskId) {
  event.preventDefault();
  const taskData = getFormData();          
  if (!validateTaskData(taskData)) {       
    return;
  }
  await updateTaskInFirebase(taskData, taskId);
  closeEditTaskOverlay();
  await refreshBoard();
  showTaskUpdatedNotification();           
}

async function updateTaskInFirebase(taskData, taskId) {
  const response = await pushTaskData(taskData, taskId);
  return await response.json();
}

const pushTaskData = async (taskData, taskId) => {
  return await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
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

function mapApiTaskToTemplate(data) {
  return {
    id: data.id || null,
    Category: data.Category || "toDo",
    assignedTo: data.assignedTo || "",
    description: data.description || "",
    dueDate: data.dueDate || "",
    taskPriority: data.taskPriority || "Medium",
    title: data.title || "Untitled Task"
  };
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
  const colors = {
    "Urgent": "#FF0000",
    "Medium": "#FFA500",
    "Low": "#008000"
  };
  return colors[priority] || "#000000"; 
}