let data = [];

function renderData() {
  const filteredData = getFilteredData();
  const list = document.querySelector(".todoList_item");
  list.innerHTML = "";

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
    list.innerHTML = defaultTemplate;
    updateCompletedCount();
    return;
  }

  filteredData.forEach(function (item) {
    const li = document.createElement("li");
    const originalIndex = data.indexOf(item);
    const isCompleted = item.completed;

    li.innerHTML = filteredTemplate(isCompleted, originalIndex);

    li.querySelector("span").textContent = item.content;

    list.appendChild(li);
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

  data.push(obj);
  text.value = "";
  renderData();
}

createTodo.addEventListener("click", createTodoItem);

// 刪除待辦功能
const deleteTodo = document.querySelector(".todoList_item");
function deleteTodoItem(e) {
  const deleteBtn = e.target.closest(".delete_todo");

  if (!deleteBtn) return;

  e.preventDefault();

  const isConfirmed = confirm("確認刪除待辦事項？");

  if (!isConfirmed) return;

  const num = deleteBtn.getAttribute("data-num");
  data.splice(num, 1);

  renderData();
}

deleteTodo.addEventListener("click", deleteTodoItem);

// 取得篩選後的資料
function getFilteredData() {
  const activeTab = document.querySelector("#filterTabs a.active");
  let currentFilter = activeTab ? activeTab.getAttribute("data-status") : "all";

  if (currentFilter === "pending") {
    return data.filter((item) => !item.completed);
  } else if (currentFilter === "completed") {
    return data.filter((item) => item.completed);
  }

  return data;
}

// 切換完成狀態功能
const todoListItem = document.querySelector(".todoList_item");
function toggleTodoStatus(e) {
  const checkbox = e.target;

  const isChecked = checkbox.classList.contains("todoList_input");

  if (!isChecked) return;

  const index = checkbox.getAttribute("data-index");

  data[index].completed = !data[index].completed;

  renderData();
}

todoListItem.addEventListener("change", toggleTodoStatus);

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
  const completedCount = data.filter((item) => item.completed).length;
  const countEl = document.getElementById("completed-count");
  countEl.textContent = completedCount;
}
