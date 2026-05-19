const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombreRegistro"))
const apellido = /** @type {HTMLInputElement} */ ( document.getElementById("apellidoRegistro"))
const fechaNacimiento = /** @type {HTMLInputElement} */ (document.getElementById("fechaNacimiento"))
const dni = /** @type {HTMLInputElement} */ ( document.getElementById("dniRegistro"))
const email = /** @type {HTMLInputElement} */ ( document.getElementById("emailRegistro"))
const telefono = /** @type {HTMLInputElement} */ ( document.getElementById("telefonoRegistro"))
const contraseña = /** @type {HTMLInputElement} */ (document.getElementById("contraseñaRegistro"))
const puestoTrabajo = /** @type {HTMLSelectElement} */ (document.getElementById("puestoTrabajo"))

const contenedorMensaje = document.getElementById('mensaje');


function validarCampoNombre(nom){
    
    let esValido = false

    if((nom != "")){

        if(nom.length >= 3 && nom.length <= 30){

            if(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(nom)){
                esValido = true;
            }

            else{
                mostrarError("❌ Error: Formato de nombre invalido.")
            }
        }

        else{
            mostrarError("❌ Error: El campo 'Nombre' debe poseer entre 3 y 30 caracteres.")
        }
    }

    else{
        mostrarError("❌ Error: Debe completar el campo 'Nombre'.")
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
                mostrarError("❌ Error: Formato de apellido invalido.")
            }
        }

        else{
            mostrarError("❌ Error: El campo 'Apellido' debe poseer entre 3 y 30 caracteres.")
        }
    }

    else{
        mostrarError("❌ Error: Debe completar el campo 'Apellido'.")
    }
        
    
    
    return esValido
}

function validarCampoFechaNacimiento(fechaNac){
    
    let esValido = false

    if(fechaNac != ""){
        let fechaAuxiliar = new Date(fechaNac)    //comprueba que fecha no sea vacío y que no sea una fecha futura a la actual
        let fechaHoy = new Date()
        if(fechaAuxiliar <= fechaHoy){
            esValido = true
        }
        else{
            mostrarError("❌ Error: La fecha de nacimiento debe ser anterior a la fecha actual.")
        }
    }
    else{
        mostrarError("❌ Error: Debe completar la fecha de nacimiento.")
    }

    return esValido

}

async function validarCampoDni(dniParametro){
    let esValido = false;

    if(dniParametro != ""){

        if(/^\d{7,8}$/.test(dniParametro)){ //testeo que el dni cumpla el formato

            const res = await fetch(`http://localhost:3000/personal/verificar-dni/${dniParametro}`)
            const data = await res.json()

            if(!(data.existe)){

                esValido = true

            }
            else{
                mostrarError("❌ Error: Ya existe una Cuenta Profesional con el DNI elegido.")
            }

        }
        
        else{
            mostrarError("❌ Error: El campo 'DNI' debe poseer entre 7 y 8 caracteres numéricos.")
        }

    }

    else{
        mostrarError("❌ Error: Debe completar el campo 'DNI'.")
    }

    return esValido
}

async function validarCampoEmail(correo){

    let esValido = false;

    if(correo != ""){

        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){ //testeo que el correo cumpla el formato

            const res = await fetch(`http://localhost:3000/personal/verificar-email/${correo}`)
            const data = await res.json()

            if(!(data.existe)){
                esValido = true
            }
            else{
                mostrarError("❌ Error: Ya existe una cuenta Profesional con el email elegido.")
            }

        }
        else{
            mostrarError("❌ Error: Formato de email invalido.")
        }

    }
    else{
        mostrarError("❌ Error: Debe completar el campo 'Email'.")
    }

    return esValido
}


function validarCampoTelefono(tel){
    
    let esValido = false

    if(tel != ""){ //verifico que no sea vacio el campo

        if(/^\d{7,15}$/.test(tel)){ //testeo que el numero de telefono no tenga caracteres, cantidad digitos etc.
            
            esValido = true
        }

        else{
            mostrarError("❌ Error: el telefono debe poseer entre 7 y 15 caracteres numéricos.")
        }

    }

    else{
        mostrarError("❌ Error: Debe completar el campo 'telefono'.")
    }

    return esValido

}


function validarCampoContraseña(cont){

    let esValido = false

    if(cont != ""){  //verifica que no sea vacio el campo

        if(cont.length >= 8 && cont.length <= 12){

            esValido = true

        }

        else{
            mostrarError("❌ Error: La Contraseña debe poseer entre 8 y 12 caracteres.")
        }

    }

    else{
        mostrarError("❌ Error: Debe completar el campo 'Contraseña'.")
    }

    return esValido

}

function validarCampoPuestoTrabajo(pt){
    
    let esValido = false

    if(pt != ""){       //verifica que no sea vacio el campo
        esValido=true
    }
    else{
        mostrarError("❌ Error: Seleccione un Rol")
    }

    return esValido

}


async function formularioValido(){  

    return (
            validarCampoNombre(nombre.value.trim()) 
            && validarCampoApellido(apellido.value.trim()) 
            && validarCampoFechaNacimiento(fechaNacimiento.value)
            && await validarCampoDni(dni.value.trim())              //nota: puse && en lugar de & para hacer cortocircuito (apenas una este mal no sigue evaluando)
            && await validarCampoEmail(email.value.trim())         //si se quiere cambiar y que se evalue todo, hay que usar &
            && validarCampoTelefono(telefono.value.trim())
            && validarCampoContraseña(contraseña.value.trim())
            && validarCampoPuestoTrabajo(puestoTrabajo.value)
        )
}



const formulario = document.getElementById("formRegistroPersonal")

formulario.addEventListener("submit", async e =>{
    e.preventDefault()
    
    if(await formularioValido()){  //se llama al metodo formularioValido() y si todos los campos están "Ok" se devuelve true
        
        try{
            const personalTrabajo = {
                nombre: nombre.value.trim(),
                apellido: apellido.value.trim(),
                fechaNac: fechaNacimiento.value,
                dni: dni.value.trim(),
                email: email.value.trim(),                            //Creo el objeto que contiene los datos del personal
                telefono: telefono.value.trim(),
                password: contraseña.value,
                rol: puestoTrabajo.value
            }

            fetch("http://localhost:3000/personal/registrar", {   
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(personalTrabajo)                  //convierto el objeto a archivo json
            })

            .then(res => res.json())
            .then(data => {
                if(data.ok){     //verifico que se subió
                    alert("Personal registrado correctamente")
                    window.location.href = "./pagina-personal.html" 
                }
            })
        }
        catch(error) {
            console.error("Error al registrar:", error)  //caso de error
            alert("Hubo un error al registrar el Personal")
        }

    }
})

function mostrarError(mensaje) {
    contenedorMensaje.style.display = "block"
    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.style.color = "#ff4d4d";
}
    