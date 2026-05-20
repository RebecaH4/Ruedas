
const API_BASE = 'http://localhost:5000';
const API_RUEDAS = `${API_BASE}/ruedas`;
const ruedasForm = document.getElementById('ruedas-form');
const ruedasResultado = document.getElementById('ruedas-resultado');
const limpiarRuedasBtn = document.getElementById('limpiar-ruedas-btn');

function limpiarRuedasFormulario() {
    ruedasForm.reset();
    ruedasResultado.innerHTML = '';
}

function renderRuedasResultado(data) {
    if (!data || !Array.isArray(data.asignacion)) {
        ruedasResultado.innerHTML = '<div class="message error">No se pudo calcular la asignación.</div>';
        return;
    }
    let html = `<div class="message ok">Costo total óptimo: <b>$${data.costo_total}</b><br>Heurística admisible: <b>$${data.heuristica_admisible}</b></div>`;
    html += '<table style="width:100%;margin-top:10px;border-collapse:collapse;background:#f7f9f4;"><thead><tr><th>Empresa</th><th>Tipo</th><th>Precio</th></tr></thead><tbody>';
    for (const fila of data.asignacion) {
        html += `<tr><td>${fila.empresa}</td><td>${fila.tipo}</td><td>$${fila.precio}</td></tr>`;
    }
    html += '</tbody></table>';
    ruedasResultado.innerHTML = html;
}

async function calcularRuedas(event) {
    event.preventDefault();
    const campos = ['e1t','e1h','e1v','e1w','e2t','e2h','e2v','e2w','e3t','e3h','e3v','e3w','e4t','e4h','e4v','e4w'];
    const precios = [[],[],[],[]];
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            const val = ruedasForm.elements[campos[i*4+j]].value;
            const num = Number(val);
            if (!val || isNaN(num) || num < 0) {
                ruedasResultado.innerHTML = '<div class="message error">Completa todos los precios con valores válidos.</div>';
                return;
            }
            precios[i][j] = num;
        }
    }
    ruedasResultado.innerHTML = '<div class="message">Calculando...</div>';
    try {
        const resp = await fetch(API_RUEDAS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ precios })
        });
        const data = await resp.json();
        if (!resp.ok) {
            ruedasResultado.innerHTML = `<div class="message error">${data.error || 'Error al calcular.'}</div>`;
            return;
        }
        renderRuedasResultado(data);
    } catch (e) {
        ruedasResultado.innerHTML = '<div class="message error">No se pudo conectar al servidor.</div>';
    }
}

if (ruedasForm) {
    ruedasForm.addEventListener('submit', calcularRuedas);
}
if (limpiarRuedasBtn) {
    limpiarRuedasBtn.addEventListener('click', limpiarRuedasFormulario);
}

