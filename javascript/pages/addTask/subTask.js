/**
 * @fileoverview Subtask management functionality for the Add Task feature
 * Handles subtask creation, editing, deletion, and event handling
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Initializes subtask functionality with empty array and event listeners
 */
function initializeSubtask() {
  renderSubtasks([]);
  setupSubtaskEvents();
}

/**
 * Sets up all event listeners for subtask functionality
 */
function setupSubtaskEvents() {
  setupSubtaskIconEvents();
  setupSubtaskInputEvents();
  setupSubtaskContainerEvents();
}

/**
 * Sets up click events for the subtask creation icon
 */
function setupSubtaskIconEvents() {
  const subtaskIcon = document.getElementById("createSubtaskButton");
  if (subtaskIcon) {
    subtaskIcon.onclick = function () {
      addSubtaskToTask();
    };
    subtaskIcon.style.cursor = "pointer";
  }
}

/**
 * Sets up double-click events for the subtask input field
 */
function setupSubtaskInputEvents() {
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) {
    subtaskInput.addEventListener("dblclick", function (e) {
      e.preventDefault();
      addSubtaskToTask();
    });
  }
}

/**
 * Sets up event listeners for the subtask container
 */
function setupSubtaskContainerEvents() {
  const container = document.getElementById("editableDiv");
  if (container) {
    setupContainerDoubleClickEvents(container);
    setupContainerButtonClickEvents(container);
  }
}

/**
 * Sets up double-click events for editing subtasks in the container
 * @param {HTMLElement} container - The subtask container element
 */
function setupContainerDoubleClickEvents(container) {
  container.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("subtaskText")) {
      e.target.contentEditable = true;
      e.target.focus();
    }
  });
}

/**
 * Sets up click events for subtask action buttons
 * @param {HTMLElement} container - The subtask container element
 */
function setupContainerButtonClickEvents(container) {
  container.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.closest(".deleteBtn")) {
      handleDeleteButtonClick(e);
    }
    if (e.target.closest(".checkBtn")) {
      handleCheckButtonClick(e);
    }
  });
}

/**
 * Handles the delete button click for a subtask
 * @param {Event} e - The click event
 */
function handleDeleteButtonClick(e) {
  const index = e.target.closest(".subtaskItem").dataset.index;
  deleteSubtask(parseInt(index));
}

/**
 * Handles the check button click for a subtask to save edits
 * @param {Event} e - The click event
 */
function handleCheckButtonClick(e) {
  const subtaskItem = e.target.closest(".subtaskItem");
  const subtaskText = subtaskItem.querySelector(".subtaskText");
  const index = subtaskItem.dataset.index;
  editSubtaskText(parseInt(index), subtaskText.textContent.trim());
  subtaskText.contentEditable = false;
  // CSS übernimmt automatisch das Hide/Show der Buttons
}

/**
 * Adds a new subtask to the current task
 * Creates a subtask object and adds it to the global currentSubtasks array
 */
function addSubtaskToTask() {
  const subtaskInput = document.getElementById("taskSubtask");
  if (!subtaskInput || !subtaskInput.value.trim()) {
    return;
  }
  const subtaskData = {
    id: Date.now().toString(),
    text: subtaskInput.value.trim(),
    completed: false,
  };
  if (typeof window.currentSubtasks === "undefined") {
    window.currentSubtasks = [];
  }
  window.currentSubtasks.push(subtaskData);
  subtaskInput.value = "";
  renderSubtasks(window.currentSubtasks);
}

/**
 * Deletes a subtask at the specified index
 * @param {number} index - The index of the subtask to delete
 */
function deleteSubtask(index) {
  if (typeof window.currentSubtasks !== "undefined") {
    window.currentSubtasks.splice(index, 1);
    renderSubtasks(window.currentSubtasks);
  }
}

/**
 * Edits the text of a subtask at the specified index
 * @param {number} index - The index of the subtask to edit
 * @param {string} newText - The new text for the subtask
 */
function editSubtaskText(index, newText) {
  if (
    typeof window.currentSubtasks !== "undefined" &&
    window.currentSubtasks[index]
  ) {
    window.currentSubtasks[index].text = newText;
  }
}

/**
 * Starts editing mode for a subtask (triggered by hover edit button)
 * @param {number} index - The index of the subtask to edit
 */
function startEditingSubtask(index) {
  const subtaskItem = document.querySelector(`[data-index="${index}"]`);
  if (subtaskItem) {
    const subtaskText = subtaskItem.querySelector(".subtaskText");
    if (subtaskText) {
      subtaskText.contentEditable = true;
      subtaskText.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(subtaskText);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

/**
 * Renders the subtasks list in the DOM
 * @param {Array} subtasks - Array of subtask objects to render
 */
function renderSubtasks(subtasks = []) {
  const subtaskData = selectSubtask(subtasks);
  const editableDiv = document.getElementById("editableDiv");
  if (editableDiv) {
    editableDiv.innerHTML = subtaskData;
  }
}
