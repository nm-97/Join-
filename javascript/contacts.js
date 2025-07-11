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

function showContactSideBar() {
  const overlay = document.getElementById("contactsList");
  overlay.innerHTML = getContactTemplate();
  overlay.style.display = "block";
}

function showContactDetails(event) {
  // Entferne 'selected' Klasse von allen contactItems
  const allContactItems = document.querySelectorAll(".contactItem");
  allContactItems.forEach((item) => item.classList.remove("selected"));

  // Füge 'selected' Klasse zum geklickten Element hinzu
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("selected");
  }

  // Zeige das floating contact panel
  const overlay = document.getElementById("floatingContactOverlay");
  overlay.innerHTML = getFloatingContact();
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

// Lade die Kontaktliste beim Seitenstart
document.addEventListener("DOMContentLoaded", function () {
  showContactSideBar();
});
