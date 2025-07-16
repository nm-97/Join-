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
    selectedPriority = 'Urgent';
  };
  
  mediumBtn.onclick = function() {
    clearPrioritySelection();
    mediumBtn.classList.add('selected');
    selectedPriority = 'Medium';
  };
  
  lowBtn.onclick = function() {
    clearPrioritySelection();
    lowBtn.classList.add('selected');
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
    'await-feedback': 'Urgent',
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