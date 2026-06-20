let tasks = [];
let nextId = 1;

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
    const title = document.getElementById('task-title').value.trim();
    if(!title) return;

    const description = document.getElementById('task-desc').value.trim();
    const tagsRaw = document.getElementById('task-tags').value;
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    const column = document.getElementById('task-col').value;

    addTask(title, description, tags, column);

    modalOverlay.classList.remove('show');

    document.getElementById('modalOverlay').classList.remove('show');
    document.getElementById('task-title').value = '';
    document.getElementById('task-desc').value = '';
    document.getElementById('task-tags').value = '';
});

function updateCounts(){
    document.getElementById('.todo-count').textContent = tasks.filter(t => t.column === 'todo').length;

    document.getElementById('.progress-count').textContent = tasks.filter(t => t.column === 'progress').length;

    document.getElementById('.done-count').textContent = tasks.filter(t => t.column === "done").length;

}