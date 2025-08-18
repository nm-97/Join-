/**
 * @fileoverview Subtask management functionality for the Add Task feature
 * Handles subtask creation, editing, deletion, and event handling
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Initializes subtask functionality with empty array and comprehensive event listener setup
 * Renders empty subtask list and configures all subtask-related event handlers for user interaction
 * Provides complete subtask management initialization for task creation interface
 * @function initializeSubtask
 * @returns {void} No return value, sets up subtask functionality with rendering and event handling
 */
function initializeSubtask() {
  renderSubtasks([]);
  setupSubtaskEvents();
}

/**
 * Sets up all event listeners for comprehensive subtask functionality and user interaction
 * Configures icon clicks, input field interactions, and container event handling for subtask management
 * Provides complete event handling setup for subtask creation, editing, and deletion operations
 * @function setupSubtaskEvents
 * @returns {void} No return value, configures all subtask-related event listeners and interactions
 */
function setupSubtaskEvents() {
  setupSubtaskIconEvents();
  setupSubtaskInputEvents();
  setupSubtaskContainerEvents();
}

/**
 * Sets up click events for the subtask creation icon with cursor styling and click handler
 * Attaches click event to subtask creation button and applies pointer cursor for better UX
 * Provides interactive subtask creation button functionality for task subtask management
 * @function setupSubtaskIconEvents
 * @returns {void} No return value, configures subtask creation icon click events and styling
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
 * Sets up double-click events for the subtask input field to enable quick subtask creation
 * Attaches double-click event handler to subtask input for alternative subtask creation method
 * Provides convenient double-click subtask creation functionality as alternative to button click
 * @function setupSubtaskInputEvents
 * @returns {void} No return value, configures subtask input field double-click event handling
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
 * Sets up event listeners for the subtask container to handle editing and action button interactions
 * Configures double-click editing events and button click events for subtask management operations
 * Provides comprehensive container event handling for subtask editing, deletion, and confirmation
 * @function setupSubtaskContainerEvents
 * @returns {void} No return value, configures subtask container event listeners for user interactions
 */
function setupSubtaskContainerEvents() {
  const container = document.getElementById("editableDiv");
  if (container) {
    setupContainerDoubleClickEvents(container);
    setupContainerButtonClickEvents(container);
  }
}

/**
 * Sets up double-click events for editing subtasks in the container with inline editing functionality
 * Enables inline editing by making subtask text content editable and focusing on double-click
 * Provides intuitive double-click editing interface for quick subtask text modifications
 * @function setupContainerDoubleClickEvents
 * @param {HTMLElement} container - The subtask container element containing subtask items
 * @returns {void} No return value, configures double-click editing events for subtask text elements
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
 * Sets up click events for subtask action buttons including delete and check/save functionality
 * Handles click events for delete and check buttons with event delegation and preventDefault
 * Provides comprehensive button interaction handling for subtask management operations
 * @function setupContainerButtonClickEvents
 * @param {HTMLElement} container - The subtask container element containing action buttons
 * @returns {void} No return value, configures click event handlers for subtask action buttons
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
 * Handles the delete button click for a subtask with index extraction and deletion execution
 * Extracts subtask index from DOM data attribute and calls deleteSubtask function
 * Provides delete button click handling for subtask removal from task subtask list
 * @function handleDeleteButtonClick
 * @param {Event} e - The click event object containing target element and event information
 * @returns {void} No return value, processes delete button click and removes specified subtask
 */
function handleDeleteButtonClick(e) {
  const index = e.target.closest(".subtaskItem").dataset.index;
  deleteSubtask(parseInt(index));
}

/**
 * Handles the check button click for a subtask to save edits and exit editing mode
 * Extracts edited text content, saves changes, and disables content editing functionality
 * Provides check/save button functionality for confirming subtask text modifications
 * @function handleCheckButtonClick
 * @param {Event} e - The click event object containing target element and event information
 * @returns {void} No return value, saves subtask edits and exits editing mode
 */
function handleCheckButtonClick(e) {
  const subtaskItem = e.target.closest(".subtaskItem");
  const subtaskText = subtaskItem.querySelector(".subtaskText");
  const index = subtaskItem.dataset.index;
  editSubtaskText(parseInt(index), subtaskText.textContent.trim());
  subtaskText.contentEditable = false;
}

/**
 * Adds a new subtask to the current task with validation, object creation, and rendering
 * Validates input, creates subtask object, adds to global array, clears input, and re-renders
 * Provides complete subtask creation workflow from input validation to visual update
 * @function addSubtaskToTask
 * @returns {void} No return value, creates and adds subtask to current task with visual update
 */
function addSubtaskToTask() {
  if (!validateSubtaskInput()) return;
  const subtaskData = createSubtaskObject();
  addSubtaskToArray(subtaskData);
  clearSubtaskInput();
  renderSubtasks(window.currentSubtasks);
}

