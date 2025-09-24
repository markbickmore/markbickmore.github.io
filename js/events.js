(function () {
    const statusClasses = {
        Planning: 'badge bg-yellow-100 text-yellow-700',
        Approved: 'badge bg-emerald-100 text-emerald-700',
        'In Progress': 'badge bg-blue-100 text-blue-700',
        Completed: 'badge bg-gray-200 text-gray-700',
    };

    const getFilters = () => {
        const type = document.getElementById('event-type-filter');
        const status = document.getElementById('event-status-filter');
        const organizer = document.getElementById('event-organizer-filter');
        const search = document.getElementById('event-search');
        return {
            type: type ? type.value : '',
            status: status ? status.value : '',
            organizer: organizer ? organizer.value : '',
            search: search ? search.value.trim().toLowerCase() : '',
        };
    };

    const getEventTasks = (eventId) => {
        return window.AppState.tasks.filter((task) => task.eventId === eventId);
    };

    const getStatusClass = (status) => statusClasses[status] || 'badge bg-gray-100 text-gray-700';

    const renderEventCard = (event) => {
        const tasks = getEventTasks(event.id);
        const completed = tasks.filter((task) => task.status === 'Completed').length;
        const nextTask = tasks
            .filter((task) => task.status !== 'Completed')
            .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))[0];

        const organizer = window.Utils.getAuxiliaryName(event.organizer);
        const taskSummary = tasks.length
            ? `${completed}/${tasks.length} tasks complete`
            : 'No tasks assigned yet';

        const upcomingTask = nextTask
            ? `<p class="text-sm text-gray-500"><span class="font-semibold">Next due:</span> ${window.Utils.escapeHtml(
                  nextTask.title
              )} • ${window.Utils.formatDate(nextTask.dueDate)}</p>`
            : '<p class="text-sm text-gray-500">No outstanding tasks</p>';

        return `
            <article class="bg-white rounded-2xl shadow-md card-shadow p-6">
                <div class="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-900">${window.Utils.escapeHtml(event.name)}</h3>
                        <p class="text-sm text-gray-500">${window.Utils.formatDateTime(event.start)} • ${window.Utils.escapeHtml(
            event.location
        )}</p>
                        <p class="text-sm text-gray-500">Organized by ${window.Utils.escapeHtml(organizer)}</p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <span class="${getStatusClass(event.status)} status-badge">${window.Utils.escapeHtml(event.status)}</span>
                        <span class="badge bg-indigo-100 text-indigo-700">${window.Utils.escapeHtml(event.type)}</span>
                    </div>
                </div>
                <p class="text-gray-600 mb-4">${window.Utils.escapeHtml(event.description)}</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-50 rounded-xl p-4">
                        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timeline</p>
                        <p class="text-sm text-gray-700">${window.Utils.formatDateTime(event.start)}</p>
                        <p class="text-sm text-gray-500">Ends ${window.Utils.formatTime(event.end)}</p>
                    </div>
                    <div class="bg-gray-50 rounded-xl p-4">
                        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tasks</p>
                        <p class="text-sm font-semibold text-gray-800">${window.Utils.escapeHtml(taskSummary)}</p>
                        ${upcomingTask}
                    </div>
                    <div class="bg-gray-50 rounded-xl p-4">
                        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</p>
                        <p class="text-sm text-gray-700">${window.Utils.escapeHtml(event.location)}</p>
                        <p class="text-xs text-gray-400 mt-1">Begins ${window.Utils.formatRelativeTime(event.start)}</p>
                    </div>
                </div>
            </article>
        `;
    };

    const filterEvents = () => {
        const filters = getFilters();
        return window.AppState.events.filter((event) => {
            const matchesType = !filters.type || event.type === filters.type;
            const matchesStatus = !filters.status || event.status === filters.status;
            const matchesOrganizer = !filters.organizer || event.organizer === filters.organizer;
            const matchesSearch = !filters.search ||
                event.name.toLowerCase().includes(filters.search) ||
                event.description.toLowerCase().includes(filters.search);
            return matchesType && matchesStatus && matchesOrganizer && matchesSearch;
        });
    };

    const render = () => {
        const container = document.getElementById('events-list');
        if (!container) return;
        const filtered = filterEvents();
        if (!filtered.length) {
            container.innerHTML = `
                <div class="bg-white rounded-2xl p-8 text-center shadow-inner border border-dashed border-gray-200">
                    <p class="text-lg font-semibold text-gray-700 mb-2">No events match your filters.</p>
                    <p class="text-sm text-gray-500">Try adjusting the filters or create a new event.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = filtered
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .map(renderEventCard)
            .join('');
    };

    const populateOrganizerFilter = () => {
        const select = document.getElementById('event-organizer-filter');
        if (!select) return;
        const current = select.value;
        select.innerHTML = '<option value="">All Auxiliaries</option>' +
            window.AppState.auxiliaries
                .map((aux) => `<option value="${aux.id}">${window.Utils.escapeHtml(aux.name)}</option>`)
                .join('');
        if (current) {
            select.value = current;
        }
    };

    const openEventForm = () => {
        const form = document.createElement('form');
        form.className = 'space-y-4';
        form.innerHTML = `
            <div class="form-grid">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                    <input name="name" type="text" required placeholder="Activity title" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select name="type" required>
                        <option value="Ward Activity">Ward Activity</option>
                        <option value="Stake Activity">Stake Activity</option>
                        <option value="Youth Activity">Youth Activity</option>
                        <option value="Relief Society">Relief Society</option>
                        <option value="Elders Quorum">Elders Quorum</option>
                        <option value="Primary">Primary</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                    <select name="organizer" required>
                        ${window.AppState.auxiliaries
                            .map(
                                (aux) => `<option value="${aux.id}">${window.Utils.escapeHtml(aux.name)}</option>`
                            )
                            .join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" required>
                        <option value="Planning">Planning</option>
                        <option value="Approved">Approved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                    <input name="start" type="datetime-local" required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input name="end" type="datetime-local" />
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input name="location" type="text" required placeholder="Building or venue" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" placeholder="Share the purpose, agenda, and special notes"></textarea>
            </div>
        `;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const newEvent = {
                id: window.Utils.generateId('event'),
                name: data.get('name').trim(),
                type: data.get('type'),
                status: data.get('status'),
                organizer: data.get('organizer'),
                start: data.get('start') ? new Date(data.get('start')).toISOString() : null,
                end: data.get('end') ? new Date(data.get('end')).toISOString() : null,
                location: data.get('location').trim(),
                description: data.get('description').trim(),
            };
            window.App.addEvent(newEvent);
            window.Modal.hide();
        });

        window.Modal.show({
            title: 'Create New Event',
            content: form,
            primaryAction: {
                label: 'Save Event',
                onClick: () => form.requestSubmit(),
            },
            secondaryAction: {
                label: 'Cancel',
                onClick: window.Modal.hide,
            },
        });
    };

    const init = () => {
        ['event-type-filter', 'event-status-filter', 'event-organizer-filter'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', render);
        });
        const search = document.getElementById('event-search');
        if (search) search.addEventListener('input', () => {
            window.requestAnimationFrame(render);
        });
        populateOrganizerFilter();
        render();
    };

    window.EventsModule = {
        init,
        render,
        openEventForm,
        populateOrganizerFilter,
    };
})();
