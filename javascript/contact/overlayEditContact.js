function closeEditContactOverlay() {
    const overlay = document.querySelector('.editContactOverlay');
    if (overlay) {
        overlay.classList.add('closing');
        setTimeout(() => {
            overlay.remove();
        }, 200); 
    }
}

async function showEditContactOverlay(contactId) {
  const contact = await fetchContactById(contactId);
  const overlay = document.getElementById("editContactOverlay");
  overlay.innerHTML = getEditContactOverlay(contact);
  overlay.style.display = "flex";
}
