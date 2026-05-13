const nombre = /** @type {HTMLInputElement} */ (document.getElementById("nombreRegistro"))
const apellido = /** @type {HTMLInputElement} */ ( document.getElementById("apellidoRegistro"))
const dni = /** @type {HTMLInputElement} */ ( document.getElementById("dniRegistro"))
const email = /** @type {HTMLInputElement} */ ( document.getElementById("emailRegistro"))
const telefono = /** @type {HTMLInputElement} */ ( document.getElementById("telefonoRegistro"))
const contraseña = /** @type {HTMLInputElement} */ (document.getElementById("contraseñaRegistro"))


function validarCampoNombre(nom){
    
    let esValido = false

    if((nom != "")){

        if(nom.length >= 3 && nom.length <= 30){

            if(/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(nom)){
                esValido = true;
            }

            else{
                //avisar en pantalla formato invalido
            }
        }

        else{
            //avisar en pantalla limite de caracteres
        }
    }

    else{
        //avisar en pantalla campo vacio
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
                //avisar en pantalla formato invalido
            }
        }

        else{
            //avisar en pantalla limite de caracteres
        }
    }

    else{
        //avisar en pantalla campo vacio
    }
        
    
    
    return esValido
}

function validarCampoDni(dniParametro){
    let esValido = false;

    if(dniParametro != ""){

        if(/^\d{7,8}$/.test(dniParametro)){

            //Hacer el If que compruebe la BD. si no existe en la BD se asigna esValido = true (ya que dni es unico). else avisar que dni ya existe

        }
        
        else{
            //avisar dni invalido
        }

    }

    else{
        //avisar campo vacio
    }

    return esValido
}

function validarCampoEmail(correo){

    let esValido = false;

    if(correo != ""){

        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)){

            //Hacer el if que compruebe la BD. Si no existe en la BD se asigna esValido = true (correo unico). Else avisar que correo ya existe

        }
        
        else{
            //avisar correo invalido
        }

    }

    else{
        //avisar campo vacio
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
            //avisar que telefono debe ser entre 8 y 15 digitos numericos
        }

    }

    else{
        //avisar campo vacio
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
            //avisar que contraseña debe tener entre 8 y 12 caracteres
        }

    }

    else{
        //informar campo vacio
    }

    return esValido

}



function formularioValido(){  

    return (
            validarCampoNombre(nombre.value.trim()) 
            && validarCampoApellido(apellido.value.trim()) 
            && validarCampoDni(dni.value.trim())              //nota: puse && en lugar de & para hacer cortocircuito (apenas una este mal no sigue evaluando)
            && validarCampoEmail(email.value.trim())         //si se quiere cambiar y que se evalue todo, hay que usar &
            && validarCampoTelefono(telefono.value.trim())
            && validarCampoContraseña(contraseña.value.trim())
        )
}



const formulario = document.getElementById("formRegistroPaciente")

formulario.addEventListener("submit", e =>{
    e.preventDefault()
    
    if(formularioValido()){
        
        const paciente = {
            nombre: nombre.value.trim(),
            apellido: apellido.value.trim(),
            dni: dni.value.trim(),
            email: email.value.trim(),
            telefono: telefono.value.trim(),
            password: contraseña.value
        }

        fetch("http://localhost:3000/usuarios/registrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paciente)
        })
        
        .then(res => res.json())
        .then(data => {
            if(data.ok){
                alert("Usuario registrado correctamente")
                formulario.reset() // limpia los campos
            }
        })
        .catch(error => {
            console.error("Error al registrar:", error)
            alert("Hubo un error al registrar el usuario")
        })

    }
})
    
