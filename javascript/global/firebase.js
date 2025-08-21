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
 * Retrieves the current user from session storage with fallback to guest mode
 * Parses stored user data from browser session or returns default guest object
 * Provides consistent user context management for authentication-dependent operations
 * @function getCurrentUser
 * @returns {Object} Current user object or guest user object if none found
 */
function getCurrentUser() {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : { type: "guest" };
}

/**
 * Fetches data from Firebase database using HTTP GET request with error handling
 * Constructs Firebase URL with provided path and processes JSON response data
 * Provides core data retrieval functionality for all Firebase database operations
 * @function fetchData
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
 * Posts data to Firebase database using HTTP POST request with JSON serialization
 * Sends new data to specified Firebase path with proper headers and error handling
 * Enables creation of new records in Firebase Realtime Database structure
 * @function postData
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
 * Updates existing data in Firebase database using PATCH method for partial updates
 * Modifies specific fields in existing records without overwriting entire objects
 * Provides efficient data synchronization for record modifications and field updates
 * @function patchData
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
 * Deletes data from Firebase database using HTTP DELETE request with status validation
 * Removes specified records or data structures from Firebase Realtime Database
 * Provides secure data removal functionality with boolean success confirmation
 * @function deleteData
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
 * Extracts user form data from a form submission event using FormData API
 * Retrieves name, email, and password fields from submitted form elements
 * Provides standardized user data extraction for registration and authentication workflows
 * @function getUserFormData
 * @param {Event} event - The form submission event
 * @returns {Object} Object containing name, email, and password from form
 */
const getUserFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  password: new FormData(event.target).get("password"),
});

/**
 * Creates a new user account after checking for email uniqueness across existing users
 * Validates email availability, adds user to Firebase, and manages login session state
 * Provides complete user registration workflow with duplicate prevention and success handling
 * @function createUser
 * @param {Object} userData - User data object containing name, email, password
 * @returns {Promise<Object>} Success status and user ID if successful
 */
async function createUser(userData) {
  const emailExists = await checkEmailExists(userData.email);
  if (emailExists) {
    return { success: false };
  }
  
  return await processUserCreation(userData);
}

/**
 * Checks if email already exists in registered users
 * @function checkEmailExists
 * @param {string} email - Email to check for existence
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
async function checkEmailExists(email) {
  const existingUsers = await fetchAllRegisteredUsers();
  return existingUsers.some(user => user.email === email);
}

/**
 * Processes user creation and login setup
 * @function processUserCreation
 * @param {Object} userData - User data object containing name, email, password
 * @returns {Promise<Object>} Success status and user ID
 */
async function processUserCreation(userData) {
  const userId = await addUserToFirebase(userData);
  
  setUserLogin({
    id: userId,
    name: userData.name,
    email: userData.email,
  }, false);
  
  renderSignUpSuccessMessage();
  
  return {
    success: true,
    userId: userId,
  };
}

/**
 * Posts user data to Firebase database using predefined registered users path
 * Sends user registration data to Firebase with proper path routing and error handling
 * Provides simplified interface for user data submission to centralized user storage
 * @function postUserData
 * @param {Object} UserData - User data to post
 * @returns {Promise<any>} Firebase response
 */
const postUserData = async (UserData) => {
  return await postData(USERS_PATH, UserData);
};

/**
 * Adds user data to Firebase database and extracts the generated unique identifier
 * Posts user information to registered users collection and returns Firebase-assigned ID
 * Provides user creation functionality with automatic ID generation for database references
 * @function addUserToFirebase
 * @param {Object} userData - User data object to add to Firebase
 * @returns {Promise<string>} The Firebase-generated user ID
 */
async function addUserToFirebase(userData) {
  const result = await postData(USERS_PATH, userData);
  return result.name;
}

/**
 * Fetches all tasks for the current user with automatic guest/registered user routing
 * Determines appropriate Firebase path based on user type and retrieves task collection
 * Provides unified task access interface with data mapping for consistent application format
 * @function fetchTaskByUser
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
 * Adds a new task to Firebase for the current user with automatic path resolution
 * Determines user-specific Firebase path and posts task data with ID cleanup
 * Provides streamlined task creation workflow with Firebase ID generation and user context
 * @function addTaskToFirebaseByUser
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
 * Fetches a specific task by its ID for the current user from complete task collection
 * Retrieves all user tasks and filters to find matching task by unique identifier
 * Provides targeted task access with null fallback for non-existent task requests
 * @function fetchTaskById
 * @param {string} taskId - The ID of the task to fetch
 * @returns {Promise<Object|null>} Task object if found, null otherwise
 */
async function fetchTaskById(taskId) {
  const tasks = await fetchTaskByUser();
  return tasks.find((task) => task.id === taskId) || null;
}

/**
 * Deletes a contact from Firebase and all associated tasks to maintain data integrity
 * Removes contact record and cascades deletion to all tasks assigned to that contact
 * Provides comprehensive contact removal with automatic cleanup of dependent task records
 * @function deleteContactFromFirebase
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
 * Deletes a specific task from Firebase for the current user with path resolution
 * Determines user-specific Firebase path and removes task record from database
 * Provides secure task deletion functionality with user context validation and error handling
 * @function deleteTaskFromFirebaseByUser
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
 * Updates an existing contact in Firebase for the current user with automatic path routing
 * Modifies contact record using PATCH method to preserve existing data integrity
 * Provides efficient contact modification workflow with user context and data validation
 * @function updateContactInFirebaseByUser
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
 * Fetches a specific contact by ID for the current user with automatic ID assignment
 * Retrieves contact data from user-specific Firebase path and adds ID to result object
 * Provides targeted contact access with consistent data structure and null fallback handling
 * @function fetchContactByIdAndUser
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
 * Fetches all contacts for the current user with automatic guest/registered user routing
 * Determines appropriate Firebase path based on user type and retrieves contact collection
 * Provides unified contact access interface with data mapping for consistent application format
 * @function fetchContactsByIdAndUser
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
 * Adds a new contact to Firebase for the current user with automatic path resolution
 * Determines user-specific Firebase path and posts contact data with ID generation
 * Provides streamlined contact creation workflow with Firebase ID assignment and user context
 * @function addContactToFirebaseByUser
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
 * Updates an existing task in Firebase for the current user with ID cleanup and path routing
 * Modifies task record using PATCH method while removing local ID before submission
 * Provides efficient task modification workflow with data sanitization and user context validation
 * @function updateTaskInFirebaseByUser
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
 * Maps Firebase API task data to application template format with default value assignment
 * Transforms raw Firebase task objects into consistent application data structure
 * Provides data normalization layer ensuring all task properties have appropriate fallback values
 * @function mapApiTaskToTemplate
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
 * Maps Firebase API contact data to application template format with field normalization
 * Transforms raw Firebase contact objects into consistent application data structure
 * Provides data cleanup layer handling field variations and ensuring proper default values
 * @function mapApiContactToTemplate
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