/**
 * Validates subtask input for existence and non-empty content
 * @function validateSubtaskInput
 * @returns {boolean} True if input exists and has content, false otherwise
 */
function validateSubtaskInput() {
  const subtaskInput = document.getElementById("taskSubtask");
  return subtaskInput && subtaskInput.value.trim();
}

/**
 * Creates a new subtask object with unique ID and input text
 * @function createSubtaskObject
 * @returns {Object} Subtask object with id, text, and completed properties
 */
function createSubtaskObject() {
  const subtaskInput = document.getElementById("taskSubtask");
  return {
    id: Date.now().toString(),
    text: subtaskInput.value.trim(),
    completed: false,
  };
}

/**
 * Adds subtask object to global currentSubtasks array with initialization check
 * @function addSubtaskToArray
 * @param {Object} subtaskData - The subtask object to add to the array
 * @returns {void} No return value, adds subtask to global array
 */
function addSubtaskToArray(subtaskData) {
  if (typeof window.currentSubtasks === "undefined") {
    window.currentSubtasks = [];
  }
  window.currentSubtasks.push(subtaskData);
}

/**
 * Clears the subtask input field after successful subtask creation
 * @function clearSubtaskInput
 * @returns {void} No return value, empties subtask input field
 */
function clearSubtaskInput() {
  const subtaskInput = document.getElementById("taskSubtask");
  if (subtaskInput) subtaskInput.value = "";
}

/**
 * Deletes a subtask at the specified index from the global subtasks array with re-rendering
 * Removes subtask from currentSubtasks array using splice and updates visual display
 * Provides subtask deletion functionality with immediate visual feedback and array management
 * @function deleteSubtask
 * @param {number} index - The index position of the subtask to delete from the array
 * @returns {void} No return value, removes subtask from array and re-renders subtask list
 */
function deleteSubtask(index) {
  if (typeof window.currentSubtasks !== "undefined") {
    window.currentSubtasks.splice(index, 1);
    renderSubtasks(window.currentSubtasks);
  }
}

/**
 * Edits the text of a subtask at the specified index with validation and text update
 * Updates subtask text property in currentSubtasks array with bounds checking
 * Provides subtask text modification functionality with safe array access and validation
 * @function editSubtaskText
 * @param {number} index - The index position of the subtask to edit in the array
 * @param {string} newText - The new text content to assign to the subtask
 * @returns {void} No return value, updates subtask text in global array with validation
 */
function editSubtaskText(index, newText) {
  if (
    typeof window.currentSubtasks !== "undefined" &&
    window.currentSubtasks[index]
  ) {
    if (newText.trim() === "") {
      deleteSubtask(index);
    } else {
      window.currentSubtasks[index].text = newText;
    }
  }
}

/**
 * Starts editing mode for a subtask triggered by hover edit button with cursor positioning
 * Enables content editing, focuses element, and positions cursor at end of text content
 * Provides programmatic editing initiation with proper text selection and cursor management
 * @function startEditingSubtask
 * @param {number} index - The index position of the subtask to start editing mode for
 * @returns {void} No return value, enables editing mode with focus and cursor positioning
 */
function startEditingSubtask(index) {
  const subtaskItem = findSubtaskItem(index);
  if (!subtaskItem) return;
  const subtaskText = subtaskItem.querySelector(".subtaskText");
  if (!subtaskText) return;
  enableEditingMode(subtaskText);
  positionCursorAtEnd(subtaskText);
}

/**
 * Finds subtask item element by index using data attribute selector
 * @function findSubtaskItem
 * @param {number} index - The index to search for
 * @returns {HTMLElement|null} The subtask item element or null if not found
 */
function findSubtaskItem(index) {
  return document.querySelector(`[data-index="${index}"]`);
}

/**
 * Enables editing mode for subtask text element
 * @function enableEditingMode
 * @param {HTMLElement} subtaskText - The subtask text element to enable editing for
 * @returns {void} No return value, makes element editable and focuses it
 */
function enableEditingMode(subtaskText) {
  subtaskText.contentEditable = true;
  subtaskText.focus();
}

/**
 * Positions cursor at the end of text content for editing
 * @function positionCursorAtEnd
 * @param {HTMLElement} subtaskText - The text element to position cursor in
 * @returns {void} No return value, positions cursor at end of text content
 */
function positionCursorAtEnd(subtaskText) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(subtaskText);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Renders the subtasks list in the DOM using template generation and container injection
 * Generates subtask HTML using selectSubtask template function and injects into editable container
 * Provides complete subtask list rendering with template-based HTML generation and DOM injection
 * @function renderSubtasks
 * @param {Array} subtasks - Array of subtask objects to render with id, text, and completed properties
 * @returns {void} No return value, updates DOM with rendered subtask list using template system
 */
function renderSubtasks(subtasks = []) {
  const subtaskData = selectSubtask(subtasks);
  const editableDiv = document.getElementById("editableDiv");
  if (editableDiv) {
    editableDiv.innerHTML = subtaskData;
  }
}
