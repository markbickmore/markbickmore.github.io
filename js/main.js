(function () {
    const createDateFromNow = (daysOffset, hours = 18, minutes = 0) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + daysOffset);
        date.setHours(hours, minutes, 0, 0);
        return date.toISOString();
    };

    const AppState = {
        auxiliaries: [
            {
                id: 'relief-society',
                name: 'Relief Society',
                leaders: ['Sister Jensen', 'Sister Price'],
                focus: 'Ministering, outreach, and compassionate service',
                meeting: '2nd Tuesday @ 7:00 PM',
                contact: 'reliefsociety@ward.org',
                upcoming: 'Temple prep meal train',
                strengths: ['Ministering', 'Meal support', 'Family outreach'],
            },
            {
                id: 'elders-quorum',
                name: "Elders Quorum",
                leaders: ['Brother Morales'],
                focus: 'Service coordination, ministering, temporal needs',
                meeting: '1st Thursday @ 7:00 PM',
                contact: 'elders@ward.org',
                upcoming: 'Move-in assistance rotation',
                strengths: ['Logistics', 'Heavy lifting', 'Temple trips'],
            },
            {
                id: 'young-men',
                name: 'Young Men',
                leaders: ['Brother Katoa', 'Brother Lee'],
                focus: 'Youth development, Scouting, adventure activities',
                meeting: 'Wednesday Mutual @ 7:00 PM',
                contact: 'youngmen@ward.org',
                upcoming: 'Summer high-adventure planning',
                strengths: ['Leadership development', 'Outdoor skills', 'Firesides'],
            },
            {
                id: 'young-women',
                name: 'Young Women',
                leaders: ['Sister Tanner'],
                focus: 'Personal progress, spiritual growth, connection',
                meeting: 'Wednesday Mutual @ 7:00 PM',
                contact: 'youngwomen@ward.org',
                upcoming: 'Standards night refresh',
                strengths: ['Creative events', 'Mentoring', 'Youth councils'],
            },
            {
                id: 'primary',
                name: 'Primary',
                leaders: ['Sister Latu'],
                focus: 'Children’s gospel instruction & singing time',
                meeting: 'Sunday Primary @ 11:10 AM',
                contact: 'primary@ward.org',
                upcoming: 'Summer singing time in the park',
                strengths: ['Music', 'Storytelling', 'Parent outreach'],
            },
            {
                id: 'ward-mission',
                name: 'Ward Mission',
                leaders: ['Elder & Sister Martin'],
                focus: 'Missionary lessons, convert retention, welcome kits',
                meeting: '2nd Sunday Council @ 3:00 PM',
                contact: 'mission@ward.org',
                upcoming: 'Community open house follow-up',
                strengths: ['Teaching', 'Friendshipping', 'Fellowshipping new members'],
            },
        ],
        events: [],
        tasks: [],
        notifications: [],
        activityLog: [],
    };

    const baseEvents = [
        {
            id: 'event-ward-potluck',
            name: 'Ward Potluck & Talent Showcase',
            type: 'Ward Activity',
            status: 'In Progress',
            organizer: 'relief-society',
            start: createDateFromNow(9, 18, 0),
            end: createDateFromNow(9, 20, 0),
            location: 'Cultural Hall',
            description: 'Bring a favorite family recipe and enjoy performances from every auxiliary.',
        },
        {
            id: 'event-youth-temple-trip',
            name: 'Youth Temple Trip',
            type: 'Youth Activity',
            status: 'Approved',
            organizer: 'young-women',
            start: createDateFromNow(14, 6, 30),
            end: createDateFromNow(14, 12, 0),
            location: 'Draper Utah Temple',
            description: 'Combined Young Men and Young Women baptistry session with family history workshop.',
        },
        {
            id: 'event-stake-leadership',
            name: 'Stake Leadership Training',
            type: 'Stake Activity',
            status: 'Planning',
            organizer: 'elders-quorum',
            start: createDateFromNow(21, 9, 0),
            end: createDateFromNow(21, 12, 0),
            location: 'Stake Center Chapel',
            description: 'Quarterly leadership council for ward council presidencies and auxiliary leads.',
        },
        {
            id: 'event-primary-splash',
            name: 'Primary Splash Day',
            type: 'Primary',
            status: 'In Progress',
            organizer: 'primary',
            start: createDateFromNow(4, 10, 0),
            end: createDateFromNow(4, 12, 0),
            location: 'Ward Building Lawn',
            description: 'Water games, popsicles, and a scripture treasure hunt for families.',
        },
        {
            id: 'event-ward-mission-devotional',
            name: 'Ward Mission Devotional',
            type: 'Ward Activity',
            status: 'Approved',
            organizer: 'ward-mission',
            start: createDateFromNow(2, 19, 0),
            end: createDateFromNow(2, 20, 30),
            location: 'Relief Society Room',
            description: 'Convert testimonies and ministering experiences with refreshments afterwards.',
        },
        {
            id: 'event-elders-service',
            name: 'Elders Quorum Service Saturday',
            type: 'Elders Quorum',
            status: 'Planning',
            organizer: 'elders-quorum',
            start: createDateFromNow(16, 8, 0),
            end: createDateFromNow(16, 11, 30),
            location: 'Various ward homes',
            description: 'Split the quorum into crews to help three families with projects and blessing visits.',
        },
    ];

    const baseTasks = [
        {
            id: 'task-set-up-tables',
            title: 'Reserve and set up cultural hall tables',
            eventId: 'event-ward-potluck',
            auxiliaryId: 'elders-quorum',
            owner: 'Brother Morales',
            dueDate: createDateFromNow(7, 12, 0),
            status: 'In Progress',
            priority: 'High',
            notes: 'Coordinate with building scheduler and request 20 round tables.',
        },
        {
            id: 'task-program-outline',
            title: 'Finalize talent program outline',
            eventId: 'event-ward-potluck',
            auxiliaryId: 'relief-society',
            owner: 'Sister Price',
            dueDate: createDateFromNow(6, 18, 0),
            status: 'Not Started',
            priority: 'Medium',
            notes: 'Confirm 8-10 acts across auxiliaries; keep under 75 minutes.',
        },
        {
            id: 'task-transport-youth',
            title: 'Organize temple trip transportation',
            eventId: 'event-youth-temple-trip',
            auxiliaryId: 'young-men',
            owner: 'Brother Lee',
            dueDate: createDateFromNow(10, 17, 0),
            status: 'Waiting',
            priority: 'High',
            notes: 'Need 4 additional drivers cleared and youth permission slips.',
        },
        {
            id: 'task-sack-lunches',
            title: 'Prepare sack lunches for youth temple trip',
            eventId: 'event-youth-temple-trip',
            auxiliaryId: 'relief-society',
            owner: 'Sister Jensen',
            dueDate: createDateFromNow(13, 20, 0),
            status: 'Not Started',
            priority: 'Medium',
            notes: 'Coordinate with parents for allergy-friendly options.',
        },
        {
            id: 'task-speakers',
            title: 'Confirm stake leadership training speakers',
            eventId: 'event-stake-leadership',
            auxiliaryId: 'elders-quorum',
            owner: 'Bishop Roberts',
            dueDate: createDateFromNow(18, 9, 0),
            status: 'In Progress',
            priority: 'High',
            notes: 'Need confirmations from Stake RS and Primary Presidents.',
        },
        {
            id: 'task-primary-games',
            title: 'Plan water activity rotations',
            eventId: 'event-primary-splash',
            auxiliaryId: 'primary',
            owner: 'Sister Latu',
            dueDate: createDateFromNow(1, 9, 0),
            status: 'Completed',
            priority: 'Medium',
            notes: 'Include toddler-friendly option and family scripture moment.',
        },
        {
            id: 'task-missionary-invites',
            title: 'Deliver devotional invitations to ministering families',
            eventId: 'event-ward-mission-devotional',
            auxiliaryId: 'ward-mission',
            owner: 'Elder Martin',
            dueDate: createDateFromNow(1, 14, 0),
            status: 'In Progress',
            priority: 'Medium',
            notes: 'Coordinate with ward council for special invitees.',
        },
    ];

    const baseNotifications = [
        {
            id: 'note-transport',
            type: 'Task Assigned',
            status: 'Unread',
            message: 'Transportation assignment added for the youth temple trip.',
            createdAt: createDateFromNow(-1, 8, 30),
            relatedTaskId: 'task-transport-youth',
        },
        {
            id: 'note-potlucks',
            type: 'Task Due Soon',
            status: 'Unread',
            message: 'Cultural hall setup is due in 3 days for the potluck showcase.',
            createdAt: createDateFromNow(-2, 15, 45),
            relatedTaskId: 'task-set-up-tables',
        },
        {
            id: 'note-devotional',
            type: 'Event Reminder',
            status: 'Read',
            message: 'Ward mission devotional starts in 48 hours—confirm refreshment assignments.',
            createdAt: createDateFromNow(-3, 10, 0),
            relatedEventId: 'event-ward-mission-devotional',
        },
        {
            id: 'note-speakers',
            type: 'Assignment Request',
            status: 'Unread',
            message: 'Stake presidency requested updated leadership training agenda.',
            createdAt: createDateFromNow(-5, 9, 30),
            relatedEventId: 'event-stake-leadership',
        },
    ];

    const baseActivity = [
        {
            id: 'activity-program',
            category: 'Task Update',
            description: 'Program outline created for the ward talent showcase.',
            createdAt: createDateFromNow(-1, 21, 10),
        },
        {
            id: 'activity-drivers',
            category: 'Coordination',
            description: 'Secured three of four drivers for the youth temple trip.',
            createdAt: createDateFromNow(-2, 19, 25),
        },
        {
            id: 'activity-devotional',
            category: 'Event Update',
            description: 'Ward mission devotional agenda approved by the bishopric.',
            createdAt: createDateFromNow(-3, 8, 15),
        },
        {
            id: 'activity-primary',
            category: 'Milestone',
            description: 'Primary activity plan finalized with new scripture treasure hunt.',
            createdAt: createDateFromNow(-4, 20, 50),
        },
        {
            id: 'activity-stake',
            category: 'Planning',
            description: 'Stake leadership breakout topics submitted for review.',
            createdAt: createDateFromNow(-6, 14, 5),
        },
    ];

    AppState.events.push(...baseEvents);
    AppState.tasks.push(...baseTasks);
    AppState.notifications.push(...baseNotifications);
    AppState.activityLog.push(...baseActivity);

    const Utils = {
        generateId(prefix) {
            return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
        },
        formatDate(date, options = {}) {
            if (!date) return 'TBD';
            const dt = new Date(date);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                ...options,
            }).format(dt);
        },
        formatDateTime(date) {
            if (!date) return 'TBD';
            const dt = new Date(date);
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            }).format(dt);
        },
        formatTime(date) {
            if (!date) return '';
            const dt = new Date(date);
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
            }).format(dt);
        },
        formatMonthYear(date) {
            const dt = new Date(date);
            return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(dt);
        },
        formatRelativeTime(date) {
            const dt = new Date(date);
            const now = new Date();
            const diff = dt.getTime() - now.getTime();
            const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
            const units = [
                { unit: 'day', value: 86400000 },
                { unit: 'hour', value: 3600000 },
                { unit: 'minute', value: 60000 },
            ];
            for (const { unit, value } of units) {
                const delta = Math.round(diff / value);
                if (Math.abs(delta) >= 1) {
                    return rtf.format(delta, unit);
                }
            }
            return 'just now';
        },
        escapeHtml(value = '') {
            const str = value == null ? '' : String(value);
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },
        getAuxiliaryName(id) {
            const aux = AppState.auxiliaries.find((item) => item.id === id);
            return aux ? aux.name : 'Unassigned';
        },
        getEventName(id) {
            const event = AppState.events.find((item) => item.id === id);
            return event ? event.name : 'Unknown Event';
        },
    };

    const modalContainer = document.getElementById('modal-container');

    const Modal = {
        show({ title, content, primaryAction, secondaryAction }) {
            if (!modalContainer) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'modal-content bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6';

            const header = document.createElement('div');
            header.className = 'flex justify-between items-start mb-4';
            const titleEl = document.createElement('h3');
            titleEl.className = 'text-xl font-semibold text-gray-900';
            titleEl.textContent = title;

            const closeBtn = document.createElement('button');
            closeBtn.className = 'text-gray-400 hover:text-gray-600';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.addEventListener('click', Modal.hide);

            header.append(titleEl, closeBtn);
            wrapper.append(header);

            const body = document.createElement('div');
            if (typeof content === 'string') {
                body.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                body.appendChild(content);
            }
            wrapper.append(body);

            if (primaryAction || secondaryAction) {
                const footer = document.createElement('div');
                footer.className = 'modal-actions';
                if (secondaryAction) {
                    const secondaryBtn = document.createElement('button');
                    secondaryBtn.className = 'px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100';
                    secondaryBtn.textContent = secondaryAction.label;
                    secondaryBtn.addEventListener('click', secondaryAction.onClick || Modal.hide);
                    footer.appendChild(secondaryBtn);
                }
                if (primaryAction) {
                    const primaryBtn = document.createElement('button');
                    primaryBtn.className = 'px-4 py-2 rounded-lg bg-lds-blue text-white hover:bg-lds-light-blue';
                    primaryBtn.textContent = primaryAction.label;
                    primaryBtn.addEventListener('click', primaryAction.onClick);
                    footer.appendChild(primaryBtn);
                }
                wrapper.append(footer);
            }

            modalContainer.innerHTML = '';
            modalContainer.appendChild(wrapper);
            modalContainer.classList.remove('hidden');
            modalContainer.addEventListener(
                'click',
                (event) => {
                    if (event.target === modalContainer) {
                        Modal.hide();
                    }
                },
                { once: true }
            );
        },
        hide() {
            modalContainer.classList.add('hidden');
            modalContainer.innerHTML = '';
        },
    };

    const getSectionId = (key) => `${key}-section`;

    const navigation = {
        setActive(sectionKey) {
            const sectionId = getSectionId(sectionKey);
            document.querySelectorAll('.content-section').forEach((section) => {
                if (section.id === sectionId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });

            document.querySelectorAll('.nav-link, .nav-link-mobile').forEach((link) => {
                const isActive = link.dataset.section === sectionKey;
                link.classList.toggle('active', isActive);
                if (link.classList.contains('nav-link-mobile')) {
                    link.classList.toggle('text-white', isActive);
                }
            });
        },
        init() {
            const links = document.querySelectorAll('.nav-link, .nav-link-mobile');
            links.forEach((link) => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const { section } = link.dataset;
                    navigation.setActive(section);
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                });
            });

            const mobileToggle = document.getElementById('mobile-menu-button');
            if (mobileToggle) {
                mobileToggle.addEventListener('click', () => {
                    const menu = document.getElementById('mobile-menu');
                    menu.classList.toggle('hidden');
                });
            }

            navigation.setActive('dashboard');
        },
    };

    const dashboard = {
        updateQuickStats() {
            const activeEvents = AppState.events.filter((event) => event.status !== 'Completed').length;
            const pendingTasks = AppState.tasks.filter((task) => task.status !== 'Completed').length;
            const currentMonth = new Date();
            const monthEvents = AppState.events.filter((event) => {
                const eventDate = new Date(event.start);
                return (
                    eventDate.getMonth() === currentMonth.getMonth() &&
                    eventDate.getFullYear() === currentMonth.getFullYear()
                );
            }).length;

            const activeEventsEl = document.getElementById('active-events-count');
            const pendingTasksEl = document.getElementById('pending-tasks-count');
            const auxCountEl = document.getElementById('active-auxiliaries-count');
            const monthEventsEl = document.getElementById('month-events-count');

            if (activeEventsEl) activeEventsEl.textContent = activeEvents;
            if (pendingTasksEl) pendingTasksEl.textContent = pendingTasks;
            if (auxCountEl) auxCountEl.textContent = AppState.auxiliaries.length;
            if (monthEventsEl) monthEventsEl.textContent = monthEvents;
        },
        renderRecentActivity() {
            const container = document.getElementById('recent-activity');
            if (!container) return;
            container.innerHTML = '';
            const sorted = [...AppState.activityLog].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            sorted.slice(0, 6).forEach((activity) => {
                const item = document.createElement('div');
                item.className = 'flex items-start gap-3';

                const icon = document.createElement('div');
                icon.className = 'timeline-dot bg-lds-blue mt-1';

                const details = document.createElement('div');
                details.className = 'flex-1';

                const title = document.createElement('p');
                title.className = 'text-sm font-semibold text-gray-800';
                title.textContent = activity.category;

                const desc = document.createElement('p');
                desc.className = 'text-sm text-gray-600';
                desc.textContent = activity.description;

                const time = document.createElement('p');
                time.className = 'text-xs text-gray-400 mt-1';
                time.textContent = Utils.formatRelativeTime(activity.createdAt);

                details.append(title, desc, time);
                item.append(icon, details);
                container.appendChild(item);
            });
        },
        renderUpcomingEvents() {
            const container = document.getElementById('upcoming-events');
            if (!container) return;
            container.innerHTML = '';

            const now = new Date();
            const upcoming = AppState.events
                .filter((event) => new Date(event.start) >= new Date(now.setHours(0, 0, 0, 0)))
                .sort((a, b) => new Date(a.start) - new Date(b.start));

            upcoming.slice(0, 5).forEach((event) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'flex justify-between items-start bg-gray-50 rounded-xl px-4 py-3';

                const details = document.createElement('div');
                const title = document.createElement('p');
                title.className = 'font-semibold text-gray-900';
                title.textContent = event.name;

                const meta = document.createElement('p');
                meta.className = 'text-sm text-gray-500';
                meta.textContent = `${Utils.formatDateTime(event.start)} • ${Utils.getAuxiliaryName(event.organizer)}`;

                details.append(title, meta);

                const badge = document.createElement('span');
                badge.className = 'badge bg-blue-100 text-blue-700';
                badge.textContent = event.type;

                wrapper.append(details, badge);
                container.appendChild(wrapper);
            });

            if (!container.children.length) {
                const emptyState = document.createElement('p');
                emptyState.className = 'text-gray-500 text-sm';
                emptyState.textContent = 'No upcoming events scheduled. Create one to get started!';
                container.appendChild(emptyState);
            }
        },
    };

    const notifications = {
        updateBadge() {
            const badge = document.getElementById('notification-badge');
            if (!badge) return;
            const unread = AppState.notifications.filter((note) => note.status === 'Unread').length;
            if (unread > 0) {
                badge.textContent = unread;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        },
    };

    const App = {
        addEvent(event) {
            AppState.events.push(event);
            App.addActivity({
                category: 'Event Added',
                description: `${event.name} created by ${Utils.getAuxiliaryName(event.organizer)}.`,
            });
            App.addNotification({
                type: 'Event Reminder',
                status: 'Unread',
                message: `${event.name} scheduled for ${Utils.formatDateTime(event.start)}.`,
                relatedEventId: event.id,
            });
            App.refreshAll();
            if (window.EventsModule) window.EventsModule.render();
            if (window.TasksModule) window.TasksModule.refreshFilters();
            if (window.CalendarModule) window.CalendarModule.render();
        },
        addAuxiliary(auxiliary) {
            AppState.auxiliaries.push(auxiliary);
            App.addActivity({
                category: 'Auxiliary Update',
                description: `${auxiliary.name} presidency details refreshed.`,
            });
            dashboard.updateQuickStats();
            if (window.EventsModule) window.EventsModule.populateOrganizerFilter();
            if (window.TasksModule) window.TasksModule.refreshFilters();
            if (window.AuxiliaryModule) window.AuxiliaryModule.render();
        },
        addTask(task) {
            AppState.tasks.push(task);
            App.addActivity({
                category: 'Task Added',
                description: `${task.title} assigned to ${Utils.getAuxiliaryName(task.auxiliaryId)}.`,
            });
            App.addNotification({
                type: 'Task Assigned',
                status: 'Unread',
                message: `${task.title} assigned to ${task.owner}.`,
                relatedTaskId: task.id,
            });
            if (window.TasksModule) window.TasksModule.render();
            dashboard.updateQuickStats();
            if (window.EventsModule) window.EventsModule.render();
            if (window.CalendarModule) window.CalendarModule.render();
        },
        updateTaskStatus(taskId, status) {
            const task = AppState.tasks.find((item) => item.id === taskId);
            if (!task) return;
            task.status = status;
            App.addActivity({
                category: 'Task Update',
                description: `${task.title} marked as ${status.toLowerCase()}.`,
            });
            if (status === 'Completed') {
                App.addNotification({
                    type: 'Task Completed',
                    status: 'Unread',
                    message: `${task.title} has been completed.`,
                    relatedTaskId: task.id,
                });
            }
            if (window.TasksModule) window.TasksModule.render();
            dashboard.updateQuickStats();
            if (window.EventsModule) window.EventsModule.render();
        },
        addNotification(notification) {
            AppState.notifications.unshift({
                id: Utils.generateId('note'),
                createdAt: new Date().toISOString(),
                ...notification,
            });
            notifications.updateBadge();
            if (window.NotificationsModule) window.NotificationsModule.render();
        },
        addActivity(activity) {
            AppState.activityLog.unshift({
                id: Utils.generateId('activity'),
                createdAt: new Date().toISOString(),
                ...activity,
            });
            dashboard.renderRecentActivity();
        },
        refreshAll() {
            dashboard.updateQuickStats();
            dashboard.renderUpcomingEvents();
            notifications.updateBadge();
            dashboard.renderRecentActivity();
        },
    };

    document.addEventListener('DOMContentLoaded', () => {
        navigation.init();
        dashboard.updateQuickStats();
        dashboard.renderRecentActivity();
        dashboard.renderUpcomingEvents();
        notifications.updateBadge();

        if (window.EventsModule) window.EventsModule.init();
        if (window.AuxiliaryModule) window.AuxiliaryModule.init();
        if (window.TasksModule) window.TasksModule.init();
        if (window.CalendarModule) window.CalendarModule.init();
        if (window.NotificationsModule) window.NotificationsModule.init();
    });

    window.AppState = AppState;
    window.Utils = Utils;
    window.Modal = Modal;
    window.App = App;
})();
