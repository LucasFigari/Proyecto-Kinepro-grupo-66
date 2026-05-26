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
            <i class="ti ti-search"></i> Buscar paciente
        </a>
        <a href="#" class="sidebar-btn">
            <i class="ti ti-activity"></i> Tratamientos
        </a>
        <button class="sidebar-logout" id="btnCerrarSesion">
            <i class="ti ti-logout"></i> Cerrar sesión
        </button>
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
        `
        resultados.appendChild(li)
    })
})
