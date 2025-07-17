async function countToDOId() {
    let category = await fetchAllTasks();
    let todoTasks = category.filter(task => task.Category === 'toDo');
    return todoTasks.length;
}

async function countDoneId() {
let category = await fetchAllTasks();
    let doneTasks = category.filter(task => task.Category === 'done');
    return doneTasks.length;
}

async function countInTasksInBoard() {
    let allTasks = await fetchAllTasks();    
    let boardTasks = allTasks.filter(task => 
        task.Category === 'toDo' || 
        task.Category === 'done' || 
        task.Category === 'inProgress' || 
        task.Category === 'await-feedback'
    );
    return boardTasks.length;
} 

async function countTaskProgress() {
    let category = await fetchAllTasks();
    let inProgressTasks = category.filter(task => task.Category === 'inProgress');
    return inProgressTasks.length;
}

async function countAwaitFeedbackId() {
    let category = await fetchAllTasks();
    let awaitFeedbackTasks = category.filter(task => task.Category === 'awaitFeedback');
    return awaitFeedbackTasks.length;   
}

async function filterforDueDate() {
    let allTasks = await fetchAllTasks();
    let today = new Date();
    let filteredTasks = allTasks.filter(task => {
        let dueDate = new Date(task.dueDate);
        return dueDate >= today;
    });
    return filteredTasks;
}

async function filterforDueDate() {
    let allTasks = await fetchAllTasks();
    let today = new Date();
    let filteredTasks = allTasks.filter(task => {
        let dueDate = new Date(task.dueDate);
        return dueDate >= today;
    });
    if (filteredTasks.length > 0) {
        let nextDeadline = filteredTasks.reduce((earliest, task) => {
            let taskDate = new Date(task.dueDate);
            let earliestDate = new Date(earliest.dueDate);
            return taskDate < earliestDate ? task : earliest;
        });
        let formattedDate = formatDate(nextDeadline.dueDate);
        return { tasks: filteredTasks, nextDeadline: formattedDate };
    }
    return { tasks: filteredTasks, nextDeadline: "No upcoming deadlines" };
}

function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

async function filterforPriority() {
    let allTasks = await fetchAllTasks();
    let highPriorityTasks = allTasks.filter(task => task.taskPriority === 'High');
    return {
        high: highPriorityTasks,
    };
}

async function showPriorityforDueDate() {
    let dueDateResult = await filterforDueDate();
    document.getElementById('dueDateCounter').textContent = dueDateResult.nextDeadline;
    let priorityTasks = await filterforPriority();
    document.getElementById('highPriorityCounter').textContent = priorityTasks.high.length;
}

async function showCountInSummary() {
    const todoCount = await countToDOId();
    document.getElementById('todoCounter').textContent = todoCount;
    const doneCount = await countDoneId();
    document.getElementById('doneCounter').textContent = doneCount;
    const TasksInBoard = await countInTasksInBoard();
    document.getElementById('boardCounter').textContent = TasksInBoard;
    const inProgressCount = await countTaskProgress();
    document.getElementById('inProgressCounter').textContent = inProgressCount;
    const awaitFeedbackCount = await countAwaitFeedbackId();
    document.getElementById('awaitFeedbackCounter').textContent = awaitFeedbackCount;
    await showPriorityforDueDate();
    await filterforDueDate();
}

document.addEventListener('DOMContentLoaded', async () => {
    await showCountInSummary();
});

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

document.addEventListener('DOMContentLoaded', async () => {
    await showCountInSummary();
    showLocalTimeFormUser();
    await getUserName(); 
});

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
