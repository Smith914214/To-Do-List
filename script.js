 const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  const itemsLeft = document.getElementById('itemsLeft');
  const clearCompletedBtn = document.getElementById('clearCompleted');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function render() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
      filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      filteredTasks = tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `<li class="empty-msg">No tasks to show</li>`;
    } else {
      filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        li.innerHTML = `
          <div class="task-left">
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-checkbox" />
            <span class="task-text">${escapeHTML(task.text)}</span>
          </div>
          <button class="delete-btn" data-id="${task.id}">✕</button>
        `;

        taskList.appendChild(li);
      });
    }

    const remaining = tasks.filter(t => !t.completed).length;
    itemsLeft.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    tasks.push({
      id: Date.now(),
      text: text,
      completed: false
    });

    taskInput.value = '';
    saveTasks();
    render();
  }

  addBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  taskList.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);

    if (e.target.classList.contains('toggle-checkbox')) {
      const task = tasks.find(t => t.id === id);
      task.completed = !task.completed;
      saveTasks();
      render();
    }

    if (e.target.classList.contains('delete-btn')) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      render();
    }
  });

  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    render();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  render();