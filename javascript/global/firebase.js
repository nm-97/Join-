/**
 * @fileoverview Firebase database integration for JOIN task management application
 * Handles all CRUD operations with Firebase Realtime Database for tasks, contacts, and subtasks
 * Supports both guest users and registered users with different data paths
 * @author Development Team
 * @version 1.0.0
 */

"use strict";

const firebaseUrl =
  "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

const GUEST_TASKS_PATH = "user/guest/task.json";
const GUEST_CONTACTS_PATH = "user/guest/contacts.json";
const USERS_PATH = "user/registered/.json";
const GUEST_SUBTASKS_PATH = "user/guest/subtasks.json";

const getUserTasksPath = (userId) => `user/registered/${userId}/task.json`;
const getUserTaskPath = (userId, taskId) =>
  `user/registered/${userId}/task/${taskId}.json`;
const getUserContactsPath = (userId) =>
  `user/registered/${userId}/contacts.json`;
const getUserContactPath = (userId, contactId) =>
  `user/registered/${userId}/contacts/${contactId}.json`;
const getUserSubtaskPath = (userId, subtaskId) =>
  `user/registered/${userId}/subtasks/${subtaskId}.json`;
const getGuestTaskPath = (taskId) => `user/guest/task/${taskId}.json`;
const getGuestContactPath = (contactId) =>
  `user/guest/contacts/${contactId}.json`;
const getGuestSubtaskPath = (subtaskId) =>
  `user/guest/subtasks/${subtaskId}.json`;

/**
 * Retrieves the current user from session storage
 * @returns {Object} Current user object or guest user object if none found
 */
function getCurrentUser() {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : { type: "guest" };
}

/**
 * Fetches data from Firebase database
 * @param {string} path - The Firebase database path to fetch from
 * @returns {Promise<any>} The fetched data from Firebase
 * @throws {Error} When the HTTP request fails
 */
async function fetchData(path) {
  const response = await fetch(`${firebaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`GET request failed: ${response.status}`);
  }
  return await response.json();
}

/**
 * Posts data to Firebase database
 * @param {string} path - The Firebase database path to post to
 * @param {any} data - The data to post to Firebase
 * @returns {Promise<any>} The response from Firebase
 * @throws {Error} When the HTTP request fails
 */
async function postData(path, data) {
  const response = await fetch(`${firebaseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`POST request failed: ${response.status}`);
  }
  return await response.json();
}

/**
 * Updates existing data in Firebase database using PATCH method
 * @param {string} path - The Firebase database path to update
 * @param {any} data - The data to update in Firebase
 * @returns {Promise<any>} The response from Firebase
 * @throws {Error} When the HTTP request fails
 */
