const API_URL = 'http://localhost:3000/area';
const contenido = document.getElementById("divContenedor");
const botonTurnos = document.getElementById("botonDeTurnos");
const botonHistorialClinico = document.getElementById("historialClinico");

const rol = sessionStorage.getItem('rol');
if (!rol || rol !== 'Kinesiologo') window.location.href = '/';

// === 1. NUEVA FUNCIÓN: Cargar y mostrar los turnos del área seleccionada ===
const cargarTurnosPorArea = async (areaId, areaNombre) => {
    try {
        contenido.innerHTML = `
            <p class="welcome">Turnos: ${areaNombre}</p>
            <p class="subtitle">Consultando la agenda en el servidor...</p>
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        `;

        const respuesta = await fetch(`http://localhost:3000/area/${areaId}/turnos`);
        if (!respuesta.ok) throw new Error('Error al obtener los turnos');
        
        const turnos = await respuesta.json();

        contenido.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <p class="welcome">Turnos: ${areaNombre}</p>
                    <p class="subtitle">Listado de horarios agendados para esta especialidad.</p>
                </div>
                <button class="btn btn-outline-success" id="btnVolverAreas">
                    <i class="ti ti-arrow-left"></i> Volver a Áreas
                </button>
            </div>
            <div id="tabla-turnos-contenedor"></div>
        `;

        document.getElementById("btnVolverAreas").addEventListener("click", cargarAreas);
        const tablaContenedor = document.getElementById("tabla-turnos-contenedor");

        // 📅 1. Obtenemos la fecha de HOY en formato local 'YYYY-MM-DD'
        const hoy = new Date().toLocaleDateString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).split('/').reverse().join('-'); 

        // 🧼 2. FILTRADO: Nos quedamos ESTRICTAMENTE con los turnos que coincidan con hoy
        const turnosDeHoy = turnos.filter(turno => {
            // Aseguramos que si la fecha viene completa con hora de la base de datos, solo comparemos el YYYY-MM-DD
            const fechaLimpia = turno.fecha.includes('T') ? turno.fecha.split('T')[0] : turno.fecha;
            return fechaLimpia === hoy;
        });

        // ⏱️ 3. ORDENADO: Ordenamos por horario para que la jornada se lea de corrido
        turnosDeHoy.sort((a, b) => a.horario.localeCompare(b.horario));

        // 🚨 4. NUEVA VALIDACIÓN: Si después de limpiar no hay nada para hoy, mostramos el aviso
        if (turnosDeHoy.length === 0) {
            tablaContenedor.innerHTML = `
                <div class="alert alert-info" role="alert">
                    No hay turnos registrados para el día de hoy en el área de ${areaNombre}.
                </div>
            `;
            return;
        }

        let tablaHTML = `
            <table class="table table-striped table-hover mt-3 align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Fecha</th>
                        <th>Horario</th>
                        <th>Paciente</th> 
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // 📐 5. Recorremos únicamente el array filtrado 'turnosDeHoy'
        turnosDeHoy.forEach(turno => {
            const estadoBadge = turno.isDisponible 
                ? '<span class="badge bg-success">Disponible</span>' 
                : '<span class="badge bg-danger">Ocupado</span>';

            const pacienteInfo = turno.usuario 
                ? `<strong>${turno.usuario.nombre} ${turno.usuario.apellido}</strong> <br><small class="text-muted">DNI: ${turno.usuario.dni}</small>`
                : '<span class="text-success-emphasis fw-medium">-- Cupo Disponible --</span>';

            // Usamos una variable limpia para mostrar la fecha de forma más amigable si querés
            const fechaAMostrar = turno.fecha.includes('T') ? turno.fecha.split('T')[0] : turno.fecha;

            tablaHTML += `
                <tr>
                    <td><strong>${fechaAMostrar}</strong></td>
                    <td>${turno.horario} hs</td>
                    <td>${pacienteInfo}</td> 
                    <td>${estadoBadge}</td>
                </tr>
            `;
        });

        tablaHTML += `
                </tbody>
            </table>
        `;

        tablaContenedor.innerHTML = tablaHTML;

    } catch (error) {
        console.error('Error al cargar turnos:', error);
        contenido.innerHTML = `
            <p class="welcome">Error</p>
            <div class="alert alert-danger" role="alert">
                No se pudieron cargar los turnos de esta área. Asegurate de tener el endpoint configurado en el backend.
            </div>
            <button class="btn btn-secondary mt-2" onclick="cargarAreas()">Volver a Áreas</button>
        `;
    }
};

