// sidebar dinamico
const rol = sessionStorage.getItem("rol")
const sidebar = document.getElementById("sidebar")

if(rol === "Secretaria"){
    sidebar.innerHTML = `
        <div class="sidebar-title">KinePro · Secretaria</div>
        <a href="registrar-paciente.html" class="sidebar-btn">
            <i class="ti ti-user-plus"></i> Registrar paciente
        </a>
        <a href="buscar-paciente.html" class="sidebar-btn">
            <i class="ti ti-search"></i> Buscar paciente
        </a>
        <button class="sidebar-logout" id="btnCerrarSesion">
            <i class="ti ti-logout"></i> Cerrar sesión
        </button>
    `
} else if(rol === "Admin"){
    sidebar.innerHTML = `
        <div class="sidebar-title">KinePro · Admin</div>
        <a href="registrar-personal.html" class="sidebar-btn">
            <i class="ti ti-user-plus"></i> Registrar personal
        </a>
        <a href="lista-personal.html" class="sidebar-btn">
            <i class="ti ti-users"></i> Lista personal
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
