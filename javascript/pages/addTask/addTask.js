let selectedPriority = "Medium";
let selectedCategory = "";
let currentSubtasks = [];

function initializeAddTask() {
  renderAddTaskMainContent();
  setupPriorityButtons();
  setupFormSubmission();
  currentSubtasks = [];
  window.currentSubtasks = currentSubtasks;
  setupSubtaskEvents();
  loadContacts();
  setDefaultPriority();
}

function renderAddTaskMainContent() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = getaddTaskMainContent();
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

async function setupFormSubmission() {
  const createButton = document.getElementById("createTaskBtn");
  const clearButton = document.getElementById("clearTaskBtn");
  if (!createButton || !clearButton) {
    console.error("Form buttons not found");
    return;
  }
  createButton.addEventListener("click", function (e) {
    e.preventDefault();
    createTask();
  });
  clearButton.addEventListener("click", function (e) {
    e.preventDefault();
    clearForm();
  });
}

async function loadContacts() {
  try {
    const contacts = await fetchContactsByIdAndUser();
    const assigneeSelect = document.getElementById("taskAssignee");
    if (!assigneeSelect) return;
    assigneeSelect.innerHTML =
      '<option value="" disabled selected hidden>Select contacts to assign</option>';
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const option = document.createElement("option");
      option.value = contact.id;
      option.textContent = contact.name;
      assigneeSelect.appendChild(option);
    }
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

async function createTask() {
  const isValid = validateAddTaskForm();

  if (!isValid) {
    return;
  }

  try {
    const taskData = getFormData();
    await addTaskToFirebaseByUser(taskData);
    window.currentSubtasks = [];
    document.getElementById("taskSubtask").value = "";
    renderSubtasks([]);
    clearForm();
    showTaskCreatedNotification();
  } catch (error) {
    console.error("Fehler beim Erstellen der Task:", error);
  }
}

function getFormData() {
  return {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value,
    dueDate: document.getElementById("taskDueDate").value,
    taskPriority: selectedPriority,
    assignedTo: assignedTo,
    Category: mapCategoryToFirebase(
      document.getElementById("taskStatus").value
    ),
    Status: "toDo",
    subtasks: currentSubtasks,
  };
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
  clearPrioritySelection();
  selectedPriority = "Medium";
  currentSubtasks = [];
  renderSubtasks([]);
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
  loadContacts();
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
