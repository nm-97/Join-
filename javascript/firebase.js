"use strict";

const firebaseUrl =
  "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

function getCurrentUser() {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : {type: "guest"};
}

async function initializeUserData() {
  await showContactSideBar();
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("contacts.html")) {
    initializeUserData();
  }
});

function setGuestLogin() {
  sessionStorage.setItem('currentUser', JSON.stringify({
    type: "guest"
  }));
  window.location.href = "../html/summaryUser.html"; 
}

function showSuccessMessage(message) {
  const existingMessage = document.getElementById("successMessage");
  if (existingMessage) {
    existingMessage.remove();
  }
  renderSuccessMessage(message);
  const toast = document.getElementById("successMessage");
  toast.style.display = "block";
}

async function deleteContactFromFirebase(contactId) {
  const response = await fetch(`${firebaseUrl}contacts/${contactId}.json`, {
    method: "DELETE",
  });
  return true;
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

function mapApiTaskToTemplate(data) {
  return {
    id: data.id || null,
    Category: data.Category || "toDo",
    assignedTo: data.assignedTo || "",
    description: data.description || "",
    dueDate: data.dueDate || "",
    taskPriority: data.taskPriority || "Medium",
    title: data.title || "Untitled Task"
  };
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

async function initializeBoard() {
  const tasks = await fetchAllTasks();
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = getBoardTemplate(tasks);
}

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("board.html")) {
    initializeBoard();
  }
});