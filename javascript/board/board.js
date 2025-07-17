async function showTaskDetail(taskId) {
  console.log('🔍 showTaskDetail() gestartet mit ID:', taskId);
  try {
    const task = await fetchTaskById(taskId);
    console.log('📋 Task Daten geladen:', task);
    
    const overlay = document.getElementById("taskOverlay");
    if (!overlay) {
      console.error('❌ taskOverlay Element nicht gefunden!');
      return;
    }
    console.log('✅ Overlay Element gefunden');
    
    overlay.innerHTML = getTaskDetailOverlay(task);
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
    console.log('✅ Task Detail Overlay angezeigt');
  } catch (error) {
    console.error('💥 Fehler in showTaskDetail:', error);
  }
}

async function deleteTask(taskId) {
  console.log('🗑️ deleteTask() gestartet mit ID:', taskId);
  try {
    await deleteTaskFromFirebase(taskId);
    console.log('✅ Task erfolgreich aus Firebase gelöscht');
    
    closeTaskOverlay();
    console.log('✅ Task Overlay geschlossen');
    
    await refreshBoard();
    console.log('✅ Board erfolgreich aktualisiert');
  } catch (error) {
    console.error('💥 Fehler beim Löschen der Task:', error);
  }
}

async function refreshBoard() {
  console.log('🔄 refreshBoard() gestartet');
  try {
    const tasks = await fetchAllTasks();
    console.log('📋 Tasks geladen:', tasks.length, 'Tasks gefunden');
    
    const boardContainer = document.getElementById("boardContainer");
    if (!boardContainer) {
      console.error('❌ boardContainer Element nicht gefunden!');
      return;
    }
    console.log('✅ Board Container gefunden');
    
    boardContainer.innerHTML = getBoardTemplate(tasks);
    console.log('✅ Board Template erfolgreich gerendert');
  } catch (error) {
    console.error('💥 Fehler beim Aktualisieren des Boards:', error);
  }
}

function initializeOverlayAddTask() {
  setupPriorityButtons();
  setupOverlayFormSubmission();
  loadContacts();
}

function addTaskToColumn(status) {
  console.log('➕ addTaskToColumn() aufgerufen mit Status:', status);
  try {
    showAddTaskOverlay();
    console.log('✅ AddTask Overlay angezeigt');
  } catch (error) {
    console.error('💥 Fehler beim Anzeigen des AddTask Overlays:', error);
  }
}

async function fetchTaskById(taskId) {
  console.log('🔍 fetchTaskById() gestartet mit ID:', taskId);
  console.log('🌐 Versuche erste URL:', `${firebaseUrl}user/guest /task/${taskId}.json`);
  
  let response = await fetch(`${firebaseUrl}user/guest /task/${taskId}.json`);
  let data = await response.json();
  console.log('📥 Erste Response:', response.status, data);
  
  if (!data) {
    console.log('⚠️ Keine Daten, versuche alternative URL:', `${firebaseUrl}user /guest /task/${taskId}.json`);
    response = await fetch(`${firebaseUrl}user /guest /task/${taskId}.json`);
    data = await response.json();
    console.log('📥 Zweite Response:', response.status, data);
  }
  
  const mappedTask = mapApiTaskToTemplate({ id: taskId, ...data });
  console.log('✅ Task gemappt:', mappedTask);
  return mappedTask;
}

async function initializeBoard() {
  console.log('🚀 initializeBoard() gestartet');
  try {
    const tasks = await fetchAllTasks();
    console.log('📋 Alle Tasks geladen:', tasks.length, 'Tasks gefunden');
    console.log('📋 Task Details:', tasks);
    
    const boardContainer = document.getElementById("boardContainer");
    if (!boardContainer) {
      console.error('❌ boardContainer Element nicht gefunden!');
      return;
    }
    console.log('✅ Board Container gefunden');
    
    boardContainer.innerHTML = getBoardTemplate(tasks);
    console.log('✅ Board erfolgreich initialisiert');
  } catch (error) {
    console.error('💥 Fehler beim Initialisieren des Boards:', error);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  console.log('📄 DOM Content Loaded - Board');
  console.log('🌐 Current path:', window.location.pathname);
  
  if (window.location.pathname.includes("board.html")) {
    console.log('✅ Board.html erkannt, initialisiere Board...');
    initializeBoard();
  } else {
    console.log('ℹ️ Nicht auf board.html, Board wird nicht initialisiert');
  }
});
