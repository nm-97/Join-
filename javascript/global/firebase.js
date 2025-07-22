"use strict";

const firebaseUrl =
  "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

function getCurrentUser() {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : { type: "guest" };
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

function setUserLogin(params) {
  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({
      type: "registered",
      ...params,
    })
  );
  window.location.href = "../html/summaryUser.html";
}

const getUserFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  password: new FormData(event.target).get("password"),
});

async function createUser(userData) {
  try {
    const existingUsers = await fetchAllRegisteredUsers();
    for (let i = 0; i < existingUsers.length; i++) {
      if (existingUsers[i].email === userData.email) {
        return {
          success: false,
        };
      }
    }
    const userId = await addUserToFirebase(userData);
    setUserLogin({
      id: userId,
      name: userData.name,
      email: userData.email,
    });

    return {
      success: true,
      userId: userId,
    };
  } catch (error) {
    console.error("Registrierung Fehler:", error);
    return {
      success: false,
    };
  }
}

const postUserData = async (UserData) => {
  return await fetch(`${firebaseUrl}user/registered/.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(UserData),
  });
};

async function addUserToFirebase(userData) {
  const userDataWithType = {
    ...userData,
    type: "registered",
  };

  // DEBUG: Zeige was gespeichert wird
  console.log("🔥 Speichere User in Firebase:", userDataWithType);

  const response = await postUserData(userDataWithType);
  const result = await response.json();

  // DEBUG: Zeige Firebase Antwort
  console.log("🔥 Firebase Antwort:", result);

  return result.name;
}
async function fetchTaskByUser() {
  const currentUser = getCurrentUser();
  let response;
  let data;
  if (currentUser.type === "registered") {
    response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/task.json`
    );
  } else if (currentUser.type === "guest") {
    response = await fetch(`${firebaseUrl}user/guest/task.json`);
  }
  data = await response.json();
  if (!data) return [];
  return Object.entries(data).map(([id, taskData]) =>
    mapApiTaskToTemplate({ id, ...taskData })
  );
}

async function addTaskToFirebaseByUser(taskData) {
  const currentUser = getCurrentUser();
  if (currentUser.type === "registered") {
    const response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/task.json`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      }
    );
    const result = await response.json();
    return result.name;
  } else if (currentUser.type === "guest") {
    const response = await fetch(`${firebaseUrl}user/guest/task.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    const result = await response.json();
    return result.name;
  }
}

async function fetchTaskById(taskId) {
  const tasks = await fetchTaskByUser();
  return tasks.find((task) => task.id === taskId) || null;
}

async function deleteContactFromFirebase(contactId) {
  const currentUser = getCurrentUser();
  let response;
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

    if (currentUser.type === "registered") {
      response = await fetch(
        `${firebaseUrl}user/registered/${currentUser.id}/contacts/${contactId}.json`,
        { method: "DELETE" }
      );
    } else if (currentUser.type === "guest") {
      response = await fetch(
        `${firebaseUrl}user/guest/contacts/${contactId}.json`,
        { method: "DELETE" }
      );
    }
    return true;
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    return false;
  }
}

async function updateContactInFirebaseByUser(contactId, contactData) {
  const currentUser = getCurrentUser();
  let response;

  if (currentUser.type === "registered") {
    response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/contacts/${contactId}.json`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      }
    );
  } else if (currentUser.type === "guest") {
    response = await fetch(
      `${firebaseUrl}user/guest/contacts/${contactId}.json`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      }
    );
  }
  return response.ok;
}

async function fetchContactsByIdAndUser() {
  const currentUser = getCurrentUser();
  let response;
  let data;
  if (currentUser.type === "registered") {
    response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/contacts.json`
    );
  } else if (currentUser.type === "guest") {
    response = await fetch(`${firebaseUrl}user/guest/contacts.json`);
  }
  data = await response.json();
  if (!data) return [];
  return Object.entries(data).map(([id, contactData]) =>
    mapApiContactToTemplate({ id, ...contactData })
  );
}

async function fetchContactByIdAndUser(contactId) {
  const currentUser = getCurrentUser();
  let response;
  if (currentUser.type === "registered") {
    response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/contacts/${contactId}.json`
    );
  } else if (currentUser.type === "guest") {
    response = await fetch(
      `${firebaseUrl}user/guest/contacts/${contactId}.json`
    );
  }
  const data = await response.json();
  return mapApiContactToTemplate({ id: contactId, ...data });
}

async function addContactToFirebaseByUser(contactData) {
  const currentUser = getCurrentUser();
  let response;
  if (currentUser.type === "registered") {
    response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/contacts.json`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      }
    );
    const result = await response.json();
    return result.name;
  } else if (currentUser.type === "guest") {
    response = await fetch(`${firebaseUrl}user/guest/contacts.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData),
    });
    const result = await response.json();
    return result.name;
  }
}

async function updateTaskInFirebaseByUser(taskId, taskData) {
  const currentUser = getCurrentUser();
  let response;
  if (currentUser.type === "registered") {
    response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/task/${taskId}.json`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      }
    );
  } else if (currentUser.type === "guest") {
    response = await fetch(`${firebaseUrl}user/guest/task/${taskId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
  }
  return true;
}

async function deleteTaskFromFirebaseByUser(taskId) {
  const currentUser = getCurrentUser();
  let response;
  if (currentUser.type === "registered") {
    response = await fetch(
      `${firebaseUrl}user/registered/${currentUser.id}/task/${taskId}.json`,
      {
        method: "DELETE",
      }
    );
  } else if (currentUser.type === "guest") {
    response = await fetch(`${firebaseUrl}user/guest/task/${taskId}.json`, {
      method: "DELETE",
    });
  }
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
  const response = await fetch(`${firebaseUrl}user/registered/.json`);
  const data = await response.json();
  if (!data) return [];

  const users = [];
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    const user = { id, ...data[id] };
    users.push(user);
  }
  return users;
}

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
