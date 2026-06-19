const API_URL = 'http://localhost:3000/area';
const btonPerfil = document.getElementById("Perfil"); 
const contenido = document.getElementById("divContenedor");
const turnos = document.getElementById("botonDeTurnos"); 

const rol = sessionStorage.getItem('rol');
if (!rol || rol !== 'usuario') window.location.href = '/';

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

        areas.forEach(area => {
            const nombreNormalizado = area.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').toLowerCase();
            const rutaImagen = `http://localhost:3000/imagenes/${nombreNormalizado}.png`;

const descripcionTratamiento = area.descripcion || 'Descripción detallada del tratamiento y sus metodologías de rehabilitación.';

const tarjetaHTML = `
    <div class="card border-0 text-white overflow-hidden shadow-sm p-0 flex-column mb-3" 
         style="height: auto; border-radius: 14px; background: white;">
        
        <div class="position-relative" style="height: 160px; overflow: hidden;">
            <img src="${rutaImagen}" 
                 onerror="this.onerror=null; this.src='/default.png';" 
                 class="w-100 h-100" 
                 style="object-fit: cover; position: absolute; top: 0; left: 0; z-index: 1;" 
                 alt="${area.nombre}">
            
            <div class="w-100 h-100 position-absolute" 
                 style="z-index: 2; background: linear-gradient(transparent, rgba(0,0,0,0.7)); top:0; left:0;"></div>
            
            <div class="position-absolute bottom-0 start-0 p-3 w-100" style="z-index: 3;">
                <p class="card-title mb-0 fw-bold fs-5 text-white">${area.nombre}</p>
            </div>
        </div>
        
        <div class="p-3 bg-white" style="color: #333;">
            
            <div class="d-flex gap-2 mb-2">
                <button 
                    type="button" 
                    class="btn btn-sm btn-outline-info fw-bold flex-grow-1"
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapseArea-${area.id}" 
                    aria-expanded="false" 
                    aria-controls="collapseArea-${area.id}">
                    <i class="ti ti-info-circle"></i> Ver detalles
                </button>

                <button 
                    type="button"
                    class="btn btn-sm btn-success fw-bold flex-grow-1"
                    onclick="cargarTurnosPorArea(${area.id}, '${area.nombre}')">
                    <i class="ti ti-calendar-plus"></i> Agendar Turno
                </button>
            </div>
            
            <div class="collapse" id="collapseArea-${area.id}">
                <div class="pt-2 border-top mt-2">
                    <label class="text-muted small d-block fw-bold mb-1">Información del Tratamiento</label>
                    <p class="card-desc mb-0 text-secondary" style="font-size: 13px; line-height: 1.4;">
                        ${descripcionTratamiento}
                    </p>
                </div>
            </div>

        </div>
    </div>
`;
            gridDinamica.insertAdjacentHTML('beforeend', tarjetaHTML);
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

cargarAreas();

btonPerfil.addEventListener("click", async (e) => {
    e.preventDefault(); 

    const idUsuarioLogueado = sessionStorage.getItem('idUsuario'); 
    console.log('El usuario logueado tiene el item: ' + idUsuarioLogueado);

    if (!idUsuarioLogueado) {
        contenido.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <h5>Sesión no válida</h5>
                <p>No se encontraron datos de inicio de sesión. Por favor, vuelva a ingresar al sistema.</p>
                <a href="/login.html" class="btn btn-warning btn-sm">Ir al Login</a>
            </div>
        `;
        return;
    }

    contenido.innerHTML = `
        <div class="text-center mt-5">
            <div class="spinner-border text-info" role="status"></div>
            <p class="mt-2 text-muted">Buscando tus datos...</p>
        </div>
    `; 
    
    try {
        console.log("✈️ Enviando petición fetch a la URL:", `http://localhost:3000/usuarios/${idUsuarioLogueado}`);

        const respuesta = await fetch(`http://localhost:3000/usuarios/${idUsuarioLogueado}`); 
        
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la información del perfil.");
        }
        
        const usuario = await respuesta.json();
        sessionStorage.setItem("idUsuario", usuario.id); // ✅ Mantener consistencia en sessionStorage
        
        contenido.innerHTML = `
            <div class="container mt-2" style="max-width: 600px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <p class="welcome mb-0">Mi Perfil</p>
                        <p class="subtitle mb-0">Gestioná tus datos personales de la cuenta.</p>
                    </div>
                    <button id="btnVolverAlInicio" class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                        <i class="ti ti-arrow-back-up"></i> Volver
                    </button>
                    <button id="btnEditarPerfil" class="btn btn-info btn-sm text-white d-flex align-items-center gap-2">
                        <i class="ti ti-pencil"></i> Editar Perfil
                    </button>
                </div>
                
                <div class="card p-4 shadow-sm" style="height: auto; overflow: visible;">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 60px; height: 60px; font-size: 24px;">
                            <i class="ti ti-user"></i>
                        </div>
                        <div>
                            <h4 class="mb-0 text-dark">${usuario.nombre} ${usuario.apellido || ''}</h4>
                            <span class="badge bg-primary">Usuario KinePro</span>
                        </div>
                    </div>
                    
                    <hr class="text-muted">
                    
                    <div class="row g-3">
                        <div class="col-6">
                            <label class="text-muted small d-block">Nombre</label>
                            <strong>${usuario.nombre}</strong>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small d-block">Apellido</label>
                            <strong>${usuario.apellido || 'No registrado'}</strong>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small d-block">Documento (DNI)</label>
                            <strong>${usuario.dni || 'No registrado'}</strong>
                        </div>
                        <div class="col-6">
                            <label class="text-muted small d-block">Teléfono</label>
                            <strong>${usuario.telefono || 'No registrado'}</strong>
                        </div>
                        <div class="col-12">
                            <label class="text-muted small d-block">Correo Electrónico</label>
                            <strong>${usuario.email || usuario.correo || 'No registrado'}</strong> 
                        </div>
                    </div>
                </div>
            </div>
        `; 

        document.getElementById("btnVolverAlInicio").addEventListener("click", () => {
            cargarAreas(); 
        });

        //Manejo de la edicion de perfil
        document.getElementById("btnEditarPerfil").addEventListener("click", () => {
            contenido.innerHTML = `
                <div class="container mt-2" style="max-width: 600px;">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <p class="welcome mb-0">Editar Perfil</p>
                            <p class="subtitle mb-0">Actualizá tus datos personales.</p>
                        </div>
                        <button id="btnCancelarEdicion" class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                            <i class="ti ti-arrow-back-up"></i> Cancelar
                        </button>
                    </div>

                    <div class="card p-4 shadow-sm">
                        <div class="row g-3">
                            <div class="col-6">
                                <label class="text-muted small d-block">Nombre</label>
                                <input id="editNombre" type="text" class="form-control" value="${usuario.nombre}">
                            </div>
                            <div class="col-6">
                                <label class="text-muted small d-block">Apellido</label>
                                <input id="editApellido" type="text" class="form-control" value="${usuario.apellido || ''}">
                            </div>
                            <div class="col-6">
                                <label class="text-muted small d-block">DNI</label>
                                <strong>${usuario.dni || 'No registrado'}</strong>
                            </div>
                            <div class="col-6">
                                <label class="text-muted small d-block">Teléfono</label>
                                <input id="editTelefono" type="text" class="form-control" value="${usuario.telefono || ''}">
                            </div>
                            <div class="col-12">
                                <label class="text-muted small d-block">Email</label>
                                <strong>${usuario.email || 'No registrado'}</strong>
                            </div>
                            <div class="col-12">
                                <label class="text-muted small d-block">Nueva contraseña <span class="text-muted">(dejá vacío para no cambiarla)</span></label>
                                <input id="editPassword" type="password" class="form-control" placeholder="Entre 6 y 12 caracteres">
                            </div>
                        </div>

                        <p id="mensajeEdicion" style="display:none; font-size:0.9rem; margin-top:1rem;"></p>

                        <button id="btnActualizarDatos" class="btn btn-info text-white mt-3 w-100">
                            Actualizar datos
                        </button>
                    </div>
                </div>
            `;

        document.getElementById("btnCancelarEdicion").addEventListener("click", () => {
            btonPerfil.click();
        });

        document.getElementById("btnActualizarDatos").addEventListener("click", async () => {
            const nombre = document.getElementById("editNombre").value.trim();
            const apellido = document.getElementById("editApellido").value.trim();
            const telefono = document.getElementById("editTelefono").value.trim();
            const password = document.getElementById("editPassword").value.trim();
            const mensajeEl = document.getElementById("mensajeEdicion");
            const id = sessionStorage.getItem("idUsuario");

            try {
                const response = await fetch(`http://localhost:3000/usuarios/editar/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, apellido, telefono, password })
                });
                const data = await response.json();

                mensajeEl.style.display = "block";
                if (data.ok) {
                    mensajeEl.style.color = "green";
                    mensajeEl.textContent = data.mensaje;
                    setTimeout(() => {
                        btonPerfil.click();
                    }, 1500);
                } else {
                    mensajeEl.style.color = "red";
                    mensajeEl.textContent = data.mensaje;
                }
            } catch (error) {
                mensajeEl.style.display = "block";
                mensajeEl.style.color = "red";
                mensajeEl.textContent = "Error al conectar con el servidor.";
            }
        });
        });

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        contenido.innerHTML = `
            <div class="alert alert-danger">Error al cargar los datos del perfil.</div>
        `;
    }
});

if (turnos) {
    turnos.addEventListener("click", async (e) => {
        e.preventDefault();
        const idUsuarioLogueado = sessionStorage.getItem('idUsuario');

        if (!idUsuarioLogueado) {
            contenido.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <h5>Sesión requerida</h5>
                    <p>Debes iniciar sesión para ver tus turnos.</p>
                    <a href="/login.html" class="btn btn-warning btn-sm">Ir al Login</a>
                </div>
            `;
            return;
        }

        contenido.innerHTML = `
            <div class="container mt-2" style="max-width: 600px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <p class="welcome mb-0">Mis Turnos</p>
                        <p class="subtitle mb-0">Visualizá tus próximas citas programadas.</p>
                    </div>
                    <button id="btnVolverAlInicio" class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2">
                        <i class="ti ti-arrow-back-up"></i> Volver
                    </button>
                </div>
                <div id="contenedor-turnos-usuario" class="mt-3">
                    <div class="text-center py-5">
                        <div class="spinner-border text-info" role="status"></div>
                        <p class="mt-2 text-muted">Cargando tu agenda...</p>
                    </div>
                </div>
            </div>
        `;

        await cargarTurnosDelUsuario(idUsuarioLogueado);

        document.getElementById("btnVolverAlInicio").addEventListener("click", () => {
            cargarAreas();
        });
    });
}

async function cargarTurnosPorArea(idArea, nombreArea) {
    try {
        const respuesta = await fetch('http://localhost:3000/area/reservar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreArea: nombreArea })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            Swal.fire({
                icon: "error",
                title: "Cupos agotados",
                text: resultado.detalles,
                confirmButtonColor: "#72B9CB"
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "¡Cupos disponibles!",
            text: `Área: ${nombreArea}`,
            confirmButtonColor: "#72B9CB"
        }).then(() => {
            window.location.href = `/seleccion-de-turnos.html?id=${idArea}&area=${encodeURIComponent(nombreArea)}`;
        });

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo verificar el cupo."
        });
    }
}

const cargarTurnosDelUsuario = async (idUsuario) => {
    const contenedor = document.getElementById("contenedor-turnos-usuario");

    try {
        const respuesta = await fetch(`http://localhost:3000/turnos/paciente/${idUsuario}`);
        
        if (!respuesta.ok) {
            contenedor.innerHTML = '<p class="text-muted small">No se pudieron cargar los turnos en este momento.</p>';
            return;
        }

        const turnosData = await respuesta.json();
        const hoy = new Date().toLocaleDateString('en-CA');

        const turnosProximos = turnosData.filter(t => t.fecha_turno >= hoy);

        if (turnosProximos.length === 0) {
            contenedor.innerHTML = '<p class="text-muted small">No tienes turnos programados próximamente.</p>';
            return;
        }

        turnosProximos.sort((a, b) =>
            (a.fecha_turno + a.hora_comienzo).localeCompare(b.fecha_turno + b.hora_comienzo)
        );

        contenedor.innerHTML = turnosProximos.map(turno => `
            <div class="card mb-2 border-0 shadow-sm bg-light" style="border-left: 4px solid #0dcaf0 !important;">
                <div class="card-body p-2 d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0 text-dark">${turno.area?.nombre || 'Consulta de Kinesiología'}</h6>
                        <small class="text-muted">
                            <i class="ti ti-calendar"></i> ${turno.fecha_turno} | 
                            <i class="ti ti-clock"></i> ${turno.hora_comienzo.substring(0, 5)} hs
                        </small>
                    </div>
                    <span class="badge bg-white text-info border border-info">Confirmado</span>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Error al obtener turnos:", error);
        contenedor.innerHTML = '<p class="text-danger small">Error de conexión al obtener turnos.</p>';
    }
};

window.cargarTurnosPorArea = cargarTurnosPorArea;

const modalCerrar = document.getElementById('modalCerrarSesion');

if (document.getElementById('btnCerrarSesion')) {
    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
        modalCerrar.style.display = 'flex';
    });
}

if (document.getElementById('btnConfirmarCerrar')) {
    document.getElementById('btnConfirmarCerrar').addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
    });
}

if (document.getElementById('btnCancelarCerrar')) {
    document.getElementById('btnCancelarCerrar').addEventListener('click', () => {
        modalCerrar.style.display = 'none';
    });
}