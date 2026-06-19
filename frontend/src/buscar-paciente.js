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
                <button class="btn btn-outline-secondary btn-sm mt-3" onclick="document.getElementById('perfilCliente').style.display='none'">
                    <i class="ti ti-x"></i> Cerrar perfil
                </button>
            </div>
        `;

    }catch (error){
        perfilDiv.innerHTML = `<div class="alert alert-danger">Error al cargar el perfil</div>`;
    }
}
