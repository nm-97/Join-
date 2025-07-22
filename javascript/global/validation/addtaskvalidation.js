"use strict";

function initializeDateInput() {
  const dueDateInput = document.getElementById('taskDueDate');
  if (!dueDateInput) return;
  
  setupDateFormatting(dueDateInput);
}

function setupDateFormatting(input) {
  input.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5);
    }
    
    e.target.value = value.substring(0, 10);
  });
}

function validateAddTaskForm() {
  const inputs = getFormInputs();
  let isValid = true;
  
  clearAllTaskErrors();
  
  if (!validateTitle(inputs.titleInput)) isValid = false;
  if (!validateDueDate(inputs.dueDateInput)) isValid = false;
  if (!validateCategory(inputs.categorySelect)) isValid = false;
  if (!validateAssignee(inputs.assigneeSelect)) isValid = false;
  if (!validatePriority()) isValid = false;
  
  return isValid;
}

function getFormInputs() {
  return {
    titleInput: document.getElementById('taskTitle'),
    dueDateInput: document.getElementById('taskDueDate'),
    categorySelect: document.getElementById('taskStatus'),
    assigneeSelect: document.getElementById('taskAssignee')
  };
}

function validateTitle(titleInput) {
  if (!titleInput || !validateRequired(titleInput.value)) {
    showError('taskTitle', 'This field is required');
    return false;
  }
  return true;
}

function validateDueDate(dueDateInput) {
  if (!dueDateInput || !validateRequired(dueDateInput.value)) {
    showError('taskDueDate', 'This field is required');
    return false;
  }
  if (!validateDateFormat(dueDateInput.value)) {
    showError('taskDueDate', 'Please use DD/MM/YYYY format');
    return false;
  }
  if (!validateTodayOrFutureDate(dueDateInput.value)) {
    showError('taskDueDate', 'Please select today or a future date');
    return false;
  }
  return true;
}

function validateCategory(categorySelect) {
  if (!categorySelect || !validateRequired(categorySelect.value)) {
    showError('taskStatus', 'This field is required');
    return false;
  }
  return true;
}

function validateAssignee(assigneeSelect) {
  if (!assigneeSelect || !validateRequired(assigneeSelect.value)) {
    showError('taskAssignee', 'This field is required');
    return false;
  }
  return true;
}

function validatePriority() {
  if (!selectedPriority || selectedPriority === '') {
    showPriorityError('This field is required');
    return false;
  }
  return true;
}

function validateDateFormat(dateString) {
  if (dateString.length !== 10) return false;
  if (dateString[2] !== '/' || dateString[5] !== '/') return false;
  
  const day = dateString.substring(0, 2);
  const month = dateString.substring(3, 5);
  const year = dateString.substring(6, 10);
  
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 2024) return false;
  
  return true;
}

function validateTodayOrFutureDate(dateString) {
  if (!validateDateFormat(dateString)) return false;
  
  const day = dateString.substring(0, 2);
  const month = dateString.substring(3, 5);
  const year = dateString.substring(6, 10);
  
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return inputDate >= today;
}

function validateFutureDate(dateString) {
  return validateTodayOrFutureDate(dateString);
}

function showPriorityError(message) {
  const priorityGroup = document.querySelector('.taskPriorityGroup');
  if (!priorityGroup) return;
  
  clearPriorityError();
  createPriorityErrorDiv(priorityGroup, message);
}

function createPriorityErrorDiv(priorityGroup, message) {
  let errorDiv = priorityGroup.querySelector('.errorMessage');
  
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hide');
  } else {
    errorDiv = document.createElement('div');
    errorDiv.className = 'errorMessage';
    errorDiv.textContent = message;
    errorDiv.id = 'taskPriorityError';
    priorityGroup.parentNode.insertBefore(errorDiv, priorityGroup.nextSibling);
  }
}

function clearPriorityError() {
  const priorityGroup = document.querySelector('.taskPriorityGroup');
  if (!priorityGroup) return;
  
  clearSpecificPriorityError() || clearGeneralPriorityError(priorityGroup);
}

function clearSpecificPriorityError() {
  const specificErrorMessage = document.getElementById('taskPriorityError');
  if (specificErrorMessage) {
    specificErrorMessage.textContent = '';
    specificErrorMessage.classList.add('hide');
    return true;
  }
  return false;
}

function clearGeneralPriorityError(priorityGroup) {
  const errorDiv = priorityGroup.querySelector('.errorMessage');
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.classList.add('hide');
  }
}

function clearAllTaskErrors() {
  clearError('taskTitle');
  clearError('taskDueDate');
  clearError('taskStatus');
  clearError('taskAssignee');
  clearPriorityError();
}

function getFormDataForFirebase() {
  const dueDateInput = document.getElementById('taskDueDate');
  const formattedDueDate = convertDateFormat(dueDateInput);
  
  return createTaskDataObject(formattedDueDate);
}

function convertDateFormat(dueDateInput) {
  if (!dueDateInput || !dueDateInput.value) return '';
  
  const day = dueDateInput.value.substring(0, 2);
  const month = dueDateInput.value.substring(3, 5);
  const year = dueDateInput.value.substring(6, 10);
  
  if (day && month && year) {
    return year + '-' + month + '-' + day;
  }
  
  return '';
}

function createTaskDataObject(formattedDueDate) {
  return {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value || '',
    dueDate: formattedDueDate,
    taskPriority: selectedPriority,
    assignedTo: document.getElementById('taskAssignee').value,
    Category: mapCategoryToFirebase(document.getElementById('taskStatus').value),
    Status: 'toDo'
  };
}

function mapCategoryToFirebase(category) {
  const categoryMap = {
    'userStory': 'User Story',
    'technicalTask': 'Technical Task',
  };
  return categoryMap[category] || 'Technical Task';
}

async function createTask() {
  if (!validateAddTaskForm()) return;
  
  const taskData = getFormDataForFirebase();
  await processTaskCreation(taskData, false);
}

async function createOverlayTask() {
  if (!validateAddTaskForm()) return;
  
  const taskData = getFormDataForFirebase();
  await processTaskCreation(taskData, true);
}

async function processTaskCreation(taskData, isOverlay) {
  try {
    const taskId = await addTaskToFirebase(taskData);
    console.log('Task created with ID:', taskId);
    
    handleSuccessfulTaskCreation(isOverlay);
  } catch (error) {
    handleTaskCreationError(error);
  }
}

function handleSuccessfulTaskCreation(isOverlay) {
  showTaskCreatedNotification();
  clearFormWithValidation();
  
  if (isOverlay) {
    if (typeof closeAddTaskOverlay === 'function') closeAddTaskOverlay();
    if (typeof refreshBoard === 'function') refreshBoard();
  }
}

function handleTaskCreationError(error) {
  console.error('Error creating task:', error);
  showError('taskTitle', 'Error creating task. Please try again.');
}

function clearFormWithValidation() {
  clearAllFormInputs();
  resetPriorityToDefault();
  clearAllTaskErrors();
}

function clearAllFormInputs() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDescription').value = '';
  document.getElementById('taskDueDate').value = '';
  document.getElementById('taskAssignee').value = '';
  document.getElementById('taskStatus').value = '';
  
  const subtaskInput = document.getElementById('taskSubtask');
  if (subtaskInput) subtaskInput.value = '';
}

function resetPriorityToDefault() {
  if (typeof clearPrioritySelection === 'function') {
    clearPrioritySelection();
  }
  selectedPriority = "Medium";
}

function clearForm() {
  clearFormWithValidation();
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("addTask.html")) {
    setTimeout(() => {
      initializeDateInput();
    }, 100);
  }
});