let selectedPriority = "Medium";
let selectedCategory = "";

function initializeAddTask() {
  setupPriorityButtons();
  setupFormSubmission();
  if (typeof loadContacts === 'function') {
    loadContacts();
  }
  setDefaultPriority();
}

function setupPriorityButtons() {
  const urgentBtn = document.getElementById("urgentBtn");
  const mediumBtn = document.getElementById("mediumBtn");
  const lowBtn = document.getElementById("lowBtn");

  if (!urgentBtn || !mediumBtn || !lowBtn) {
    return;
  }

  urgentBtn.addEventListener("click", function () {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority("Urgent");
    urgentBtn.classList.add(priorityClass);
    selectedPriority = "Urgent";
  });

  mediumBtn.addEventListener("click", function () {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority("Medium");
    mediumBtn.classList.add(priorityClass);
    selectedPriority = "Medium";
  });

  lowBtn.addEventListener("click", function () {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority("Low");
    lowBtn.classList.add(priorityClass);
    selectedPriority = "Low";
  });
}

function clearPrioritySelection() {
  const urgentBtn = document.getElementById("urgentBtn");
  const mediumBtn = document.getElementById("mediumBtn");
  const lowBtn = document.getElementById("lowBtn");

  urgentBtn.classList.remove(
    "taskPriorityBtnUrgentSelected",
    "taskPriorityBtnMediumSelected",
    "taskPriorityBtnLowSelected",
    "selected"
  );
  mediumBtn.classList.remove(
    "taskPriorityBtnUrgentSelected",
    "taskPriorityBtnMediumSelected",
    "taskPriorityBtnLowSelected",
    "selected"
  );
  lowBtn.classList.remove(
    "taskPriorityBtnUrgentSelected",
    "taskPriorityBtnMediumSelected",
    "taskPriorityBtnLowSelected",
    "selected"
  );

  urgentBtn.style.backgroundColor = "";
  mediumBtn.style.backgroundColor = "";
  lowBtn.style.backgroundColor = "";
  urgentBtn.style.color = "";
  mediumBtn.style.color = "";
  lowBtn.style.color = "";
}

function changeColorBasedOnPriority(priority) {
  const classes = {
    Urgent: "taskPriorityBtnUrgentSelected",
    Medium: "taskPriorityBtnMediumSelected",
    Low: "taskPriorityBtnLowSelected",
  };
  return classes[priority] || "";
}

function setDefaultPriority() {
  const mediumBtn = document.getElementById("mediumBtn");
  if (mediumBtn) {
    mediumBtn.classList.add("taskPriorityBtnMediumSelected");
  }
}

function setupFormSubmission() {
  const createButton = document.getElementById("createTaskBtn");
  const clearButton = document.getElementById("clearTaskBtn");
  if (!createButton || !clearButton) {
    console.error("Form buttons not found");
    return;
  }
  createButton.onclick = createTask;
  clearButton.onclick = clearForm;
}

async function createTask() {
  if (!validateAddTaskForm()) return;
  
  const taskData = getFormData();
  
  try {
    await addTaskToFirebaseByUser(taskData);
    showTaskCreatedNotification();
    clearForm();
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

function getFormData() {
  let assignedTo = "";
  
  if (typeof getSelectedContactIds === 'function') {
    const selectedContactIds = getSelectedContactIds();
    assignedTo = selectedContactIds.length > 0 ? selectedContactIds[0] : "";
  }
  
  const formData = {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    dueDate: document.getElementById("taskDueDate").value,
    taskPriority: selectedPriority,
    assignedTo: assignedTo,
    Category: mapCategoryToFirebase(
      document.getElementById("taskStatus").value
    ),
    Status: "toDo",
  };
  
  return formData;
}

function showTaskCreatedNotification() {
  const overlay = document.createElement("div");
  overlay.id = "successMessageOverlay";
  overlay.innerHTML = getSuccessAddTaskMessageTemplate();
  overlay.style.display = "flex";
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
  }, 2000);
}

function clearForm() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("taskStatus").value = "";
  document.getElementById("taskSubtask").value = "";
  
  if (typeof clearContactSelections === 'function') {
    clearContactSelections();
  }
  
  clearPrioritySelection();
  selectedPriority = "Medium";
  setDefaultPriority();
}

function showAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.innerHTML = getAddTaskOverlay();
    overlay.style.display = "flex";
    initializeOverlayAddTask();
  }
}

function closeAddTaskOverlay() {
  const overlay = document.getElementById("addTaskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.innerHTML = "";
  }
}

function initializeOverlayAddTask() {
  setupPriorityButtons();
  setupOverlayFormSubmission();
  if (typeof loadContacts === 'function') {
    loadContacts();
  }
  initializeDateInput();
  setDefaultPriority();
}

function setupOverlayFormSubmission() {
  const createButton = document.getElementById("createTaskBtn");
  const clearButton = document.getElementById("clearTaskBtn");

  if (createButton) createButton.onclick = createOverlayTask;
  if (clearButton) clearButton.onclick = clearForm;
}

async function createOverlayTask() {
  if (!validateAddTaskForm()) return;

  const taskData = getFormData();
  try {
    await addTaskToFirebaseByUser(taskData);
    clearForm();
    closeAddTaskOverlay();
    if (typeof refreshBoard === "function") {
      await refreshBoard();
    }
  } catch (error) {
    console.error("Error creating task:", error);
  }
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