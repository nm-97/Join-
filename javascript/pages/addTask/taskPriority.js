/**
 * @fileoverview Task Priority Management for Add Task functionality
 * Handles priority button selection, styling, and state management
 * @author Join Project Team
 * @version 1.0.0
 */

/**
 * Sets up event listeners for priority selection buttons with validation and event attachment
 * Retrieves priority buttons, validates their existence, and attaches click event handlers
 * Provides comprehensive priority selection functionality for task priority management
 * @function setupPriorityButtons
 * @returns {void} No return value, configures priority button event listeners and validation
 */
function setupPriorityButtons() {
  const buttons = getPriorityButtons();
  if (!validateAllButtonsExist(buttons)) return;

  attachPriorityButtonEvents(buttons);
}

/**
 * Validates that all required priority buttons exist in the DOM for proper functionality
 * Checks for urgent, medium, and low priority button elements to ensure complete button set
 * Provides essential validation before attaching event listeners to priority buttons
 * @function validateAllButtonsExist
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {boolean} True if all priority buttons exist in DOM, false if any button is missing
 */
function validateAllButtonsExist(buttons) {
  return buttons.urgent && buttons.medium && buttons.low;
}

/**
 * Attaches click event listeners to priority buttons for priority selection functionality
 * Assigns onclick handlers to urgent, medium, and low priority buttons with selectPriority calls
 * Provides interactive priority selection behavior for task priority assignment
 * @function attachPriorityButtonEvents
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {void} No return value, configures click event handlers for priority selection
 */
function attachPriorityButtonEvents(buttons) {
  buttons.urgent.onclick = () => selectPriority("Urgent", buttons.urgent);
  buttons.medium.onclick = () => selectPriority("Medium", buttons.medium);
  buttons.low.onclick = () => selectPriority("Low", buttons.low);
}

/**
 * Selects a priority level and updates button styling with proper visual feedback
 * Clears previous selections, applies priority-specific CSS class, and updates global priority state
 * Provides complete priority selection functionality with visual state management
 * @function selectPriority
 * @param {string} priority - The priority level to select ('Urgent', 'Medium', 'Low')
 * @param {HTMLElement} button - The button element that was clicked for priority selection
 * @returns {void} No return value, updates priority selection state and button visual styling
 */
function selectPriority(priority, button) {
  clearPrioritySelection();
  const priorityClass = changeColorBasedOnPriority(priority);
  button.classList.add(priorityClass);
  selectedPriority = priority;
}

/**
 * Clears all priority selections and resets button styles to default state
 * Removes priority CSS classes and inline styles from all priority buttons
 * Provides complete priority selection reset for new priority selection or form clearing
 * @function clearPrioritySelection
 * @returns {void} No return value, resets all priority buttons to unselected state
 */
function clearPrioritySelection() {
  const buttons = getPriorityButtons();
  removeAllPriorityClasses(buttons);
  resetButtonStyles(buttons);
}

/**
 * Retrieves all priority button elements from the DOM for priority management operations
 * Returns structured object containing urgent, medium, and low priority button references
 * Provides centralized access to priority buttons for event handling and styling operations
 * @function getPriorityButtons
 * @returns {Object} Object containing urgent, medium, and low button elements from DOM
 */
function getPriorityButtons() {
  return {
    urgent: document.getElementById("urgentBtn"),
    medium: document.getElementById("mediumBtn"),
    low: document.getElementById("lowBtn"),
  };
}

/**
 * Removes all priority-related CSS classes from priority buttons for state reset
 * Iterates through priority buttons and removes selected state classes and general selection classes
 * Provides comprehensive CSS class cleanup for priority button state management
 * @function removeAllPriorityClasses
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {void} No return value, removes priority selection CSS classes from all buttons
 */
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

/**
 * Resets inline styles for priority buttons to remove custom styling and restore defaults
 * Clears backgroundColor and color inline styles from all priority buttons
 * Provides complete style reset for priority buttons to default CSS state
 * @function resetButtonStyles
 * @param {Object} buttons - Object containing priority button elements (urgent, medium, low)
 * @returns {void} No return value, removes inline styles from all priority buttons
 */
function resetButtonStyles(buttons) {
  Object.values(buttons).forEach((btn) => {
    if (btn) {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }
  });
}

/**
 * Determines the appropriate CSS class to apply based on selected priority level
 * Maps priority strings to corresponding CSS class names for button styling
 * Provides priority-to-class mapping for consistent priority button visual states
 * @function changeColorBasedOnPriority
 * @param {string} priority - Selected priority level ('Urgent', 'Medium', 'Low')
 * @returns {string} CSS class name for the priority button, empty string if priority not recognized
 */
function changeColorBasedOnPriority(priority) {
  const classes = {
    Urgent: "taskPriorityBtnUrgentSelected",
    Medium: "taskPriorityBtnMediumSelected",
    Low: "taskPriorityBtnLowSelected",
  };
  return classes[priority] || "";
}

/**
 * Sets the default priority selection to Medium priority on page load
 * Applies medium priority CSS class to medium button for default visual state
 * Provides consistent default priority selection for new task creation
 * @function setDefaultPriority
 * @returns {void} No return value, applies default medium priority styling to medium button
 */
function setDefaultPriority() {
  const mediumBtn = document.getElementById("mediumBtn");
  if (mediumBtn) {
    mediumBtn.classList.add("taskPriorityBtnMediumSelected");
  }
}
