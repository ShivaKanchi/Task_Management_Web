const state = {
    tasklist: []
};


const taskcontent = document.querySelector(".tasks_content");
const taskmodal = document.querySelector(".show_task_content");


const htmlTaskContent = ({ id, key, url, title, tags, description }) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4 mt-3";
    col.id = id;
    col.setAttribute("key", id);

    const card = document.createElement("div");
    card.className = "card shadow-sm task__card";

    const header = document.createElement("div");
    header.className = "card-header d-flex gap-3 justify-content-end task__card_header";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-outline-info mr-2";
    editBtn.setAttribute("name", id);
    editBtn.onclick = function() { editTask.apply(this, arguments); };
    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-pencil-alt";
    editIcon.setAttribute("name", id);
    editBtn.appendChild(editIcon);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-outline-danger mr-2";
    deleteBtn.setAttribute("name", id);
    deleteBtn.onclick = function() { deleteTask.apply(this, arguments); };
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash-alt";
    deleteIcon.setAttribute("name", id);
    deleteBtn.appendChild(deleteIcon);

    header.appendChild(editBtn);
    header.appendChild(deleteBtn);

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column gap-2";

    const img = document.createElement("img");
    img.src = url || "images/defaultimage.jpg";
    img.alt = "Task Image";
    img.className = "card-image-top md-3 rounded-lg taskimage";
    body.appendChild(img);

    const h4 = document.createElement("h4");
    h4.className = "task__card_title";
    h4.textContent = title;
    body.appendChild(h4);

    const p = document.createElement("p");
    p.className = "description trim-3-lines text-muted";
    p.setAttribute("data-gram_editors", "false");
    p.textContent = description;
    body.appendChild(p);

    const tagsDiv = document.createElement("div");
    tagsDiv.className = "tags d-flex flex-wrap text-white";
    const span = document.createElement("span");
    span.className = "badge bg-primary m-1";
    span.textContent = tags;
    tagsDiv.appendChild(span);
    body.appendChild(tagsDiv);

    const footer = document.createElement("div");
    footer.className = "card-footer";
    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "btn btn-outline-primary float-right";
    openBtn.setAttribute("data-bs-toggle", "modal");
    openBtn.setAttribute("data-bs-target", "#showTaskModal");
    openBtn.id = id;
    openBtn.setAttribute("name", id);
    openBtn.onclick = function() { openTask.apply(this, arguments); };
    openBtn.textContent = "Open Task";
    footer.appendChild(openBtn);

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);
    col.appendChild(card);

    return col;
};


const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify({
        tasks: state.tasklist
    }));
};


const updateIntialData = () => {
    if (localStorage.tasks == undefined || localStorage.tasks.length <= 12) {
        const noTasks = document.createElement("h5");
        noTasks.className = "fw-bold text-center mt-5 text-muted";
        noTasks.textContent = "No Tasks found";
        taskcontent.appendChild(noTasks);
    }
    const localStoragecopy = JSON.parse(localStorage.tasks || "{}");

    if (localStoragecopy.tasks) state.tasklist = localStoragecopy.tasks;

    state.tasklist.map((cardDate) => {
        taskcontent.appendChild(htmlTaskContent(cardDate));
    });
};


const handleSubmit = (event) => {
    const id = `${Date.now()}`;

    const input = {
        url: document.getElementById("imageURL").value,
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDesc").value,
        tags: document.getElementById("tags").value

    };

    if (input.title === "" || input.description === "" || input.tags === "") {
        return alert("Please fill properly")
    }
    taskcontent.appendChild(htmlTaskContent({
        ...input, id
    }));

    state.tasklist.push({ ...input, id });
    updateLocalStorage();
};


const openTask = (e) => {
    if (!e) e = window.event;
    const getTask = state.tasklist.find(({ id }) => id === e.target.id);
    taskmodal.innerHTML = "";

    const date = new Date(parseInt(getTask.id));

    const container = document.createElement("div");
    container.id = getTask.id;
    container.className = "d-flex flex-column gap-1";

    const img = document.createElement("img");
    img.src = getTask.url || "images/defaultimage.jpg";
    img.alt = "Task Image";
    img.className = "card-image-top md-3 rounded-lg showtaskimage";
    container.appendChild(img);

    const strong = document.createElement("strong");
    strong.className = "text-sm text-muted";
    strong.textContent = `Created on ${date.toDateString()}`;
    container.appendChild(strong);

    const h2 = document.createElement("h2");
    h2.className = "my-3";
    h2.textContent = getTask.title;
    container.appendChild(h2);

    const p = document.createElement("p");
    p.className = "lead";
    p.textContent = getTask.description;
    container.appendChild(p);

    taskmodal.appendChild(container);
};


const deleteTask = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.getAttribute("name");
    const type = e.target.tagName;
    console.log(targetId, type);
    const removeTask = state.tasklist.filter(({ id }) => id !== targetId);
    state.tasklist = removeTask;
    updateLocalStorage();
    if (type === "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode);
    }
    if (type === "I") {
        return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode);
    }
};


const editTask = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDesc;
    let taskType;
    let submitButton;

    if (type == "BUTTON") {
        parentNode = e.target.parentNode.parentNode;
    }
    else {
        parentNode = e.target.parentNode.parentNode.parentNode;
    }
    taskTitle = parentNode.querySelector(".task__card_title");
    taskDesc = parentNode.querySelector(".description");
    taskType = parentNode.querySelector(".badge");
    submitButton = parentNode.querySelector(".card-footer button");

    taskTitle.setAttribute("contenteditable", "true");
    taskDesc.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");
    submitButton.setAttribute("onclick", "saveTask.apply(this,arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML = "Save Changes";
};


const saveTask = (e) => {
    if (!e) e = window.event;
    const targetId = e.target.id;
    const parentNode = e.target.parentNode.parentNode;

    taskTitle = parentNode.querySelector(".task__card_title");
    taskDesc = parentNode.querySelector(".description");
    taskType = parentNode.querySelector(".badge");
    submitButton = parentNode.querySelector(".card-footer button");

    const updateEdit = {
        taskTitle: taskTitle.textContent,
        taskDesc: taskDesc.textContent,
        taskType: taskType.textContent

    };

    console.log(state.tasklist);
    let stateCopy = state.tasklist;

    stateCopy = stateCopy.map((task) =>
        task.id === targetId ? {
            id: task.id,
            title: updateEdit.taskTitle,
            description: updateEdit.taskDesc,
            tags: updateEdit.taskType,
            url: task.url
        } : task
    );

    state.tasklist = stateCopy;
    updateLocalStorage();

    taskTitle.setAttribute("contenteditable", "false");
    taskDesc.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");
    submitButton.setAttribute("onclick", "openTask.apply(this,arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTaskModal");
    submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
    if (!e) e = window.event;

    while (taskcontent.firstChild) {
        taskcontent.removeChild(taskcontent.firstChild);
    };

    const resultData = state.tasklist.filter(({ title }) => {
        return title.toLowerCase().includes(e.target.value.toLowerCase());
    });

    resultData.map((cardDate) => {
        taskcontent.appendChild(htmlTaskContent(cardDate));
    });
};