// ==========================
// INIT
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  let baby = JSON.parse(localStorage.getItem("baby"));

  if (!baby) {
    createProfile();
  } else {
    loadDashboard(baby);
  }
}

// ==========================
// CREAR PERFIL
// ==========================
function createProfile() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Crear Perfil</h2>
    <input id="name" placeholder="Nombre del bebé">
    <input id="birthdate" type="date">
    <input id="weight" placeholder="Peso al nacer (kg)">
    <button onclick="saveProfile()">Guardar</button>
  `;
}

function saveProfile() {
  const baby = {
    name: document.getElementById("name").value,
    birthdate: document.getElementById("birthdate").value,
    weight: document.getElementById("weight").value,
    medical: [],
    reminders: [],
    growth: []
  };

  localStorage.setItem("baby", JSON.stringify(baby));
  location.reload();
}

// ==========================
// DASHBOARD
// ==========================
function loadDashboard(baby) {
  document.getElementById("babyName").innerText = baby.name;
  document.getElementById("babyAge").innerText = calculateAge(baby.birthdate);
}

// ==========================
// CALCULAR EDAD
// ==========================
function calculateAge(date) {
  const birth = new Date(date);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += 30;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `Edad: ${years} años, ${months} meses, ${days} días`;
}

// ==========================
// NAVEGACIÓN
// ==========================
function openSection(section) {
  switch(section) {
    case "profile":
      showProfile();
      break;
    case "vaccines":
      showVaccines();
      break;
    case "reminders":
      showReminders();
      break;
    case "medical":
      showMedical();
      break;
    case "growth":
      showGrowth();
      break;
    case "tips":
      showTips();
      break;
  }
}

// ==========================
// VACUNAS
// ==========================
function showVaccines() {
  const content = document.getElementById("content");

  let html = "<h2>Vacunas</h2>";

  vaccines.forEach((v, i) => {
    html += `
      <div>
        <input type="checkbox" onclick="toggleVaccine(${i})">
        ${v.name} (Mes ${v.age})
      </div>
    `;
  });

  content.innerHTML = html;
}

function toggleVaccine(i) {
  vaccines[i].done = !vaccines[i].done;
}

// ==========================
// RECORDATORIOS
// ==========================
function showReminders() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Recordatorios</h2>
    <input id="reminderText" placeholder="Ej: Turno pediatra">
    <button onclick="addReminder()">Agregar</button>
    <div id="reminderList"></div>
  `;
}

function addReminder() {
  let baby = JSON.parse(localStorage.getItem("baby"));

  const text = document.getElementById("reminderText").value;

  baby.reminders.push({ text, date: new Date() });

  localStorage.setItem("baby", JSON.stringify(baby));

  showReminders();
}

// ==========================
// HISTORIAL MÉDICO
// ==========================
function showMedical() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Historial Médico</h2>
    <textarea id="medicalText"></textarea>
    <button onclick="addMedical()">Guardar</button>
  `;
}

function addMedical() {
  let baby = JSON.parse(localStorage.getItem("baby"));

  const text = document.getElementById("medicalText").value;

  baby.medical.push({ text, date: new Date() });

  localStorage.setItem("baby", JSON.stringify(baby));

  alert("Guardado");
}

// ==========================
// CRECIMIENTO
// ==========================
function showGrowth() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Crecimiento</h2>
    <input id="weightNow" placeholder="Peso actual">
    <button onclick="addGrowth()">Guardar</button>
  `;
}

function addGrowth() {
  let baby = JSON.parse(localStorage.getItem("baby"));

  const weight = document.getElementById("weightNow").value;

  baby.growth.push({ weight, date: new Date() });

  localStorage.setItem("baby", JSON.stringify(baby));
}

// ==========================
// TIPS
// ==========================
function showTips() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Tips</h2>

    <h3>Gases</h3>
    <p>Masajear pancita y mover piernas tipo bicicleta</p>

    <h3>Mocos</h3>
    <p>Usar solución fisiológica</p>

    <h3>Alimentación</h3>
    <p>Lactancia exclusiva hasta 6 meses</p>

    <h3>Higiene</h3>
    <p>Limpieza suave de ojos y cara</p>
  `;
}