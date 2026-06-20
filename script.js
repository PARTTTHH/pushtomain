let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;
let draggedId = null;

function addTask(title, description, tags, column){
    const task = {
        id: nextId,
        title: title,
        description: description,
        tags: tags,
        column: column
    };
    tasks.push(task);
    nextId++;
    localStorage.setItem("nextId", nextId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
}

function createCard(task){
    const card = document.createElement("div");
    card.className = "task-card";
    card.dataset.id = task.id;

    card.innerHTML = `
        <div class="task-id">Task-${task.id}</div>
        <div class="task-title">${task.title}</div>
        <div class="task-desc">${task.description}</div>
        <div class="task-tags">
            ${task.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
    `;

    card.draggable = true;

    card.addEventListener("dragstart", () => {
        draggedId = Number(card.dataset.id);
        setTimeout(() => card.classList.add("dragging"), 0);
    });

    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });

    return card;
}

function render(){
    document.querySelector("#todo-list").innerHTML = "";
    document.querySelector("#progress-list").innerHTML = "";
    document.querySelector("#done-list").innerHTML = "";

    tasks.forEach(task => {
        const card = createCard(task);
        document.getElementById(task.column + "-list").append(card);
    });
    updateCounts();
}

document.querySelectorAll(".card-list").forEach(zone => {
    zone.addEventListener("dragover", e => {
        e.preventDefault();
        zone.classList.add("drag-over");
    });

    zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over");
    });

    zone.addEventListener("drop", () => {
        zone.classList.remove("drag-over");
        const newColumn = zone.id.replace("-list", "");
        const task = tasks.find(t => t.id == draggedId);
        task.column = newColumn;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        render();
    });

})

let addTaskBtn = document.querySelector(".add-task-btn");
const modalOverlay = document.getElementById('modalOverlay');

addTaskBtn.addEventListener('click', () => {
    modalOverlay.classList.add('show');
});
document.getElementById('closeModal').addEventListener('click', () => {
    modalOverlay.classList.remove('show');
});
document.getElementById('cancelTask').addEventListener('click', () => {
    modalOverlay.classList.remove('show');
});
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('show');
});

document.querySelector("#submitTask").addEventListener("click", () => {
    modalOverlay.classList.remove('show');
    const title = document.getElementById('task-title').value.trim();
    if(!title) return;

    const description = document.getElementById('task-desc').value.trim();
    const tagsRaw = document.getElementById('task-tags').value;
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    const column = document.getElementById('task-col').value;

    addTask(title, description, tags, column);

    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-tags').value = '';
});

function updateCounts(){
    document.querySelector('.todo-count').textContent = tasks.filter(t => t.column === 'todo').length;

    document.querySelector('.progress-count').textContent = tasks.filter(t => t.column === 'progress').length;

    document.querySelector('.done-count').textContent = tasks.filter(t => t.column === "done").length;

}

render();