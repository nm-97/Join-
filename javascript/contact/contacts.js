const renderContactsList = (contacts) => {
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const groupedContacts = groupContactsByLetter(sortedContacts);
  
  return Object.keys(groupedContacts)
    .sort()
    .map(letter => {
      const contactsInGroup = groupedContacts[letter];
      return contactsInGroup.map((contact, index) => 
        getContactWithSeparator(contact, index === 0)
      ).join("");
    }).join("");
};

const getContactFormData = (event) => ({
  name: new FormData(event.target).get("name"),
  email: new FormData(event.target).get("email"),
  phone: new FormData(event.target).get("phone"),
});


async function fetchContacts() {
  const response = await fetch(`${firebaseUrl}user /guest /contacts.json`);
  const data = await response.json();
  
  return Object.entries(data || {}).map(([id, contactData]) => 
    mapApiContactToTemplate({ id, ...contactData })
  );
}

async function fetchContactById(contactId) {
  const response = await fetch(`${firebaseUrl}user /guest /contacts/${contactId}.json`);
  const data = await response.json();
  
  return mapApiContactToTemplate({ id: contactId, ...data });
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

const capitalizeFirstLetter = (string) => 
  string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";

const groupContactsByLetter = (contacts) => {
  return contacts.reduce((grouped, contact) => {
    const firstLetter = contact.name.charAt(0).toUpperCase();
    grouped[firstLetter] = grouped[firstLetter] || [];
    grouped[firstLetter].push(contact);
    return grouped;
  }, {});
};
 
const processDeleteRequest = async (contactId) => {
  await fetch(`${firebaseUrl}user /guest /contacts/${contactId}.json`, {
    method: "DELETE",
  });
};

async function deleteContactFromFirebase(contactId) {
  await processDeleteRequest(contactId);
  await refreshContactsList();
  closeFloatingOverlay();
  return true;
}

const refreshContactsList = async () => {
  const contacts = await fetchContacts();
  const contactsList = document.getElementById("contactsList");
  contactsList.innerHTML = renderContactsList(contacts);
};

const postContactData = async (contactData) => {
  return await fetch(`${firebaseUrl}user /guest /contacts.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
};

function renderSuccessMessage() {
  document.body.insertAdjacentHTML('beforeend', getSuccessContactMessageTemplate());

  setTimeout(() => {
    const toast = document.getElementById('addContactSuccess');
    if (toast) toast.remove();
  }, 2000);
}

async function addContactToFirebase(contactData) {
  const response = await postContactData(contactData);
  const result = await response.json();
  return result.name;
}

async function createContact(event) {
  event.preventDefault();
  const contactData = getContactFormData(event);
  await addContactToFirebase(contactData);
  closeOverlay();
  await refreshContactsSidebar();
      setTimeout(() => {
    renderSuccessMessage();
  }, 500);
}

const refreshContactsSidebar = async () => {
  const contacts = await fetchContacts();
  const overlay = document.getElementById("contactsList");
  overlay.innerHTML = renderContactsList(contacts);
};

const pushContactData = async (contactId, contactData) => {
  return await fetch(`${firebaseUrl}user /guest /contacts/${contactId}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactData),
  });
};

async function updateContactInFirebase(contactId, contactData) {
  const response = await pushContactData(contactId, contactData);
  return await response.json();
}

async function updateContact(event, contactId) {
  event.preventDefault();
  const contactData = getContactFormData(event);
  await updateContactInFirebase(contactId, contactData);
  closeEditContactOverlay();
  await refreshContactsList();
  await refreshContactsSidebar();
  await showFloatingContact(contactId);
}
