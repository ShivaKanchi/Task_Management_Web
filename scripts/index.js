const state = {
    tasklist: []
};


const taskcontent = document.querySelector(".tasks_content");
const taskmodal = document.querySelector(".show_task_content");


const htmlTaskContent = ({ id, key, url, title, tags, description }) =>
    `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
    <div class="card shadow-sm task__card">
        <div class="card-header d-flex gap-3 justify-content-end task__card_header">
            <button type="button" class="btn btn-outline-info mr-2" name=${id} onclick="editTask.apply(this, arguments)">
                <i class="fas fa-pencil-alt" name=${id}></i>
            </button>
            <button type="button" class="btn btn-outline-danger mr-2" name=${id} onclick="deleteTask.apply(this, arguments)">
                <i class="fas fa-trash-alt" name=${id}></i>
            </button>
        </div>
        <div class="card-body d-flex flex-column gap-2 ">
            ${url ? `<img src=${url} alt="Task Image" class="card-image-top md-3 rounded-lg taskimage" />` : `<img src="images/defaultimage.jpg" alt="Task Image" class="card-image-top md-3 rounded-lg taskimage" />`
    }
            <h4 class="task__card_title">${title}</h4>
            <p class="description trim-3-lines text-muted" data-gram_editors="false">${description}</p>
            <div class="tags d-flex flex-wrap text-white">
                <span class="badge bg-primary m-1">${tags}</span>
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
            id=${id} 
            name=${id}
            onclick="openTask.apply(this,arguments)">
            Open Task
            </button>
        </div>
    </div>`;


const htmlModalContent = ({ id, url, title, description }) => {
    const date = new Date(parseInt(id));
    return `    
	<div id=${id} class="d-flex flex-column gap-1" >
    ${url ? `<img src=${url} alt="Task Image" class="card-image-top md-3 rounded-lg taskimage" />` : `<img src="images/defaultimage.jpg" alt="Task Image" class="card-image-top md-3 rounded-lg taskimage" />`
        }
		<strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
		<h2 class="my-3">${title}</h2>
		<p class="lead">${description}</p>
	</div>
    `;
};


const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify({
        tasks: state.tasklist
    }));
};


const updateIntialData = () => {
    if (localStorage.tasks == undefined || localStorage.tasks.length <= 12) {
        taskcontent.insertAdjacentHTML("beforeend", `<h5 class="fw-bold text-center mt-5 text-muted">No Tasks found</h5>`);
    }
    const localStoragecopy = JSON.parse(localStorage.tasks);

    if (localStoragecopy) state.tasklist = localStoragecopy.tasks;

    state.tasklist.map((cardDate) => {
        taskcontent.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));
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
    taskcontent.insertAdjacentHTML("beforeend", htmlTaskContent({
        ...input, id
    }));

    state.tasklist.push({ ...input, id });
    updateLocalStorage();
};


const openTask = (e) => {
    if (!e) e = window.event;
    const getTask = state.tasklist.find(({ id }) => id === e.target.id);
    console.log(e.target.id);
    taskmodal.innerHTML = htmlModalContent(getTask);
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
    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDesc = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];

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

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDesc = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];

    const updateEdit = {
        taskTitle: taskTitle.innerHTML,
        taskDesc: taskDesc.innerHTML,
        taskType: taskType.innerHTML

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