function showAddContactOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  const modal = overlay.querySelector(".addContactModal");
  modal.innerHTML = getAddContactOverlay();
  overlay.style.display = "flex"; //
}
function showEditContactOverlay() {
  let overlay = getEEditContactOverlay("floatingContactOverlay");
  overlay.classList.remove("hide");
  overlay.classList.add("overlay");
  overlay.style.display = "flex";
}

function closeOverlay() {
  const overlay = document.getElementById("addContactOverlay");
  overlay.style.display = "none";
  const modal = overlay.querySelector(".addContactModal");
  if (modal) modal.innerHTML = "";
}

function renderOverlay(params) {
  showAddContactOverlay();
}
