function closeFloatingOverlay() {
  const overlay = document.getElementById("floatingContactOverlay");
  overlay.style.display = "none";
  overlay.classList.add("hide"); 
  overlay.innerHTML = "";
}

async function showFloatingContact(contactId) {
  const contact = await fetchContactById(contactId);
  const overlay = document.getElementById("floatingContactOverlay");
  overlay.innerHTML = getFloatingContact(contact);
  overlay.classList.remove("hide"); 
  overlay.style.display = "block";
}