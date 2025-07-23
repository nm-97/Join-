let currentDraggedTaskId = null;

function handleDragStart(event) {
  const taskElement = event.target.closest(".taskCard");
  if (!taskElement) return;
  currentDraggedTaskId = taskElement.dataset.taskId;
}

function handleDragOver(event) {
  event.preventDefault();
}

async function handleDrop(event) {
  event.preventDefault();
  const columnElement = event.target.closest(".columnContent");
  if (!columnElement || !currentDraggedTaskId) return;
  const columnId = columnElement.closest(".column").id;
  const newStatus = getColumnStatus(columnId);
  await changeStatusforDraggedTask(currentDraggedTaskId, newStatus);
  await initializeBoard();
  currentDraggedTaskId = null;
}
