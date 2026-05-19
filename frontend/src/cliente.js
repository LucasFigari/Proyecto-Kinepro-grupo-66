const API_URL = 'http://localhost:3000/area';
const btonPerfil = document.getElementById("Perfil"); // ✅ Vinculado al ID exacto del HTML
const contenido = document.getElementById("divContenedor");
const turnos = document.getElementById("botonDeTurnos"); // 👈 1. INTEGRADO: Captura el botón de turnos del HTML

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
            const nombreNormalizado = area.nombre.replace(/\s+/g, '');
            const rutaImagen = `./src/imagenes/${nombreNormalizado}.png`;

            // 🎨 NUEVO DISEÑO: Tarjeta moderna con texto sobre la imagen
            const tarjetaHTML = `
                <div class="card border-0 position-relative text-white overflow-hidden shadow-sm" 
                     style="cursor: pointer; height: 220px; border-radius: 14px;">
                    
                    <img src="${rutaImagen}" 
                         onerror="this.onerror=null; this.src='./src/imagenes/default.png';" 
                         class="w-100 h-100" 
                         style="object-fit: cover; position: absolute; top: 0; left: 0; z-index: 1;" 
                         alt="${area.nombre}">
                    
                    <div class="d-flex flex-column justify-content-end p-3 w-100 h-100 position-relative" 
                         style="z-index: 2; ">
                        
                        <div class="d-flex align-items-center gap-2">
                            <p class="card-title mb-0 fw-bold">${area.nombre}</p>
                        </div>
                        
                        <div class="mt-3">
                            <button 
                                type="button"
                                class="btn btn-sm btn-success fw-bold"
                                onclick="cargarTurnosPorArea(${area.id}, '${area.nombre}')">
                                Agendar Turno
                            </button>
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

    const idUsuarioLogueado = localStorage.getItem('idUsuario'); 
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
        localStorage.setItem("idUsuario", usuario.id);
        
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

    } catch (error) {
        console.error("Error al cargar el perfil:", error);
        contenido.innerHTML = `
            <div class="alert alert-danger">Error al cargar los datos del perfil.</div>
        `;
    }
});

/**
 * ⚡ 2. INTEGRADO: Evento para el botón de "Mis Turnos"
 */
if (turnos) {
    turnos.addEventListener("click", async (e) => {
        e.preventDefault();
        const idUsuarioLogueado = localStorage.getItem('idUsuario');

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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreArea: nombreArea
            })
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
            window.location.href =
            `/seleccion-de-turnos.html?id=${idArea}&area=${encodeURIComponent(nombreArea)}`;
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

/**
 * ⚡ 3. INTEGRADO: Función que busca los turnos del usuario y los dibuja en pantalla
 */
const cargarTurnosDelUsuario = async (idUsuario) => {
    const contenedor = document.getElementById("contenedor-turnos-usuario");

    try {
        const idLimpio = String(idUsuario).replace(/[^0-9]/g, ''); 
        const respuesta = await fetch(`http://localhost:3000/turnos/paciente/${idLimpio}`);
        
        if (!respuesta.ok) {
            contenedor.innerHTML = '<p class="text-muted small">No se pudieron cargar los turnos en este momento.</p>';
            return;
        }

        const turnosData = await respuesta.json();
        const hoy = new Date().toLocaleDateString('en-CA'); 

        // 🧼 FILTRADO: Nos quedamos con los turnos vigentes
        const turnosProximos = turnosData.filter(t => {
            const fechaLimpia = t.fecha.includes('T') ? t.fecha.split('T')[0] : t.fecha;
            return fechaLimpia >= hoy;
        });

        if (turnosProximos.length === 0) {
            contenedor.innerHTML = '<p class="text-muted small">No tienes turnos programados próximamente.</p>';
            return;
        }

        // ⏱️ ORDENADO: Cronológico por fecha y horario
        turnosProximos.sort((a, b) => {
            const fechaA = a.fecha.includes('T') ? a.fecha.split('T')[0] : a.fecha;
            const fechaB = b.fecha.includes('T') ? b.fecha.split('T')[0] : b.fecha;
            return (fechaA + a.horario).localeCompare(fechaB + b.horario);
        });

        // 📐 RENDERIZADO: Generamos el HTML dinámico
        contenedor.innerHTML = turnosProximos.map(turno => {
            const fechaFormateada = turno.fecha.includes('T') ? turno.fecha.split('T')[0] : turno.fecha;
            const horarioCorto = turno.horario.substring(0, 5); 

            return `
                <div class="card mb-2 border-0 shadow-sm bg-light" style="border-left: 4px solid #0dcaf0 !important;">
                    <div class="card-body p-2 d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0 text-dark">${turno.area?.nombre || 'Consulta de Kinesiología'}</h6>
                            <small class="text-muted"><i class="ti ti-calendar"></i> ${fechaFormateada} | <i class="ti ti-clock"></i> ${horarioCorto} hs</small>
                        </div>
                        <span class="badge bg-white text-info border border-info">Confirmado</span>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Error al obtener turnos:", error);
        contenedor.innerHTML = '<p class="text-danger small">Error de conexión al obtener turnos.</p>';
    }
};

window.cargarTurnosPorArea = cargarTurnosPorArea;