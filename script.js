let todos = [];
const todoList = document.getElementById("todoList");

function renderData() {
  const filteredData = getFilteredData();
  todoList.innerHTML = "";

  const defaultTemplate = `
    <li class="no-data">
      <p>目前尚無待辦事項</p>
    </li>
  `;

  const filteredTemplate = (isCompleted, originalIndex) => `
    <label class="todoList_label">
      <input class="todoList_input" type="checkbox" ${isCompleted ? "checked" : ""} data-index="${originalIndex}">
      <span></span>
    </label>
    <a href="#" class="delete_todo" data-num="${originalIndex}">
      <i class="fa fa-times"></i>
    </a>
  `;

  const isEmptyData = filteredData.length === 0;

  if (isEmptyData) {
    todoList.innerHTML = defaultTemplate;
    updateCompletedCount();
    return;
  }

  filteredData.forEach(function (todo) {
    const li = document.createElement("li");
    const originalIndex = todos.indexOf(todo);
    const isCompleted = todo.completed;

    li.innerHTML = filteredTemplate(isCompleted, originalIndex);

    li.querySelector("span").textContent = todo.content;

    todoList.appendChild(li);
  });

  updateCompletedCount();
}

// 初始渲染
renderData();

// 新增待辦功能
const text = document.querySelector(".text");
const createTodo = document.querySelector(".create_todo");
function createTodoItem(e) {
  e.preventDefault();

  const todoItem = text.value.trim();

  if (todoItem === "") {
    alert("請輸入內容");
    text.value = "";
    return;
  }

  const obj = {
    content: todoItem,
    completed: false, // 預設為未完成
  };

  todos.push(obj);
  text.value = "";
  renderData();
}

createTodo.addEventListener("click", createTodoItem);

// 刪除待辦功能
function deleteTodoItem(e) {
  const deleteBtn = e.target.closest(".delete_todo");

  if (!deleteBtn) return;

  e.preventDefault();

  const isConfirmed = confirm("確認刪除待辦事項？");

  if (!isConfirmed) return;

  const numStr = deleteBtn.getAttribute("data-num");
  const num = Number(numStr);
  todos.splice(num, 1);

  renderData();
}

todoList.addEventListener("click", deleteTodoItem);

// 取得篩選後的資料
function getFilteredData() {
  const activeTab = document.querySelector("#filterTabs a.active");
  let currentFilter = activeTab ? activeTab.getAttribute("data-status") : "all";

  if (currentFilter === "pending") {
    return todos.filter((todo) => !todo.completed);
  } else if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 切換完成狀態功能
function toggleTodoStatus(e) {
  const checkbox = e.target;

  const isChecked = checkbox.classList.contains("todoList_input");

  if (!isChecked) return;

  const index = checkbox.getAttribute("data-index");

  todos[index].completed = !todos[index].completed;

  renderData();
}

todoList.addEventListener("change", toggleTodoStatus);

// 篩選顯示功能
const filterTabs = document.getElementById("filterTabs");
filterTabs.addEventListener("click", function (e) {
  const clickedLink = e.target.closest("a");
  if (!clickedLink) return;

  e.preventDefault();

  filterTabs.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
  clickedLink.classList.add("active");

  renderData();
});

// 更新完成數量功能
function updateCompletedCount() {
  const completedCount = todos.filter((todo) => todo.completed).length;
  const countEl = document.getElementById("completed-count");
  countEl.textContent = completedCount;
}
