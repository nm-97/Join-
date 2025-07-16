function showAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  const modal = overlay.querySelector(".addContactModal");
  modal.innerHTML = getAddContactOverlay();
  overlay.style.display = "flex";
}

async function showEditContactOverlay(contactId) {
  const contact = await fetchContactById(contactId);
  const overlay = document.getElementById("editContactOverlay");
  overlay.innerHTML = getEditContactOverlay(contact);
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
  overlay.classList.remove("hide"); 
  overlay.style.display = "block";
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

function closeOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  overlay.style.display = "none";
  const modal = overlay.querySelector(".addContactModal");
  if (modal) modal.innerHTML = "";
}

function closeEditContactOverlay() {
    const overlay = document.querySelector('.editContactOverlay');
    if (overlay) {
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.remove();
        }, 200); 
    }
}

function closeFloatingOverlay() {
  const overlay = document.getElementById("floatingContactOverlay");
  overlay.style.display = "none";
  overlay.classList.add("hide"); 
  overlay.innerHTML = "";
}