async function patchData(path, data) {
  const response = await fetch(`${firebaseUrl}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`PATCH request failed: ${response.status}`);
  }
  return await response.json();
}

/**
 * Deletes data from Firebase database
 * @param {string} path - The Firebase database path to delete from
 * @returns {Promise<boolean>} True if deletion was successful, false otherwise
 */
async function deleteData(path) {
  const response = await fetch(`${firebaseUrl}${path}`, {
    method: "DELETE",
  });
  return response.ok;
}

/**
 * Extracts user form data from a form submission event
 * @param {Event} event - The form submission event
 * @returns {Object} Object containing name, email, and password from form
 */
const getUserFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  password: new FormData(event.target).get("password"),
});

/**
 * Creates a new user account after checking for email uniqueness
 * @param {Object} userData - User data object containing name, email, password
 * @returns {Promise<Object>} Success status and user ID if successful
 */
async function createUser(userData) {
  const existingUsers = await fetchAllRegisteredUsers();
  for (let i = 0; i < existingUsers.length; i++) {
    if (existingUsers[i].email === userData.email) {
      return {
        success: false,
      };
    }
  }
  const userId = await addUserToFirebase(userData);
  setUserLogin(
    {
      id: userId,
      name: userData.name,
      email: userData.email,
    },
    false
  );
  renderSignUpSuccessMessage();
  return {
    success: true,
    userId: userId,
  };
}

/**
 * Posts user data to Firebase database
 * @param {Object} UserData - User data to post
 * @returns {Promise<any>} Firebase response
 */
const postUserData = async (UserData) => {
  return await postData(USERS_PATH, UserData);
};

/**
 * Adds user data to Firebase database
 * @param {Object} userData - User data object to add to Firebase
 * @returns {Promise<string>} The Firebase-generated user ID
 */
async function addUserToFirebase(userData) {
  const result = await postData(USERS_PATH, userData);
  return result.name;
}

/**
 * Fetches all tasks for the current user (guest or registered)
 * @returns {Promise<Array>} Array of task objects
 */
async function fetchTaskByUser() {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserTasksPath(currentUser.id)
      : GUEST_TASKS_PATH;
  const data = await fetchData(path);
  if (!data) return [];
  return Object.entries(data).map(([id, taskData]) =>
    mapApiTaskToTemplate({ id, ...taskData })
  );
}

/**
 * Adds a new task to Firebase for the current user
 * @param {Object} taskData - Task data object to add
 * @returns {Promise<string>} The Firebase-generated task ID
 */
async function addTaskToFirebaseByUser(taskData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserTasksPath(currentUser.id)
      : GUEST_TASKS_PATH;
  const { id, ...cleanTaskData } = taskData;

  const result = await postData(path, cleanTaskData);
  return result.name;
}

/**
 * Fetches a specific task by its ID for the current user
 * @param {string} taskId - The ID of the task to fetch
 * @returns {Promise<Object|null>} Task object if found, null otherwise
 */
async function fetchTaskById(taskId) {
  const tasks = await fetchTaskByUser();
  return tasks.find((task) => task.id === taskId) || null;
}

/**
 * Deletes a contact from Firebase and all associated tasks
 * @param {string} contactId - The ID of the contact to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
async function deleteContactFromFirebase(contactId) {
  const currentUser = getCurrentUser();
  try {
    const contact = await fetchContactByIdAndUser(contactId);
    const contactName = contact.name;
    const allTasks = await fetchTaskByUser();
    const tasksToDelete = allTasks.filter(
      (task) => task.assignedTo === contactName
    );
    for (let i = 0; i < tasksToDelete.length; i++) {
      await deleteTaskFromFirebaseByUser(tasksToDelete[i].id);
    }
    const path =
      currentUser.type === "registered"
        ? getUserContactPath(currentUser.id, contactId)
        : getGuestContactPath(contactId);
    return await deleteData(path);
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return false;
  }
}

/**
 * Deletes a specific task from Firebase for the current user
 * @param {string} taskId - The ID of the task to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
async function deleteTaskFromFirebaseByUser(taskId) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserTaskPath(currentUser.id, taskId)
      : getGuestTaskPath(taskId);
  return await deleteData(path);
}

/**
 * Updates an existing contact in Firebase for the current user
 * @param {string} contactId - The ID of the contact to update
 * @param {Object} contactData - Updated contact data
 * @returns {Promise<boolean>} True if update was successful
 */
async function updateContactInFirebaseByUser(contactId, contactData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserContactPath(currentUser.id, contactId)
      : getGuestContactPath(contactId);
  await patchData(path, contactData);
  return true;
}

/**
 * Fetches a specific contact by ID for the current user
 * @param {string} contactId - The ID of the contact to fetch
 * @returns {Promise<Object|null>} Contact object if found, null otherwise
 */
async function fetchContactByIdAndUser(contactId) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserContactPath(currentUser.id, contactId)
      : getGuestContactPath(contactId);
  const result = await fetchData(path);
  if (result) {
    result.id = contactId;
  }
  return result;
}

/**
 * Fetches all contacts for the current user (guest or registered)
 * @returns {Promise<Array>} Array of contact objects
 */
async function fetchContactsByIdAndUser() {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserContactsPath(currentUser.id)
      : GUEST_CONTACTS_PATH;
  const data = await fetchData(path);
  if (!data) return [];
  return Object.entries(data).map(([id, contactData]) =>
    mapApiContactToTemplate({ id, ...contactData })
  );
}

/**
 * Adds a new contact to Firebase for the current user
 * @param {Object} contactData - Contact data object to add
 * @returns {Promise<string>} The Firebase-generated contact ID
 */
async function addContactToFirebaseByUser(contactData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserContactsPath(currentUser.id)
      : GUEST_CONTACTS_PATH;
  const result = await postData(path, contactData);
  return result.name;
}

/**
 * Updates an existing task in Firebase for the current user
 * @param {string} taskId - The ID of the task to update
 * @param {Object} taskData - Updated task data
 * @returns {Promise<boolean>} True if update was successful
 */
async function updateTaskInFirebaseByUser(taskId, taskData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserTaskPath(currentUser.id, taskId)
      : getGuestTaskPath(taskId);
  const { id, ...cleanTaskData } = taskData;
  await patchData(path, cleanTaskData);
  return true;
}

/**
 * Maps Firebase API task data to application template format
 * @param {Object} data - Raw task data from Firebase API
 * @returns {Object} Formatted task object with default values
 */
function mapApiTaskToTemplate(data) {
  return {
    id: data.id || null,
    Category: data.Category || "Technical Task",
    Status: data.Status || "toDo",
    assignedTo: data.assignedTo || "",
    description: data.description || "",
    dueDate: data.dueDate || "",
    taskPriority: data.taskPriority || "Medium",
    title: data.title || "Untitled Task",
    subtasks: data.subtasks || [],
  };
}

/**
 * Maps Firebase API contact data to application template format
 * @param {Object} data - Raw contact data from Firebase API
 * @returns {Object} Formatted contact object with default values
 */
function mapApiContactToTemplate(data) {
  const name = data.name || data["name "] || "";
  const phone = data.phone || data["phone "] || "";
  return {
    id: data.id || null,
    name: formatName(name) || "Unbekannt",
    email: data.email || "",
    phone: phone || "",
    address: data.address || "",
  };
}
