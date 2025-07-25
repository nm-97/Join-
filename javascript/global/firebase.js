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

function getCurrentUser() {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : { type: "guest" };
}

async function fetchData(path) {
  const response = await fetch(`${firebaseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`GET request failed: ${response.status}`);
  }
  return await response.json();
}

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

async function deleteData(path) {
  const response = await fetch(`${firebaseUrl}${path}`, {
    method: "DELETE",
  });
  return response.ok;
}

function setGuestLogin() {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      type: "guest",
    })
  );
  window.location.href = "../html/summaryUser.html";
}

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

const getUserFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  password: new FormData(event.target).get("password"),
});

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
const postUserData = async (UserData) => {
  return await postData(USERS_PATH, UserData);
};

async function addUserToFirebase(userData) {
  const result = await postData(USERS_PATH, userData);
  return result.name;
}

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

async function fetchTaskById(taskId) {
  const tasks = await fetchTaskByUser();
  return tasks.find((task) => task.id === taskId) || null;
}

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

async function deleteTaskFromFirebaseByUser(taskId) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserTaskPath(currentUser.id, taskId)
      : getGuestTaskPath(taskId);
  return await deleteData(path);
}

async function updateContactInFirebaseByUser(contactId, contactData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserContactPath(currentUser.id, contactId)
      : getGuestContactPath(contactId);
  await patchData(path, contactData);
  return true;
}

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

async function addContactToFirebaseByUser(contactData) {
  const currentUser = getCurrentUser();
  const path =
    currentUser.type === "registered"
      ? getUserContactsPath(currentUser.id)
      : GUEST_CONTACTS_PATH;
  const result = await postData(path, contactData);
  return result.name;
}

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

function mapApiContactToTemplate(data) {
  const name = data.name || data["name "] || "";
  const phone = data.phone || data["phone "] || "";
  return {
    id: data.id || null,
    name: capitalizeFirstLetter(name) || "Unbekannt",
    email: data.email || "",
    phone: phone || "",
    address: data.address || "",
  };
}

async function fetchAllRegisteredUsers() {
  const data = await fetchData(USERS_PATH);
  if (!data) return [];
  return Object.entries(data).map(([id, userData]) => ({ id, ...userData }));
}
