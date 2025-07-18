document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes("summaryUser.html")) {
        rendersummaryMainContent();        
        loadAllDataSimultaneously();
    }
});

function countEveryTaskLength(allTasks) {
    return {
        todoCount: allTasks.filter(task => task.Status === 'toDo').length,
        doneCount: allTasks.filter(task => task.Status === 'done').length,
        inProgressCount: allTasks.filter(task => task.Status === 'inProgress').length,
        awaitFeedbackCount: allTasks.filter(task => task.Status === 'awaitFeedback').length,
        boardCount: allTasks.filter(task => 
            task.Status === 'toDo' || 
            task.Status === 'done' || 
            task.Status === 'inProgress' || 
            task.Status === 'awaitFeedback'
        ).length,
        urgentCount: allTasks.filter(task => task.taskPriority === 'Urgent').length
    };
}

function updateAllCounters(taskCounts, nextDeadline) {
    updateCounter('todoCounter', taskCounts.todoCount);
    updateCounter('doneCounter', taskCounts.doneCount);
    updateCounter('inProgressCounter', taskCounts.inProgressCount);
    updateCounter('awaitFeedbackCounter', taskCounts.awaitFeedbackCount);
    updateCounter('boardCounter', taskCounts.boardCount);
    updateCounter('highPriorityCounter', taskCounts.urgentCount);
    updateCounter('dueDateCounter', nextDeadline);
}

function loadUserInfo() {
    showLocalTimeFormUser();
    getUserName();
}

async function loadAllDataSimultaneously() {
    try {
        const allTasks = await fetchAllTasks();
        const taskCounts = countEveryTaskLength(allTasks);
        const nextDeadline = calculateNextDeadline(allTasks);
        updateAllCounters(taskCounts, nextDeadline);
        loadUserInfo();
    } catch (error) {
        console.error('Fehler beim Laden der Summary-Daten:', error);
    }
}

function updateCounter(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function calculateNextDeadline(allTasks) {
    const today = new Date();
    const futureTasks = allTasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today;
    });
    if (futureTasks.length === 0) {
        return "No upcoming deadlines";
    }
    const nextTask = futureTasks.reduce((earliest, task) => {
        const taskDate = new Date(task.dueDate);
        const earliestDate = new Date(earliest.dueDate);
        return taskDate < earliestDate ? task : earliest;
    });
    return formatDate(nextTask.dueDate);
}


function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function rendersummaryMainContent() {
    let summaryMainContent = getsummaryTemplate();
    const summaryElement = document.getElementById('summaryMainContent');
    if (summaryElement) {
        summaryElement.innerHTML = summaryMainContent;
    } else {
        console.error('summaryMainContent Element nicht gefunden!');
    }
}

function showLocalTimeFormUser() {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 8) greeting = "Good evening,";
    else if (hour < 12) greeting = "Good morning,";
    else if (hour < 18) greeting = "Good afternoon,";
    else greeting = "Good evening,";
    const welcomeElement = document.getElementById('welcomeText');
    if (welcomeElement) {
        welcomeElement.textContent = greeting;
    }
    return greeting;
}

async function getUserName() {
    const user = await getCurrentUser();
    let displayName = "User"; 
    if (user.type === 'guest') {
        displayName = "Guest";
    }
    else if (user.type === 'registered') {
        displayName = user.name || "User";
    }
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = displayName;
    }
    return displayName;
}
