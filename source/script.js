document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-task-form");
  const titleInput = document.getElementById("task-title-input");
  const descInput = document.getElementById("task-desc-input");
  const select = document.getElementById("task-column-select");

  const columns = {
    todo: document.querySelector(".colonne:nth-child(1) ul"),
    inprogress: document.querySelector(".colonne:nth-child(2) ul"),
    terminer: document.querySelector(".colonne:nth-child(3) ul"),
  };

  // Drag & Drop variables
  let draggedItem = null;

  function createTaskElement(title, description = '') {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");

    const spanTitle = document.createElement("span");
    spanTitle.className = "task-title";
    spanTitle.textContent = title;

    const spanDesc = document.createElement("span");
    spanDesc.className = "task-desc";
    spanDesc.textContent = description;

    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.className = "delete-btn";
    btn.title = "Supprimer la tâche";

    btn.addEventListener("click", () => {
      li.remove();
      saveData();
    });

    li.appendChild(spanTitle);
    if (description.trim() !== "") {
      li.appendChild(spanDesc);
    }
    li.appendChild(btn);

    // Drag events
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragend", dragEnd);

    return li;
  }

  function dragStart(e) {
    draggedItem = this;
    setTimeout(() => (this.style.display = "none"), 0);
  }

  function dragEnd(e) {
    this.style.display = "block";
    draggedItem = null;
    saveData();
  }

  // Set up columns for drop
  Object.values(columns).forEach(column => {
    column.addEventListener("dragover", e => {
      e.preventDefault();
    });

    column.addEventListener("drop", e => {
      e.preventDefault();
      if (draggedItem) {
        column.appendChild(draggedItem);
        saveData();
      }
    });
  });

  function saveData() {
    const data = {};
    for (const col in columns) {
      data[col] = Array.from(columns[col].children).map(li => {
        const title = li.querySelector(".task-title")?.textContent || "";
        const desc = li.querySelector(".task-desc")?.textContent || "";
        return { title, desc };
      });
    }
    sessionStorage.setItem("todoData", JSON.stringify(data));
  }

  function loadData() {
    const data = sessionStorage.getItem("todoData");
    if (!data) return;
    const lists = JSON.parse(data);
    for (const col in lists) {
      columns[col].innerHTML = "";
      lists[col].forEach(task => {
        const li = createTaskElement(task.title, task.desc);
        columns[col].appendChild(li);
      });
    }
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    if (title === "") return;

    const col = select.value;
    const taskElement = createTaskElement(title, desc);
    columns[col].appendChild(taskElement);
    saveData();

    titleInput.value = "";
    descInput.value = "";
    titleInput.focus();
  });

  loadData();
});
