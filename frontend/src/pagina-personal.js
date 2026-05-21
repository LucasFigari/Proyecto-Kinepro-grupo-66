const rol = sessionStorage.getItem('rol');
if (!rol || rol !== 'Admin') window.location.href = '/';

fetch("http://localhost:3000/personal/lista-completa")
.then(res => res.json())
.then(data => {

    const contenedorKinesiologos = document.getElementById("listaKinesiologos")
    const contenedorSecretarios = document.getElementById("listaSecretarios")

    if(data.length === 0){
        contenedorSecretarios.innerHTML = '<li>No hay personal registrado.</li>'
        contenedorKinesiologos.innerHTML = '<li>No hay personal registrado.</li>'
        return
    }

    data.forEach(persona => {

        const li = document.createElement("li")  // creo un div por cada persona

        li.innerHTML = `
            <p>${persona.nombre} ${persona.apellido} - DNI: ${persona.dni}</p>
            <button onclick="abrirModalEditar(${persona.id}, '${persona.nombre}', '${persona.apellido}', '${persona.dni}', '${persona.email}', '${persona.telefono}', '${persona.rol}')">Editar Perfil</button>
            <button onclick="eliminar(${persona.id})">Eliminar Miembro</button>
        `                                                               //listo el trabajador y un botón de eliminar asociado a su id

        if(persona.rol === "Secretaria"){  //si es secretaria se agrega en la lista secretarios

            contenedorSecretarios.appendChild(li)

        }
        else if(persona.rol === "Kinesiologo"){         //si es kinesiologo se agrega en la lista kinesiologos

            contenedorKinesiologos.appendChild(li)

        }

    })
})


function eliminar(id){

    const confirmacion = confirm("¿Estás seguro que deseas eliminar este personal?")

    if(confirmacion){
        fetch(`http://localhost:3000/personal/dar-baja-personal/${id}`, {
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

//Modal de edición
function abrirModalEditar(id, nombre, apellido, dni, email, telefono, rol){
    document.getElementById('modalEditar').style.display = 'flex';
    document.getElementById('editId').value = id;
    document.getElementById('editNombre').value = nombre;
    document.getElementById('editApellido').value = apellido;
    document.getElementById('editDni').value = dni;
    document.getElementById('editEmail').value = email;
    document.getElementById('editTelefono').value = telefono;
    document.getElementById('editRol').value = rol;
    document.getElementById('mensajeEditar').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('btnCancelarEditar').addEventListener('click', () => {
        document.getElementById('modalEditar').style.display = 'none';
    })

    document.getElementById('btnGuardarCambios').addEventListener('click', async () => {
        const id = document.getElementById('editId').value;
        const nombre = document.getElementById('editNombre').value.trim();
        const apellido = document.getElementById('editApellido').value.trim();
        const dni = document.getElementById('editDni').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const telefono = document.getElementById('editTelefono').value.trim();
        const rol = document.getElementById('editRol').value;
        const mensajeEl = document.getElementById('mensajeEditar');

        try {
            const response = await fetch(`http://localhost:3000/personal/editar-personal/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, apellido, dni, email, telefono, rol})
            })
            const data = await response.json();

            if(data.ok){
                mensajeEl.textContent = data.mensaje
                mensajeEl.style.color = 'green';
                mensajeEl.style.display = 'block';
                setTimeout(() => {
                    document.getElementById('modalEditar').style.display = 'none';
                    location.reload();
                }, 1500);
            }else{
                mensajeEl.textContent = data.mensaje;
                mensajeEl.style.color = 'red';
                mensajeEl.style.display = 'block';
            }
        } catch (error) {
            mensajeEl.textContent = "Error al conectar con el servidor.";
            mensajeEl.style.color = 'red';
            mensajeEl.style.display = 'block';
        }
    })
})