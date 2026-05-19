// ----- DATA MODEL -----
// Each task: { id: number, text: string, completed: boolean }
let tasks = [];

// ----- DOM REFERENCES -----
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filtros button');

// ----- FILTER VARIABLE (stored in sessionStorage) -----
let currentFilter = 'all';

// ----- 1. LOAD TASKS FROM localStorage -----
function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  } else {
    tasks = [];
  }
}

// ----- 2. SAVE TASKS TO localStorage -----
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ----- 3. LOAD FILTER FROM sessionStorage -----
function loadFilter() {
  const savedFilter = sessionStorage.getItem('filter');
  if (savedFilter && ['all', 'pending', 'completed'].includes(savedFilter)) {
    currentFilter = savedFilter;
  }
  filterButtons.forEach(btn => {
    if (btn.getAttribute('data-filter') === currentFilter) {
      btn.classList.add('filtro-activo');
    } else {
      btn.classList.remove('filtro-activo');
    }
  });
}

// ----- 4. SAVE FILTER TO sessionStorage -----
function saveFilter() {
  sessionStorage.setItem('filter', currentFilter);
}

// ----- 5. SHOW WELCOME MESSAGE (only once per session) -----
function showWelcome() {
  const alreadySeen = sessionStorage.getItem('welcomed');
  if (!alreadySeen) {
    const welcomeDiv = document.getElementById('welcomeMessage');
    welcomeDiv.textContent = 'Welcome! Your tasks are always saved, but the filter is forgotten when you close the browser.';
    setTimeout(() => {
      welcomeDiv.textContent = '';
    }, 4000);
    sessionStorage.setItem('welcomed', 'true');
  }
}

// ----- 6. RENDER TASKS ACCORDING TO CURRENT FILTER -----
function render() {
  let filteredTasks = [];
  if (currentFilter === 'all') {
    filteredTasks = tasks;
  } else if (currentFilter === 'pending') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  taskList.innerHTML = '';
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<li style="text-align:center">No tasks</li>';
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = 'tarea-text';
    if (task.completed) span.classList.add('completada');

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = ' ❌ ';
    deleteBtn.className = 'eliminar';
    deleteBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      render();
    });

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '✅';
    toggleBtn.className = 'modificar';
    toggleBtn.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      render();
    });

    li.appendChild(span);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// ----- 7. ADD NEW TASK -----
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') {
    alert('Write something');
    return;
  }
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  taskInput.value = '';
  render();
}

// ----- 8. CHANGE FILTER -----
function changeFilter(event) {
  const filter = event.target.getAttribute('data-filter');
  if (!filter) return;
  currentFilter = filter;
  saveFilter();
  render();
  filterButtons.forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('filtro-activo');
    } else {
      btn.classList.remove('filtro-activo');
    }
  });
}

// ----- 9. INITIALIZE APP -----
function init() {
  loadTasks();
  loadFilter();
  showWelcome();
  render();

  addButton.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  filterButtons.forEach(btn => {
    btn.addEventListener('click', changeFilter);
  });
}

init();You