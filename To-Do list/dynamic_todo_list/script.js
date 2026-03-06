
const taskInput = document.getElementById('taskInput');
const dueInput = document.getElementById('dueInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const clearAllBtn = document.getElementById('clearAllBtn');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');

// Tasks array to store all tasks
let tasks = [];

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderTasks();
    updateTaskCounter();
});

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
clearAllBtn.addEventListener('click', clearAllTasks);

/* ============================================
   TASK 4: Add & Display Tasks (JavaScript)
   ============================================ */

/**
 * Add a new task to the list
 * - Validates input (prevents empty tasks)
 * - Adds task to tasks array
 * - Saves to localStorage
 * - Re-renders the task list
 */
function addTask() {
    const taskText = taskInput.value.trim();
    const dueValue = dueInput.value; // datetime-local value

    // Validate: Prevent empty tasks
    if (taskText === '') {
        alert('Please enter a task!');
        taskInput.focus();
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString(),
        due: dueValue ? new Date(dueValue).toISOString() : null
    };

    // Add task to array
    tasks.push(task);

    // Save to localStorage
    saveTasksToStorage();

    // Clear input field
    taskInput.value = '';
    taskInput.focus();

    // Re-render tasks
    renderTasks();
    updateTaskCounter();

    // Send task to backend API to schedule email reminder (if backend running)
    try {
        fetch('http://localhost:3000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: task.text, due: task.due })
        }).then(res => {
            if (res.ok) {
                console.log('Scheduled reminder on server');
            } else {
                console.warn('Server responded with', res.status);
            }
        }).catch(err => {
            console.warn('Could not reach reminder server:', err.message);
        });
    } catch (err) {
        console.warn('Error sending to server:', err.message);
    }
}

/* ============================================
   RENDER & DISPLAY TASKS
   ============================================ */

/**
 * Render all tasks to the DOM
 * - Clears previous list
 * - Creates HTML for each task
 * - Adds event listeners to buttons
 */
function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';

    tasks.forEach((task) => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

/**
 * Create a task element with all functionality
 * @param {Object} task - Task object
 * @returns {HTMLElement} - Task list item element
 */
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.taskId = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    // Task Text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Buttons Container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'task-buttons';

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(task.id));

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(buttonsDiv);

    return li;
}

/* ============================================
   TASK 5: Edit & Delete Tasks
   ============================================ */

/**
 * Edit a task
 * - Replace task text with input field
 * - Add Save and Cancel buttons
 * @param {number} taskId - ID of task to edit
 */
function editTask(taskId) {
    const taskItem = document.querySelector(`[data-task-id="${taskId}"]`);
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    const taskText = taskItem.querySelector('.task-text');
    const buttonsDiv = taskItem.querySelector('.task-buttons');

    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.text;

    // Create Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.addEventListener('click', () => saveEdit(taskId, editInput.value));

    // Create Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => cancelEdit(taskId));

    // Replace task text with input
    taskText.replaceWith(editInput);
    buttonsDiv.innerHTML = '';
    buttonsDiv.appendChild(saveBtn);
    buttonsDiv.appendChild(cancelBtn);

    editInput.focus();
    editInput.select();
}

/**
 * Save the edited task
 * @param {number} taskId - ID of task to save
 * @param {string} newText - New task text
 */
function saveEdit(taskId, newText) {
    const newTextTrimmed = newText.trim();

    if (newTextTrimmed === '') {
        alert('Task cannot be empty!');
        return;
    }

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.text = newTextTrimmed;
        saveTasksToStorage();
        renderTasks();
        updateTaskCounter();
    }
}

/**
 * Cancel edit operation
 * @param {number} taskId - ID of task to cancel editing
 */
function cancelEdit(taskId) {
    renderTasks();
}

/**
 * Delete a task
 * @param {number} taskId - ID of task to delete
 */
function deleteTask(taskId) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');

    if (!confirmDelete) return;

    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasksToStorage();
    renderTasks();
    updateTaskCounter();
}

/* ============================================
   TASK 6 (BONUS): Task Completion Status
   ============================================ */

/**
 * Toggle task completion status
 * @param {number} taskId - ID of task to toggle
 */
function toggleTaskCompletion(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasksToStorage();
        renderTasks();
        updateTaskCounter();
    }
}

/**
 * Update the task counter display
 * Shows total, completed, and pending tasks
 */
function updateTaskCounter() {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
    pendingTasksSpan.textContent = pending;

    // Disable clear button if no tasks
    clearAllBtn.disabled = total === 0;
}

/* ============================================
   CLEAR ALL TASKS
   ============================================ */

/**
 * Clear all tasks after confirmation
 */
function clearAllTasks() {
    if (tasks.length === 0) return;

    const confirmClear = confirm(
        `Are you sure you want to delete all ${tasks.length} tasks? This action cannot be undone.`
    );

    if (!confirmClear) return;

    tasks = [];
    saveTasksToStorage();
    renderTasks();
    updateTaskCounter();
}

/* ============================================
   LOCAL STORAGE MANAGEMENT
   ============================================ */

/**
 * Save tasks to localStorage
 */
function saveTasksToStorage() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

/**
 * Load tasks from localStorage
 */
function loadTasksFromStorage() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (error) {
            console.error('Error loading tasks from storage:', error);
            tasks = [];
        }
    }
}
