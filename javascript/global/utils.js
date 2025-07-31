/**
 * @fileoverview Utility functions for the JOIN application
 * Contains common helper functions for date formatting, string manipulation, and data processing
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * async function getGreetingsMessage() {
  return `
   <div class="header">`mats a date string into a readable format
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
 * Formats a name to proper case (first letter of each word capitalized)
 * @param {string} name - The name to format
 * @returns {string} Properly formatted name
 */
function formatName(name) {
  if (!name || typeof name !== "string") return name;
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

// Ersetze die getAllContactsFromAssigned Funktion (ab Zeile ~105):

/**
 * Handles assignedTo array and returns all contact objects
 * @param {Array|string|null} assignedTo - The assignedTo field (array, string, or null)
 * @returns {Promise<Array>} Promise resolving to array of contact objects
 */
async function getAllContactsFromAssigned(assignedTo) {
  if (!assignedTo) return [];
  const contactIds = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
  const contacts = [];
  for (const contactId of contactIds) {
    try {
      const contact = await fetchContactByIdAndUser(contactId);
      if (contact) {
        contacts.push(contact);
      }
    } catch (error) {
      console.warn(`Contact with ID ${contactId} not found:`, error);
    }
  }
  return contacts;
}

/**
 * Gets all contact names from assignedTo array
 * @param {Array|string|null} assignedTo - The assignedTo field
 * @returns {Array} Array of contact names
 */
function getAllContactNamesFromAssigned(assignedTo) {
  const contacts = getAllContactsFromAssigned(assignedTo);
  return contacts.map((contact) => contact.name);
}

/**
 * Toggles the visibility of the user dropdown menu with animation.
 * Adds or removes CSS classes to animate showing/hiding the menu.
 * Disables body scroll while menu is visible and restores it after hiding.
 * @returns {void}
 */
function toggleUserMenu() {
  const dropdown = document.getElementById("usermenu");

  if (dropdown.classList.contains("show")) {
    dropdown.classList.remove("show");
    dropdown.classList.add("hide");

    setTimeout(() => {
      dropdown.style.display = "none";
      dropdown.classList.remove("hide");
      document.body.classList.remove("noScroll");
    }, 300);
  } else {
    dropdown.style.display = "block";
    dropdown.classList.add("show");
    document.body.classList.add("noScroll");
  }
}

/**
 * Initializes the user avatar with appropriate initials and color
 * Handles both guest and registered user display
 */
function initializeUserAvatar() {
  const user = getCurrentUser();
  let displayName = "User";
  if (user.type === "guest") {
    displayName = "Guest";
  } else if (user.type === "registered") {
    displayName = user.name || "User";
  }
  const userAvatarElement = document.getElementById("userAvatar");
  if (userAvatarElement) {
    const initials = getInitials(displayName);
    const color = getAvatarColor(displayName);
    userAvatarElement.textContent = initials;
    userAvatarElement.style.backgroundColor = color;
  }
}

/**
 * Initializes the correct logo based on screen size
 * Should be called when page loads
 */
function initializeLogo() {
  const logoImg = document.querySelector("img#loadingScreen");
  if (logoImg) {
    const isMobile = window.innerWidth <= 428;
    if (isMobile) {
      logoImg.src = "../assets/icons/login/Capa 1.png";
    } else {
      logoImg.src = "../assets/icons/joinlogo_black.png";
    }
  }
}

/**
 * Handles logo animation with smooth opacity transition
 * Sets appropriate start logo based on screen size
 */
function startLogoAnimation() {
  const logoImg = document.querySelector("img#loadingScreen");
  if (logoImg) {
    const isMobile = window.innerWidth <= 428;
    if (isMobile) {
      logoImg.src = "../assets/icons/login/Capa 1.png";
      setTimeout(() => {
        logoImg.style.opacity = "0.95";
        setTimeout(() => {
          logoImg.src = "../assets/icons/login/Capa 2.png";
          logoImg.style.opacity = "1";
        }, 300);
      }, 200);
    } else {
      logoImg.src = "../assets/icons/joinlogo_black.png";
    }
  }
}

/**
 * Shows greeting overlay before redirecting to summary page
 * Called after successful login (mobile responsive design)
 */
function showGreetingOverlay() {
  sessionStorage.setItem("justLoggedIn", "true");
  window.location.href = "../html/summaryUser.html";
}

/**
 * Checks if device is in mobile/responsive mode
 * @returns {boolean} True if mobile device (≤428px)
 */
function isMobileDevice() {
  return window.innerWidth <= 1024;
}

/**
 * Updates navigation button selection state (mobile only)
 * @param {HTMLElement} clickedElement - The clicked navigation element
 */
function updateNavigationSelection(clickedElement) {
  if (!isMobileDevice()) return;

  document.querySelectorAll(".navBtn").forEach((btn) => {
    btn.classList.remove("selected");
  });
  if (clickedElement) {
    clickedElement.classList.add("selected");
  }
}

/**
 * Gets the URL for a given page
 * @param {string} page - The page identifier
 * @returns {string|null} The URL for the page or null if not found
 */
function getPageUrl(page) {
  const pageMap = {
    summary: "../html/summaryUser.html",
    addTask: "../html/addTask.html",
    board: "../html/board.html",
    contacts: "../html/contacts.html",
  };
  return pageMap[page] || null;
}

/**
 * Performs the actual navigation to a URL
 * @param {string} url - The URL to navigate to
 */
function performNavigation(url) {
  window.location.href = url;
}

/**
 * Navigates to the specified page (mobile responsive only)
 * @param {string} page - The page to navigate to (summary, addTask, board, contacts)
 */
function navigateTo(page) {
  if (!isMobileDevice()) return;

  updateNavigationSelection(event.target);
  const url = getPageUrl(page);
  if (url) {
    performNavigation(url);
  } else {
    console.error(`Page '${page}' not found in navigation map`);
  }
}

/**
 * Sets the selected navigation button based on current page
 * Call this on each page load to maintain selection state
 */
function setCurrentPageSelection() {
  if (!isMobileDevice()) return;
  const currentPage = window.location.pathname;
  let pageKey = null;
  if (currentPage.includes("summaryUser.html")) {
    pageKey = "summary";
  } else if (currentPage.includes("addTask.html")) {
    pageKey = "addTask";
  } else if (currentPage.includes("board.html")) {
    pageKey = "board";
  } else if (currentPage.includes("contacts.html")) {
    pageKey = "contacts";
  }
  if (pageKey) {
    document.querySelectorAll(".navBtn").forEach((btn) => {
      btn.classList.remove("selected");
    });
    const currentButton = document.querySelector(
      `[onclick*="navigateTo('${pageKey}')"]`
    );
    if (currentButton) {
      currentButton.classList.add("selected");
    }
  }
}

/**
 * Initializes UI components when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  initializeLogo();
  initializeUserAvatar();
  startLogoAnimation();
  setCurrentPageSelection();
});
