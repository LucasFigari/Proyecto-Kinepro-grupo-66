fetch("http://localhost:3000/personal/lista-completa")
.then(res => res.json())
.then(data => {

    const contenedorKinesiologos = document.getElementById("listaKinesiologos")
    const contenedorSecretarios = document.getElementById("listaSecretarios")

    data.forEach(persona => {

        const div = document.createElement("li")  // creo un div por cada persona

        li.innerHTML = `
            <p>${persona.nombre} ${persona.apellido} - DNI: ${persona.dni}</p>
            <button onclick="eliminar(${persona.id})">Eliminar Miembro</button>
        `                                                               //listo el trabajador y un botón de eliminar asociado a su id

        if(persona.rol === "secretario/a"){  //si es secretaria se agrega en la lista secretarios

            contenedorSecretarios.appendChild(li)

        }
        else if(persona.rol === "kinesiologo/a"){         //si es kinesiologo se agrega en la lista kinesiologos

            contenedorKinesiologos.appendChild(li)

        }

    })
})


function eliminar(id){

    const confirmacion = confirm("¿Estás seguro que deseas eliminar este personal?")

    if(confirmacion){
        fetch(`http://localhost:3000/personal/eliminar/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            if(data.ok){
                alert("Personal eliminado correctamente")
                location.reload()
            }
        })
        .catch(error => {
            console.error("Error al eliminar:", error)
            alert("Hubo un error al eliminar el personal")
        })
    }
}

document.getElementById("btnAgregarPersonal").onclick = () => {  //redirige al registro de personal
    window.location.href = "./registrar-personal.html"
}