"use strict";

function initializeDateInput() {
  const dueDateInput = document.getElementById("taskDueDate");
  if (!dueDateInput) return;

  setupDateFormatting(dueDateInput);
}

function setupDateFormatting(input) {
  input.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + "/" + value.substring(5);
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
  if (!validateCategory()) isValid = false;
  if (!validateAssignee()) isValid = false;
  if (!validatePriority()) isValid = false;

  return isValid;
}

function getFormInputs() {
  return {
    titleInput: document.getElementById("taskTitle"),
    dueDateInput: document.getElementById("taskDueDate"),
  };
}

function validateTitle(titleInput) {
  if (!titleInput || !validateRequired(titleInput.value)) {
    showError("taskTitle", "This field is required");
    return false;
  }
  return true;
}

function validateDueDate(dueDateInput) {
  if (!dueDateInput || !validateRequired(dueDateInput.value)) {
    showError("taskDueDate", "This field is required");
    return false;
  }
  if (!validateDateFormat(dueDateInput.value)) {
    showError("taskDueDate", "Please use DD/MM/YYYY format");
    return false;
  }
  if (!validateTodayOrFutureDate(dueDateInput.value)) {
    showError("taskDueDate", "Please select today or a future date");
    return false;
  }
  return true;
}

function validateCategory() {
  if (!selectedCategory || selectedCategory === "") {
    showCategoryError("This field is required");
    return false;
  }
  clearCategoryError();
  return true;
}

function validateAssignee() {
  if (typeof getSelectedContactIds !== "function") {
    const assigneeSelect = document.getElementById("taskAssignee");
    if (
      !assigneeSelect ||
      !assigneeSelect.value ||
      assigneeSelect.value === ""
    ) {
      return false;
    }
    return true;
  }

  const selectedContactIds = getSelectedContactIds();

  if (!selectedContactIds || selectedContactIds.length === 0) {
    showCustomDropdownError("This field is required");
    return false;
  }

  clearCustomDropdownError();
  return true;
}

function showCustomDropdownError(message) {
  const customDropdownContainer = document.querySelector(
    ".customDropdownContainer"
  );
  if (!customDropdownContainer) return;

  const errorDiv = customDropdownContainer.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hide");
  }

  const dropdownHeader = document.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#ff0000";
  }
}

function clearCustomDropdownError() {
  const customDropdownContainer = document.querySelector(
    ".customDropdownContainer"
  );
  if (!customDropdownContainer) return;

  const errorDiv = customDropdownContainer.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.add("hide");
  }

  const dropdownHeader = document.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#d1d1d1";
  }
}

function showCategoryError(message) {
  const categoryDropdown = document.getElementById("customCategoryDropdown");
  if (!categoryDropdown) return;

  const errorDiv = categoryDropdown.parentNode.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hide");
  }

  const dropdownHeader = categoryDropdown.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#ff0000";
  }
}

function clearCategoryError() {
  const categoryDropdown = document.getElementById("customCategoryDropdown");
  if (!categoryDropdown) return;

  const errorDiv = categoryDropdown.parentNode.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.add("hide");
  }

  const dropdownHeader = categoryDropdown.querySelector(".dropdownHeader");
  if (dropdownHeader) {
    dropdownHeader.style.borderColor = "#d1d1d1";
  }
}

function validatePriority() {
  if (!selectedPriority || selectedPriority === "") {
    showPriorityError("This field is required");
    return false;
  }
  return true;
}

function validateDateFormat(dateString) {
  if (dateString.length !== 10) return false;
  if (dateString[2] !== "/" || dateString[5] !== "/") return false;

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
  const priorityGroup = document.querySelector(".taskPriorityGroup");
  if (!priorityGroup) return;

  clearPriorityError();

  const errorDiv = priorityGroup.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hide");
  }
}

function clearPriorityError() {
  const priorityGroup = document.querySelector(".taskPriorityGroup");
  if (!priorityGroup) return;

  const errorDiv = priorityGroup.querySelector(".errorMessage");
  if (errorDiv) {
    errorDiv.textContent = "";
    errorDiv.classList.add("hide");
  }
}

function clearAllTaskErrors() {
  clearError("taskTitle");
  clearError("taskDueDate");
  clearCustomDropdownError();
  clearCategoryError();
  clearPriorityError();
}

function getFormDataForFirebase() {
  const dueDateInput = document.getElementById("taskDueDate");
  const formattedDueDate = convertDateFormat(dueDateInput);

  return createTaskDataObject(formattedDueDate);
}

function convertDateFormat(dueDateInput) {
  if (!dueDateInput || !dueDateInput.value) return "";

  const day = dueDateInput.value.substring(0, 2);
  const month = dueDateInput.value.substring(3, 5);
  const year = dueDateInput.value.substring(6, 10);

  if (day && month && year) {
    return year + "-" + month + "-" + day;
  }

  return "";
}

function createTaskDataObject(formattedDueDate) {
  return {
    title: document.getElementById("taskTitle").value,
    description: document.getElementById("taskDescription").value || "",
    dueDate: formattedDueDate,
    taskPriority: selectedPriority,
    assignedTo: document.getElementById("taskAssignee").value,
    Category: mapCategoryToFirebase(selectedCategory),
    Status: "toDo",
  };
}

function mapCategoryToFirebase(category) {
  const categoryMap = {
    "User Story": "User Story",
    "Technical Task": "Technical Task",
  };
  return categoryMap[category] || "Technical Task";
}

function clearFormWithValidation() {
  clearAllFormInputs();
  resetPriorityToDefault();
  resetCategoryToDefault();
  clearAllTaskErrors();
}

function clearAllFormInputs() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDueDate").value = "";

  if (typeof clearContactSelections === "function") {
    clearContactSelections();
  }

  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) subtaskInput.value = "";
}

function resetPriorityToDefault() {
  if (typeof clearPrioritySelection === "function") {
    clearPrioritySelection();
  }
  selectedPriority = "Medium";
}

function resetCategoryToDefault() {
  selectedCategory = "";
  const categoryInput = document.getElementById("categoryDropdownInput");
  if (categoryInput) {
    categoryInput.value = "";
    categoryInput.placeholder = "Select task category";
  }
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