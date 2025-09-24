(function () {
    const getFilters = () => {
        const type = document.getElementById('notification-type-filter');
        const status = document.getElementById('notification-status-filter');
        return {
            type: type ? type.value : '',
            status: status ? status.value : '',
        };
    };

    const filterNotifications = () => {
        const filters = getFilters();
        return window.AppState.notifications.filter((note) => {
            const matchesType = !filters.type || note.type === filters.type;
            const matchesStatus = !filters.status || note.status === filters.status;
            return matchesType && matchesStatus;
        });
    };

    const renderNotification = (note) => {
        const statusClasses = {
            Unread: 'border-lds-blue bg-blue-50',
            Read: 'border-gray-200 bg-white',
            Archived: 'border-gray-200 bg-gray-50 opacity-70',
        };
        return `
            <article class="rounded-2xl border ${statusClasses[note.status] || 'border-gray-200 bg-white'} p-5 shadow-sm flex flex-col gap-2" data-id="${note.id}">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-sm font-semibold text-gray-900">${window.Utils.escapeHtml(note.type)}</p>
                        <p class="text-sm text-gray-600">${window.Utils.escapeHtml(note.message)}</p>
                    </div>
                    <span class="text-xs text-gray-400">${window.Utils.formatRelativeTime(note.createdAt)}</span>
                </div>
                <div class="flex items-center gap-3 text-xs">
                    <button class="toggle-read px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100" data-id="${note.id}">
                        Mark ${note.status === 'Unread' ? 'Read' : 'Unread'}
                    </button>
                    <button class="archive px-3 py-1 rounded-md border border-transparent text-red-600 hover:bg-red-50" data-id="${note.id}">
                        Archive
                    </button>
                </div>
            </article>
        `;
    };

    const render = () => {
        const container = document.getElementById('notifications-list');
        if (!container) return;
        const filtered = filterNotifications();
        if (!filtered.length) {
            container.innerHTML = `
                <div class="bg-white rounded-2xl p-8 text-center shadow-inner border border-dashed border-gray-200">
                    <p class="text-lg font-semibold text-gray-700 mb-2">No notifications to display.</p>
                    <p class="text-sm text-gray-500">When new assignments arrive, they will appear here.</p>
                </div>
            `;
            return;
        }
        container.innerHTML = filtered
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map(renderNotification)
            .join('');
    };

    const bindEvents = () => {
        ['notification-type-filter', 'notification-status-filter'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('change', render);
        });

        const container = document.getElementById('notifications-list');
        if (container) {
            container.addEventListener('click', (event) => {
                const target = event.target;
                const id = target.dataset.id;
                if (!id) return;
                const note = window.AppState.notifications.find((item) => item.id === id);
                if (!note) return;

                if (target.classList.contains('toggle-read')) {
                    note.status = note.status === 'Unread' ? 'Read' : 'Unread';
                    window.App.refreshAll();
                    render();
                }

                if (target.classList.contains('archive')) {
                    note.status = 'Archived';
                    window.App.refreshAll();
                    render();
                }
            });
        }

        const markAllRead = document.getElementById('mark-all-read');
        const clearAll = document.getElementById('clear-notifications');
        if (markAllRead)
            markAllRead.addEventListener('click', () => {
                window.AppState.notifications.forEach((note) => {
                    if (note.status !== 'Archived') note.status = 'Read';
                });
                window.App.refreshAll();
                render();
            });
        if (clearAll)
            clearAll.addEventListener('click', () => {
                window.AppState.notifications = [];
                window.App.refreshAll();
                render();
            });
    };

    const init = () => {
        bindEvents();
        render();
    };

    window.NotificationsModule = {
        init,
        render,
    };
})();
