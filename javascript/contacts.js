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
  const contacts = await fetchAllContacts();
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
