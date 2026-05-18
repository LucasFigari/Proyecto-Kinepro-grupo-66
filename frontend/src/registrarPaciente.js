const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombreRegistro"))
const apellido = /** @type {HTMLInputElement} */ ( document.getElementById("apellidoRegistro"))
const dni = /** @type {HTMLInputElement} */ ( document.getElementById("dniRegistro"))
const email = /** @type {HTMLInputElement} */ ( document.getElementById("emailRegistro"))
const telefono = /** @type {HTMLInputElement} */ ( document.getElementById("telefonoRegistro"))
const password = /** @type {HTMLInputElement} */ (document.getElementById("contraseñaRegistro"))

const contenedorMensaje = document.getElementById('mensaje');

function validarCampoNombre(nom){
    
    let esValido = false

    if((nom != "")){

        if(nom.length >= 3 && nom.length <= 30){

            if(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(nom)){
                esValido = true;
            }

            else{
                mostrarError("❌ Error: Formato invalido en campo 'Nombre'.")
            }
        }

        else{
            mostrarError("❌ Error: El campo 'Nombre' debe poseer entre 3 y 30 caracteres.")
        }
    }

    else{
        mostrarError("❌ Error: Debe completar todos los campos.")
    }
        
    
    
    return esValido
}

function validarCampoApellido(ape){
    
    let esValido = false

    if((ape != "")){

        if(ape.length >= 3 && ape.length <= 30){

            if(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(ape)){
                esValido = true;
            }

            else{
                mostrarError("❌ Error: Formato invalido en campo 'Apellido'.")
            }
        }

        else{
            mostrarError("❌ Error: El campo 'Apellido' debe poseer entre 3 y 30 caracteres.")
        }
    }

    else{
        mostrarError("❌ Error: Debe completar todos los campos.")
    }
        
    
    
    return esValido
}

async function validarCampoDni(dniParametro){
    let esValido = false;

    if(dniParametro != ""){

        if(/^\d{7,8}$/.test(dniParametro)){

            const res = await fetch(`http://localhost:3000/usuarios/verificar-dni/${dniParametro}`)
            const data = await res.json()

            if(!data.existe){
                esValido = true
            } else {
                mostrarError("❌ Error: El DNI ingresado ya existe en el sistema.")
            }
        }
        
        else{
            mostrarError("❌ Error: El DNI debe poseer entre 7 y 8 caracteres numéricos.")
        }
    }
    else{
        mostrarError("❌ Error: Debe completar todos los campos.")
    }

    return esValido

}

async function validarCampoEmail(correo){

    let esValido = false;

    if(correo != ""){

        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){

            const res = await fetch(`http://localhost:3000/usuarios/verificar-email/${correo}`)
            const data = await res.json()

            if(!data.existe){
                esValido = true
            } 
            else {
                mostrarError("❌ Error: El correo ingresado ya existe en el sistema.")
            }
        }
    }

    else{
        mostrarError("❌ Error: Debe completar todos los campos.")
    }

    return esValido
}


function validarCampoTelefono(tel){
    
    let esValido = false

    if(tel != ""){

        if(/^\d{8,15}$/.test(tel)){
            
            esValido = true
        }

        else{
            mostrarError("❌ Error: El número de teléfono debe poseer Únicamente entre 8 y 15 digitos numéricos.")
        }

    }

    else{
        mostrarError("❌ Error: Debe completar todos los campos.")
    }

    return esValido

}


function validarCampoContraseña(cont){

    let esValido = false

    if(cont != ""){

        if(cont.length >= 8 && cont.length <= 12){

            esValido = true

        }

        else{
            mostrarError("❌ Error: La contraseña debe tener entre 8 y 12 caracteres.")
        }

    }

    else{
        mostrarError("❌ Error: Debe completar todos los campos.")
    }

    return esValido

}



async function formularioValido(){  

    return (
            validarCampoNombre(nombre.value.trim()) 
            && validarCampoApellido(apellido.value.trim()) 
            && await validarCampoDni(dni.value.trim())              //nota: puse && en lugar de & para hacer cortocircuito (apenas una este mal no sigue evaluando)
            && await validarCampoEmail(email.value.trim())         //si se quiere cambiar y que se evalue todo, hay que usar &
            && validarCampoTelefono(telefono.value.trim())
            && validarCampoContraseña(password.value.trim()));
}



const formulario = document.getElementById("formRegistroPaciente")

formulario.addEventListener("submit", async e =>{
    e.preventDefault()
    
    if(await formularioValido()){
        console.log("-> Formulario OK, iniciando Fetch...");
        try {
        const datosParaEnviar = { 
                dni: dni.value.trim(), 
                apellido: apellido.value.trim(), 
                nombre: nombre.value.trim(), 
                email: email.value.trim(), 
                password: password.value.trim(), 
                telefono: telefono.value.trim() 
            };

        const response = await fetch('http://localhost:3000/usuarios/registrar', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(datosParaEnviar)
        });


        const resultado = await response.json();
        
        if (!response.ok) {
            throw new Error(resultado.detalles || "Error desconocido");
        }

        contenedorMensaje.textContent = "✅ ¡Registro exitoso!";
        contenedorMensaje.style.color = "var(--accent)"; 
        contenedorMensaje.style.display = "block"
        formulario.reset(); 

    } catch (error) {
        if (error.message === "Failed to fetch") {
            mostrarError("❌ Error: No se pudo conectar con el servidor.");
        } else {
            mostrarError("❌ " + error.message);
        }
    }
    }
})

function mostrarError(mensaje) {
    contenedorMensaje.style.display = "block"
    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.style.color = "#ff4d4d";
}