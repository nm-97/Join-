/**
 * @fileoverview User management utilities for the JOIN application
 * Handles user display, authentication, greetings, and avatar generation
 * @author Join Project Team
 * @version 1.0.0
 */

"use strict";

/**
 * Gets and displays the current user's name
 * @returns {Promise<string>} The display name of the current user
 */
async function getUserName() {
  const user = getCurrentUser();
  let displayName = "User";
  if (user.type === "guest") {
    displayName = "Guest";
  } else if (user.type === "registered") {
    displayName = user.name || "User";
  }
  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.textContent = displayName;
  }
  return displayName;
}

/**
 * Logs out the current user and redirects to login page
 */
function logoutUserDirectly() {
  sessionStorage.removeItem("currentUser");
  window.location.href = "../html/index.html";
}

/**
 * Shows time-appropriate greeting based on current hour
 * @returns {string} The greeting message
 */
function showLocalTimeFormUser() {
  const hour = new Date().getHours();
  let greeting;
  if (hour < 8) greeting = "Good evening,";
  else if (hour < 12) greeting = "Good morning,";
  else if (hour < 18) greeting = "Good afternoon,";
  else greeting = "Good evening,";
  const welcomeElement = document.getElementById("welcomeText");
  if (welcomeElement) {
    welcomeElement.textContent = greeting;
  }
  return greeting;
}

/**
 * Displays a success message after user sign up
 */
function renderSignUpSuccessMessage() {
  document.body.insertAdjacentHTML(
    "beforeend",
    getSuccessSignUpMessageTemplate()
  );
  setTimeout(() => {
    const toast = document.getElementById("signUpSuccess");
    if (toast) toast.remove();
  }, 2000);
}

/**
 * Initializes user-related data and UI components
 */
async function initializeUserData() {
  await showContactSideBar();
}

/**
 * Generates initials from a person's name
 * @param {string} name - The full name to generate initials from
 * @returns {string} Two-character initials or "?" if invalid input
 */
function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const nameParts = name.split(" ");
  if (nameParts.length >= 2) {
    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[1].charAt(0).toUpperCase()
    );
  }
  return name.charAt(0).toUpperCase() + (name.charAt(1) || "").toUpperCase();
}

/**
 * Generates a color for user avatar based on name
 * @param {string} name - The name to generate color for
 * @returns {string} Hexadecimal color code
 */
function getAvatarColor(name) {
  const colors = [
    "#FF5EB3",
    "#6E52FF",
    "#00BEE8",
    "#1FD7C1",
    "#FF745E",
    "#FFA35E",
    "#FC71FF",
    "#FFC701",
    "#0038FF",
    "#C3FF2B",
    "#FFE62B",
    "#FF4646",
    "#FFBB2B",
  ];
  return colors[name.charCodeAt(0) % colors.length];
}
