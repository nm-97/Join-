"use strict";

const firebaseUrl =
  "https://joinda1312-default-rtdb.europe-west1.firebasedatabase.app/";

async function fetchContactById(id) {
  const response = await fetch(`${firebaseUrl}contacts/${id}.json`);
  const data = await response.json();
  return mapApiContactToTemplate(data);
}

async function fetchAllContacts(ids) {
  return await Promise.all(ids.map((id) => fetchContactById(id)));
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
