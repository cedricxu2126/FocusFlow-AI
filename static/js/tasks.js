
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");

const titleInput = document.getElementById("task-title");
const descriptionInput = document.getElementById("task-description");
const dueDateInput = document.getElementById("task-due-date");
const priorityInput = document.getElementById("task-priority");
const estimateInput = document.getElementById("task-estimate");

const submitButton = document.getElementById("submit-button");
const cancelButton = document.getElementById("cancel-edit");
const formHeading = document.getElementById("form-heading");
const formMessage = document.getElementById("form-message");
const taskFilter = document.getElementById("task-filter");

let tasks = [];
let editingTaskId = null;


// Retrieve tasks from Flask
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");

        if (!response.ok) {
            throw new Error("Could not retrieve tasks.");
        }

        tasks = await response.json();

        displayTasks();

    } catch (error) {
        taskList.textContent = error.message;
    }
}


// Display tasks on the page
function displayTasks() {
    taskList.replaceChildren();

    const filter = taskFilter.value;

    const filteredTasks = tasks.filter(task => {
        return filter === "All" || task.status === filter;
    });

    if (filteredTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = "No tasks found. Add a task to get started!";
        taskList.appendChild(message);
        return;
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        const details = document.createElement("div");
        details.className = "task-card-details";

        const title = document.createElement("h3");
        title.textContent = task.title;

        if (task.status === "Completed") {
            title.classList.add("completed-task");
        }

        const description = document.createElement("p");
        description.textContent = task.description || "No description provided.";

        const metadata = document.createElement("small");

        const dueDate = task.due_date
            ? `Due: ${task.due_date}`
            : "No deadline";

        const estimate = task.estimated_minutes
            ? `${task.estimated_minutes} minutes`
            : "No time estimate";

        metadata.textContent =
            `${dueDate} | ${estimate} | ${task.priority} Priority`;

        details.append(title, description, metadata);

        const badge = document.createElement("span");
        badge.className = `priority-badge ${task.priority.toLowerCase()}`;
        badge.textContent = task.priority;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        if (task.status === "Pending") {
            actions.appendChild(
                createButton("Complete", () => completeTask(task.id))
            );
        }

        actions.appendChild(
            createButton("Edit", () => editTask(task))
        );

        actions.appendChild(
            createButton("Delete", () => deleteTask(task.id))
        );

        card.append(details, badge, actions);
        taskList.appendChild(card);
    });
}


// Create a button safely
function createButton(label, action) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.className = "action-button";
    button.addEventListener("click", action);

    return button;
}


// Add or update a task
taskForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const taskData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        due_date: dueDateInput.value || null,
        priority: priorityInput.value,
        estimated_minutes: estimateInput.value
            ? Number(estimateInput.value)
            : null
    };

    if (!taskData.title) {
        formMessage.textContent = "Please enter a task title.";
        return;
    }

    const url = editingTaskId
        ? `/api/tasks/${editingTaskId}`
        : "/api/tasks";

    const method = editingTaskId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to save task.");
        }

        formMessage.textContent = result.message;

        resetForm();
        await loadTasks();

    } catch (error) {
        formMessage.textContent = error.message;
    }
});


// Load an existing task into the form
function editTask(task) {
    editingTaskId = task.id;

    titleInput.value = task.title;
    descriptionInput.value = task.description || "";
    dueDateInput.value = task.due_date || "";
    priorityInput.value = task.priority;
    estimateInput.value = task.estimated_minutes || "";

    formHeading.textContent = "Edit Task";
    submitButton.textContent = "Save Changes";
    cancelButton.hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}


// Reset the form
function resetForm() {
    taskForm.reset();

    editingTaskId = null;

    formHeading.textContent = "Add a New Task";
    submitButton.textContent = "Add Task";
    cancelButton.hidden = true;
}


// Cancel editing
cancelButton.addEventListener("click", function() {
    resetForm();
    formMessage.textContent = "";
});


// Mark a task as completed
async function completeTask(taskId) {
    try {
        const response = await fetch(
            `/api/tasks/${taskId}/complete`,
            { method: "PATCH" }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to complete task.");
        }

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}


// Delete a task
async function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Unable to delete task.");
        }

        await loadTasks();

    } catch (error) {
        alert(error.message);
    }
}


// Filter tasks
taskFilter.addEventListener("change", displayTasks);


// Load tasks when the page opens
loadTasks();
