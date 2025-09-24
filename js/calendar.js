(function () {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const typeStyles = {
        'Ward Activity': 'calendar-event bg-lds-blue text-white',
        'Stake Activity': 'calendar-event bg-green-100 text-green-700',
        'Youth Activity': 'calendar-event bg-purple-100 text-purple-700',
        'Relief Society': 'calendar-event bg-pink-100 text-pink-700',
        'Elders Quorum': 'calendar-event bg-sky-100 text-sky-700',
        Primary: 'calendar-event bg-amber-100 text-amber-700',
    };

    let currentDate = new Date();
    let currentView = 'month';

    const startOfWeek = (date) => {
        const clone = new Date(date);
        const day = clone.getDay();
        clone.setDate(clone.getDate() - day);
        clone.setHours(0, 0, 0, 0);
        return clone;
    };

    const isSameDay = (dateA, dateB) => {
        const a = new Date(dateA);
        const b = new Date(dateB);
        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        );
    };

    const getEventsForDay = (date) => {
        return window.AppState.events.filter((event) => isSameDay(event.start, date));
    };

    const getTypeClass = (type) => typeStyles[type] || 'calendar-event bg-gray-100 text-gray-700';

    const renderDayHeader = (container) => {
        const headerRow = document.createElement('div');
        headerRow.className = 'grid grid-cols-7 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wide';
        dayNames.forEach((day) => {
            const cell = document.createElement('div');
            cell.className = 'px-3 py-2 text-center';
            cell.textContent = day;
            headerRow.appendChild(cell);
        });
        container.appendChild(headerRow);
    };

    const renderMonthView = (container) => {
        container.innerHTML = '';
        renderDayHeader(container);

        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const gridStart = startOfWeek(monthStart);
        const today = new Date();

        for (let week = 0; week < 6; week++) {
            const row = document.createElement('div');
            row.className = 'grid grid-cols-7 border-b border-gray-200';

            for (let day = 0; day < 7; day++) {
                const cellDate = new Date(gridStart);
                cellDate.setDate(gridStart.getDate() + week * 7 + day);

                const cell = document.createElement('div');
                cell.className = 'calendar-cell';
                if (cellDate.getMonth() !== currentDate.getMonth()) {
                    cell.classList.add('bg-gray-50', 'text-gray-400');
                }

                const number = document.createElement('div');
                number.className = 'day-number text-sm flex items-center justify-between';
                number.textContent = cellDate.getDate();

                if (isSameDay(cellDate, today)) {
                    const badge = document.createElement('span');
                    badge.className = 'badge bg-lds-blue text-white';
                    badge.textContent = 'Today';
                    number.appendChild(badge);
                }

                cell.appendChild(number);

                const events = getEventsForDay(cellDate);
                events.forEach((event) => {
                    const tag = document.createElement('span');
                    tag.className = getTypeClass(event.type);
                    tag.textContent = `${window.Utils.formatTime(event.start)} ${event.name}`;
                    cell.appendChild(tag);
                });

                row.appendChild(cell);
            }

            container.appendChild(row);
        }
    };

    const renderWeekView = (container) => {
        container.innerHTML = '';
        const weekStart = startOfWeek(currentDate);
        const today = new Date();

        const wrapper = document.createElement('div');
        wrapper.className = 'grid grid-cols-1 md:grid-cols-7 border border-gray-200 rounded-lg overflow-hidden';

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(weekStart.getDate() + i);

            const column = document.createElement('div');
            column.className = 'border-b md:border-b-0 md:border-l border-gray-200 p-4';

            const header = document.createElement('div');
            header.className = 'flex items-center justify-between mb-3';
            const title = document.createElement('p');
            title.className = 'font-semibold text-gray-800';
            title.textContent = `${dayNames[i]} ${window.Utils.formatDate(dayDate, { day: 'numeric', month: 'short' })}`;
            header.appendChild(title);

            if (isSameDay(dayDate, today)) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-lds-blue text-white';
                badge.textContent = 'Today';
                header.appendChild(badge);
            }
            column.appendChild(header);

            const events = getEventsForDay(dayDate);
            if (!events.length) {
                const empty = document.createElement('p');
                empty.className = 'text-xs text-gray-400';
                empty.textContent = 'No events';
                column.appendChild(empty);
            } else {
                events
                    .sort((a, b) => new Date(a.start) - new Date(b.start))
                    .forEach((event) => {
                        const card = document.createElement('div');
                        card.className = 'bg-white rounded-xl shadow p-3 mb-3 border border-gray-100';
                        const titleEl = document.createElement('p');
                        titleEl.className = 'font-semibold text-sm text-gray-900';
                        titleEl.textContent = event.name;
                        const meta = document.createElement('p');
                        meta.className = 'text-xs text-gray-500 mt-1';
                        meta.textContent = `${window.Utils.formatTime(event.start)} • ${window.Utils.getAuxiliaryName(
                            event.organizer
                        )}`;
                        card.append(titleEl, meta);
                        column.appendChild(card);
                    });
            }

            wrapper.appendChild(column);
        }

        container.appendChild(wrapper);
    };

    const renderAgendaView = (container) => {
        container.innerHTML = '';
        const start = startOfWeek(currentDate);
        const upcoming = window.AppState.events
            .slice()
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .filter((event) => new Date(event.start) >= start)
            .slice(0, 12);

        if (!upcoming.length) {
            const empty = document.createElement('div');
            empty.className = 'p-8 text-center text-gray-500';
            empty.textContent = 'No upcoming events in this timeframe. Add something inspiring!';
            container.appendChild(empty);
            return;
        }

        const list = document.createElement('div');
        list.className = 'divide-y divide-gray-200 bg-white';

        upcoming.forEach((event) => {
            const item = document.createElement('div');
            item.className = 'p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3';

            const left = document.createElement('div');
            left.innerHTML = `
                <p class="text-sm font-semibold text-gray-900">${window.Utils.escapeHtml(event.name)}</p>
                <p class="text-xs text-gray-500">${window.Utils.formatDateTime(event.start)} • ${window.Utils.escapeHtml(
                window.Utils.getAuxiliaryName(event.organizer)
            )}</p>
            `;

            const badge = document.createElement('span');
            badge.className = getTypeClass(event.type);
            badge.textContent = event.type;

            item.append(left, badge);
            list.appendChild(item);
        });

        container.appendChild(list);
    };

    const updateHeader = () => {
        const header = document.getElementById('calendar-month-year');
        if (!header) return;
        if (currentView === 'month') {
            header.textContent = window.Utils.formatMonthYear(currentDate);
        } else if (currentView === 'week') {
            const start = startOfWeek(currentDate);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            header.textContent = `${window.Utils.formatDate(start)} - ${window.Utils.formatDate(end)}`;
        } else {
            header.textContent = 'Upcoming Agenda';
        }
    };

    const render = () => {
        const container = document.getElementById('calendar-container');
        if (!container) return;
        updateHeader();
        if (currentView === 'month') {
            renderMonthView(container);
        } else if (currentView === 'week') {
            renderWeekView(container);
        } else {
            renderAgendaView(container);
        }
    };

    const adjustDate = (direction) => {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + direction);
        } else {
            currentDate.setDate(currentDate.getDate() + direction * 7);
        }
        render();
    };

    const init = () => {
        const prev = document.getElementById('calendar-prev');
        const next = document.getElementById('calendar-next');
        const todayBtn = document.getElementById('calendar-today');
        const viewSelect = document.getElementById('calendar-view');

        if (prev) prev.addEventListener('click', () => adjustDate(-1));
        if (next) next.addEventListener('click', () => adjustDate(1));
        if (todayBtn)
            todayBtn.addEventListener('click', () => {
                currentDate = new Date();
                render();
            });
        if (viewSelect)
            viewSelect.addEventListener('change', (event) => {
                currentView = event.target.value;
                render();
            });

        render();
    };

    window.CalendarModule = {
        init,
        render,
    };
})();
