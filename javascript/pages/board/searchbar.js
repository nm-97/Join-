function handleSearchInput() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    const searchValue = searchInput.value.toLowerCase().trim();
    if (searchValue) {
      filterTaskbySearchInput(searchValue);
    } else {
      showAllTasks();
    }
  }
}

async function filterTaskbySearchInput(searchValue) {
  const tasks = await fetchTaskByUser();

  tasks.forEach((task) => {
    const isMatch = isTaskMatchingSearch(task, searchValue);

    if (isMatch) {
      showHighlightTask(task.id);
    } else {
      hideTask(task.id);
    }
  });
}

function isTaskMatchingSearch(task, searchValue) {
  const titleMatches = doesTitleMatch(task, searchValue);
  const descriptionMatches = doesDescriptionMatch(task, searchValue);
  return titleMatches || descriptionMatches;
}

function doesTitleMatch(task, searchValue) {
  return task.title && task.title.toLowerCase().includes(searchValue);
}

function doesDescriptionMatch(task, searchValue) {
  return (
    task.description && task.description.toLowerCase().includes(searchValue)
  );
}

function hideTask(taskId) {
  const taskElement = getTaskElement(taskId);
  if (taskElement) {
    taskElement.classList.add("hidden");
    taskElement.classList.remove("highlight");
  }
}

function showHighlightTask(taskId) {
  const taskElement = getTaskElement(taskId);
  if (taskElement) {
    taskElement.classList.remove("hidden");
    taskElement.classList.add("highlight");
  }
}

function showAllTasks() {
  const allTasks = document.querySelectorAll("[data-task-id]");
  allTasks.forEach((taskElement) => {
    taskElement.classList.remove("hidden", "highlight");
  });
}

function getTaskElement(taskId) {
  return document.querySelector(`[data-task-id="${taskId}"]`);
}

function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initializeSearch(); // ✅ Wichtig!
});
