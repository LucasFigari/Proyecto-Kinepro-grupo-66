// sidebar dinamico
const rol = sessionStorage.getItem("rol")
const sidebar = document.getElementById("sidebar")

const rolesPermitidos = ['Admin', 'Secretaria', 'Kinesiologo'];
if (!rol || !rolesPermitidos.includes(rol)) window.location.href = '/';

if(rol === "Secretaria"){
    sidebar.innerHTML = `
             <div class="sidebar">

        <a href="./index-secretaria.html">
            <img src="./src/imagenes/logo.png" alt="Menu principal" class="sidebar-logo">
        </a>

        <div class="sidebar-title">KinePro · Secretaria</div>
        <a href="./registrar-paciente.html" class="sidebar-btn">
            <i class="ti ti-user-plus"></i> Registrar usuario
        </a>
        <a href="./buscar-paciente.html" class="sidebar-btn">
            <i class="ti ti-search"></i> Buscar Paciente
        </a>
        <a href="./listar-areas.html" class="sidebar-btn">
            <i class="ti ti-menu"></i> Tratamientos         <!--aca agregué el boton-->
        </a>
        
        <a href="./eliminar-usuarios.html" class="sidebar-btn" id="btnSidebarGestion">
            <i class="ti ti-users"></i> Eliminar pacientes
        </a>

        <button class="sidebar-logout" id="btnCerrarSesion">
            <i class="ti ti-logout"></i> Cerrar sesión
        </button>
    </div>
    `
} else if(rol === "Admin"){
    sidebar.innerHTML = `
        <a href="./index-admin.html">
        <img src="./src/imagenes/logo.png" alt="Menu principal" class="sidebar-logo">
    </a>

        <div class="sidebar-title">KinePro · Admin</div>

        <a href="./pagina-personal.html" class="sidebar-btn">
            <i class="ti ti-users"></i> Personal
        </a>
        <a href="./buscar-paciente.html" class="sidebar-btn">
            <i class="ti ti-search"></i> Buscar Paciente
        </a>


        <a href="listar-areas.html" class="sidebar-btn">
            <i class="ti ti-activity"></i> Tratamientos
        </a>

        <a href="./eliminar-usuarios.html" class="sidebar-btn" id="btnSidebarGestion">
            <i class="ti ti-users"></i> Eliminar pacientes
        </a>

        <button class="sidebar-logout" id="btnCerrarSesion">
            <i class="ti ti-logout"></i> Cerrar sesión
        </button>
    </div>
    `
}

document.getElementById("btnCerrarSesion").addEventListener("click", () => {
    sessionStorage.clear()
    window.location.href = "/"
})

// busqueda de pacientes
const buscador = document.getElementById("buscador")
const resultados = document.getElementById("resultados")

buscador.addEventListener("input", async function(){
    const busqueda = this.value.trim()

    if(busqueda === ""){
        resultados.innerHTML = ""
        return
    }

    const res = await fetch(`http://localhost:3000/usuarios/buscar/${busqueda}`)
    const data = await res.json()

    resultados.innerHTML = ""

    if(data.length === 0){
        resultados.innerHTML = "<li>No se encontraron pacientes</li>"
        return
    }

    data.forEach(paciente => {
        const li = document.createElement("li")
        li.className = "resultado-item"
        li.innerHTML = `
            <p>${paciente.nombre} ${paciente.apellido} - DNI: ${paciente.dni}</p>
            <button class="btn btn-sm btn-info text-white" onclick="verPerfil(${paciente.id})">
                <i class="ti ti-user"></i> Ver perfil
            </button>
        `
        resultados.appendChild(li)
    })
})

async function verPerfil(id){
    const perfilDiv = document.getElementById("perfilCliente");
    perfilDiv.style.display = "block";
    perfilDiv.innerHTML = `
        <div class="text-center mt-3">
            <div class="spinner-border text-info" role="status"></div>
            <p class="mt-2 text-muted">Cargando perfil...</p>
        </div>
    `;

    try{
        const res = await fetch(`http://localhost:3000/usuarios/${id}`);
        const usuario = await res.json();
        mostrarPerfil(usuario);
    }catch (error){
        perfilDiv.innerHTML = `<div class="alert alert-danger">Error al cargar el perfil</div>`;
    }
}

