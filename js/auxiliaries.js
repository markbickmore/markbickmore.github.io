(function () {
    const createAuxiliaryCard = (aux) => {
        const leaders = aux.leaders.join(', ');
        const strengths = (aux.strengths || []).map((item) => `
            <span class="badge bg-lds-blue/10 text-lds-blue">${window.Utils.escapeHtml(item)}</span>
        `).join('');

        return `
            <section class="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
                <header>
                    <h3 class="text-xl font-semibold text-gray-900">${window.Utils.escapeHtml(aux.name)}</h3>
                    <p class="text-sm text-gray-500">${window.Utils.escapeHtml(aux.focus)}</p>
                </header>
                <div class="flex flex-wrap gap-3 items-center text-sm text-gray-600">
                    <span><i class="fas fa-user-circle text-lds-gold mr-2"></i>${window.Utils.escapeHtml(leaders)}</span>
                    <span><i class="fas fa-envelope text-lds-gold mr-2"></i>${window.Utils.escapeHtml(aux.contact)}</span>
                </div>
                <div class="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                    <p><i class="fas fa-calendar-week text-lds-gold mr-2"></i>${window.Utils.escapeHtml(aux.meeting)}</p>
                    <p class="mt-2"><i class="fas fa-star text-lds-gold mr-2"></i>Next focus: ${window.Utils.escapeHtml(aux.upcoming)}</p>
                </div>
                <footer class="flex flex-wrap gap-2">${strengths}</footer>
            </section>
        `;
    };

    const render = () => {
        const grid = document.getElementById('auxiliaries-grid');
        if (!grid) return;
        grid.innerHTML = window.AppState.auxiliaries.map(createAuxiliaryCard).join('');
    };

    const showAuxiliaryForm = () => {
        const form = document.createElement('form');
        form.className = 'space-y-4';
        form.innerHTML = `
            <div class="form-grid">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Auxiliary Name</label>
                    <input name="name" type="text" required placeholder="Auxiliary or committee" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Primary Leader(s)</label>
                    <input name="leaders" type="text" required placeholder="Separated by commas" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input name="contact" type="email" required placeholder="council@example.com" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Meeting Schedule</label>
                    <input name="meeting" type="text" required placeholder="e.g., 1st Tuesday @ 7:00 PM" />
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Primary Focus</label>
                <input name="focus" type="text" required placeholder="How does this auxiliary bless the ward?" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Next Initiative</label>
                <input name="upcoming" type="text" placeholder="Upcoming emphasis or event" />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Strengths / Resources</label>
                <input name="strengths" type="text" placeholder="Separate each strength with a comma" />
            </div>
        `;

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = new FormData(form);
            const newAuxiliary = {
                id: window.Utils.generateId('aux'),
                name: data.get('name').trim(),
                leaders: data.get('leaders').split(',').map((name) => name.trim()).filter(Boolean),
                contact: data.get('contact').trim(),
                meeting: data.get('meeting').trim(),
                focus: data.get('focus').trim(),
                upcoming: data.get('upcoming').trim(),
                strengths: data
                    .get('strengths')
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
            };
            window.App.addAuxiliary(newAuxiliary);
            render();
            window.Modal.hide();
        });

        window.Modal.show({
            title: 'Add Auxiliary or Committee',
            content: form,
            primaryAction: {
                label: 'Save Auxiliary',
                onClick: () => form.requestSubmit(),
            },
            secondaryAction: {
                label: 'Cancel',
                onClick: window.Modal.hide,
            },
        });
    };

    const init = () => {
        render();
    };

    window.AuxiliaryModule = {
        init,
        render,
        showAuxiliaryForm,
    };
    window.auxiliaryManager = window.AuxiliaryModule;
})();
