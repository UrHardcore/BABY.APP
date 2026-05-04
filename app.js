let babyProfile = JSON.parse(localStorage.getItem('babyProfile')) || null;
let vaccineStatus = JSON.parse(localStorage.getItem('vaccineStatus')) || {};

document.addEventListener('DOMContentLoaded', init);

function init() {
    if (!babyProfile) {
        document.getElementById('setup-screen').classList.remove('hidden');
    } else {
        renderDashboard();
    }
}

function saveProfile() {
    const name = document.getElementById('baby-name-input').value;
    const dob = document.getElementById('baby-dob-input').value;
    if (!name || !dob) return alert("Completa los datos");

    babyProfile = { name, dob };
    localStorage.setItem('babyProfile', JSON.stringify(babyProfile));
    document.getElementById('setup-screen').classList.add('hidden');
    renderDashboard();
}

function calculateAge(dob) {
    const birth = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) { months--; days += 30; }
    if (months < 0) { years--; months += 12; }
    return { years, months, days };
}

function renderDashboard() {
    document.getElementById('main-screen').classList.remove('hidden');
    const age = calculateAge(babyProfile.dob);
    document.getElementById('baby-display-name').innerText = babyProfile.name;
    document.getElementById('baby-display-age').innerText = `${age.years} años, ${age.months} meses, ${age.days} días`;

    const listContainer = document.getElementById('vaccine-list');
    const summaryContainer = document.getElementById('summary-cards');
    listContainer.innerHTML = '';
    summaryContainer.innerHTML = '';

    let dueCount = 0;
    let lateCount = 0;
    const today = new Date();

    VACCINE_CALENDAR.forEach(vac => {
        const dueDate = new Date(babyProfile.dob);
        dueDate.setMonth(dueDate.getMonth() + vac.months);
        
        const isDone = vaccineStatus[vac.id];
        let state = 'pending';
        
        if (isDone) {
            state = 'done';
        } else if (today > dueDate) {
            // Margen de 15 días para considerarla "atrasada" vs "toca hoy"
            const diffDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
            if (diffDays > 30) {
                state = 'late';
                lateCount++;
            } else {
                state = 'due';
                dueCount++;
            }
        }

        const item = document.createElement('div');
        item.className = `vaccine-item state-${state}`;
        item.innerHTML = `
            <div class="vaccine-info">
                <h4>${vac.name}</h4>
                <p>${vac.months === 0 ? 'Nacimiento' : 'A los ' + vac.months + ' meses'}</p>
            </div>
            <button onclick="toggleVaccine(${vac.id})" class="btn-check ${isDone ? 'active' : ''}">
                ${isDone ? '✔' : 'Marcar'}
            </button>
        `;
        listContainer.appendChild(item);
    });

    // Resumen Superior
    if (dueCount > 0) summaryContainer.innerHTML += `<div class="summary-item" style="background:var(--warning)">💉 ${dueCount} por aplicar</div>`;
    if (lateCount > 0) summaryContainer.innerHTML += `<div class="summary-item" style="background:var(--danger)">⚠ ${lateCount} atrasadas</div>`;
    if (dueCount === 0 && lateCount === 0) summaryContainer.innerHTML += `<div class="summary-item" style="background:var(--success); grid-column: 1 / span 2;">✨ Al día</div>`;

    showToasts(dueCount, lateCount);
}

function toggleVaccine(id) {
    vaccineStatus[id] = !vaccineStatus[id];
    localStorage.setItem('vaccineStatus', JSON.stringify(vaccineStatus));
    renderDashboard();
}

function showToasts(due, late) {
    const container = document.getElementById('toast-container');
    container.innerHTML = '';
    if (late > 0) createToast(`¡Atención! Tienes ${late} vacunas atrasadas.`, 4000);
    else if (due > 0) createToast(`Hoy corresponde vacunación.`, 3000);
}

function createToast(msg, time) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    document.getElementById('toast-container').appendChild(t);
    setTimeout(() => t.remove(), time);
}