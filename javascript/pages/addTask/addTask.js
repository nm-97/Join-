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
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority('Medium'); 
    mediumBtn.classList.add(priorityClass); 
    selectedPriority = 'Medium';
  });
  
  lowBtn.addEventListener('click', function() {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority('Low'); 
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

function changeColorBasedOnPriority(priority) {
  const classes = {
    "Urgent": "taskPriorityBtnUrgentSelected",
    "Medium": "taskPriorityBtnMediumSelected",
    "Low": "taskPriorityBtnLowSelected"
  };
  return classes[priority] || "";
}

function setupFormSubmission() {
  const createButton = document.getElementById('createTaskBtn');
  const clearButton = document.getElementById('clearTaskBtn');
  
  if (!createButton || !clearButton) {
    console.error('Form buttons not found');
    return;
  }
  createButton.onclick = createTask;
  clearButton.onclick = clearForm;
}

async function loadContacts() {
  try {
    const contacts = await fetchAllContacts();
    const assigneeSelect = document.getElementById('taskAssignee');
    
    if (!assigneeSelect) return;
    
    assigneeSelect.innerHTML = '<option value="" disabled selected hidden>Select contacts to assign</option>';
    
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const option = document.createElement('option');
      option.value = contact.name; 
      option.textContent = contact.name;
      assigneeSelect.appendChild(option);
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
}

function showAddTaskOverlay() {
  const overlay = document.getElementById('addTaskOverlay');
  if (overlay) {
    overlay.innerHTML = getAddTaskOverlay();
    overlay.style.display = 'flex';
    initializeOverlayAddTask();
  }
}

function closeAddTaskOverlay() {
  const overlay = document.getElementById('addTaskOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  }
}

function initializeOverlayAddTask() {
  setupPriorityButtons();
  setupOverlayFormSubmission();
  loadContacts();
}

function setupOverlayFormSubmission() {
  const createButton = document.getElementById('createTaskBtn');
  const clearButton = document.getElementById('clearTaskBtn');

  if (createButton) createButton.onclick = createOverlayTask;
  if (clearButton) clearButton.onclick = clearForm;
}

function addTaskToColumn(status) {
  selectedCategory = status;
  showAddTaskOverlay();
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeAddTask();
    }, 200);
  }
});