// === 2. MODIFICADO: Exponer la función globalmente para que el HTML dinámico la encuentre ===
window.cargarTurnosPorArea = cargarTurnosPorArea;


// Función flecha para cargar y mostrar exclusivamente las áreas de la BD
const cargarAreas = async () => {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al obtener las áreas');  
        const areas = await respuesta.json();

        contenido.innerHTML = `
            <p class="welcome">Áreas de Tratamiento</p>
            <p class="subtitle">Seleccione un área para ver el listado de turnos.</p>
            <div class="cards-grid" id="areas-grid-dinamica"></div>
        `;
        const gridDinamica = document.getElementById('areas-grid-dinamica');

        if (areas.length === 0) {
            gridDinamica.innerHTML = '<p class="text-muted">No hay áreas de tratamiento registradas actualmente.</p>';
            return;
        }

        // === 3. MODIFICADO: Agregamos estilo de cursor y el evento onclick a la tarjeta ===
        areas.forEach(area => {
            const tarjetaHTML = `
                <div class="card" style="cursor: pointer;" onclick="cargarTurnosPorArea(${area.id}, '${area.nombre}')">
                    <div class="card-icon"><i class="ti ti-layers-intersect"></i></div>
                    <p class="card-title">${area.nombre}</p>
                    <p class="card-desc">${area.descripcion || 'Sin descripción disponible.'}</p>
                </div>
            `;
            gridDinamica.insertAdjacentHTML('beforeend', tarjetaHTML);
        });
    } catch (error) {
        console.error('Error:', error);
        contenido.innerHTML = `
            <p class="welcome">Error</p>
            <div class="alert alert-danger" role="alert">
                No se pudieron cargar las áreas. Verificá que el backend esté corriendo en el puerto 3000.
            </div>
        `;
    }
};

//funcion de historial medico
const historialMedico = () => {
    contenido.innerHTML = `
        <p class="welcome">Historial Clínico</p>
        <p class="subtitle">Buscá un paciente por DNI para ver o crear su historial.</p>

        <div style="max-width: 500px; margin-bottom: 1.5rem;">
            <input type="text" id="buscadorDni" placeholder="Ingresá el DNI del paciente..." 
                style="width: 100%; padding: 0.8rem 1.2rem; border: 1px solid #ccc; border-radius: 10px; font-size: 16px; outline: none;">
        </div>

        <div id="resultadoPaciente"></div>
    `

    document.getElementById("buscadorDni").addEventListener("input", async function(){
        const dni = this.value.trim()
        const contenedor = document.getElementById("resultadoPaciente")

        if(dni === ""){
            contenedor.innerHTML = ""
            return
        }

        const res = await fetch(`http://localhost:3000/usuarios/buscar/${dni}`)
        const data = await res.json()

        if(data.length === 0){
            contenedor.innerHTML = `<p style="color: #888;">No se encontraron pacientes con ese DNI.</p>`
            return
        }

        contenedor.innerHTML = ""

        data.forEach(paciente => {
            contenedor.innerHTML += `
                <div style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.2rem; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="font-weight: 500; margin: 0">${paciente.nombre} ${paciente.apellido}</p>
                        <p style="font-size: 13px; color: #888; margin: 0">DNI: ${paciente.dni} · ${paciente.email}</p>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="verHistorial(${paciente.id})" 
                            style="padding: 0.5rem 1rem; background: #2d6a4f; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            Ver historial
                        </button>
                        <button onclick="crearHistorial(${paciente.id}, '${paciente.nombre} ${paciente.apellido}')" 
                            style="padding: 0.5rem 1rem; background: #52b788; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            Crear historial
                        </button>
                    </div>
                </div>
            `
        })
    })
}

