document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  let baby = JSON.parse(localStorage.getItem("baby"));

  if (!baby) {
    createProfile();
  } else {
    loadDashboard(baby);
    checkVaccineAlerts();
  }
}

// ==========================
// PERFIL
// ==========================
function createProfile() {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h2>Crear Perfil</h2>
    <input id="name" placeholder="Nombre">
    <input id="birthdate" type="date">
    <button onclick="saveProfile()">Guardar</button>
  `;
}

function saveProfile() {
  const baby = {
    name: document.getElementById("name").value,
    birthdate: document.getElementById("birthdate").value,
    vaccinesDone: [],
    medical: [],
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
// EDAD
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

  return `Edad: ${years}a ${months}m ${days}d`;
}

// ==========================
// CALCULAR VACUNAS
// ==========================
function getVaccineStatus(birthdate, doneList) {
  const now = new Date();
  const birth = new Date(birthdate);

  return vaccineSchedule.map((v, index) => {
    let dueDate = new Date(birth);
    dueDate.setMonth(dueDate.getMonth() + v.months);

    let status = "pending";

    if (doneList.includes(index)) {
      status = "done";
    } else if (now >= dueDate) {
      const diffDays = (now - dueDate) / (1000 * 60 * 60 * 24);

      if (diffDays > 30) {
        status = "late";
      } else {
        status = "due";
      }
    }

    return {
      ...v,
      dueDate,
      status,
      index
    };
  });
}

// ==========================
// VACUNAS UI
// ==========================
function showVaccines() {
  const content = document.getElementById("content");
  const baby = JSON.parse(localStorage.getItem("baby"));

  const vaccines = getVaccineStatus(
    baby.birthdate,
    baby.vaccinesDone || []
  );

  let html = "<h2>Calendario de Vacunas</h2>";

  vaccines.forEach(v => {
    let color = "#ccc";
    if (v.status === "due") color = "orange";
    if (v.status === "late") color = "red";
    if (v.status === "done") color = "green";

    html += `
      <div style="border-left:5px solid ${color}; padding:10px; margin-bottom:10px;">
        <strong>${v.name}</strong><br>
        Fecha: ${v.dueDate.toLocaleDateString()}<br>
        Estado: ${v.status}
        <br>
        ${v.status !== "done" ? `<button onclick="markVaccineDone(${v.index})">✔ Aplicada</button>` : ""}
      </div>
    `;
  });

  content.innerHTML = html;
}

// ==========================
// MARCAR VACUNA
// ==========================
function markVaccineDone(index) {
  let baby = JSON.parse(localStorage.getItem("baby"));

  if (!baby.vaccinesDone.includes(index)) {
    baby.vaccinesDone.push(index);
  }

  localStorage.setItem("baby", JSON.stringify(baby));
  showVaccines();
}

// ==========================
// ALERTAS
// ==========================
function checkVaccineAlerts() {
  const baby = JSON.parse(localStorage.getItem("baby"));
  if (!baby) return;

  const vaccines = getVaccineStatus(
    baby.birthdate,
    baby.vaccinesDone || []
  );

  let alerts = [];

  vaccines.forEach(v => {
    if (v.status === "due") {
      alerts.push(`💉 Hoy corresponde: ${v.name}`);
    }
    if (v.status === "late") {
      alerts.push(`⚠ Atrasada: ${v.name}`);
    }
  });

  showAlerts(alerts);
}

// ==========================
// UI ALERTAS
// ==========================
function showAlerts(alerts) {
  if (alerts.length === 0) return;

  const box = document.createElement("div");

  box.style.position = "fixed";
  box.style.bottom = "10px";
  box.style.right = "10px";
  box.style.background = "white";
  box.style.padding = "15px";
  box.style.borderRadius = "10px";
  box.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";

  alerts.forEach(a => {
    const p = document.createElement("p");
    p.innerText = a;
    box.appendChild(p);
  });

  document.body.appendChild(box);

  setTimeout(() => box.remove(), 6000);
}

// ==========================
// NAVEGACIÓN
// ==========================
function openSection(section) {
  if (section === "vaccines") showVaccines();
}
