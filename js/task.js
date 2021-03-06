window.addEventListener("DOMContentLoaded", () => {
  // Date Objects
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // The form and The form content
  const taskForm = document.querySelector("#task-form");
  const taskContent = document.querySelector(".task-container");
  const taskNumber = document.querySelector(".badge");
  const modalBtn = document.querySelector("#modal-key");
  const modal = document.querySelector(".modal");
  const mainModel = document.querySelector(".main-modal");

  // Model events
  modalBtn.addEventListener("click", activateModal);
  function activateModal(event) {
    mainModel.style.display = "block";
  }

  // Close button
  let closeBtn = document.getElementById("closeBtn");
  closeBtn.addEventListener("click", closeModal);
  function closeModal(e) {
    mainModel.style.display = "none";
    modal.style.transition = "all 1s ease";
  }

  // Window close event
  window.addEventListener("click", windowClose);
  function windowClose(e) {
    if (e.target == mainModel) {
      mainModel.style.display = "none";
    }
  }

  // Update the dom
  function updateTaskDOM({ name, desc, id, date, completed }) {
    updateTaskNumber();

    if (completed) {
      taskContent.insertAdjacentHTML(
        "beforeend",
        `
        <li class="task-item" data-id="${id}">
            <h4 class="text-stylish strike">${name}</h4>
            <p class="task-btn">
                <button href="#" class="deleteTask"><span class="lnr lnr-trash"></span></button>
                <button href="#" class="doneTask"><span class="lnr lnr-spell-check"></span></button>
            </p>
            <p class="text-desc">${desc}</p>
            <p class="task-date">${date}</p>
          </li>
      `
      );
    } else {
      taskContent.insertAdjacentHTML(
        "beforeend",
        `
        <li class="task-item" data-id="${id}">
            <h4 class="text-stylish">${name}</h4>
            <p class="task-btn">
            <button href="#" class="deleteTask"><span class="lnr lnr-trash"></span></button>
            <button href="#" class="doneTask"><span class="lnr lnr-spell-check"></span></button>
            </p>
            <p class="text-desc">${desc}</p>
            <p class="task-date">${date}</p>
          </li>
      `
      );
    }
  }

  function changeLocal(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  // Update BADGE NUMBER
  function updateTaskNumber() {
    let storedTask = localStorage.getItem("tasks");

    if (storedTask == null) {
      taskNumber.textContent = "0";
    } else {
      let tasks = JSON.parse(storedTask);
      taskNumber.textContent = tasks.length;
    }
  }
  // function to update and check local storage
  function updateStorage(task) {
    let tasks = [];
    let storedTask = localStorage.getItem("tasks");
    if (storedTask == null) {
      tasks.push(task);
      changeLocal(tasks);
    } else {
      let tasks = JSON.parse(storedTask);
      tasks.push(task);
      changeLocal(tasks);
    }
  }

  // Bubble the delete and done task from the task-container element
  taskContent.addEventListener("click", deleteTaskOrDone);
  // Function to delete task
  function deleteTaskOrDone(event) {
    // capture the clicked element
    let li = event.target.parentElement.parentElement;
    let deletedTaskId = li.dataset.id;

    // Delete event
    if (event.target.classList.contains("deleteTask")) {
      // Delete from LocalStorage
      // Get the task from local Storage
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      let newTasks = tasks.filter((task) => task.id != deletedTaskId);
      console.log(newTasks);
      changeLocal(newTasks);
      // Remove The Element
      li.classList.add("fadeOut");
      setTimeout(() => li.remove(), 400);
      // Update task number
      updateTaskNumber();

      if (newTasks.length === 0) {
        taskContent.innerHTML = "";
      }
    }

    if (event.target.classList.contains("doneTask")) {
      // Update the Local Storage
      // Get the task from local Storage
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      let newTasks = [];
      tasks.forEach((task) => {
        if (task.id == deletedTaskId) {
          task.completed = true;
        }
        newTasks.push(task);
      });
      changeLocal(newTasks);
      // Add Shake Animation
      let taskLi = event.target.closest(".task-item");
      taskLi.classList.add("shake");
      // StrikeThrough the Task Header
      let taskHeader = taskLi.firstElementChild;
      taskHeader.classList.add("strike");
      // Congration Voice message
      let word = `Congratulations ,You have completed a task`;
      speak(word);
    }
  }

  // Speech Synthesis
  function speak(word) {
    const synth = window.speechSynthesis;
    let voices = [];
    let voice;

    const getVoices = () => {
      voices = synth.getVoices();
    };
    getVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = getVoices;
    }
    if (voices.length > 0) {
      voice = voices[0];
    }
    const speakText = new SpeechSynthesisUtterance(word);
    speakText.voice = voice;
    synth.speak(speakText);
  }

  // Get the date and time
  function getDate(date) {
    let currentDate = date.toLocaleDateString();
    let currentDay = days[date.getDay()].slice(0, 3);
    let currentTime = date.toLocaleTimeString().slice(0, 4);
    let timeZone = date.toLocaleTimeString().slice(8).toLowerCase();

    return `${currentTime}${timeZone}, ${currentDay} , ${currentDate}`;
  }

  function formatString(string) {
    let stringArray = string.split(".");
    let arr = stringArray
      .map((map) => {
        let individualString = String(map);
        let editedFormName;
        if (individualString[0] == " ") {
          editedFormName =
            individualString[1].toUpperCase() +
            individualString.slice(2).toLowerCase();
        } else {
          editedFormName =
            individualString[0].toUpperCase() +
            individualString.slice(1).toLowerCase();
        }
        return editedFormName;
      })
      .join(". ");
    return arr;
  }
  // Update Task Event
  const updateTask = (event) => {
    event.preventDefault();
    let formName = document.querySelector("#task-name").value.trim();
    let formDesc = document.querySelector("#task-desc").value.trim();

    if (!formName || !formDesc) {
      alert("Please fill all available fields");
      return;
    }
    let editedFormName = formatString(formName);
    let editedformDesc = formatString(formDesc);
    const task = {
      name: editedFormName,
      desc: editedformDesc,
      id: Date.now(),
      completed: false,
      date: getDate(new Date()),
    };

    // Update and fill up local storage
    updateStorage(task);

    // updateTaskDOM(task);
    updateTaskDOM(task);
    // Reset Form
    taskForm.reset();
  };

  // Event Listener for the submit event
  taskForm.addEventListener("submit", updateTask);
  // Onload Dom Update
  function createDom() {
    updateTaskNumber();

    if (localStorage.getItem("tasks") == null) {
      return;
    } else {
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      tasks.forEach((task) => {
        updateTaskDOM(task);
      });
    }
  }
  createDom();
});
