const state = {
    tasklist: {}
};

const taskcontent = document.querySelector(".tasks_content");
const taskmodal = document.querySelector(".show_task_content");

const htmlTaskContent = ({ id, key, url, title, type, description }) =>
    `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
    <div class="card shadow-sm task__card">
        <div class="card-header d-flex gap-2 justify-content-end task__card_header">
            <button type="button" class="btn btn-outline-info mr-2" name=${id}>
                <i class="fas fa-pencil-alt" name=${id}></i>
            </button>
            <button type="button" class="btn btn-outline-danger mr-2" name=${id}>
                <i class="fas fa-trash-alt" name=${id}></i>
            </button>
        </div>
        <div class="card-body">
            ${url && `<img width='100%' arc=${url} alt="card image cap" class="card-image-top md-3 rounded-lg" />`
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
            <button type="button" class="btn btn-outline-primary float-right" data-bs-toggle="showTaskModal"
                data-bs-target="#showTaskModal">
            </button>
        </div>
    </div>

    `;

const htmlModalContent = ({ id, url, title, description }) => {
    const date = new Date(parseInt(id));
    return
    `    
	<div id=${id}>
		${url && `<img width='100%' arc=${url} alt="card image cap" class="img-fluid  place_holder_image mb-3" />`
        }
		<strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
		<h2 class="my-3">${title}</h2>
		<p class="lead">${description}</p>
	</div>
    `;
};