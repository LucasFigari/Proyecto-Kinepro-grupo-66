const buscador = document.getElementById("buscador")
const resultados = document.getElementById("resultados")

buscador.addEventListener("input", async function(){
    const busqueda = this.value.trim()

    if(busqueda === ""){
        resultados.innerHTML = ""  // limpia los resultados si el campo está vacío
        return
    }

    const res = await fetch(`http://localhost:3000/usuarios/buscar/${busqueda}`)
    const data = await res.json()

    resultados.innerHTML = ""  // limpia los resultados anteriores

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