window.historialMedico = historialMedico

window.verHistorial = async (idPaciente) => {
    const res = await fetch(`http://localhost:3000/historial/paciente/${idPaciente}`)
    const data = await res.json()

    const contenedor = document.getElementById("resultadoPaciente")

    if(data.length === 0){
        contenedor.innerHTML = `<p style="color: #888;">Este paciente no tiene historiales clínicos.</p>`
        return
    }

    contenedor.innerHTML = data.map(historial => `
        <div style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 1.2rem; margin-bottom: 10px;">
            <p style="font-weight: 500; margin: 0">${historial.titulo}</p>
            <p style="font-size: 13px; color: #888; margin: 0">Fecha: ${historial.fecha}</p>
            <p style="font-size: 13px; color: #2d6a4f; margin: 0">Área: ${historial.area?.nombre ?? "Sin área"}</p>
            <p style="margin-top: 0.5rem;">${historial.diagnostico}</p>
        </div>
    `).join("")
}

window.crearHistorial = (idPaciente, nombrePaciente) => {
    const contenedor = document.getElementById("resultadoPaciente")

    contenedor.innerHTML = `
        <p style="font-weight: 500; margin-bottom: 1rem;">Nuevo historial para: ${nombrePaciente}</p>
        <div style="max-width: 500px; display: flex; flex-direction: column; gap: 0.8rem;">
            <input type="text" id="tituloHistorial" placeholder="Título" 
                style="padding: 0.7rem; border: 1px solid #ccc; border-radius: 8px;">
            <input type="date" id="fechaHistorial" 
                style="padding: 0.7rem; border: 1px solid #ccc; border-radius: 8px;">
            <select id="areaHistorial" style="padding: 0.7rem; border: 1px solid #ccc; border-radius: 8px;">
                <option value="">-- Seleccionar área --</option>
            </select>
            <textarea id="diagnosticoHistorial" placeholder="Diagnóstico" rows="4"
                style="padding: 0.7rem; border: 1px solid #ccc; border-radius: 8px; resize: vertical;"></textarea>
            <button onclick="guardarHistorial(${idPaciente})"
                style="padding: 0.7rem; background: #2d6a4f; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                Guardar historial
            </button>
        </div>
    `

    // cargás las áreas desde la BD
    fetch("http://localhost:3000/area")
    .then(res => res.json())
    .then(areas => {
        const select = document.getElementById("areaHistorial")
        areas.forEach(area => {
            select.innerHTML += `<option value="${area.id}">${area.nombre}</option>`
        })
    })
}

window.guardarHistorial = async (idPaciente) => {
    const titulo = document.getElementById("tituloHistorial").value.trim()
    const fecha = document.getElementById("fechaHistorial").value
    const diagnostico = document.getElementById("diagnosticoHistorial").value.trim()
    const idArea = document.getElementById("areaHistorial").value

    if(!titulo || !fecha || !diagnostico || !idArea){
        alert("Completá todos los campos")
        return
    }

    const idKinesiologo = sessionStorage.getItem("idUsuario")

    const historial = {
        titulo,
        fecha,
        diagnostico,
        idPaciente,
        idKinesiologo,
        idArea
    }

    const res = await fetch("http://localhost:3000/historial/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(historial)
    })

    const data = await res.json()

    if(data.ok){
        alert("Historial creado correctamente")
        historialMedico()
    }
}

botonHistorialClinico.addEventListener("click", (e) => {
    e.preventDefault();
    historialMedico();
});

botonTurnos.addEventListener("click", (e) => {
    e.preventDefault();
    try {
        cargarAreas();
    } catch (error) {
        console.error("Error al ejecutar el botón de áreas:", error);
    }
});

const modalCerrar = document.getElementById('modalCerrarSesion');

document.getElementById('btnCerrarSesion').addEventListener('click', () => {
    modalCerrar.style.display = 'flex';
});

document.getElementById('btnConfirmarCerrar').addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = '/';
});

document.getElementById('btnCancelarCerrar').addEventListener('click', () => {
    modalCerrar.style.display = 'none';
});