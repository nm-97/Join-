
document.addEventListener("DOMContentLoaded", function() {
  if (window.location.pathname.includes("contacts.html")) {
    initializeContacts();
  }
});

async function initializeContacts() {
  try {
    const contacts = await fetchAllContacts();
    renderContactsList(contacts);
  } catch (error) {
    console.error('Error initializing contacts:', error);
  }
}


function renderContactsList(contacts) {
  const contactsList = document.getElementById('contactsList');
  if (!contactsList) return;
  if (!Array.isArray(contacts)) {
    contacts = [];
  }
  const validContacts = contacts.filter(contact => contact && contact.name);
  const sortedContacts = validContacts.sort((a, b) => a.name.localeCompare(b.name));
  let currentLetter = '';
  let html = '';
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

async function showFloatingContact(contactId) {
  try {
    const contact = await fetchContactById(contactId);
    if (!contact) return;
    
    const floatingContactContainer = document.getElementById('floatingContactOverlay');
    if (floatingContactContainer) {
      floatingContactContainer.innerHTML = getFloatingContact(contact);
      floatingContactContainer.style.display = 'block';
    }
  } catch (error) {
    console.error('Error showing floating contact:', error);
  }
}

function selectContactItem(contactId) {
  const previousSelected = document.querySelector('.contactItem.selected');
  if (previousSelected) {
    previousSelected.classList.remove('selected');
  }
  const contactItem = document.getElementById(contactId);
  if (contactItem) {
    contactItem.classList.add('selected');
  }
}

function showAddContactOverlay() {
  const overlay = document.getElementById('addContactOverlay');
  if (overlay) {
    overlay.innerHTML = getAddContactOverlay();
    overlay.style.display = 'flex';
  }
}

function closeAddContactOverlay() {
  const overlay = document.getElementById('addContactOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  }
}

async function showEditContactOverlay(contactId) {
  try {
    const contact = await fetchContactById(contactId);
    if (!contact) return;
    
    const overlay = document.getElementById('editContactOverlay');
    if (overlay) {
      overlay.innerHTML = getEditContactOverlay(contact);
      overlay.style.display = 'flex';
    }
  } catch (error) {
    console.error('Error showing edit contact overlay:', error);
  }
}

function closeEditContactOverlay() {
  const overlay = document.getElementById('editContactOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  }
}



async function createContact(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const contactData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone')
  };
  try {
    await addContactToFirebase(contactData);
    closeAddContactOverlay();
    showSuccessMessage('Contact successfully created');
    const contacts = await fetchAllContacts();
    renderContactsList(contacts);
  } catch (error) {
    console.error('Error creating contact:', error);
    showErrorMessage('Error creating contact');
  }
}

async function updateContact(event, contactId) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const contactData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone')
  };
  try {
    await updateContactInFirebase(contactId, contactData);
    closeEditContactOverlay();
    showSuccessMessage('Contact successfully updated');
    const contacts = await fetchAllContacts();
    renderContactsList(contacts);
    await showFloatingContact(contactId);
  } catch (error) {
    console.error('Error updating contact:', error);
    showErrorMessage('Error updating contact');
  }
}
async function deleteContact(contactId) {
  try {
    await deleteContactFromFirebase(contactId);
    showSuccessMessage('Contact successfully deleted');
    const floatingContactContainer = document.getElementById('floatingContactOverlay');
    if (floatingContactContainer) {
      floatingContactContainer.style.display = 'none';
      floatingContactContainer.innerHTML = '';
    }
    const contacts = await fetchAllContacts();
    renderContactsList(contacts);
  } catch (error) {
    console.error('Error deleting contact:', error);
    showErrorMessage('Error deleting contact');
  }
}
function showSuccessMessage(message) {
  const successElement = document.createElement('div');
  successElement.innerHTML = getSuccessContactMessageTemplate({ message });
  document.body.appendChild(successElement);
  setTimeout(() => {
    if (document.body.contains(successElement)) {
      document.body.removeChild(successElement);
    }
  }, 3000);
}


