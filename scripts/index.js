const state = {
    tasklist: []
};


const taskcontent = document.querySelector(".tasks_content");
const taskmodal = document.querySelector(".show_task_content");

const escapeHTML = (str) => {
    if (!str) return str;
    return str.toString().replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[m]);
};


const htmlTaskContent = ({ id, url, title, tags, description }) =>
    `
    <div class="col-md-6 col-lg-4 mt-3" id="${escapeHTML(id)}" key="${escapeHTML(id)}">
    <div class="card shadow-sm task__card">
        <div class="card-header d-flex gap-3 justify-content-end task__card_header">
            <button type="button" class="btn btn-outline-info mr-2" name="${escapeHTML(id)}" onclick="editTask.apply(this, arguments)">
                <i class="fas fa-pencil-alt" name="${escapeHTML(id)}"></i>
            </button>
            <button type="button" class="btn btn-outline-danger mr-2" name="${escapeHTML(id)}" onclick="deleteTask.apply(this, arguments)">
                <i class="fas fa-trash-alt" name="${escapeHTML(id)}"></i>
            </button>
        </div>
        <div class="card-body d-flex flex-column gap-2 ">
            ${url ? `<img src="${escapeHTML(url)}" alt="Task Image" class="card-image-top md-3 rounded-lg taskimage" />` : `<img src="images/defaultimage.jpg" alt="Task Image" class="card-image-top md-3 rounded-lg taskimage" />`
    }
            <h4 class="task__card_title">${escapeHTML(title)}</h4>
            <p class="description trim-3-lines text-muted" data-gram_editors="false">${escapeHTML(description)}</p>
            <div class="tags d-flex flex-wrap text-white">
                <span class="badge bg-primary m-1">${escapeHTML(tags)}</span>
            </div>
            <div>
            </div>
        </div>
        <div class="card-footer">
            <button 
            type="button" 
            class="btn btn-outline-primary float-right" 
            data-bs-toggle="modal"
            data-bs-target="#showTaskModal" 
            id="${escapeHTML(id)}"
            name="${escapeHTML(id)}"
            onclick="openTask.apply(this,arguments)">
            Open Task
            </button>
        </div>
    </div>`;


const htmlModalContent = ({ id, url, title, description }) => {
    const date = new Date(parseInt(id));
    return `    
	<div id="${escapeHTML(id)}" class="d-flex flex-column gap-1" >
    ${url ? `<img src="${escapeHTML(url)}" alt="Task Image" class="card-image-top md-3 rounded-lg showtaskimage" />` : `<img src="images/defaultimage.jpg" alt="Task Image" class="card-image-top md-3 rounded-lg taskimage" />`
        }
		<strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
		<h2 class="my-3">${escapeHTML(title)}</h2>
		<p class="lead">${escapeHTML(description)}</p>
	</div>
    `;
};


const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify({
        tasks: state.tasklist
    }));
};


const updateIntialData = () => {
    const getStoredData = localStorage.getItem("tasks");

    if (!getStoredData || getStoredData.length <= 12) {
        taskcontent.insertAdjacentHTML("beforeend", `<h5 class="fw-bold text-center mt-5 text-muted">No Tasks found</h5>`);
        return;
    }

    const localStoragecopy = JSON.parse(getStoredData);

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
    while (taskcontent.firstChild) {
        taskcontent.removeChild(taskcontent.firstChild);
    };

    const searchValue = e.target.value.toLowerCase();
    const resultData = state.tasklist.filter(({ title }) => {
        return title.toLowerCase().includes(searchValue);
    });

    resultData.map((cardDate) => {
        taskcontent.appendChild(htmlTaskContent(cardDate));
    });
};
if (typeof module !== "undefined") {
    module.exports = { htmlTaskContent };
}
