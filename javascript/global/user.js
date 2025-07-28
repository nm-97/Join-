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
 * Sets up guest login by storing guest user data in session storage and redirecting
 */
function setGuestLogin() {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      type: "guest",
    })
  );
  window.location.href = "../html/summaryUser.html";
}

/**
 * Sets up registered user login by storing user data in session storage
 * @param {Object} params - User parameters (id, name, email, etc.)
 * @param {boolean} redirect - Whether to redirect after login (default: true)
 */
function setUserLogin(params, redirect = true) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      type: "registered",
      ...params,
    })
  );
  if (redirect) {
    window.location.href = "../html/summaryUser.html";
  }
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
 * Fetches all registered users from Firebase
 * @returns {Promise<Array>} Array of user objects with IDs
 */
async function fetchAllRegisteredUsers() {
  const data = await fetchData(USERS_PATH);
  if (!data) return [];
  return Object.entries(data).map(([id, userData]) => ({ id, ...userData }));
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
 * Checks user credentials against registered users in Firebase
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} Object with success status and user data if successful
 */
async function checkUserCredentials(email, password) {
  try {
    const users = await fetchAllRegisteredUsers();
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (user.email === email && user.password === password) {
        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            type: "registered",
          },
        };
      }
    }
    return {
      success: false,
    };
  } catch (error) {
    console.error("Login Fehler:", error);
    return {
      success: false,
    };
  }
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
  if (!name || typeof name !== "string") return "#6B7280";
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
    "#8B5CF6",
    "#10B981",
    "#F97316",
    "#EF4444",
    "#3B82F6",
    "#84CC16",
    "#F59E0B",
  ];
  const firstChar = name.charCodeAt(0);
  const lastChar = name.charCodeAt(name.length - 1);
  const nameLength = name.length;
  const colorIndex = (firstChar + lastChar + nameLength) % colors.length;
  return colors[colorIndex];
}
