let todos = [];
const todoList = document.getElementById("todoList");

// 取得資料
function fetchTodos() {
  fetch("http://localhost:3000/todos")
    .then((res) => res.json())
    .then((data) => {
      todos = data;
      renderData();
    })
    .catch((err) => {
      console.error(err);
      alert("取得待辦資料失敗");
    });
}

// 初始渲染
fetchTodos();

// 渲染列表
function renderData() {
  const filteredData = getFilteredData();
  todoList.innerHTML = "";

  const defaultTemplate = `
    <li class="no-data">
      <p>目前尚無待辦事項</p>
    </li>
  `;

  const filteredTemplate = (isCompleted, todo) => `
    <label class="todoList_label">
      <input class="todoList_input" type="checkbox" ${isCompleted ? "checked" : ""} data-id="${todo.id}">
      <span></span>
    </label>
    <a href="#" class="delete_todo" data-id="${todo.id}">
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
    const isCompleted = todo.completed;

    li.innerHTML = filteredTemplate(isCompleted, todo);

    li.querySelector("span").textContent = todo.content;

    todoList.appendChild(li);
  });

  updateCompletedCount();
}

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
    id: Date.now(), // 使用 Date.now() 生成唯一 id
    content: todoItem,
    completed: false, // 預設為未完成
  };

  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  })
    .then((res) => res.json())
    .then(() => {
      text.value = "";
      fetchTodos(); // 新增成功後重新抓資料
    })
    .catch((err) => {
      console.error(err);
      alert("新增待辦失敗");
    });
}

createTodo.addEventListener("click", createTodoItem);

// 刪除待辦功能
function deleteTodoItem(e) {
  const deleteBtn = e.target.closest(".delete_todo");

  if (!deleteBtn) return;

  e.preventDefault();

  const isConfirmed = confirm("確認刪除待辦事項？");

  if (!isConfirmed) return;

  const id = Number(deleteBtn.getAttribute("data-id"));

  fetch(`http://localhost:3000/todos/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      // API 刪除成功後，再更新本地陣列
      const index = todos.findIndex((todo) => todo.id === id);
      if (index !== -1) {
        todos.splice(index, 1);
        renderData();
      }
    })
    .catch((err) => {
      console.error(err);
      alert("刪除待辦失敗");
    });
}

todoList.addEventListener("click", deleteTodoItem);

// 取得篩選後的資料
function getFilteredData() {
  const activeTab = document.querySelector("#filterTabs a.active");
  const status = activeTab ? activeTab.getAttribute("data-status") : "all";

  switch (status) {
    case "pending":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "all":
    default:
      return todos;
  }
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
