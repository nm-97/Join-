function showAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  const modal = overlay.querySelector(".addContactModal");
  modal.innerHTML = getAddContactOverlay();
  overlay.style.display = "flex"; //
}
function showEditContactOverlay() {
  let overlay = getEditContactOverlay("floatingContactOverlay");
  overlay.classList.remove("hide");
  overlay.classList.add("overlay");
  overlay.style.display = "flex";
}

function showContactDetails() {
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

function renderAddContactOverlay(params) {
  showAddContactOverlay();
}

function renderEditContactOverlay(params) {
  showFloatingContact();
}

function renderEditContactOverlay(params) {
  showEditContactOverlay();
}
