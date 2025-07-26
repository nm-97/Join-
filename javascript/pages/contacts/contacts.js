/**
 * @fileoverview Contacts page functionality for the JOIN application
 * Handles contact management, display, creation, editing, and deletion
 * @author Join Project Team
 * @version 1.0.0
 */

let loadedContacts = [];

/**
 * Initializes contacts page when DOM content is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("contacts.html")) {
    initializeContacts();
  }
});

/**
 * Initializes the contacts page by fetching and rendering contacts
 */
async function initializeContacts() {
  try {
    const contacts = await fetchContactsByIdAndUser();
    loadedContacts = contacts;
    renderContactsList(contacts);
  } catch (error) {
    console.error("Error initializing contacts:", error);
  }
}

/**
 * Renders the contacts list with alphabetical separators
 * @param {Array} contacts - Array of contact objects to render
 */
function renderContactsList(contacts) {
  const contactsList = document.getElementById("contactsList");
  if (!contactsList) return;
  if (!contacts || !Array.isArray(contacts)) {
    contacts = [];
  }
  const validContacts = contacts.filter((contact) => contact && contact.name);
  const sortedContacts = validContacts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  let currentLetter = "";
  let html = "";
  for (let i = 0; i < sortedContacts.length; i++) {
    const contact = sortedContacts[i];
    const firstLetter = contact.name.charAt(0).toUpperCase();
    const showSeparator = firstLetter !== currentLetter;
    if (showSeparator) {
      currentLetter = firstLetter;
    }
    html += getContactWithSeparator(contact, showSeparator);
  }
  contactsList.innerHTML = html;
}

/**
 * Displays a contact in the floating overlay
 * @param {string} contactId - The ID of the contact to display
 */
async function showFloatingContact(contactId) {
  let contact = loadedContacts.find((c) => c.id === contactId);
  if (!contact) {
    contact = await fetchContactByIdAndUser(contactId);
  }
  if (!contact) return;
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (floatingContactContainer) {
    floatingContactContainer.innerHTML = getFloatingContact(contact);
    floatingContactContainer.style.display = "block";
  }
}

function selectContactItem(contactId) {
  const previousSelected = document.querySelector(".contactItem.selected");
  if (previousSelected) {
    previousSelected.classList.remove("selected");
  }
  const contactItem = document.getElementById(contactId);
  if (contactItem) {
    contactItem.classList.add("selected");
  }
}

function showAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.innerHTML = getAddContactOverlay();
    overlay.style.display = "flex";
    setupPhoneInputFilter();
  }
}

function closeAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.innerHTML = "";
  }
}

async function showEditContactOverlay(contactId) {
  try {
    const contact = await fetchContactByIdAndUser(contactId);
    if (!contact) return;
    const overlay = document.getElementById("editContactOverlay");
    if (overlay) {
      overlay.innerHTML = getEditContactOverlay(contact);
      overlay.style.display = "flex";
      setupPhoneInputFilter();
    }
  } catch (error) {
    console.error("Error showing edit contact overlay:", error);
  }
}

function closeEditContactOverlay() {
  const overlay = document.getElementById("editContactOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.innerHTML = "";
  }
}

async function createContact(event) {
  event.preventDefault();
  if (!validateContactForm()) return;
  const formData = new FormData(event.target);
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };
  await addContactToFirebaseByUser(contactData);
  closeAddContactOverlay();
  showSuccessMessage("Contact successfully created");
  const contacts = await fetchContactsByIdAndUser();
  renderContactsList(contacts);
}

async function updateContact(event, contactId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const contactData = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  await updateContactInFirebaseByUser(contactId, contactData);
  closeEditContactOverlay();
  showSuccessMessage("Contact successfully updated");
  const contacts = await fetchContactsByIdAndUser();
  renderContactsList(contacts);
  await showFloatingContact(contactId);
}

async function deleteContact(contactId) {
  await deleteContactFromFirebase(contactId);
  await deleteAssignedTasks(contactId);
  await updateContactsUI();
  showSuccessMessage("Contact successfully deleted");
}

async function deleteAssignedTasks(contactId) {
  const allTasks = await fetchTaskByUser();
  for (const task of allTasks) {
    if (task.assignedTo === contactId) {
      await deleteTaskFromFirebaseByUser(task.id);
    }
  }
}

async function updateContactsUI() {
  closeFloatingContactOverlay();
  const contacts = await fetchContactsByIdAndUser();
  loadedContacts = contacts;
  renderContactsList(contacts);
}

function closeFloatingContactOverlay() {
  const floatingContactContainer = document.getElementById(
    "floatingContactOverlay"
  );
  if (floatingContactContainer) {
    floatingContactContainer.style.display = "none";
    floatingContactContainer.innerHTML = "";
  }
}

function showSuccessMessage(message) {
  const successElement = document.createElement("div");
  successElement.innerHTML = getSuccessContactMessageTemplate({ message });
  document.body.appendChild(successElement);
  setTimeout(() => {
    if (document.body.contains(successElement)) {
      document.body.removeChild(successElement);
    }
  }, 3000);
}

function showSuccessMessage(message) {
  const successElement = document.createElement("div");
  successElement.innerHTML = getSuccessContactMessageTemplate({ message });
  document.body.appendChild(successElement);
  setTimeout(() => {
    if (document.body.contains(successElement)) {
      document.body.removeChild(successElement);
    }
  }, 3000);
}
