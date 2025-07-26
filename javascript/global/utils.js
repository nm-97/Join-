/**
 * @fileoverview Utility functions for the JOIN application
 * Contains common helper functions for date formatting, string manipulation, and data processing
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Capitalizes the first letter of a string and makes the rest lowercase
 * @param {string} string - The string to capitalize
 * @returns {string} Capitalized string or empty string if input is falsy
 */
const capitalizeFirstLetter = (string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";

/**
 * Formats a date string into a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date in "Month Day, Year" format
 */
function formatDate(dateString) {
  let date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculates the next upcoming deadline from a list of tasks
 * @param {Array} allTasks - Array of task objects with dueDate properties
 * @returns {string} Formatted date of next deadline or message if none found
 */
function calculateNextDeadline(allTasks) {
  const today = new Date();
  const futureTasks = allTasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today;
  });
  if (futureTasks.length === 0) {
    return "No upcoming deadlines";
  }
  const nextTask = futureTasks.reduce((earliest, task) => {
    const taskDate = new Date(task.dueDate);
    const earliestDate = new Date(earliest.dueDate);
    return taskDate < earliestDate ? task : earliest;
  });
  return formatDate(nextTask.dueDate);
}

/**
 * Groups contacts by the first letter of their name
 * @param {Array} contacts - Array of contact objects with name properties
 * @returns {Object} Object where keys are letters and values are arrays of contacts
 */
const groupContactsByLetter = (contacts) => {
  return contacts.reduce((grouped, contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    grouped[firstLetter] = grouped[firstLetter] || [];
    grouped[firstLetter].push(contact);
    return grouped;
  }, {});
};

/**
 * Maps category IDs to their Firebase display names
 * @param {string} category - The category ID to map
 * @returns {string} The display name for Firebase or default "Technical Task"
 */
function mapCategoryToFirebase(category) {
  const categoryMap = {
    userStory: "User Story",
    technicalTask: "Technical Task",
  };
  return categoryMap[category] || "Technical Task";
}

/**
 * Extracts contact form data from a form submission event
 * @param {Event} event - The form submission event
 * @returns {Object} Object containing name, email, and phone from form
 */
const getContactFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  phone: new FormData(event.target).get("phone"),
});

/**
 * Updates the text content of an element with the given value
 * @param {string} elementId - The ID of the element to update
 * @param {string|number} value - The value to set as text content
 */
function updateCounter(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}
