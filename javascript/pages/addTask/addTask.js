/**
 * @fileoverview Add Task page functionality for the JOIN application
 * Handles task creation, form validation, priority selection, and subtask management
 * @author Join Project Team
 * @version 1.0.0
 */

let selectedPriority = "Medium";
let selectedCategory = "";
let currentSubtasks = [];

/**
 * Initializes the Add Task page with all necessary components and event listeners
 */
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

/**
 * Renders the main content for the Add Task page
 */
function renderAddTaskMainContent() {
  const mainContent = document.getElementById("mainContent");
  mainContent.innerHTML = getaddTaskMainContent();
}

/**
 * Sets up event listeners for priority selection buttons
 */
function setupPriorityButtons() {
  const buttons = getPriorityButtons();
  if (!validateAllButtonsExist(buttons)) return;

  attachPriorityButtonEvents(buttons);
}

/**
 * Validates that all priority buttons exist in the DOM
 * @param {Object} buttons - Object containing priority button elements
 * @returns {boolean} True if all buttons exist, false otherwise
 */
function validateAllButtonsExist(buttons) {
  return buttons.urgent && buttons.medium && buttons.low;
}

/**
 * Attaches click event listeners to priority buttons
 * @param {Object} buttons - Object containing priority button elements
 */
function attachPriorityButtonEvents(buttons) {
  buttons.urgent.onclick = () => selectPriority("Urgent", buttons.urgent);
  buttons.medium.onclick = () => selectPriority("Medium", buttons.medium);
  buttons.low.onclick = () => selectPriority("Low", buttons.low);
}

/**
 * Selects a priority level and updates button styling
 * @param {string} priority - The priority level to select
 * @param {HTMLElement} button - The button element that was clicked
 */
function selectPriority(priority, button) {
  clearPrioritySelection();
  const priorityClass = changeColorBasedOnPriority(priority);
  button.classList.add(priorityClass);
  selectedPriority = priority;
}

/**
 * Clears all priority selections and resets button styles
 */
function clearPrioritySelection() {
  const buttons = getPriorityButtons();
  removeAllPriorityClasses(buttons);
  resetButtonStyles(buttons);
}

function getPriorityButtons() {
  return {
    urgent: document.getElementById("urgentBtn"),
    medium: document.getElementById("mediumBtn"),
    low: document.getElementById("lowBtn"),
  };
}

function removeAllPriorityClasses(buttons) {
  const classesToRemove = [
    "taskPriorityBtnUrgentSelected",
    "taskPriorityBtnMediumSelected",
    "taskPriorityBtnLowSelected",
    "selected",
  ];

  Object.values(buttons).forEach((btn) => {
    if (btn) {
      btn.classList.remove(...classesToRemove);
    }
  });
}

function resetButtonStyles(buttons) {
  Object.values(buttons).forEach((btn) => {
    if (btn) {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }
  });
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
  const dropdownElements = getCategoryDropdownElements();
  if (!validateCategoryDropdownElements(dropdownElements)) return;

  populateCategoryList(categories, dropdownElements.categoryList);
  attachCategoryDropdownEvents(dropdownElements);
}

function getCategoryDropdownElements() {
  return {
    categoryDropdown: document.getElementById("customCategoryDropdown"),
    categoryInput: document.getElementById("categoryDropdownInput"),
    categoryArrow: document.getElementById("categoryDropdownArrow"),
    categoryContent: document.getElementById("categoryDropdownContent"),
    categoryList: document.getElementById("categoriesDropdownList"),
  };
}

function validateCategoryDropdownElements(elements) {
  return (
    elements.categoryDropdown &&
    elements.categoryInput &&
    elements.categoryArrow &&
    elements.categoryContent &&
    elements.categoryList
  );
}

function populateCategoryList(categories, categoryList) {
  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const categoryItem = createCategoryItem(category);
    categoryList.appendChild(categoryItem);
  });
}

function createCategoryItem(category) {
  const categoryItem = document.createElement("div");
  categoryItem.className = "contactItem";
  categoryItem.innerHTML = `
    <div class="contactInfo">
      <span class="contactName">${category.label}</span>
    </div>
  `;
  categoryItem.onclick = () => selectCategory(category.value, category.label);
  return categoryItem;
}

function attachCategoryDropdownEvents(elements) {
  elements.categoryArrow.onclick = () => toggleCategoryDropdown();
  elements.categoryInput.onclick = () => toggleCategoryDropdown();
  document.onclick = (event) => {
    if (!elements.categoryDropdown.contains(event.target)) {
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
  const categoryValue =
    typeof getSelectedCategoryName === "function"
      ? getSelectedCategoryName()
      : selectedCategory || "";
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
