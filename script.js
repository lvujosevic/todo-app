const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";
let tasks = [];

// Load saved tasks
window.addEventListener("load", () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks = savedTasks;
  renderTasks();

  updateCounter();
});

// Add task button
addBtn.addEventListener("click", addTask);

// Enter key support
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Add task function
function addTask() {
  const taskText = input.value.trim();

  if (!taskText) return;

  tasks.push({
    text: taskText,
    completed: false
  });

  saveTasks();
  renderTasks();

  input.value = "";
}

// Create task
function createTask(taskText, completed) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = taskText;

  if (completed) {
    span.classList.add("completed");
  }

  // COMPLETE BUTTON
  const checkBtn = document.createElement("button");
  checkBtn.textContent = "✓";
  checkBtn.classList.add("complete-btn");

  checkBtn.addEventListener("click", () => {
    span.classList.toggle("completed");
    saveTasks();
    updateCounter();
  });

  // EDIT BUTTON
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");

  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit task:", span.textContent);

    if (newText && newText.trim() !== "") {
      span.textContent = newText.trim();
      saveTasks();
    }
  });

  // DELETE BUTTON
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", () => {
    li.remove();
    saveTasks();
    updateCounter();
  });

  // BUTTON CONTAINER
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("task-buttons");

  buttonContainer.appendChild(checkBtn);
  buttonContainer.appendChild(editBtn);
  buttonContainer.appendChild(deleteBtn);

  // APPEND ELEMENTS
  li.appendChild(span);
  li.appendChild(buttonContainer);
  taskList.appendChild(li);
}

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update counter
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  if (total === 0) {
    counter.textContent = "No tasks yet";
  } else {
    counter.textContent = `${active} active / ${total} total tasks`;
  }
}
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    setActiveFilter(btn);
    renderTasks();
  });
});

function setActiveFilter(activeBtn) {
  filterButtons.forEach(btn => {
    btn.classList.remove("active");
  });

  activeBtn.classList.add("active");
}

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    // complete
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "✓";
    checkBtn.classList.add("complete-btn");

    checkBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);

      if (newText && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    // delete
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("task-buttons");

    buttonContainer.appendChild(checkBtn);
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(buttonContainer);

    taskList.appendChild(li);
  });

  updateCounter();
}