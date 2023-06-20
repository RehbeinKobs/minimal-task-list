$(document).ready(main);

function createElement(tag, classname, text, elements = []) {
    const element = document.createElement(tag);
    element.className = classname;
    element.innerText = text;
    if (elements.length > 0) {
        elements.forEach(e => {
            element.appendChild(e);
        });
    }
    return element;
}

function getLocalStorage(item) {
    const data = localStorage.getItem(item);
    if (data) return JSON.parse(data);
    return [];
}

function setLocalStorage(item, data) {
    localStorage.setItem(item, JSON.stringify(data));
}

function loadTaskLists() {
    const lists = $("#notstarted ul, #started ul, #finished ul").empty();
    [...lists].forEach(e => {
        getLocalStorage(e.parentElement.id).map(task => createElement("li", "task", task, [
            createElement("button", "task-button", e.parentElement.id === "notstarted" ? "start" : "finish"),
            createElement("button", "task-remove-button", "remove"),
        ])).forEach(task => {
            e.appendChild(task);
        });
    });
    $("#finished ul li .task-button").remove();
}

function main() {
    loadTaskLists();
    // option buttons handlers
    $("#input-task").click(() => {
        $("#input-container").removeClass("hidden");
    });
    $("#clear-tasks").click(() => {
        $("#confirmation-container").removeClass("hidden");
    });
    // input buttons handlers
    $("#add-task").click(() => {
        const taskText = $("textarea").val();
        if (taskText) setLocalStorage("notstarted", [...getLocalStorage("notstarted"), taskText]);
        $("#input-container").addClass("hidden");
        loadTaskLists();
    });
    $("#cancel-input").click(() => {
        $("#input-container").addClass("hidden");
    });
    // confirmation buttons handlers
    $("#confirm").click(() => {
        setLocalStorage("notstarted", []);
        setLocalStorage("started", []);
        setLocalStorage("finished", []);
        $("#confirmation-container").addClass("hidden");
        loadTaskLists();
    });
    $("#cancel").click(() => {
        $("#confirmation-container").addClass("hidden");
    });
    // task buttons handlers
    $("#notstarted, #started, #finished").on("click", ".task-remove-button", ({ target }) => {
        const list = target.parentElement.parentElement;
        const index = [...list.children].indexOf(target.parentElement);
        const tasks = getLocalStorage(list.parentElement.id);
        tasks.splice(index, 1);
        setLocalStorage(list.parentElement.id, tasks);
        loadTaskLists();
    });
    $("#notstarted").on("click", ".task-button", ({ target }) => {
        const list = target.parentElement.parentElement;
        const index = [...list.children].indexOf(target.parentElement);
        const tasks = getLocalStorage("notstarted");
        setLocalStorage("started", [...getLocalStorage("started"), tasks.splice(index, 1)[0]]);
        setLocalStorage("notstarted", tasks);
        loadTaskLists();
    });
    $("#started").on("click", ".task-button", ({ target }) => {
        const list = target.parentElement.parentElement;
        const index = [...list.children].indexOf(target.parentElement);
        const tasks = getLocalStorage("started");
        setLocalStorage("finished", [...getLocalStorage("finished"), tasks.splice(index, 1)[0]]);
        setLocalStorage("started", tasks);
        loadTaskLists();
    });
}