const API_URL = 'http://localhost:3000/area';

const rol = sessionStorage.getItem("rol")
const rolesPermitidos = ['Admin', 'Secretaria'];
if (!rol || !rolesPermitidos.includes(rol)) window.location.href = '/';

async function cargarAreas() {
    try {
        const respuesta = await fetch(API_URL);
            if (!respuesta.ok) throw new Error('Error al obtener las áreas');
                
        const areas = await respuesta.json(); 
                
        const container = document.getElementById('areas-container');
        container.innerHTML = ''; 
 
        areas.forEach(area => {
            const itemHTML = `
                <li class="area-item" data-id="${area.id}">
                    <div class="area-info">
                        <span class="area-name">${area.nombre}</span>
                        <span class="area-details">${area.descripcion || 'Sin descripción'}</span>
                    </div>
                    <div style="display:flex; gap:8px; align-items:center;">
                        <button class="btn-add" onclick="toggleTurnos(${area.id}, this)" style="font-size:13px; padding:6px 12px;">
                            <span class="material-icons-round">schedule</span> Ver turnos
                        </button>
                        <button class="btn-delete" title="Eliminar Área" onclick="eliminarAreaDeBD(${area.id}, this)">
                            <span class="material-icons-round">delete</span>
                        </button>
                    </div>
                    <div class="turnos-container" id="turnos-${area.id}" style="display: none; width:100%; margin-top:1rem;"></div>
                </li>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });

        actualizarContadorYVistas();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('area-count').textContent = "Error";
    }
}

async function eliminarAreaDeBD(id, boton) {
    if (!confirm('¿Estás seguro de eliminar esta área?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            const filaArea = boton.closest('.area-item');
            filaArea.classList.add('fade-out');

            setTimeout(() => {
                filaArea.remove();
                actualizarContadorYVistas();
            }, 300);
            alert("Se elimino el área exitosamente");
        } else {
            alert('No se pudo eliminar el área del servidor.');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Hubo un problema de conexión.');
    }
}

function actualizarContadorYVistas() {
    const container = document.getElementById('areas-container');
    const contador = document.getElementById('area-count');
    const mensajeVacio = document.getElementById('empty-message');
            
    const totalAreas = container.children.length;
    contador.textContent = totalAreas === 1 ? '1 Área' : `${totalAreas} Áreas`;

    if (totalAreas === 0) {
        contador.style.display = 'none';
        mensajeVacio.style.display = 'block';
    } else {
        contador.style.display = 'block';
        mensajeVacio.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', cargarAreas);

async function toggleTurnos(idArea, boton) {
    const contenedor = document.getElementById(`turnos-${idArea}`);
    if(contenedor.style.display !== 'none') {
        contenedor.style.display = 'none';
        boton.innerHTML = '<span class="material-icons-round">schedule</span> Ver turnos';
        return;
    }
    boton.innerHTML = '<span class="material-icons-round">schedule</span> Ocultar turnos';
    contenedor.style.display = 'block';
    await cargarTurnosDeArea(idArea);
}

async function cargarTurnosDeArea(idArea){
    const contenedor = document.getElementById(`turnos-${idArea}`);
    contenedor.innerHTML = '<p style="color:#888; font-size:0.9rem;">Cargando turnos...</p>';

    try {
        const idUsuario = sessionStorage.getItem('idUsuario') || 0
        const res = await fetch(`http://localhost:3000/turnos/area/${idArea}`);
        const turnos = await res.json();

        let html = `
            <div style="border-top: 1px solid #eee; padding-top: 1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
                    <strong style="font-size:0.95rem;" >Turnos registrados</strong>
                    <button onclick="mostrarFormularioCrearTurno(${idArea})"
                        style="background:#2a9d8f; color:white; border:none; border-radius:8px; padding:0.4rem 0.8rem; cursor:pointer; font-size:0.85rem;">
                        + Agregar turno
                    </button>
                </div>
        `;

        if(turnos.length === 0){
            html += `<p style="color:#888; font-size:0.9rem;">No hay turnos registrados para esta área.</p>`;
        }else{
            html += `<table style="width:100%; border-collapse: collapse; font-size:0.9rem;">`;
            html += `
                <tr style="background:#f5f5f5;">
                    <th style="padding:0.5rem; text-align:left;">Fecha</th>
                    <th style="padding:0.5rem; text-align:left;">Horario</th>
                    <th style="padding:0.5rem; text-align:left;">Precio</th>
                    <th style="padding:0.5rem; text-align:left;">Cupos</th>
                    <th style="padding:0.5rem; text-align:left;"></th>
                </tr>
            `;
            turnos.forEach(turno => {
                html += `
                    <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:0.5rem;">${turno.fecha_turno}</td>
                        <td style="padding:0.5rem;">${turno.hora_comienzo} - ${turno.hora_fin}</td>
                        <td style="padding:0.5rem;">$${turno.precio}</td>
                        <td style="padding:0.5rem;">${turno.cupos_ocupados}/${turno.cupo_maximo}</td>
                        <td style="padding:0.5rem;">
                            <button onclick="eliminarTurno(${turno.id}, ${idArea})"
                                style="background:transparent; border:1px solid transparent; color:#7f8c8d; cursor:pointer; padding:6px; border-radius:8px; display:flex; align-items:center; transition: all 0.2s ease;"
                                onmouseover="this.style.background='#ffebee'; this.style.color='#e63946'; this.style.borderColor='#ffcdd2'"
                                onmouseout="this.style.background='transparent'; this.style.color='#7f8c8d'; this.style.borderColor='transparent'">
                                <span class="material-icons-round" style="font-size:18px;">delete</span>
                            </button>
                        </td>
                    </tr>
                `;
            })
            html += `</table>`;
        }

        html += '<div id="form-turno-' + idArea + '" style="margin-top:1rem;"></div>'
        html += `</div>`;
        contenedor.innerHTML = html;

    }catch(error){
        contenedor.innerHTML = '<p style="color:red; font-size:0.9rem;">Error al cargar los turnos.</p>';
    }
}

function mostrarFormularioCrearTurno(idArea){

    const formDiv = document.getElementById(`form-turno-${idArea}`);
    formDiv.innerHTML = `
        <div style="background:#f9f9f9; border-radius:10px; padding:1rem; margin-top:0.5rem;">
            <h6 style="margin-bottom:1rem;">Nuevo turno</h6>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
                <div>
                    <label style="font-size:0.85rem; color:#666;">Fecha</label>
                    <input id="turno-fecha-${idArea}" type="date" 
                           style="width:100%; padding:0.4rem; border:1px solid #ccc; border-radius:6px; margin-top:0.2rem;">
                </div>
                <div>
                    <label style="font-size:0.85rem; color:#666;">Precio</label>
                    <input id="turno-precio-${idArea}" type="number" placeholder="Ej: 3000"
                           style="width:100%; padding:0.4rem; border:1px solid #ccc; border-radius:6px; margin-top:0.2rem;">
                </div>
                <div>
                    <label style="font-size:0.85rem; color:#666;">Hora inicio</label>
                    <input id="turno-inicio-${idArea}" type="time"
                           style="width:100%; padding:0.4rem; border:1px solid #ccc; border-radius:6px; margin-top:0.2rem;">
                </div>
                <div>
                    <label style="font-size:0.85rem; color:#666;">Hora fin</label>
                    <input id="turno-fin-${idArea}" type="time"
                           style="width:100%; padding:0.4rem; border:1px solid #ccc; border-radius:6px; margin-top:0.2rem;">
                </div>
                <div>
                    <label style="font-size:0.85rem; color:#666;">Cupo máximo</label>
                    <input id="turno-cupo-${idArea}" type="number" placeholder="Ej: 5"
                           style="width:100%; padding:0.4rem; border:1px solid #ccc; border-radius:6px; margin-top:0.2rem;">
                </div>
            </div>

            <p id="turno-mensaje-${idArea}" style="display:none; font-size:0.85rem; margin-top:0.75rem;"></p>

            <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                <button onclick="guardarTurno(${idArea})"
                        style="background:#2a9d8f; color:white; border:none; border-radius:8px; padding:0.5rem 1rem; cursor:pointer; font-size:0.85rem;">
                    Generar turno
                </button>
                <button onclick="document.getElementById('form-turno-${idArea}').innerHTML=''"
                        style="background:#eee; border:none; border-radius:8px; padding:0.5rem 1rem; cursor:pointer; font-size:0.85rem;">
                    Cancelar
                </button>
            </div>
        </div>
    `;
}

async function guardarTurno(idArea) {
    const fecha_turno = document.getElementById(`turno-fecha-${idArea}`).value
    const hora_comienzo = document.getElementById(`turno-inicio-${idArea}`).value
    const hora_fin = document.getElementById(`turno-fin-${idArea}`).value
    const precio = document.getElementById(`turno-precio-${idArea}`).value
    const cupo_maximo = document.getElementById(`turno-cupo-${idArea}`).value
    const mensajeEl = document.getElementById(`turno-mensaje-${idArea}`)

    try{
        const response = await fetch('http://localhost:3000/turnos/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fecha_turno, hora_comienzo, hora_fin, precio, cupo_maximo, idArea })
        })
        const data = await response.json();

        mensajeEl.style.display = 'block';
        if(data.ok){
            mensajeEl.style.color = 'green';
            mensajeEl.textContent = data.mensaje;
            setTimeout(() => cargarTurnosDeArea(idArea), 1200);
        }else{
            mensajeEl.style.color = 'red';
            mensajeEl.textContent = data.mensaje;
        }

    }catch(error){
        mensajeEl.style.display = 'block';
        mensajeEl.style.color = 'red';
        mensajeEl.textContent = 'Error al conectar con el servidor';
    }
}

async function eliminarTurno(idTurno, idArea) {
    if(!confirm('¿Estás seguro que querés eliminar este turno?')) return

    try{
        const response = await fetch(`http://localhost:3000/turnos/eliminar/${idTurno}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if(data.ok){
            alert(data.mensaje)
            await cargarTurnosDeArea(idArea)
        }else{
            alert(data.mensaje)
        }

    }catch(error){
        alert('Error al conectar con el servidor.')
    }
}