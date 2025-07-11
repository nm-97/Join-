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

function showFloatingContact() {
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

document.addEventListener("DOMContentLoaded", function () {
  showContactSideBar();
});
