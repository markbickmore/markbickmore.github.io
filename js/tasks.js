(function () {
    const statusOptions = ['Not Started', 'In Progress', 'Waiting', 'Completed'];
    const statusStyles = {
        'Not Started': 'badge bg-gray-200 text-gray-700',
        'In Progress': 'badge bg-blue-100 text-blue-700',
        Waiting: 'badge bg-yellow-100 text-yellow-700',
        Completed: 'badge bg-emerald-100 text-emerald-700',
    };

    let currentView = 'list';

    const getFilters = () => {
        const event = document.getElementById('task-event-filter');
        const status = document.getElementById('task-status-filter');
        const auxiliary = document.getElementById('task-auxiliary-filter');
        return {
            event: event ? event.value : '',
            status: status ? status.value : '',
            auxiliary: auxiliary ? auxiliary.value : '',
        };
    };

    const getFilteredTasks = () => {
        const filters = getFilters();
        return window.AppState.tasks.filter((task) => {
            const matchesEvent = !filters.event || task.eventId === filters.event;
            const matchesStatus = !filters.status || task.status === filters.status;
            const matchesAuxiliary = !filters.auxiliary || task.auxiliaryId === filters.auxiliary;
            return matchesEvent && matchesStatus && matchesAuxiliary;
        });
    };

    const createStatusSelect = (task) => {
        return `
            <select class="task-status-select border border-gray-200 rounded-md px-2 py-1 text-sm" data-task-id="${task.id}">
                ${statusOptions
                    .map((status) => `<option value="${status}" ${status === task.status ? 'selected' : ''}>${status}</option>`)
                    .join('')}
            </select>
        `;
    };

    const createTaskCard = (task) => {
        const eventName = window.Utils.getEventName(task.eventId);
        const dueDate = task.dueDate ? window.Utils.formatDateTime(task.dueDate) : 'No due date';
        return `
            <article class="task-card bg-white rounded-2xl shadow-md p-6">
                <div class="flex flex-wrap justify-between gap-4 mb-3">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">${window.Utils.escapeHtml(task.title)}</h3>
                        <p class="text-sm text-gray-500">${window.Utils.escapeHtml(eventName)} • ${window.Utils.escapeHtml(
            window.Utils.getAuxiliaryName(task.auxiliaryId)
        )}</p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <span class="${statusStyles[task.status] || 'badge bg-gray-100 text-gray-700'}">${window.Utils.escapeHtml(
            task.status
        )}</span>
                        <span class="badge bg-red-100 text-red-700">${window.Utils.escapeHtml(task.priority || 'Standard')}</span>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-4">${window.Utils.escapeHtml(task.notes || 'No notes added yet.')}</p>
                <div class="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                    <div class="flex items-center gap-3">
                        <span><i class="fas fa-user text-lds-gold mr-2"></i>${window.Utils.escapeHtml(task.owner || 'Unassigned')}</span>
                        <span><i class="fas fa-hourglass-half text-lds-gold mr-2"></i>${window.Utils.escapeHtml(dueDate)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        ${createStatusSelect(task)}
                        <button class="mark-complete px-3 py-1 bg-lds-blue text-white text-xs rounded-md" data-task-id="${task.id}">
                            Mark Complete
                        </button>
                    </div>
                </div>
            </article>
        `;
    };

    const createBoardCard = (task) => {
        const due = task.dueDate ? window.Utils.formatDate(task.dueDate) : 'No due date';
        return `
            <div class="bg-white rounded-xl shadow p-4">
                <p class="font-semibold text-sm text-gray-800">${window.Utils.escapeHtml(task.title)}</p>
                <p class="text-xs text-gray-500 mb-2">${window.Utils.escapeHtml(window.Utils.getEventName(task.eventId))}</p>
                <span class="badge bg-gray-100 text-gray-600 mb-2 inline-block">Due ${window.Utils.escapeHtml(due)}</span>
                <p class="text-xs text-gray-500">${window.Utils.escapeHtml(task.owner || 'Unassigned')}</p>
            </div>
        `;
    };

    const renderList = (tasks) => {
        const listView = document.getElementById('tasks-list-view');
        if (!listView) return;
        if (!tasks.length) {
            listView.innerHTML = `
                <div class="bg-white rounded-2xl p-8 text-center shadow-inner border border-dashed border-gray-200">
                    <p class="text-lg font-semibold text-gray-700 mb-2">No tasks to show.</p>
                    <p class="text-sm text-gray-500">Adjust filters or create a new task assignment.</p>
                </div>
            `;
            return;
        }
        listView.innerHTML = tasks
            .slice()
            .sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity))
            .map(createTaskCard)
            .join('');
    };

    const renderBoard = (tasks) => {
        const containers = {
            'Not Started': document.getElementById('tasks-not-started'),
            'In Progress': document.getElementById('tasks-in-progress'),
            Waiting: document.getElementById('tasks-waiting'),
            Completed: document.getElementById('tasks-completed'),
        };
        Object.values(containers).forEach((el) => {
            if (el) el.innerHTML = '';
        });
        tasks.forEach((task) => {
            const column = containers[task.status] || containers['Not Started'];
            if (column) {
                column.insertAdjacentHTML('beforeend', createBoardCard(task));
            }
        });
    };

    const setView = (view) => {
        currentView = view;
        const listView = document.getElementById('tasks-list-view');
        const boardView = document.getElementById('tasks-board-view');
        const listButton = document.getElementById('task-view-list');
        const boardButton = document.getElementById('task-view-board');
        if (!listView || !boardView || !listButton || !boardButton) return;

        if (view === 'list') {
            listView.classList.remove('hidden');
            boardView.classList.add('hidden');
            listButton.classList.add('bg-lds-blue', 'text-white');
            boardButton.classList.remove('bg-lds-blue', 'text-white');
        } else {
            listView.classList.add('hidden');
            boardView.classList.remove('hidden');
            boardButton.classList.add('bg-lds-blue', 'text-white');
            listButton.classList.remove('bg-lds-blue', 'text-white');
        }
    };

    const render = () => {
        const tasks = getFilteredTasks();
        renderList(tasks);
        renderBoard(tasks);
    };

    const refreshFilters = () => {
        const eventFilter = document.getElementById('task-event-filter');
        const auxiliaryFilter = document.getElementById('task-auxiliary-filter');

        if (eventFilter) {
            const current = eventFilter.value;
            eventFilter.innerHTML =
                '<option value="">All Events</option>' +
                window.AppState.events
                    .map((event) => `<option value="${event.id}">${window.Utils.escapeHtml(event.name)}</option>`)
                    .join('');
            if (current) eventFilter.value = current;
        }

        if (auxiliaryFilter) {
            const current = auxiliaryFilter.value;
            auxiliaryFilter.innerHTML =
                '<option value="">All Auxiliaries</option>' +
                window.AppState.auxiliaries
                    .map((aux) => `<option value="${aux.id}">${window.Utils.escapeHtml(aux.name)}</option>`)
                    .join('');
            if (current) auxiliaryFilter.value = current;
        }
    };

    const openTaskForm = () => {
        const form = document.createElement('form');
        form.className = 'space-y-4';
        form.innerHTML = `
            <div class="form-grid">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input name="title" type="text" required placeholder="Describe the assignment" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Event</label>
                    <select name="eventId" required>
                        ${window.AppState.events
                            .map((event) => `<option value="${event.id}">${window.Utils.escapeHtml(event.name)}</option>`)
                            .join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Auxiliary</label>
                    <select name="auxiliaryId" required>
                        ${window.AppState.auxiliaries
                            .map((aux) => `<option value="${aux.id}">${window.Utils.escapeHtml(aux.name)}</option>`)
                            .join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <input name="owner" type="text" placeholder="Member name" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input name="dueDate" type="datetime-local" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select name="priority">
                        <option value="High">High</option>
                        <option value="Medium" selected>Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status">
                    ${statusOptions
                        .map((status) => `<option value="${status}">${status}</option>`)
                        .join('')}
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" placeholder="Add details, checklists, or links"></textarea>
            </div>
        `;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const newTask = {
                id: window.Utils.generateId('task'),
                title: data.get('title').trim(),
                eventId: data.get('eventId'),
                auxiliaryId: data.get('auxiliaryId'),
                owner: data.get('owner').trim(),
                dueDate: data.get('dueDate') ? new Date(data.get('dueDate')).toISOString() : null,
                status: data.get('status') || 'Not Started',
                priority: data.get('priority') || 'Medium',
                notes: data.get('notes').trim(),
            };
            window.App.addTask(newTask);
            render();
            window.Modal.hide();
        });

        window.Modal.show({
            title: 'Create Task Assignment',
            content: form,
            primaryAction: {
                label: 'Save Task',
                onClick: () => form.requestSubmit(),
            },
            secondaryAction: {
                label: 'Cancel',
                onClick: window.Modal.hide,
            },
        });
    };

    const bindEvents = () => {
        ['task-event-filter', 'task-status-filter', 'task-auxiliary-filter'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', render);
        });

        const listView = document.getElementById('tasks-list-view');
        if (listView) {
            listView.addEventListener('change', (event) => {
                const target = event.target;
                if (target.classList.contains('task-status-select')) {
                    const taskId = target.dataset.taskId;
                    window.App.updateTaskStatus(taskId, target.value);
                }
            });
            listView.addEventListener('click', (event) => {
                const button = event.target.closest('.mark-complete');
                if (button) {
                    const taskId = button.dataset.taskId;
                    window.App.updateTaskStatus(taskId, 'Completed');
                }
            });
        }

        const listButton = document.getElementById('task-view-list');
        const boardButton = document.getElementById('task-view-board');
        if (listButton && boardButton) {
            listButton.addEventListener('click', () => setView('list'));
            boardButton.addEventListener('click', () => setView('board'));
        }
    };

    const init = () => {
        refreshFilters();
        bindEvents();
        render();
        setView(currentView);
    };

    window.TasksModule = {
        init,
        render,
        openTaskForm,
        refreshFilters,
    };
})();
