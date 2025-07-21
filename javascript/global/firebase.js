"use strict";

const firebaseUrl = "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

function getCurrentUser() {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : {type: "guest"};
}

function setGuestLogin() {
  sessionStorage.setItem('currentUser', JSON.stringify({
    type: "guest"
  }));
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
          success: false
        };
      }
    }
    
    const userId = await addUserToFirebase(userData);
    
    return {
      success: true,
      userId: userId
    };
    
  } catch (error) {
    console.error('Registrierung Fehler:', error);
    return {
      success: false
    };
  }
}

const postUserData = async (UserData) => {
  return await fetch(`${firebaseUrl}user /registered/.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(UserData),
  });
};

async function addUserToFirebase(UserData) {
  const response = await postUserData(UserData);
  const result = await response.json();
  return result.name;
}


async function fetchAllTasks() {
  let response = await fetch(`${firebaseUrl}user/guest /task.json`);
  let data = await response.json();
  if (!data) {
    response = await fetch(`${firebaseUrl}user /guest /task.json`);
    data = await response.json();
  }
  if (!data) return [];
  const tasks = [];
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    const task = mapApiTaskToTemplate({ id, ...data[id] });
    tasks.push(task);
  }
  return tasks;
}

async function fetchTaskById(taskId) {
  let response = await fetch(`${firebaseUrl}user/guest /task/${taskId}.json`);
  let data = await response.json();
  if (!data) {
    response = await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`);
    data = await response.json();
  }
  return mapApiTaskToTemplate({ id: taskId, ...data });
}

async function addTaskToFirebase(taskData) {
  const response = await fetch(`${firebaseUrl}user /guest /task.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  const result = await response.json();
  return result.name;
}

async function deleteTaskFromFirebase(taskId) {
  const response = await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`, {
    method: "DELETE",
  });
  return true;
}

async function updateTaskInFirebase(taskId, taskData) {
  const response = await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  return true;
}

async function fetchAllContacts() {
  const response = await fetch(`${firebaseUrl}user /guest /contacts.json`);
  const data = await response.json();
  if (!data) return [];
  const contacts = [];
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    const contact = { id, ...data[id] };
    contacts.push(contact);
  }
  return contacts;
}

async function fetchContactById(contactId) {
  const response = await fetch(`${firebaseUrl}user /guest /contacts/${contactId}.json`);
  const data = await response.json();
  return mapApiContactToTemplate({ id: contactId, ...data });
}

async function fetchContacts() {
  const response = await fetch(`${firebaseUrl}user /guest /contacts.json`);
  const data = await response.json();
  return Object.entries(data || {}).map(([id, contactData]) => 
    mapApiContactToTemplate({ id, ...contactData })
  );
}

async function addContactToFirebase(contactData) {
  const response = await fetch(`${firebaseUrl}user /guest /contacts.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
  const result = await response.json();
  return result.name;
}

async function updateContactInFirebase(contactId, contactData) {
  const response = await fetch(`${firebaseUrl}user /guest /contacts/${contactId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
  return response.ok;
}

async function deleteContactFromFirebase(contactId) {
  try {
    const contact = await fetchContactById(contactId);
    const contactName = contact.name;  
    const allTasks = await fetchAllTasks();  
    const tasksToDelete = allTasks.filter(task => task.assignedTo === contactName);
    for (let i = 0; i < tasksToDelete.length; i++) {
      await deleteTaskFromFirebase(tasksToDelete[i].id);
    }
    await fetch(`${firebaseUrl}user /guest /contacts/${contactId}.json`, {
      method: "DELETE",
    });
    return true;
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    return false;
  }
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
    title: data.title || "Untitled Task"
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
  const response = await fetch(`${firebaseUrl}user /registered/.json`);
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
            type: "registered"
          }
        };
      }
    }
    
    return {
      success: false
    };
    
  } catch (error) {
    console.error('Login Fehler:', error);
    return {
      success: false
    };
  }
}

function setUserLogin(userData) {
  sessionStorage.setItem('currentUser', JSON.stringify(userData));
  window.location.href = "../html/summaryUser.html";
}