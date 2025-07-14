"use strict";

async function fetchContacts() {
const userPath = setUserPath();
const response = await fetch(`${firebaseUrl}user/${userPath}/contacts.json`);
}

async function fetchContactById(contactId) {
  const userPath = setUserPath();
  const response = await fetch(`${firebaseUrl}user/${userPath}/contacts/${contactId}.json`);
  const data = await response.json();
  return mapApiContactToTemplate({ id: contactId, ...data });
}

function mapApiContactToTemplate(data) {
  return {
    id: data.id || null,
    name: capitalizeFirstLetter(data.name) || "Unbekannt",
    email: data.email || "",
    phone: data.phone || "",
    address: data.address || "",
  };
}

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function groupContactsByLetter(contacts) {
  const groupedContacts = {};
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    const firstLetter = contact.name.charAt(0).toUpperCase();
    if (!groupedContacts[firstLetter]) groupedContacts[firstLetter] = [];
    groupedContacts[firstLetter].push(contact);
  }
  return groupedContacts;
}

function renderSuccessMessage(message) {
  const successHTML = getSuccessMessageTemplate({ message });
  document.body.insertAdjacentHTML("beforeend", successHTML);
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
  const userPath = setUserPath();
  const response = await fetch(`${firebaseUrl}user/${userPath}/contacts${contactId}.json`, {
    method: "DELETE",
  });
  return true;
}


async function addContactToFirebase(contactData) {
  const response = await fetch(`${firebaseUrl}contacts.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
  const result = await response.json();
  return result.name;
}

function showAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  const modal = overlay.querySelector(".addContactModal");
  modal.innerHTML = getAddContactOverlay();
  overlay.style.display = "flex";
}

function showEditContactOverlay() {
  const overlay = document.getElementById("editContactOverlay");
  overlay.innerHTML = getEditContactOverlay();
  overlay.style.display = "flex";
}

async function showContactSideBar() {
  const contacts = await fetchContacts();
  const overlay = document.getElementById("contactsList");
  overlay.innerHTML = renderContactsList(contacts);
  overlay.style.display = "block";
}

async function showFloatingContact(contactId) {
  const contact = await fetchContactById(contactId);
  const overlay = document.getElementById("floatingContactOverlay");
  overlay.innerHTML = getFloatingContact(contact);
  overlay.style.display = "block";
}

function closeOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  overlay.style.display = "none";
  const modal = overlay.querySelector(".addContactModal");
  if (modal) modal.innerHTML = "";
}

function closeEditContactOverlay() {
  const overlay = document.getElementById("editContactOverlay");
  overlay.style.display = "none";
  overlay.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
  showContactSideBar();
});

function renderContactsList(contacts) {
  if (!contacts || contacts.length === 0) {
    return "<p>Keine Kontakte vorhanden</p>";
  }
  let html = "";
  for (let i = 0; i < contacts.length; i++) {
    html += getContactTemplate(contacts[i]);
  }
  return html;
}

async function createContact(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };
  const newContactId = await addContactToFirebase(contactData);
  showSuccessMessage("Kontakt erfolgreich hinzugefügt!");
  closeOverlay();
  await refreshContactsSidebar();
}

async function refreshContactsSidebar() {
  const contacts = await fetchContacts();
  const overlay = document.getElementById("contactsList");
  overlay.innerHTML = renderContactsList(contacts);
}

async function deleteContact(contactId) {
  await deleteContactFromFirebase(contactId);
  showSuccessMessage("Contact erfolgreich gelöscht!");
  document.getElementById("floatingContactOverlay").style.display = "none";
  await refreshContactsSidebar();
}
