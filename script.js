const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(taskObject) {

  const li = document.createElement("li");

  li.classList.add("task");

  li.innerHTML = `
    <span class="task-text ${taskObject.completed ? "completed" : ""}">
      ${taskObject.text}
    </span>

    <div class="buttons">
      <button class="complete-btn">✓</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  const deleteBtn = li.querySelector(".delete-btn");
  const completeBtn = li.querySelector(".complete-btn");
  const taskSpan = li.querySelector(".task-text");

  completeBtn.addEventListener("click", function () {

    taskObject.completed = !taskObject.completed;

    taskSpan.classList.toggle("completed");

    saveTasks();

  });

  deleteBtn.addEventListener("click", function () {

    li.remove();

    tasks = tasks.filter(function(task) {
      return task !== taskObject;
    });

    saveTasks();

  });

  taskList.appendChild(li);

}

function addTask() {

  const taskText = taskInput.value;

  if (taskText === "") {
    return;
  }

  const taskObject = {
    text: taskText,
    completed: false
  };

  tasks.push(taskObject);

  saveTasks();

  createTaskElement(taskObject);

  taskInput.value = "";

}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {

  if (event.key === "Enter") {
    addTask();
  }

});

const savedTasks = JSON.parse(localStorage.getItem("tasks"));

if (savedTasks) {

  tasks = savedTasks;

  tasks.forEach(function(taskObject) {
    createTaskElement(taskObject);
  });

}