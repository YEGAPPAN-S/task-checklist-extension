const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const clearTasksButton = document.getElementById('clear-tasks');

// Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));
    sortTasks();
}

// Save tasks to localStorage
function saveTasks() {
    const tasks = Array.from(taskList.children).map(task => ({
        text: task.querySelector('.task-text').innerText,
        completed: task.querySelector('.task-checkbox').checked,
        highPriority: task.classList.contains('high-priority'),
    }));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Sort tasks
function sortTasks() {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
        const isCompletedA = a.classList.contains('task-completed');
        const isCompletedB = b.classList.contains('task-completed');
        const isHighPriorityA = a.classList.contains('high-priority');
        const isHighPriorityB = b.classList.contains('high-priority');

        if (isCompletedA !== isCompletedB) {
            return isCompletedA - isCompletedB; // Completed tasks go last
        }
        return isHighPriorityB - isHighPriorityA; // High-priority tasks stay on top
    });
    tasks.forEach(task => taskList.appendChild(task));
}

// Add task to the DOM
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.highPriority) li.classList.add('high-priority');
    if (task.completed) li.classList.add('task-completed');
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <button class="priority-btn">${task.highPriority ? 'High Priority 🔥' : 'Set High Priority'}</button>
    `;
    taskList.appendChild(li);

    li.addEventListener('click', (e) => {
        if (!e.target.classList.contains('priority-btn')) {
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.checked = !checkbox.checked;
            toggleTaskCompletion(li, checkbox.checked);
        }
    });

    li.querySelector('.priority-btn').addEventListener('click', () => {
        li.classList.toggle('high-priority');
        li.querySelector('.priority-btn').textContent = li.classList.contains('high-priority')
            ? 'High Priority 🔥'
            : 'Set High Priority';
        sortTasks();
        saveTasks();
    });
}

// Toggle task completion
function toggleTaskCompletion(taskItem, isCompleted) {
    if (isCompleted) {
        taskItem.classList.add('task-completed');
    } else {
        taskItem.classList.remove('task-completed');
    }
    sortTasks();
    saveTasks();
}

// Add task
function addTaskFromInput() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        addTaskToDOM({ text: taskText, completed: false, highPriority: false });
        saveTasks();
        taskInput.value = '';
    }
}

addTaskButton.addEventListener('click', addTaskFromInput);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTaskFromInput();
});

clearTasksButton.addEventListener('click', () => {
    taskList.innerHTML = '';
    saveTasks();
});

// Initialize
loadTasks();
