const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("task-counter");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// LOAD
window.addEventListener("load", () => {
  renderTasks();
});

// ADD TASK
addBtn.addEventListener("click", addTask);

// ENTER SUPPORT
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    addTask();
  }
});

// ADD TASK FUNCTION
function addTask() {
  const taskText = input.value.trim();

  if (!taskText) return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  input.value = "";
}

// SAVE TASKS
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// UPDATE COUNTER
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const active = total - completed;

  if (total === 0) {
    counter.textContent = "No tasks yet";
  } else {
    counter.textContent = `${active} active / ${total} total tasks`;
  }
}

// FILTER BUTTONS
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    setActiveFilter(btn);
    renderTasks();
  });
});

// ACTIVE FILTER UI
function setActiveFilter(activeBtn) {
  filterButtons.forEach(btn => {
    btn.classList.remove("active");
  });

  activeBtn.classList.add("active");
}

// HELPER BUTTON CREATOR
function createButton(text, className, onClick) {
  const button = document.createElement("button");

  button.textContent = text;
  button.classList.add(className);

  button.addEventListener("click", onClick);

  return button;
}

// RENDER TASKS
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    // TASK TEXT
    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.completed) {
      span.classList.add("completed");
    }

    // COMPLETE BUTTON
    const completeBtn = createButton(
      "✓",
      "complete-btn",
      () => {
        task.completed = !task.completed;

        saveTasks();
        renderTasks();
      }
    );

    // EDIT BUTTON
    const editBtn = createButton(
      "Edit",
      "edit-btn",
      () => {
        const newText = prompt("Edit task:", task.text);

        if (!newText || !newText.trim()) return;

        task.text = newText.trim();

        saveTasks();
        renderTasks();
      }
    );

    // DELETE BUTTON
    const deleteBtn = createButton(
      "Delete",
      "delete-btn",
      () => {
        tasks = tasks.filter(t => t.id !== task.id);

        saveTasks();
        renderTasks();
      }
    );

    // BUTTON CONTAINER
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("task-buttons");

    buttonContainer.appendChild(completeBtn);
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    // APPEND
    li.appendChild(span);
    li.appendChild(buttonContainer);

    taskList.appendChild(li);
  });

  updateCounter();
}