function mostrarPerfil(usuario){
    const perfilDiv = document.getElementById("perfilCliente");
    perfilDiv.innerHTML = `
            <div class="card p-4 shadow-sm">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" 
                         style="width:60px; height:60px; font-size:24px;">
                        <i class="ti ti-user"></i>
                    </div>
                    <div>
                        <h4 class="mb-0">${usuario.nombre} ${usuario.apellido || ''}</h4>
                        <span class="badge bg-primary">Cliente KinePro</span>
                    </div>
                </div>
                <hr>
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
                        <label class="text-muted small d-block">DNI</label>
                        <strong>${usuario.dni || 'No registrado'}</strong>
                    </div>
                    <div class="col-6">
                        <label class="text-muted small d-block">Teléfono</label>
                        <strong>${usuario.telefono || 'No registrado'}</strong>
                    </div>
                    <div class="col-12">
                        <label class="text-muted small d-block">Email</label>
                        <strong>${usuario.email || 'No registrado'}</strong>
                    </div>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-info btn-sm text-white" id="btnEditarCliente">
                        <i class="ti ti-pencil"></i> Editar perfil
                    </button>
                    <button class="btn btn-outline-secondary btn-sm mt-3" onclick="document.getElementById('perfilCliente').style.display='none'">
                    <i class="ti ti-x"></i> Cerrar perfil
                    </button>
                </div>
            </div>
        `;

        document.getElementById("btnEditarCliente").addEventListener("click", () => {
            mostrarFormularioEdicion(usuario);
        })
}

function mostrarFormularioEdicion(usuario){
    const perfilDiv = document.getElementById("perfilCliente");
    perfilDiv.innerHTML = `
        <div class="card p-4 shadow-sm">
            <h5 class="mb-3">Editar Perfil de ${usuario.nombre}</h5>
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
                    <input id="editDni" type="text" class="form-control" value="${usuario.dni || ''}">
                </div>
                <div class="col-6">
                    <label class="text-muted small d-block">Teléfono</label>
                    <input id="editTelefono" type="text" class="form-control" value="${usuario.telefono || ''}">
                </div>
                <div class="col-12">
                    <label class="text-muted small d-block">Email</label>
                    <input id="editEmail" type="email" class="form-control" value="${usuario.email || ''}">
                </div>
            </div>

            <p id="mensajeEdicionCliente" style="display:none; font-size:0.9rem; margin-top:1rem;"></p>

            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-info text-white" id="btnActualizarCliente">
                    Actualizar
                </button>
                <button class="btn btn-outline-secondary" id="btnCancelarEdicionCliente">
                    Cancelar
                </button>
            </div>
        </div>
    `;

    document.getElementById("btnCancelarEdicionCliente").addEventListener("click", () => { 
        mostrarPerfil(usuario);
    });

    document.getElementById("btnActualizarCliente").addEventListener("click", async () => {
        const nombre = document.getElementById("editNombre").value.trim();
        const apellido = document.getElementById("editApellido").value.trim();
        const dni = document.getElementById("editDni").value.trim();
        const email = document.getElementById("editEmail").value.trim();
        const telefono = document.getElementById("editTelefono").value.trim();
        const mensajeEl = document.getElementById("mensajeEdicionCliente");

        try {
            const response = await fetch(`http://localhost:3000/usuarios/editar-admin/${usuario.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, dni, email, telefono })
            })
            const data = await response.json();

            mensajeEl.style.display = "block";
            if(data.ok){
                mensajeEl.style.color = "green";
                mensajeEl.textContent = data.mensaje;
                setTimeout(async () => {
                    const res = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
                    const usuarioActualizado = await res.json();
                    mostrarPerfil(usuarioActualizado);
                }, 1200);
            } else {
                mensajeEl.style.color = "red";
                mensajeEl.textContent = data.mensaje;
            }
        }catch (error){
            mensajeEl.style.display = "block";
            mensajeEl.style.color = "red";
            mensajeEl.textContent = "Error al conectar con el servidor.";
        }
    })
}
