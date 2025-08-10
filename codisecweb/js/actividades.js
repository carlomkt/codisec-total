// Datos ficticios iniciales (basados en ejemplo ITCA)
let itcaData = [
  {
    linea: "Seguridad Ciudadana",
    actividad: "Reunión interinstitucional GPAI",
    responsable: "Juan Pérez",
    fecha: "2025-08-15",
    programada: 4,
    ejecutada: 3
  },
  {
    linea: "Prevención Escolar",
    actividad: "Capacitación en colegios",
    responsable: "María López",
    fecha: "2025-08-18",
    programada: 5,
    ejecutada: 5
  },
  {
    linea: "Seguridad Vial",
    actividad: "Campaña de señalización",
    responsable: "Carlos Ramírez",
    fecha: "2025-08-20",
    programada: 2,
    ejecutada: 1
  }
];

// Renderizar tabla
function renderTable() {
  const tbody = document.querySelector("#itcaTable tbody");
  tbody.innerHTML = "";
  itcaData.forEach((item, index) => {
    const cumplimiento = item.programada > 0
      ? Math.round((item.ejecutada / item.programada) * 100)
      : 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td contenteditable="true" oninput="updateCell(${index}, 'linea', this.innerText)">${item.linea}</td>
      <td contenteditable="true" oninput="updateCell(${index}, 'actividad', this.innerText)">${item.actividad}</td>
      <td contenteditable="true" oninput="updateCell(${index}, 'responsable', this.innerText)">${item.responsable}</td>
      <td><input type="date" value="${item.fecha}" onchange="updateCell(${index}, 'fecha', this.value)"></td>
      <td><input type="number" value="${item.programada}" min="0" onchange="updateCell(${index}, 'programada', parseInt(this.value))"></td>
      <td><input type="number" value="${item.ejecutada}" min="0" onchange="updateCell(${index}, 'ejecutada', parseInt(this.value))"></td>
      <td style="color:${getColor(cumplimiento)}">${cumplimiento}%</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateCell(index, field, value) {
  itcaData[index][field] = value;
  renderTable();
}

function getColor(porc) {
  if (porc >= 80) return "green";
  if (porc >= 50) return "orange";
  return "red";
}

document.getElementById("addRow").addEventListener("click", () => {
  itcaData.push({
    linea: "",
    actividad: "",
    responsable: "",
    fecha: "",
    programada: 0,
    ejecutada: 0
  });
  renderTable();
});

document.getElementById("generatePDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Informe Trimestral ITCA", 10, 10);

  let y = 20;
  itcaData.forEach(item => {
    const cumplimiento = item.programada > 0
      ? Math.round((item.ejecutada / item.programada) * 100)
      : 0;
    doc.text(
      `${item.linea} - ${item.actividad} | Resp: ${item.responsable} | ${cumplimiento}%`,
      10,
      y
    );
    y += 8;
  });

  doc.save("informe_itca.pdf");
});

// Inicializar
renderTable();
