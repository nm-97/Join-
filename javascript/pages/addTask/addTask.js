let selectedPriority = "Medium";
let selectedCategory = "";
let currentSubtasks = [];

function initializeAddTask() {
  renderAddTaskMainContent();
  initializeDateInput();
  setupPriorityButtons();
  setupFormSubmission();
  currentSubtasks = [];
  window.currentSubtasks = currentSubtasks;
  setupSubtaskEvents();
  loadContacts();
  loadCategories();
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

  urgentBtn.onclick = function () {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority("Urgent");
    urgentBtn.classList.add(priorityClass);
    selectedPriority = "Urgent";
  };

  mediumBtn.onclick = function () {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority("Medium");
    mediumBtn.classList.add(priorityClass);
    selectedPriority = "Medium";
  };

  lowBtn.onclick = function () {
    clearPrioritySelection();
    const priorityClass = changeColorBasedOnPriority("Low");
    lowBtn.classList.add(priorityClass);
    selectedPriority = "Low";
  };
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
    return;
  }
  createButton.onclick = function (e) {
    e.preventDefault();
    createTask();
  };
  clearButton.onclick = function (e) {
    e.preventDefault();
    clearForm();
  };
}

function loadCategories() {
  const categories = [
    { value: "User Story", label: "User Story" },
    { value: "Technical Task", label: "Technical Task" },
  ];

  setupCategoryDropdown(categories);
}

function setupCategoryDropdown(categories) {
  const categoryDropdown = document.getElementById("customCategoryDropdown");
  const categoryInput = document.getElementById("categoryDropdownInput");
  const categoryArrow = document.getElementById("categoryDropdownArrow");
  const categoryContent = document.getElementById("categoryDropdownContent");
  const categoryList = document.getElementById("categoriesDropdownList");

  if (
    !categoryDropdown ||
    !categoryInput ||
    !categoryArrow ||
    !categoryContent ||
    !categoryList
  ) {
    return;
  }

  categoryList.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const categoryItem = document.createElement("div");
    categoryItem.className = "contactItem";
    categoryItem.innerHTML = `
      <div class="contactInfo">
        <span class="contactName">${category.label}</span>
      </div>
    `;

    categoryItem.onclick = function () {
      selectCategory(category.value, category.label);
    };

    categoryList.appendChild(categoryItem);
  }

  categoryArrow.onclick = function () {
    toggleCategoryDropdown();
  };

  categoryInput.onclick = function () {
    toggleCategoryDropdown();
  };

  document.onclick = function (event) {
    if (!categoryDropdown.contains(event.target)) {
      closeCategoryDropdown();
    }
  };
}

function toggleCategoryDropdown() {
  const categoryContent = document.getElementById("categoryDropdownContent");
  const categoryArrow = document.getElementById("categoryDropdownArrow");

  if (!categoryContent || !categoryArrow) return;

  const isOpen = categoryContent.style.display === "block";

  if (isOpen) {
    closeCategoryDropdown();
  } else {
    openCategoryDropdown();
  }
}

function openCategoryDropdown() {
  const categoryContent = document.getElementById("categoryDropdownContent");
  const categoryArrow = document.getElementById("categoryDropdownArrow");

  if (categoryContent) categoryContent.style.display = "block";
  if (categoryArrow) categoryArrow.style.transform = "rotate(180deg)";
}

function closeCategoryDropdown() {
  const categoryContent = document.getElementById("categoryDropdownContent");
  const categoryArrow = document.getElementById("categoryDropdownArrow");

  if (categoryContent) categoryContent.style.display = "none";
  if (categoryArrow) categoryArrow.style.transform = "rotate(0deg)";
}

function selectCategory(value, label) {
  selectedCategory = value;

  const categoryInput = document.getElementById("categoryDropdownInput");
  if (categoryInput) {
    categoryInput.value = label;
  }

  closeCategoryDropdown();
  if (typeof clearCategoryError === "function") {
    clearCategoryError();
  }
}

function clearCategorySelection() {
  selectedCategory = "";
  const categoryInput = document.getElementById("categoryDropdownInput");
  if (categoryInput) {
    categoryInput.value = "";
    categoryInput.placeholder = "Select task category";
  }
}

function loadContactsForSelect() {
  try {
    const contacts = fetchContactsByIdAndUser();
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
  } catch (error) {}
}

function createTask() {
  const isValid = validateAddTaskForm();

  if (!isValid) {
    return;
  }

  try {
    const taskData = getFormData();

    const result = addTaskToFirebaseByUser(taskData);

    window.currentSubtasks = [];
    const subtaskInput = document.getElementById("taskSubtask");
    if (subtaskInput) subtaskInput.value = "";
    if (typeof renderSubtasks === "function") {
      renderSubtasks([]);
    }
    clearForm();

    showTaskCreatedNotification();
  } catch (error) {}
}

function getFormData() {
  const selectedContacts =
    typeof getSelectedContactIds === "function" ? getSelectedContactIds() : [];

  // Use the customdropdown.js system for category
  const categoryValue = typeof getSelectedCategoryName === "function" 
    ? getSelectedCategoryName() 
    : (selectedCategory || "");

  const formData = {
    title: document.getElementById("taskTitle")?.value || "",
    description: document.getElementById("taskDescription")?.value || "",
    dueDate: document.getElementById("taskDueDate")?.value || "",
    taskPriority: selectedPriority,
    assignedTo: selectedContacts[0] || "",
    Category: mapCategoryToFirebase(categoryValue),
    Status: "toDo",
    subtasks: currentSubtasks,
  };

  return formData;
}

function mapCategoryToFirebase(category) {
  const categoryMap = {
    "User Story": "User Story",
    "Technical Task": "Technical Task",
  };
  return categoryMap[category] || "Technical Task";
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
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) subtaskInput.value = "";
  clearPrioritySelection();
  clearCategorySelection();
  selectedPriority = "Medium";
  selectedCategory = "";
  currentSubtasks = [];
  if (typeof renderSubtasks === "function") {
    renderSubtasks([]);
  }
  if (typeof clearContactSelections === "function") {
    clearContactSelections();
  }
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
  if (typeof setupSubtaskEvents === "function") {
    setupSubtaskEvents();
  }
  currentSubtasks = [];
  window.currentSubtasks = currentSubtasks;
  if (typeof loadContacts === "function") {
    loadContacts();
  }

  setTimeout(() => {
    loadCategories();
  }, 100);

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
  } catch (error) {}
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
