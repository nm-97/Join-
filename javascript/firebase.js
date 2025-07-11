"use strict";

const firebaseUrl =
  "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchAllContacts() {
  const response = await fetch(`${firebaseUrl}contacts.json`);
  const data = await response.json();
  const contacts = [];
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const id = keys[i];
    const contact = mapApiContactToTemplate({ id, ...data[id] });
    contacts.push(contact);
  }
  return contacts;
}

async function fetchContactById(contactId) {
  const response = await fetch(`${firebaseUrl}contacts/${contactId}.json`);
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
